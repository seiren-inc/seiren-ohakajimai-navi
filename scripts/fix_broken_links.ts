import { PrismaClient, LinkStatus } from '@prisma/client';
import * as dotenv from 'dotenv';
import path from 'path';

// .env.local から環境変数を読み込む
const envPath = path.resolve(process.cwd(), '.env.local');
dotenv.config({ path: envPath });

// DIRECT_URL がある場合はそちらを優先（Prismaの型エラー回避のため unknown 経由）
const dbUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: dbUrl
    }
  }
});

async function checkUrl(url: string | null): Promise<{ isOk: boolean; newUrl: string | null }> {
  if (!url) return { isOk: false, newUrl: null };
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout
    const response = await fetch(url, { 
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      redirect: 'follow',
      signal: controller.signal 
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      if (response.redirected && response.url !== url) {
        return { isOk: true, newUrl: response.url };
      }
      return { isOk: true, newUrl: null };
    }
    return { isOk: false, newUrl: null };
  } catch (error) {
    return { isOk: false, newUrl: null };
  }
}

async function main() {
  console.log('--- 11件のBROKENステータスデータ調査・修正開始 ---');
  console.log(`Using database: ${dbUrl?.split('@')[1]}`);

  const brokenMunicipalities = await prisma.municipality.findMany({
    where: { linkStatus: 'BROKEN' },
    select: { id: true, jisCode: true, name: true, prefectureName: true, url: true, pdfUrl: true }
  });

  if (brokenMunicipalities.length === 0) {
    console.log('BROKENステータスの自治体は見つかりませんでした。');
    return;
  }

  console.log(`抽出件数: ${brokenMunicipalities.length}件`);

  for (const m of brokenMunicipalities) {
    console.log(`\n調査中: [${m.prefectureName} ${m.name}] (JIS: ${m.jisCode})`);
    
    // URLチェック
    const urlCheck = await checkUrl(m.url);
    let newLinkStatus: LinkStatus = 'BROKEN';
    let updatedUrl = m.url;
    let isFixed = false;

    if (urlCheck.isOk) {
      newLinkStatus = 'OK';
      isFixed = true;
      if (urlCheck.newUrl) {
        updatedUrl = urlCheck.newUrl;
        console.log(` -> 移転先を発見: ${updatedUrl}`);
      } else {
        console.log(` -> 既存URLは現在有効です: ${m.url}`);
      }
    } else if (m.pdfUrl) {
      const pdfCheck = await checkUrl(m.pdfUrl);
      if (pdfCheck.isOk) {
        newLinkStatus = 'OK';
        isFixed = true;
        console.log(` -> PDF URLは現在有効です: ${pdfCheck.newUrl || m.pdfUrl}`);
      }
    }

    if (!isFixed) {
      console.log(` -> URLは依然として無効です。ステータスを UNKNOWN に整理します。`);
      newLinkStatus = 'UNKNOWN';
    }

    await prisma.municipality.update({
      where: { id: m.id },
      data: {
        url: updatedUrl,
        linkStatus: newLinkStatus,
        lastCheckedAt: new Date()
      }
    });

    console.log(` -> 更新完了 [Status: ${newLinkStatus}]`);
  }

  console.log('\n--- 調査・修正完了 ---');
}

main()
  .catch(e => { console.error('実行エラー:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });

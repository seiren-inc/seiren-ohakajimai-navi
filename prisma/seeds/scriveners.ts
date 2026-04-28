// @ts-nocheck
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
dotenv.config() // fallback to .env
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } },
})

const scriveners = [
  {
    officeName: '山田行政書士事務所',
    representativeName: '山田 健一',
    registrationNumber: '13010503',
    prefecture: '東京都',
    city: '新宿区',
    addressLine: '新宿3-14-20 新宿ABCビル5F',
    phone: '03-5321-8800',
    email: 'info@yamada-gyosei.jp',
    websiteUrl: 'https://yamada-gyosei.jp',
    priceRangeText: '改葬許可申請：33,000円〜 / 墓じまい一式：110,000円〜',
    specialties: ['改葬許可申請', '墓じまい', '遺骨供養手続き', '散骨手続き'],
    profileText:
      '東京都内を中心に改葬・墓じまい手続きを専門に扱う行政書士事務所です。改葬許可申請から遺骨の改葬先手続きまで、ご依頼者様に寄り添いながらワンストップでサポートいたします。年間100件以上の実績があり、複雑なケースにも対応可能です。',
    businessHours: '月〜金 9:00〜18:00（土曜応相談）',
    planType: 'PREMIUM',
    priorityScore: 90,
    isApproved: true,
    isActive: true,
    paymentStatus: 'PAID',
    onboardingStep: 'APPROVED_ACTIVE',
  },
  {
    officeName: '鈴木行政書士事務所',
    representativeName: '鈴木 美咲',
    registrationNumber: '27030211',
    prefecture: '大阪府',
    city: '大阪市北区',
    addressLine: '梅田1-2-5 大阪梅田タワー12F',
    phone: '06-6342-5500',
    email: 'contact@suzuki-gyosei.com',
    websiteUrl: 'https://suzuki-gyosei.com',
    priceRangeText: '改葬許可申請：27,500円〜 / 墓じまい一式：88,000円〜',
    specialties: ['改葬許可申請', '墓じまい', '永代供養転出手続き'],
    profileText:
      '大阪・関西エリアの改葬・墓じまいに精通した女性行政書士です。お客様の不安を丁寧に受け止め、行政手続きをすべて代行します。他府県の墓地からの改葬にも対応しており、遠方案件も多数手がけております。',
    businessHours: '月〜土 9:30〜17:30',
    planType: 'STANDARD',
    priorityScore: 75,
    isApproved: true,
    isActive: true,
    paymentStatus: 'PAID',
    onboardingStep: 'APPROVED_ACTIVE',
  },
  {
    officeName: '伊藤総合行政書士事務所',
    representativeName: '伊藤 正樹',
    registrationNumber: '14020189',
    prefecture: '神奈川県',
    city: '横浜市西区',
    addressLine: '北幸2-9-40 横浜ダイヤビル9F',
    phone: '045-315-7700',
    email: 'info@ito-gyosei.co.jp',
    websiteUrl: 'https://ito-gyosei.co.jp',
    priceRangeText: '改葬許可申請：38,500円〜 / 墓じまい・改葬一式：132,000円〜',
    specialties: ['改葬許可申請', '墓じまい', '無縁改葬', '遺骨処理相談'],
    profileText:
      '神奈川県・横浜を拠点に、墓じまい・改葬手続きを専門に取り扱う総合行政書士事務所です。寺院との折衝から許可申請、新しい供養先の手配まで全面的に代行。無縁仏の改葬や複数墓地からの集約改葬など複雑な案件も豊富な実績があります。',
    businessHours: '月〜金 9:00〜18:00',
    planType: 'PREMIUM',
    priorityScore: 85,
    isApproved: true,
    isActive: true,
    paymentStatus: 'PAID',
    onboardingStep: 'APPROVED_ACTIVE',
  },
  {
    officeName: '佐藤行政書士事務所',
    representativeName: '佐藤 雅彦',
    registrationNumber: '04010354',
    prefecture: '宮城県',
    city: '仙台市青葉区',
    addressLine: '中央3-8-11 仙台パークビル7F',
    phone: '022-717-9900',
    email: 'sato@sendai-gyosei.jp',
    websiteUrl: null,
    priceRangeText: '改葬許可申請：22,000円〜',
    specialties: ['改葬許可申請', '墓じまい', '宗教法人との折衝代行'],
    profileText:
      '宮城・東北エリアの改葬・墓じまい手続きに対応する地域密着型の行政書士事務所です。地元の寺院・霊園との豊富なネットワークを活かし、スムーズな手続きを実現します。初回相談は無料です。',
    businessHours: '月〜金 10:00〜17:00（土曜午前応相談）',
    planType: 'BASIC',
    priorityScore: 60,
    isApproved: true,
    isActive: true,
    paymentStatus: 'PAID',
    onboardingStep: 'APPROVED_ACTIVE',
  },
  {
    officeName: '高橋行政書士・社会保険労務士事務所',
    representativeName: '高橋 裕子',
    registrationNumber: '23050671',
    prefecture: '愛知県',
    city: '名古屋市中区',
    addressLine: '栄3-18-1 ナディアパーク6F',
    phone: '052-265-4400',
    email: 'info@takahashi-office.jp',
    websiteUrl: 'https://takahashi-office.jp',
    priceRangeText: '墓じまい手続き一式：99,000円〜',
    specialties: ['改葬許可申請', '墓じまい', '散骨・樹木葬転出手続き', '遺産整理'],
    profileText:
      '名古屋市内および愛知県全域の改葬・墓じまいに対応。行政書士と社会保険労務士の両資格を活かし、相続・遺産整理とあわせた総合的なサポートが可能です。散骨・樹木葬・納骨堂への転出手続きも多数実績があります。',
    businessHours: '月〜金 9:00〜18:30',
    planType: 'STANDARD',
    priorityScore: 70,
    isApproved: true,
    isActive: true,
    paymentStatus: 'PAID',
    onboardingStep: 'APPROVED_ACTIVE',
  },
  {
    officeName: '中村法務行政書士事務所',
    representativeName: '中村 大輔',
    registrationNumber: '40020423',
    prefecture: '福岡県',
    city: '福岡市博多区',
    addressLine: '博多駅前2-9-28 博多ONビル3F',
    phone: '092-441-7600',
    email: 'nakamura@fukuoka-gyosei.jp',
    websiteUrl: 'https://fukuoka-gyosei.jp',
    priceRangeText: '改葬許可申請：29,700円〜 / 墓じまい一式：93,500円〜',
    specialties: ['改葬許可申請', '墓じまい', '改葬先選定サポート', '遺骨の一時預かり手配'],
    profileText:
      '福岡・九州エリアの改葬・墓じまい手続きを専門とする行政書士事務所です。改葬許可申請はもちろん、改葬先霊園・納骨堂の選定サポートから遺骨の一時預かり手配まで幅広く対応。離島や山間部の墓地からの改葬も承っております。',
    businessHours: '月〜土 9:00〜18:00',
    planType: 'STANDARD',
    priorityScore: 72,
    isApproved: true,
    isActive: true,
    paymentStatus: 'PAID',
    onboardingStep: 'APPROVED_ACTIVE',
  },
  {
    officeName: '小林行政書士事務所',
    representativeName: '小林 哲也',
    registrationNumber: '01010889',
    prefecture: '北海道',
    city: '札幌市中央区',
    addressLine: '北一条西4-1 札幌大通ビル11F',
    phone: '011-261-8800',
    email: 'kobayashi@sapporo-gyosei.com',
    websiteUrl: 'https://sapporo-gyosei.com',
    priceRangeText: '改葬許可申請：25,300円〜',
    specialties: ['改葬許可申請', '墓じまい', '道外への改葬手続き'],
    profileText:
      '北海道・札幌を拠点に、墓じまい・改葬手続きをサポートする行政書士事務所です。道内各地の自治体への改葬許可申請から、本州・道外への改葬転出手続きまで対応しております。冬季も通常通り営業しております。',
    businessHours: '月〜金 9:30〜17:30',
    planType: 'BASIC',
    priorityScore: 55,
    isApproved: true,
    isActive: true,
    paymentStatus: 'PAID',
    onboardingStep: 'APPROVED_ACTIVE',
  },
  {
    officeName: '渡辺行政書士事務所',
    representativeName: '渡辺 智子',
    registrationNumber: '26010912',
    prefecture: '京都府',
    city: '京都市中京区',
    addressLine: '烏丸通三条上る大倉町213 京都KTビル4F',
    phone: '075-231-6600',
    email: 'watanabe@kyoto-gyosei.jp',
    websiteUrl: null,
    priceRangeText: '墓じまい・改葬一式：77,000円〜',
    specialties: ['改葬許可申請', '墓じまい', '寺院との離檀交渉サポート'],
    profileText:
      '京都市内を中心に改葬・墓じまいの行政手続きを専門とする女性行政書士です。特に寺院との離檀交渉に精通しており、円満な解決をサポートします。宗派を問わず相談に対応しており、古いしきたりや作法についても丁寧にご説明します。',
    businessHours: '月〜金 10:00〜17:00',
    planType: 'BASIC',
    priorityScore: 58,
    isApproved: true,
    isActive: true,
    paymentStatus: 'PAID',
    onboardingStep: 'APPROVED_ACTIVE',
  },
]

async function main(): Promise<void> {
  console.log('Seeding AdministrativeScrivener records...')

  const existing = await prisma.administrativeScrivener.findMany({
    select: { officeName: true },
  })
  const existingNames = new Set(existing.map((r) => r.officeName))

  let created = 0
  for (const data of scriveners) {
    if (existingNames.has(data.officeName)) {
      console.log(`  Skip (exists): ${data.officeName}`)
      continue
    }
    const record = await prisma.administrativeScrivener.create({ data })
    console.log(`  Created: ${record.officeName} (${record.id})`)
    created++
  }

  console.log(`Done. ${created} created, ${scriveners.length - created} skipped.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

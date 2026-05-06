import { Resend } from 'resend';
import * as dotenv from 'dotenv';
import path from 'path';

// .env.local から環境変数を読み込む
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const FROM_ADDRESS = process.env.MAIL_FROM_ADDRESS || 'system@ohakajimai-navi.jp';

async function testResend() {
  if (!RESEND_API_KEY) {
    console.error('Error: RESEND_API_KEY is not set in .env.local');
    process.exit(1);
  }

  if (!ADMIN_EMAIL) {
    console.error('Error: ADMIN_EMAIL is not set in .env.local');
    process.exit(1);
  }

  console.log('--- Resend Test Configuration ---');
  console.log(`From: お墓じまいナビ <${FROM_ADDRESS}>`);
  console.log(`To: ${ADMIN_EMAIL}`);
  console.log('----------------------------------');

  const resend = new Resend(RESEND_API_KEY);

  try {
    console.log('Sending test email...');
    const { data, error } = await resend.emails.send({
      from: `お墓じまいナビ <${FROM_ADDRESS}>`,
      to: ADMIN_EMAIL,
      subject: '【Resend Test】ドメイン認証確認メール',
      text: `これは「お墓じまいナビ」のドメイン認証（ohakajimai-navi.jp）後の疎通確認テストです。\n送信時刻: ${new Date().toLocaleString('ja-JP')}`,
    });

    if (error) {
      console.error('Resend API Error:', error);
      process.exit(1);
    }

    console.log('Success! Email sent successfully.');
    console.log('Data:', data);
  } catch (err) {
    console.error('Unexpected Error:', err);
    process.exit(1);
  }
}

testResend();

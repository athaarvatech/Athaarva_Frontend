import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import nodemailer from 'nodemailer';

export const runtime = 'nodejs';

const REQUIRED_ENV_VARS = [
  'SMTP_SERVER',
  'SMTP_PORT',
  'SMTP_USERNAME',
  'SMTP_PASSWORD',
  'SMTP_FROM_EMAIL',
];

const validateEnv = () => {
  const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`Missing SMTP environment variables: ${missing.join(', ')}`);
  }
};

export async function POST(request: NextRequest) {
  try {
    validateEnv();

    const payload = await request.json();
    const { to, subject, html, text, cc } = payload ?? {};

    if (!to || !subject || (!html && !text)) {
      return NextResponse.json({
        success: false,
        message: 'Required fields: to, subject, and html or text body.',
      }, { status: 400 });
    }

    const port = Number(process.env.SMTP_PORT ?? 587);
    const secure = port === 465;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_SERVER,
      port,
      secure,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `${process.env.SMTP_FROM_NAME ?? 'Athaarva Platform'} <${process.env.SMTP_FROM_EMAIL}>`,
      to,
      cc,
      subject,
      text,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('SMTP send failed', error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to send email',
    }, { status: 500 });
  }
}

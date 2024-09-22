import { sendEmail } from '@components/serves/mailerJrd';
import { NextResponse } from 'next/server';

export const POST = async (request: Request) => {
  try {
    const { to, subject, text } = await request.json();
    if (!to || !subject || !text) {
      return NextResponse.json({ msg: 'Missing required fields' }, { status: 400 });
    }

    await sendEmail(to, subject, text);
    return NextResponse.json({ msg: "Email sent" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ msg: error?.message || 'Internal Server Error' }, { status: 500 });
  }
};

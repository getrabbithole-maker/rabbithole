/**
 * Run this to test your Resend email setup:
 * npx tsx test-email.ts
 */

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmail() {
  console.log('Sending test email...');

  try {
    const result = await resend.emails.send({
      from: 'noreply@rabbithole.autos',
      to: 'your-email@example.com', // ⚠️ Replace with your email
      subject: 'Test Email from Rabbit Hole',
      html: `
        <h1>It works!</h1>
        <p>Your Resend email setup is working correctly.</p>
        <p>From: <strong>rabbithole.autos</strong></p>
      `,
    });

    console.log('✅ Email sent successfully!', result);
  } catch (error) {
    console.error('❌ Error sending email:', error);
  }
}

testEmail();

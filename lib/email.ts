import { Resend } from 'resend';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Verify your domain in Resend dashboard first!
// For testing: use your @resend.dev email address
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

export interface WaitlistEmailData {
  email: string;
  name?: string;
  queuePosition?: number;
}

/**
 * Send a confirmation email when someone joins the waitlist
 */
export async function sendWaitlistConfirmation({ email, name, queuePosition }: WaitlistEmailData) {
  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: email, // The user's email
      subject: '🎉 You\'re on the Rabbit Hole waitlist!',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .logo { font-size: 24px; font-weight: bold; color: #6366f1; }
              .content { background: #f9fafb; padding: 30px; border-radius: 8px; }
              .queue-number { font-size: 48px; font-weight: bold; color: #6366f1; text-align: center; margin: 20px 0; }
              .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">🐰 Rabbit Hole</div>
              </div>
              <div class="content">
                <h2>Welcome${name ? ` ${name}` : ''}! 🎉</h2>
                <p>You've successfully joined the Rabbit Hole waitlist!</p>

                ${queuePosition !== undefined ? `
                  <p>Your current position in the queue:</p>
                  <div class="queue-number">#${queuePosition}</div>
                ` : ''}

                <p>We're working hard to bring you something amazing. Stay tuned for updates!</p>
                <p>In the meantime, follow us on social media for behind-the-scenes content.</p>
              </div>
              <div class="footer">
                <p>You're receiving this email because you signed up for the Rabbit Hole waitlist.</p>
                <p>© 2025 Rabbit Hole. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    return { success: true, data };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error };
  }
}

/**
 * Send a notification email to yourself when someone joins
 */
export async function sendWaitlistNotification({ email, name, queuePosition }: WaitlistEmailData) {
  // Your email address - update this!
  const adminEmail = process.env.ADMIN_EMAIL || 'your-email@example.com';

  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: adminEmail,
      subject: `🆕 New Waitlist Signup: ${email}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .info { background: #e0e7ff; padding: 15px; border-radius: 6px; margin: 10px 0; }
              .label { font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="container">
              <h2>🆕 New Waitlist Signup</h2>
              <div class="info">
                <p><span class="label">Email:</span> ${email}</p>
                ${name ? `<p><span class="label">Name:</span> ${name}</p>` : ''}
                ${queuePosition !== undefined ? `<p><span class="label">Queue Position:</span> #${queuePosition}</p>` : ''}
              </div>
            </div>
          </body>
        </html>
      `,
    });

    return { success: true, data };
  } catch (error) {
    console.error('Notification email error:', error);
    return { success: false, error };
  }
}

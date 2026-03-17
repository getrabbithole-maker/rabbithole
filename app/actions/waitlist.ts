'use server'

import { getSupabaseAdmin } from '@/lib/supabase'
import { resend } from '@/lib/resend'
import { sendTelegramNotification, formatWaitlistNotification } from '@/lib/telegram'
import { revalidatePath } from 'next/cache'
import type { WaitlistFormData, Plan, Locale } from '@/types/waitlist'

interface WaitlistResult {
  success: boolean
  error?: string
  alreadyExists?: boolean
  count?: number
}

const MONTHLY_PRICE = 29
const YEARLY_PRICE = 290

async function sendConfirmationEmail(
  email: string,
  plan: Plan,
  locale: Locale
) {
  const price = plan === 'monthly' ? `฿${MONTHLY_PRICE}/month` : `฿${YEARLY_PRICE}/year`

  // Bilingual content
  const subject = "You're on the list 🐇 | คุณอยู่ในลิสต์แล้ว 🐇"

  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500&display=swap" rel="stylesheet">
        <title>Welcome to Rabbit Hole</title>
      </head>
      <body style="margin: 0; padding: 0; background: #000; font-family: 'Prompt', -apple-system, BlinkMacSystemFont, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; padding: 60px 20px;">

          <!-- Logo & Header -->
          <div style="text-align: center; margin-bottom: 60px;">
            <img src="https://rabbithole-alpha.vercel.app/logo.png" alt="Rabbit Hole" style="width: 60px; height: auto; margin: 0 auto 20px; display: block;">
            <h1 style="color: #fff; font-size: 14px; font-weight: 400; letter-spacing: 3px; margin: 0; text-transform: uppercase;">
              rabbithole
            </h1>
          </div>

          <!-- Congratulations -->
          <div style="text-align: center; margin-bottom: 40px;">
            <img src="https://rabbithole-alpha.vercel.app/Profile_Icon.png" alt="Congrats" style="width: 48px; height: auto; margin: 0 auto 20px; display: block;">
            <h2 style="color: #fff; font-size: 28px; font-weight: 500; margin: 0 0 8px 0; letter-spacing: -0.5px;">
              Congrats
            </h2>
            <p style="color: #888; font-size: 16px; margin: 0; font-weight: 300;">
              ยินดีด้วย
            </p>
          </div>

          <!-- Welcome Message -->
          <div style="text-align: center; margin-bottom: 40px;">
            <p style="color: #fff; font-size: 18px; font-weight: 400; margin: 0 0 8px 0;">
              You're in.
            </p>
            <p style="color: #888; font-size: 15px; margin: 0; font-weight: 300;">
              คุณได้เข้าร่วม Early Access แล้ว
            </p>
          </div>

          <!-- Divider -->
          <div style="border-top: 1px solid #222; margin: 40px 0;"></div>

          <!-- Next Steps -->
          <div style="text-align: center; margin-bottom: 40px;">
            <p style="color: #fff; font-size: 14px; margin: 0 0 6px 0; line-height: 1.6; font-weight: 300;">
              We'll email you on launch day with your access link.
            </p>
            <p style="color: #666; font-size: 13px; margin: 0; line-height: 1.6; font-weight: 300;">
              เราจะส่งอีเมลคุณในวันที่เปิดตัวแอป พร้อมลิงก์เข้าใช้งาน
            </p>
          </div>

          <!-- Thank You -->
          <div style="text-align: center; margin-bottom: 40px;">
            <p style="color: #fff; font-size: 14px; margin: 0 0 6px 0; font-weight: 300;">
              Thank you
            </p>
            <p style="color: #666; font-size: 13px; margin: 0; font-weight: 300;">
              ขอบคุณจากใจจริง
            </p>
          </div>

          <!-- Contact -->
          <div style="text-align: center; margin-bottom: 40px;">
            <p style="color: #888; font-size: 13px; margin: 0 0 6px 0; font-weight: 300;">
              Contact us
            </p>
            <a href="mailto:getrabbithole@gmail.com" style="color: #fff; font-size: 13px; text-decoration: none; font-weight: 300;">
              getrabbithole@gmail.com
            </a>
          </div>

          <!-- Footer -->
          <div style="text-align: center; padding-top: 40px; border-top: 1px solid #222;">
            <p style="color: #444; font-size: 13px; margin: 0; letter-spacing: 0.5px; font-weight: 300;">
              Go deep. Stay deep.
            </p>
            <p style="color: #333; font-size: 12px; margin: 4px 0 0 0; font-weight: 300;">
              ดำดิ่งลงไป ให้ลึก
            </p>
          </div>

        </div>
      </body>
    </html>
  `

  try {
    await resend.emails.send({
      from: 'rabbithole <noreply@rabbithole.autos>',
      to: email,
      subject: subject,
      html: emailHtml,
    })
  } catch (error) {
    console.error('Failed to send confirmation email:', error)
    // Don't throw - we still want to succeed even if email fails
  }
}

async function sendAdminNotification(
  email: string,
  plan: Plan,
  totalCount: number
) {
  const adminEmail = process.env.ADMIN_EMAIL || 'getrabbithole@gmail.com'
  const planLabel = plan === 'monthly' ? '฿29/month' : '฿290/year'

  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Waitlist Signup 🐇</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #7B4FBE; border-radius: 8px; padding: 30px; text-align: center; margin-bottom: 20px;">
            <div style="font-size: 48px; margin-bottom: 10px;">🐇</div>
            <h1 style="color: white; margin: 0; font-size: 24px;">New Waitlist Signup</h1>
          </div>

          <div style="background: white; border-radius: 8px; padding: 30px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666; width: 120px;">Email</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-weight: 600;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666;">Plan</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-weight: 600;">${planLabel}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666;">Total Signups</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-weight: 600; color: #7B4FBE; font-size: 18px;">${totalCount}</td>
              </tr>
            </table>

            <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #7B4FBE; text-align: center;">
              <p style="margin: 0; color: #999; font-size: 12px;">
                Sent from Rabbit Hole Waitlist
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `

  try {
    await resend.emails.send({
      from: 'rabbithole <noreply@rabbithole.autos>',
      to: adminEmail,
      subject: `🆕 ${email} joined the waitlist`,
      html: emailHtml,
    })
  } catch (error) {
    console.error('Failed to send admin notification:', error)
  }
}

export async function joinWaitlist(formData: WaitlistFormData): Promise<WaitlistResult> {
  try {
    const { email, plan, locale } = formData
    const supabaseAdmin = getSupabaseAdmin()

    // Check if email already exists
    const { data: existing, error: checkError } = await supabaseAdmin
      .from('waitlist')
      .select('id')
      .eq('email', email)
      .single()

    if (existing) {
      return {
        success: false,
        alreadyExists: true,
      }
    }

    // Insert new entry
    const { data, error } = await supabaseAdmin
      .from('waitlist')
      .insert({
        email,
        plan,
        locale,
      })
      .select()
      .single()

    if (error) {
      // Check for unique constraint violation
      if (error.code === '23505') {
        return {
          success: false,
          alreadyExists: true,
          error: 'Already on the list!',
        }
      }
      throw error
    }

    // Get total count
    const { count } = await supabaseAdmin
      .from('waitlist')
      .select('*', { count: 'exact', head: true })

    const totalSpotsTaken = count || 0
    const totalSpotsLeft = 100 - totalSpotsTaken

    // Send Telegram notification
    await sendTelegramNotification(
      formatWaitlistNotification(email, plan, totalSpotsTaken, totalSpotsLeft)
    )

    // Send confirmation email to user
    await sendConfirmationEmail(email, plan, locale)

    // Send notification to admin
    await sendAdminNotification(email, plan, totalSpotsTaken)

    // Revalidate the page to update the count
    revalidatePath('/')

    return {
      success: true,
      count: count || 0,
    }
  } catch (error) {
    console.error('Error joining waitlist:', error)
    return {
      success: false,
      error: 'Something went wrong. Please try again.',
    }
  }
}

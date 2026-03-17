'use server'

import { getSupabaseAdmin } from '@/lib/supabase'
import { resend } from '@/lib/resend'
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

  const subjectEn = "You're on the list 🐇"
  const subjectTh = 'คุณอยู่ในลิสต์แล้ว 🐇'

  const headlineEn = "You're in."
  const headlineTh = 'คุณเข้ามาแล้ว'

  const priceLockedEn = 'This price never changes. Ever.'
  const priceLockedTh = 'ราคานี้จะไม่เปลี่ยน ตลอดไป'

  const nextStepsEn = "We'll email you on launch day with your access link."
  const nextStepsTh = 'เราจะอีเมลคุณในวัน launch พร้อมลิงก์เข้าใช้งาน'

  const sloganEn = 'Go deep. Stay deep.'
  const sloganTh = 'ดำดิ่งลงไป อยู่ให้ลึก'

  const isEn = locale === 'en'

  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${isEn ? subjectEn : subjectTh}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #080612; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="text-align: center; margin-bottom: 40px;">
            <div style="width: 48px; height: 48px; background: #7B4FBE; border-radius: 8px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 24px;">
              🐇
            </div>
            <h1 style="color: #F2EDF9; font-size: 14px; font-weight: 400; letter-spacing: 2px; margin: 0;">
              rabbithole
            </h1>
          </div>

          <div style="text-align: center; margin-bottom: 40px;">
            <h2 style="color: #F2EDF9; font-size: 32px; font-weight: 700; margin: 0 0 20px 0; font-family: Georgia, serif;">
              ${isEn ? headlineEn : headlineTh}
            </h2>

            <div style="background: #0F0A1E; border: 1px solid rgba(180, 127, 232, 0.2); border-radius: 4px; padding: 24px; margin-bottom: 24px;">
              <p style="color: rgba(242, 237, 249, 0.5); font-size: 14px; margin: 0 0 8px 0;">
                ${isEn ? 'Your locked price' : 'ราคาที่ล็อคไว้'}
              </p>
              <p style="color: #F2EDF9; font-size: 24px; font-weight: 700; margin: 0;">
                ${price}
              </p>
            </div>

            <p style="color: rgba(242, 237, 249, 0.5); font-size: 16px; margin: 0 0 12px 0;">
              ${isEn ? priceLockedEn : priceLockedTh}
            </p>

            <p style="color: rgba(242, 237, 249, 0.5); font-size: 16px; margin: 0 0 32px 0;">
              ${isEn ? nextStepsEn : nextStepsTh}
            </p>
          </div>

          <div style="text-align: center; padding-top: 40px; border-top: 1px solid rgba(255, 255, 255, 0.07);">
            <p style="color: rgba(242, 237, 249, 0.25); font-size: 14px; margin: 0; font-style: italic; font-family: Georgia, serif;">
              ${isEn ? sloganEn : sloganTh}
            </p>
          </div>
        </div>
      </body>
    </html>
  `

  try {
    await resend.emails.send({
      from: 'rabbithole <noreply@rabbithole.so>',
      to: email,
      subject: isEn ? subjectEn : subjectTh,
      html: emailHtml,
    })
  } catch (error) {
    console.error('Failed to send confirmation email:', error)
    // Don't throw - we still want to succeed even if email fails
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
        error: 'Already on the list!',
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

    // Send confirmation email
    await sendConfirmationEmail(email, plan, locale)

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

interface TelegramMessage {
  text: string
}

export async function sendTelegramNotification(message: string): Promise<void> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!botToken || !chatId) {
    console.log('Telegram credentials not configured, skipping notification')
    return
  }

  try {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`

    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    })
  } catch (error) {
    console.error('Failed to send Telegram notification:', error)
    // Don't throw - we don't want to break the waitlist signup if Telegram fails
  }
}

export function formatWaitlistNotification(
  email: string,
  plan: string,
  spotsTaken: number,
  spotsLeft: number
): string {
  const planEmoji = plan === 'monthly' ? '📅' : '📆'
  const spotLeftEmoji = spotsLeft <= 10 ? '🔥' : '✅'
  const urgencyEmoji = spotsLeft <= 5 ? '⚡' : spotsLeft <= 10 ? '🚨' : '📊'

  return `
<b>${urgencyEmoji} NEW RABBITHOLE SIGNUP!</b>

${planEmoji} <b>Plan:</b> ${plan}
📧 <b>Email:</b> ${email}

━━━━━━━━━━━━━━━
<b>📊 CURRENT STATUS:</b>
✅ <b>Joined:</b> ${spotsTaken}/100
${spotLeftEmoji} <b>Spots Left:</b> ${spotsLeft}

${spotsLeft <= 10 ? `<b>${urgencyEmoji} GETTING FULL!</b>` : ''}
━━━━━━━━━━━━━━━
<i>Go deep. Stay deep. 🐇</i>
  `.trim()
}

# Telegram Notification Setup

Get instant Telegram notifications when people join your Rabbithole waitlist!

## 📱 Setup Instructions

### 1. Create a Telegram Bot
1. Open Telegram and search for `@BotFather`
2. Send `/newbot` command
3. Follow the prompts to name your bot (e.g., "Rabbithole Bot")
4. Copy the **Bot Token** (looks like `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)
5. Add this as `TELEGRAM_BOT_TOKEN` in your Vercel environment variables

### 2. Get Your Chat ID
1. Search for `@userinfobot` on Telegram
2. Send `/start` command
3. Copy your **Chat ID** (a number, e.g., `123456789`)
4. Add this as `TELEGRAM_CHAT_ID` in your Vercel environment variables

### 3. Add to Vercel
1. Go to your Vercel project → Settings → Environment Variables
2. Add both variables:
   - `TELEGRAM_BOT_TOKEN` = `your_bot_token_here`
   - `TELEGRAM_CHAT_ID` = `your_chat_id_here`
3. Redeploy your application

## 📊 Notification Format

You'll receive notifications like this:

```
🚨 NEW RABBITHOLE SIGNUP!

📅 Plan: monthly
📧 Email: user@example.com

━━━━━━━━━━━━━━━
📊 CURRENT STATUS:
✅ Joined: 24/100
✅ Spots Left: 76

━━━━━━━━━━━━━━━
Go deep. Stay deep. 🐇
```

## ⚡ Urgency Levels

- **🔥 10 or fewer spots left** - Special urgency indicator
- **⚡ 5 or fewer spots left** - Maximum urgency
- **🚨 10-20 spots left** - Getting full indicator
- **📊 20+ spots left** - Normal status

## 🛠️ Troubleshooting

**Not receiving notifications?**
1. Verify bot token and chat ID are correct
2. Make sure you've started a conversation with your bot
3. Check Vercel function logs for errors
4. Test manually: Send a message to your bot first

**Want to test notifications?**
1. Temporarily add a test signup in your Supabase dashboard
2. Or use the API directly to test the notification function

**Multiple recipients?**
You can create a Telegram group and add your bot, then use the group chat ID instead of personal chat ID.
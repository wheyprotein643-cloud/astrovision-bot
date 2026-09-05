# Astro-Vision WhatsApp Bot

WhatsApp receptionist for **Astro-Vision Astrological Centre (Regd.)**, Ludhiana — Pandit Harvinder Singh Dhillon.

Customers get Hindi / Hinglish / English replies about Kundli, match making, marriage, career, gemstones, Vastu, Lal Kitab, palmistry, and can book an appointment in 5 steps.

## Railway

1. Push this repo to GitHub.
2. Railway → New Project → GitHub repo.
3. Set environment variables:

```
WHATSAPP_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_VERIFY_TOKEN=
WHATSAPP_APP_SECRET=
XAI_API_KEY=          # optional, for open questions
```

4. In Meta Developer → WhatsApp → Configuration:

- Callback URL: `https://YOUR-RAILWAY-HOST/webhook`
- Verify token: same as `WHATSAPP_VERIFY_TOKEN`
- Subscribe to `messages`

Start command (already in `railway.toml`): `npx tsx bot/server.ts`

Health: `GET /health`
Webhook: `GET|POST /webhook` (also accepts `/api/whatsapp/webhook`)

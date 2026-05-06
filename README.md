# Spatos Lounge&Grill Website

Professional multi-page React website for Spatos Lounge&Grill, with a local backend API for booking and subscription forms.

## Run locally

1. Copy `.env.example` to `.env`.
2. Install dependencies:
   - `npm install`
3. Run frontend + backend together:
   - `npm run dev:full`

Frontend runs on `http://localhost:5173` and backend API runs on `http://localhost:4000`.

## Useful scripts

- `npm run dev` - start Vite frontend
- `npm run server` - start Express forms API
- `npm run dev:full` - run both services together
- `npm run lint` - run ESLint
- `npm run build` - build production frontend

## API endpoints

- `GET /health` - API health check
- `GET /booking-options` - fetch lounge services + availability + deposit rate
- `POST /subscriptions` - save newsletter subscription
- `POST /bookings` - save booking request
- `GET /whatsapp/webhook` - verification endpoint for WhatsApp webhook providers
- `POST /whatsapp/webhook` - WhatsApp auto-reply handler (Twilio-ready)

## WhatsApp auto-reply setup

1. Fill Twilio credentials in `.env`:
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_SMS_NUMBER`
   - `TWILIO_WHATSAPP_NUMBER`
2. Set lounge notification destinations:
   - `LOUNGE_PHONE_NUMBER`
   - `LOUNGE_WHATSAPP_NUMBER`
   - `LOUNGE_EMAIL`
3. Optional SMTP for lounge email notification:
   - `SMTP_HOST`
   - `SMTP_PORT`
   - `SMTP_USER`
   - `SMTP_PASS`
   - `SMTP_FROM`
4. Set a verify token (`WHATSAPP_VERIFY_TOKEN`) for webhook validation.
5. Point your WhatsApp webhook to:
   - `GET /whatsapp/webhook` for verification
   - `POST /whatsapp/webhook` for incoming message events
6. Without Twilio credentials, endpoint still returns a `previewReply` for testing logic.

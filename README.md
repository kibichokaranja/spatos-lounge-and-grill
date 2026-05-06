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
- `GET /booking-options` - fetch lounge services + day/time availability
- `POST /subscriptions` - save newsletter subscription
- `POST /bookings` - save day/time service booking request
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
7. Booking emails:
   - customer receives a warm confirmation email
   - lounge receives booking details via email

## Twilio production enablement checklist (Vercel + GitHub)

1. Prepare Twilio account for delivery:
   - Upgrade from trial if you want unrestricted customer delivery.
   - Buy/activate an SMS-capable number and set it as `TWILIO_SMS_NUMBER`.
   - Enable WhatsApp sender (Sandbox or approved WhatsApp Business sender) and set it as `TWILIO_WHATSAPP_NUMBER` in `whatsapp:+<number>` format.
2. Verify destination numbers while on trial:
   - Add your customer test number(s) and lounge number(s) in Twilio verified recipients.
   - Keep `LOUNGE_PHONE_NUMBER` and `LOUNGE_WHATSAPP_NUMBER` in E.164 format (`+254...` and `whatsapp:+254...`).
3. Set environment variables in Vercel project settings:
   - `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`
   - `TWILIO_SMS_NUMBER`, `TWILIO_WHATSAPP_NUMBER`
   - `LOUNGE_PHONE_NUMBER`, `LOUNGE_WHATSAPP_NUMBER`, `LOUNGE_EMAIL`
   - `WHATSAPP_VERIFY_TOKEN`
   - SMTP values for subscription/booking emails (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`)
4. Redeploy after env updates:
   - Push to `main` (or redeploy latest commit) so runtime picks new secrets.
5. Configure webhook callbacks (if using inbound WhatsApp automation):
   - Verification URL: `GET https://<your-domain>/whatsapp/webhook`
   - Messages URL: `POST https://<your-domain>/whatsapp/webhook`
   - Use the same `WHATSAPP_VERIFY_TOKEN` in provider setup.
6. Run quick production API checks:
   - `GET /health` returns `{ ok: true }`
   - `GET /booking-options` returns service options
   - `POST /subscriptions` stores email and sends welcome mail when SMTP is valid
   - `POST /bookings` returns `notifications` object and logs Twilio failures without breaking booking save
7. Validate delivery in Twilio console:
   - Confirm outbound message attempts for SMS and WhatsApp.
   - If blocked, check trial restrictions, sender/channel mismatch, and E.164 formatting first.

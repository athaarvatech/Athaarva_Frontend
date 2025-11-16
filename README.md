## Development

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to access the app. The Super Admin slice lives under `/super-admin`.

## Super Admin sandbox credentials

Use these demo credentials to log into the Super Admin workspace (the login form is pre-filled and also lists them):

| Email | Password |
| --- | --- |
| `super.admin@athaarva.com` | `supersecure` |

## SMTP email testing

Invites now trigger a real SMTP send through a Next.js API route at `POST /api/smtp/send`. Add the following variables to `.env.local` (values mirror the backend `.env` shared by the team):

```env
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=discordsmurf245@gmail.com
SMTP_PASSWORD=azqbiucrcvfxrknd
SMTP_FROM_EMAIL=discordsmurf245@gmail.com
SMTP_FROM_NAME=Athaarva Healthcare
```

> ⚠️ These credentials are for local testing only. Do not push real secrets to public repos.

Restart `npm run dev` after editing env vars. When you compose an invite in `/super-admin/invites`, the app will:

1. Save the invite to the local mock ledger (for UI state).
2. Call `/api/smtp/send` to dispatch an email via Gmail SMTP using the details you entered.

Toast notifications will tell you whether the SMTP call succeeded or failed.

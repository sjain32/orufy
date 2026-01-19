# Sign Project

Full‑stack app with OTP login and product admin dashboard.

## Tech Stack

- **Frontend:** React + Vite, Tailwind CSS, Axios
- **Backend:** Node.js, Express, Mongoose
- **Database:** MongoDB Atlas
- **Email:** Nodemailer (SMTP)
- **Hosting:** Netlify (frontend), Render (backend)

## Local Setup

### 1) Backend

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```
PORT=5000
MONGO_URI=<your_mongodb_uri>
JWT_SECRET=<your_jwt_secret>
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=<your_email>
SMTP_PASS=<your_app_password>
FRONTEND_URL=http://localhost:5173
```

Run the backend:

```bash
npm start
```

### 2) Frontend

```bash
cd frontend
npm install
```

Create a `.env` file inside `frontend/`:

```
VITE_API_URL=http://localhost:5000
```

Run the frontend:

```bash
npm run dev
```

Open `http://localhost:5173`.

## Deployment Notes (OTP 500 in Production)

Locally, OTP works because SMTP is allowed. After deploying, OTP requests return **500** because outbound SMTP is blocked by the hosting provider (Render/Netlify).

**Why this happens:**
- Many cloud hosts block SMTP ports to prevent spam.
- The backend can’t reach Gmail’s SMTP server, so `sendOTP()` fails.

**Options to fix:**
- Use an email API (recommended): SendGrid, Mailgun, Resend, AWS SES, Brevo.
- If staying on SMTP, use a host that allows outbound SMTP or request an unblock from your provider.

Once SMTP connectivity is restored, OTP will work in production.

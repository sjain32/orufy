import cors from "cors";

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.FRONTEND_URL, // https://orufyproj.netlify.app
].filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true); // allow Postman, curl
      if (allowedOrigins.includes(origin)) {
        return cb(null, true);
      }
      return cb(null, false); // ❗ DO NOT throw error
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ REQUIRED for preflight
app.options("*", cors());

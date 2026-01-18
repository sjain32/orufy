import express from "express";
import cors from "cors";
import authRoutes from "./Routes/auth.routes.js";
import productsRoutes from "./Routes/products.routes.js";

const app = express();

const allowedOrigins = [
  "https://orufyp.netlify.app",
  process.env.FRONTEND_URL,
].filter(Boolean);
//good to go
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true); // Postman / curl
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(null, false); // ❌ never throw
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/auth", authRoutes);
app.use("/products", productsRoutes);

export default app;

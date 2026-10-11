require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const auth = require("./middlewares/auth");
const {
  adminRouter,
  loginRouter,
  studentRouter,
  internshipRouter,
  profileRouter,
  applicationRouter,
} = require("./routes/export_routes");

// ─── App Setup ───────────────────────────────────────────────────────────────

const app = express();
app.use(express.json());

// ─── CORS ────────────────────────────────────────────────────────────────────

// Origins always allowed (local dev + production from .env)
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL, // e.g. https://im-ping.vercel.app
].filter(Boolean); // removes undefined if FRONTEND_URL is not set


// Returns true if the request origin is allowed
function isAllowedOrigin(origin) {
  if (!origin) return true; // Allow non-browser requests (e.g. Postman, curl)
  return allowedOrigins.includes(origin);
}

app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true, // Required for cookies / auth headers
  })
);

// ─── Static Files ────────────────────────────────────────────────────────────

app.use("/uploads", express.static("uploads"));

// ─── Database ────────────────────────────────────────────────────────────────

connectDB();

// ─── Routes ──────────────────────────────────────────────────────────────────

app.use("/register", loginRouter);   // Public: login / register

app.use(auth);                       // All routes below require authentication

app.use("/admin", adminRouter);
app.use("/student", studentRouter);
app.use("/internships", internshipRouter);
app.use("/profile", profileRouter);
app.use("/applications", applicationRouter);



// ─── Start Server ────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
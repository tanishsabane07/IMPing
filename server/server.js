const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const auth = require("./middlewares/auth");
const {adminRouter, loginRouter, studentRouter, internshipRouter, profileRouter, applicationRouter } = require("./routes/export_routes");
require("dotenv").config();

const app = express();
app.use(express.json());

// CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  ...(process.env.FRONTEND_URLS
    ? process.env.FRONTEND_URLS.split(",").map((origin) => origin.trim()).filter(Boolean)
    : []),
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL.trim()] : []),
];

const isAllowedOrigin = (origin) => {
  if (!origin) return true;

  // Allow this Vercel project domains (production + preview URLs)
  if (/^https:\/\/im-ping(?:-[a-z0-9-]+)?\.vercel\.app$/i.test(origin)) {
    return true;
  }

  return allowedOrigins.includes(origin);
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use("/uploads", express.static("uploads"));


connectDB();    //connect to the database
 

app.use("/register", loginRouter);

app.use(auth);  // authentication middleware

app.use("/admin", adminRouter);
app.use("/student", studentRouter);
app.use("/internships", internshipRouter);
app.use("/profile", profileRouter);  // profile router
app.use("/applications", applicationRouter); // application router

// Serve React build files in production
// Serve React build files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {    //server listening
    console.log(`Server is running on port ${PORT}`);
});
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const auth = require("./middlewares/auth");
const {adminRouter, loginRouter, studentRouter, internshipRouter, profileRouter, applicationRouter } = require("./routes/export_routes");
require("dotenv").config();

const app = express();

// CORS configuration for Vercel frontend
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? [process.env.FRONTEND_URL || 'https://your-vercel-app.vercel.app'] 
        : ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true
}));

app.use(express.json());

connectDB();    //connect to the database
 

app.use("/register", loginRouter);

app.use(auth);  // authentication middleware

app.use("/admin", adminRouter);
app.use("/student", studentRouter);
app.use("/internships", internshipRouter);
app.use("/profile", profileRouter);  // profile router
app.use("/applications", applicationRouter); // application router

// Serve React build files in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));
    
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../client/dist/index.html'));
    });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {    //server listening
    console.log(`Server is running on port ${PORT}`);
});
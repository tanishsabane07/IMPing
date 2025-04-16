const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const auth = require("./middlewares/auth");
const {adminRouter, loginRouter, studentRouter, internshipRouter, profileRouter, applicationRouter } = require("./routes/export_routes");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));


connectDB();    //connect to the database
 

app.use("/register", loginRouter);

app.use(auth);  // authentication middleware

app.use("/admin", adminRouter);
app.use("/student", studentRouter);
app.use("/internships", internshipRouter);
app.use("/profile", profileRouter);  // profile router
app.use("/applications", applicationRouter); // application router


app.listen(process.env.PORT, () => {    //server listening
    console.log(`Server is running on port ${process.env.PORT}`);
});
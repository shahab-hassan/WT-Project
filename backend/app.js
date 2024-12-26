// app.js
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");

require("dotenv").config({ path: "./config/.env" });
const errorHandler = require("./middlewares/errorHandlerMW");

// Middlewares
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
    })
);

// ===== ROUTES =====

// If you have user routes
// app.use("/api/v1/users", require("./routes/userRoute"));

// Project routes
app.use("/api/projects", require("./routes/projectRoute"));

// Custom error handler (if used)
app.use(errorHandler);

module.exports = app;

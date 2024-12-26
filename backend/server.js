// server.js
const app = require("./app");
const connectDB = require("./config/database");

// Uncaught Exception
process.on("uncaughtException", (err) => {
    console.log("Error:", err.message);
    console.log("Shutting down server due to uncaught Exception");
    process.exit(1);
});

// Connect to the database
connectDB(); // <-- Call this function

// Start listening
const server = app.listen(process.env.PORT, () => {
    console.log("Server is listening at PORT:", process.env.PORT);
});

// Unhandled Promise rejection
process.on("unhandledRejection", (err) => {
    console.log("Error", err.message);
    console.log("Shutting down server due to unhandled promise rejection");
    server.close(() => {
        process.exit(1);
    });
});

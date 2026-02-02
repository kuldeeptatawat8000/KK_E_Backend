const express = require("express");
const connectDB = require("./config/database");
const morgan = require("morgan");
const dotenv = require("dotenv");
const authRouter = require("./routers/authRouter");
const categoryRouter = require("./routers/categoryRouter");
const productRouter = require("./routers/productRouter");
const cors = require("cors");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/product", productRouter);

// Test route
app.get("/", (req, res) => {
  res.send("<h1>Backend API Running 🚀</h1>");
});

// Connect DB first, then start server
connectDB().then(() => {
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
        console.log(`Server running mode on port ${PORT}`);
    });
}).catch(err => {
    console.error("DB connection failed:", err.message);
});

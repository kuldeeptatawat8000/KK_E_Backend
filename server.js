const express = require("express");
const connectDB = require("../config/database");
const morgan = require("morgan");
const dotenv = require("dotenv");
const authRouter = require("../routers/authRouter");
const categoryRouter = require("../routers/categoryRouter");
const productRouter = require("../routers/productRouter");
const cors = require("cors");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

connectDB();

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/product", productRouter);

app.get("/", (req, res) => {
  res.send("<h1>Welcome ji !</h1>");
});

module.exports = app;

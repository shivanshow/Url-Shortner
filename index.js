const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
require('dotenv').config()

const app = express();
const PORT = process.env.PORT || 8000;

const urlRoutes = require("./routes/urlRoutes");
const userRoutes = require("./routes/userRoutes");

app.use(express.json());
app.use(cookieParser());

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDb Connected");
    } catch (error) {
        console.log("MongoDb Connection Failed!", error);
        process.exit(1);
    }
};

connectDb();

// Mount routes
app.use("/user", userRoutes); // User authentication
app.use("/", urlRoutes); // Short URL handling

app.listen(PORT, () => console.log("Server Started!"));

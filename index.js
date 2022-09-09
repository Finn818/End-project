require('dotenv').config();
const express = require("express"); 
const db = require("./config/dbconn");
const cors = require("cors");
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {errorHandling} = require('./middleware/ErrorHandling');
const nodemailer = require('nodemailer');

const userRouter = require("./routes/userRoutes");
const productsRouter = require("./routes/productsRoutes");
const productDetailsRouter = require("./routes/productDetailsRoutes");
const fullproductDetailsRouter = require("./routes/fullproductDetailsRoutes");

const app = express();
app.set("port", process.env.PORT || 6969);

app.use(cors());
app.use(express.json(), 
express.urlencoded( {
    extended: true
} ));

app.get("/", (req, res) => {
    res.status(200).json({ msg: "Welcome" });
});
app.use("/users", userRouter);
app.use("/products", productsRouter);
app.use("/productDetails", productDetailsRouter);
app.use("/fullproductDetails", fullproductDetailsRouter);
app.listen(app.get("port"), () => {
    console.log(`Listening for calls on port ${app.get("port")}`);
    console.log("Press Ctrl+C to exit server");
});

// ================================

require('dotenv').config();
const db = require("./config/dbconn");
const express = require("express"); 
const cors = require("cors");
const bodyParser = require('body-parser');
const conn = require("./config/dbconn");

const userRoute = require("./routes/userRoute");

const app = express();
app.set("port", process.env.PORT || 6969);
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.json({ msg: "Welcome" });
});

app.use("/users", userRoute);

app.listen(app.get("port"), () => {
    console.log(`Listening for calls on port ${app.get("port")}`);
    console.log("Press Ctrl+C to exit server");
});
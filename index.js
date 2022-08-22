//Import libraries
const express = require("express"); 
const cors = require("cors");

//Import routes
const userRoute = require("./routes/userRoute");

//Configurs Server
const app = express();
app.set("port", process.env.PORT || 6969);
app.use(express.json());
app.use(cors());

// This is where I check URLs and Request methods to create functionality
// GET '/' is always what will be displayed on the home page of your application
app.get("/", (req, res) => {
    res.json({ msg: "Welcome" });
});

//Use individual routes when visiting these URLS
app.use("/users", userRoute);

//Set up Server to start listening for requests
app.listen(app.get("port"), () => {
    console.log(`Listening for calls on port ${app.get("port")}`);
    console.log("Press Ctrl+C to exit server");
});
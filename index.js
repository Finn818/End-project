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
app.listen(app.get("port"), () => {
    console.log(`Listening for calls on port ${app.get("port")}`);
    console.log("Press Ctrl+C to exit server");
});

// ================================
//Login
app.post("/login", bodyParser.json(),(req, res) => {
    try {
      let sql = "SELECT * FROM Users WHERE ?";
      let user = {
        name: req.body.userName, userEmail, userPassword
      };
      db.query(sql, user, async (err, result) => {
        if (err) throw err;
        if (result.length === 0) {
          res.send("Name not found please register");
        } else {
          //Decryption
          //Accepts the password stored in the db and the password given by the user(req.body)
          const isMatch = await bcrypt.compare(
            req.body.userPassword,
            result[0].userPassword
          );
          //If the password does not match
          if (!isMatch) {
            res.send("Password is Incorrect");
          } else {
            const payload = {
              user: {
                userName, 
                userEmail, 
                userPassword
              },
            };
            //Creating a token and setting an expiry date
            jwt.sign(
              payload,
              process.env.jwtSecret,
              {
                expiresIn: "365d",
              },
              (err, token) => {
                if (err) throw err;
                res.json({ token });
              }
            );
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  });
  //Verify
  app.get("/users", bodyParser.json(), (req, res) => {
    const token = req.header("x-auth-token");
    jwt.verify(token, process.env.jwtSecret, (err, decodedToken) => {
      if (err) {
        res.status(401).json({
          msg: "Unauthorized Access!",
        });
      } else {
        res.status(200);
        res.send(decodedToken);
      }
    });
  });
 
  app.get("/", bodyParser.json(), (req, res) => {
    try{
      let sql = "SELECT * FROM Users";
      db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
      });
    } catch (error) {
      console.log(error);
    }
  });
  // Importing the dependencies
 
  app.post('/forgot-psw', (req, res) => {
      try {
      let sql = "SELECT * FROM Users WHERE ?";
      let user = {
        name: req.body.userName,
      };
      db.query(sql, user, (err, result) => {
        if (err) throw err;
        if(result === 0) {
          res.status(400), res.send("Email not found")
        }
        else {
          // Allows me to connect to the given email account || Your Email
          const transporter = nodemailer.createTransport({
            host: process.env.MAILERHOST,
            port: process.env.MAILERPORT,
            auth: {
              user: process.env.MAILERUSER,
              pass: process.env.MAILERPASS,
            },
          });
          // How the email should be sent out
        var mailData = {
          from: process.env.MAILERUSER,
          // Sending to the person who requested
          to: result[0].email,
          subject: 'Password Reset',
          html:
            `<div>
              <h3>Hi ${result[0].userName},</h3>
              <br>
              <h4>Click link below to reset your password</h4>
              <a href="https://user-images.githubusercontent.com/4998145/52377595-605e4400-2a33-11e9-80f1-c9f61b163c6a.png">
                Click Here to Reset Password
                user_id = ${result[0].user_id}
              </a>
              <br>
              <p>For any queries feel free to contact us...</p>
              <div>
                Email: ${process.env.MAILERUSER}
                <br>
                Tel: If needed you can add this
              <div>
            </div>`
        };
        // Check if email can be sent
        // Check password and email given in .env file
        transporter.verify((error, success) => {
          if (error) {
            console.log(error);
          } else {
            console.log('Email valid! ', success)
          }
        });
        transporter.sendMail(mailData,  (error, info) => {
          if (error) {
            console.log(error);
          } else {
            res.send('Please Check your email', result[0].user_id)
          }
        });
        }
      });
    } catch (error) {
      console.log(error);
    }
  })
  // Rest Password Route
  app.put('/users/:id',bodyParser.json(), (req, res) => {
    let sql = "SELECT * FROM Users WHERE ?";
    let user = {
      user_id: req.params.id,
    };
    db.query(sql, user, (err, result) => {
      if (err) throw err;
      if (result === 0) {
        res.status(400), res.send("user not found");
      } else {
        let newPassword = `UPDATE Users SET ? WHERE User_id = ${req.params.id}`;
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.userPassword, salt);
        const updatedPassword = {
          userEmail,
          // Only thing im changing in table
          userPassword: hash,
        };
        db.query(newPassword, updatedPassword, (err, result) => {
          if (err) throw err;
          console.log(result);
          res.send("Password Updated please login");
        });
      }
    });
  })
// ==========================================
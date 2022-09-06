const express = require('express');
const bodyParser = require('body-parser');
const db = require('../config/dbconn');
const { hash } = require('bcrypt');
const app = express();
const router = express.Router();

//Get all the users
router.get("/", bodyParser.json(), (req, res) => {
  try {
    db.query("SELECT * FROM Users;", (err, result) => {
      if (err) throw err;
      res.status(200).json({
        results: result
      });
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

//Get all the users by the ID
router.get('/:id', (req, res)=> {
    const strQry =
    `SELECT id, userName, userEmail, userPassword
    FROM Users
    WHERE id = ?;
    `;
    db.query(strQry, [req.params.id], (err, results) => {
        if(err) throw err;
        res.setHeader('Access-Control-Allow-Origin','*')
        res.json({
            status: 204,
            results: (results.length < 1) ? "Data not found" : results
        })
    })

  });


  // Update users
router.put("/users/:id", bodyParser.json(), (req, res) => {
    const { userName, userEmail, userPassword } = req.body;
  
    const user = {
      userName,
      userEmail,
      userPassword
    };
    
    // Query
    const strQry = `UPDATE Users
       SET ?
       WHERE id = ${req.params.id}`;
    db.query(strQry, user, (err, data) => {
      if (err) throw err;
      res.json({
        msg: "User info Updated",
      });
    });
  });

  router.post('/users',bodyParser.json(),(req, res)=> {
    let {userName, userEmail, userPassword} = req.body; 
        // If the userPassword is null or empty, set it to "user".
        if(userPassword.length === 0) {
            userPassword = "users";
        }
        // Check if a user already exists
        let strQry =
        `SELECT userName, userEmail, userPassword
        FROM Users
        WHERE LOWER(userName) = LOWER('${userName}')`;
        db.query(strQry, 
        async (err, results)=> {
        if(err){
        throw err
        }else {
            if(results.length) {
            res.status(409).json({msg: 'User already exist'});
            }else {    
            // Encrypting a password
            // Default value of salt is 10. 
            password = await hash(userPassword, 10);
            // Query
            strQry = 
                `INSERT INTO Users(userName, userEmail, userPassword)
                VALUES(?, ?, ?);`;
                db.query(strQry, 
                [userName, userEmail, userPassword],
                (err, results)=> {
                    if(err){
                        throw err;
                    }else {
                        res.status(201).json({msg: `number of affected row is: ${results.affectedRows}`});
                    }
                })
            }
        }
    });
})
  
  // Delete users
  router.delete("/users/:id", (req, res) => {
    if (req.user.usertype === "Admin") {
      // Query
      const strQry = `
        DELETE FROM Users 
        WHERE id = ?;
        `;
      db.query(strQry, [req.params.id], (err, data, fields) => {
        if (err) throw err;
        res.json({
          msg: "Item Deleted",
        });
      });
    } else {
      res.json({
        msg: "Only Admins permissions!",
      });
    }
  });

  //Register
  router.post('/register',bodyParser.json(),(req, res)=> {
    let {userName, userEmail, userPassword} = req.body; 
    console.log( userName, userEmail, userPassword );
      //   If the userPassword is null or empty, set it to "user".
        if(userPassword.length === 0) {
            userPassword = "users";
        }
        // Check if a user already exists
        let strQry =
        `SELECT userName, userEmail, userPassword
        FROM Users
        WHERE LOWER(userName) = LOWER('${userName}')`;
        db.query(strQry, 
        async (err, results)=> {
        if(err){
        throw err;
        }else {
            if(results.length) {
            res.status(409).json({msg: 'User already exist'});
            }else {    
            // Encrypting a password
            // Default value of salt is 10. 
            password = await hash(userPassword, 10);
            // Query
            strQry = 
                `INSERT INTO Users(userName, userEmail, userPassword)
                VALUES(?, ?, ?);`;
                db.query(strQry, 
                [userName, userEmail, userPassword],
                (err, results)=> {
                    if(err){
                        throw err;
                    }else {
                        res.status(201).json({msg: `number of affected row is: ${results.affectedRows}`});
                    }
                })
            }
        }
    });
})

  //Login
router.post("/login", bodyParser.json(),(req, res) => {
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
router.get("/users", bodyParser.json(), (req, res) => {
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

// Rest Password Route
router.put('/users/:id',bodyParser.json(), (req, res) => {
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

  module.exports = router;
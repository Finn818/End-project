const express = require('express');
const bodyParser = require('body-parser');
const db = require('../config/dbconn');
const app = express();
const router = express.Router();

router.post('/users',bodyParser.json(),(req, res)=> {
    let {userName, userPassword} = req.body; 
        // If the userPassword is null or empty, set it to "user".
        if(userPassword.length === 0) {
            userPassword = "user";
        }
        // Check if a user already exists
        let strQry =
        `SELECT userName, userPassword
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
                `INSERT INTO Users(userName, userPassword)
                VALUES(?, ?);`;
                db.query(strQry, 
                [userName, userPassword],
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

//Get all the users by the ID
router.get('/users/:id', (req, res)=> {
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
  module.exports = router;
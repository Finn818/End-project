app.post('/users',bodyParser.json(),(req, res)=> {
    let {email, password} = req.body; 
        // If the userRole is null or empty, set it to "user".
        if(userPassword.length === 0) {
            userPassword = "user";
        }
        // Check if a user already exists
        let strQry =
        `SELECT email, password
        FROM users
        WHERE LOWER(email) = LOWER('${email}')`;
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
            password = await hash(password, 10);
            // Query
            strQry = 
                `INSERT INTO users(userName, userEmail, userPassword)
                VALUES(?, ?, ?);`;
                db.query(strQry, 
                [email, password],
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
app.get('/users/:user_id', (req, res)=> {
    const strQry =
    `SELECT id, userName, userEmail, userPassword
    FROM users
    WHERE user_id = ?;
    `;
    db.query(strQry, [req.params.user_id], (err, results) => {
        if(err) throw err;
        res.setHeader('Access-Control-Allow-Origin','*')
        res.json({
            status: 204,
            results: (results.length < 1) ? "Data not found" : results
        })
    })

  });

  //Get all the users
app.get("/", bodyParser.json(), (req, res) => {
    try {
      con.query("SELECT * FROM users", (err, result) => {
        if (err) throw err;
        res.send(result);
      });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  });

  // Update users
app.put("/users/:id", middleware, bodyParser.json(), (req, res) => {
    const { userName, userEmail, userPassword } = req.body;
  
    const user = {
      userName,
      userEmail,
      userPassword
    };
    // Query
    const strQry = `UPDATE users
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
  app.delete("/users/:id", middleware, (req, res) => {
    if (req.user.usertype === "Admin") {
      // Query
      const strQry = `
        DELETE FROM users 
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
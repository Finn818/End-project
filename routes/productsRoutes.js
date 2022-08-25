const express = require('express');
const bodyParser = require('body-parser');
const db = require('../config/dbconn');
const app = express();
const router = express.Router();

// Products functionalities
// SHOW ALL PRODUCTS
router.get('/',(req,res) => {
    let products = `SELECT * FROM products`
    db.query(products,(err,results) => {
        if(err){
            console.log(err)
            res.redirect('/error')
        }else{
            res.json({
                status: 200,
                products : results
            })
        }
    })
})
// SHOW SINGLE PRODUCT
router.get('/products/:id',(req,res) => {
    let products = `SELECT * FROM products WHERE ID = ${req.params.id};`;
    db.query(products,(err,results) => {
        if(err){
            console.log(err)
            res.redirect('/error')
        }else{
            res.json({
                status: 200,
                product : results
            })
        }
    })
});

app.post("/", bodyParser.json(), (req, res) => {
    const {
      Id,
      Img_URL, 
      prodName, 
      prodPrice, 
      prodArrival_Date,
    Stock_Available, 
    prodDesc
    } = req.body;
    try {
        db.query(
        `INSERT INTO users (Id,Img_URL,
        prodName,
        prodPrice,
        prodArrival_Date,
        Stock_Available, 
        prodDesc
        ) VALUES ("${Id}", "${Img_URL}", "${prodName}", "${prodPrice}", "${prodArrival_Date}", "${Stock_Available}", "${prodDesc}")`,
        (err, result) => {
          if (err) throw err;
          res.send(result);
        }
      );
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  });

module.exports = router;
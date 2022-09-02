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
        res.status(400).json({msg: err});
        }else{
        res.json({
        status: 200,
        products : results
            })
        }
    })
})
// SHOW SINGLE PRODUCT
router.get('/:id',(req,res) => {
    let product = `SELECT * FROM products WHERE id = ?;`;
    db.query(product, [req.params.id],(err,results) => {
        if(err) res.status(400)({msg: "no shoes in stock" })
        res.json({
            status: 200,
            products : results
            })
        })
    })


//update
router.put('/:id',(req,res) => {
    let products = `UPDATE products SET ? WHERE id = ?;`;
    db.query(products, [req.body, req.params.id], (err,results) => {
        if(err) res.status(400).json({msg: "no shoes in stock" })
        res.json({
            status: 200,
            product : results
            })
        })
    })

router.post("/", bodyParser.json(), (req, res) => {
    const {
    Img_URL, 
    prodName, 
    prodPrice, 
    prodArrival_Date,
    Stock_Available, 
    prodDesc
    } = req.body;
    try {
        db.query(
        `INSERT INTO products (Img_URL,
        prodName,
        prodPrice,
        prodArrival_Date,
        Stock_Available, 
        prodDesc
        ) VALUES ("${Img_URL}", "${prodName}", "${prodPrice}", "${prodArrival_Date}", "${Stock_Available}", "${prodDesc}")`,
        (err, result) => {
          if (err) throw err;
          res.status(200).send(result);
        }
      );
    } catch (error) {
      res.status(400).send(error);
    }
  });

module.exports = router;
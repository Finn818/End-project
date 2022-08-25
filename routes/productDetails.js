const express = require('express');
const bodyParser = require('body-parser');
const db = require('../config/dbconn');
const app = express();
const router = express.Router();

// router.get("/productDetails", bodyParser.json(), (req, res) => {
//     try {
//       db.query("SELECT * FROM productDetails;", (err, result) => {
//         if (err) throw err;
//         res.status(200).json({
//           results: result
//         });
//       });
//     } catch (error) {
//       res.status(400).send(error.message);
//     }
//   });

// SHOW ALL PRODUCTS
router.get('/products',(req,res) => {
    let products = `SELECT * FROM products`
    con.query(products,(err,results) => {
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
    con.query(products,(err,results) => {
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
})










  module.exports = router;
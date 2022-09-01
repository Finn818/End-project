const express = require('express');
const bodyParser = require('body-parser');
const db = require('../config/dbconn');
const app = express();
const router = express.Router();

router.get('/',(req,res) => {
let productDetails = `SELECT * FROM productDetails`
db.query(productDetails,(err,results) => {
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
router.get('/productDetails/:id',(req,res) => {
let productDetails = `SELECT * FROM productDetails WHERE ID = ${req.params.id};`;
db.query(productDetails,(err,results) => {
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
});

  module.exports = router;
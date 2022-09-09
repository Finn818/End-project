const express = require('express');
const bodyParser = require('body-parser');
const db = require('../config/dbconn');
const app = express();
const router = express.Router();

   // SHOW FullProductDetails PRODUCT
   router.get('/:id',(req,res) => {
    let FullProductDetails = `SELECT * FROM FullproductDetails WHERE id = ?;`;
    db.query(products, [req.params.id],(err,results) => {
        if(err) res.status(400).json({msg: "no shoes in stock" })
        res.json({
            status: 200,
            FullProductDetails : results
            })
        })
    })


module.exports = router;
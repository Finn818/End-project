const express = require('express');
const bodyParser = require('body-parser');
const db = require('../config/dbconn');
const app = express();
const router = express.Router();

// Products functionalities
app.get('/products', (req, res)=> {
    const strQry = `
    SELECT id, Img_URL, prodName, prodPrice, prodArrival_Date,
    Stock_Available, prodDesc
    FROM products;
    `
    db.query(strQry, (err, results)=> {
        if(err) throw err;
        res.status(200).json({
            results: results
        })
    })
});
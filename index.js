require('dotenv').config();
const express = require("express"); 
const db = require("./config/dbconn");
const cors = require("cors");
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const userRouter = require("./routes/userRoutes");
const productsRouter = require("./routes/productsRoutes");

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
app.listen(app.get("port"), () => {
    console.log(`Listening for calls on port ${app.get("port")}`);
    console.log("Press Ctrl+C to exit server");
});

// ============================================
// Products functionalities
// app.get('/products', (req, res)=> {
//     const strQry = `
//     SELECT id, Img_URL, prodName, prodPrice, prodSize, prodArrival_Date, Stock_Available, prodDesc 
//     FROM products;
//     `
//     db.query(strQry, (err, results)=> {
//         if(err) throw err;
//         res.status(200).json({
//             results: results
//         })
//     })
// });

// app.get('/products/:id', (req, res)=> {
//     const strQry = `
//     SELECT id, Img_URL, prodName, prodPrice, prodSize, prodArrival_Date, Stock_Available, prodDesc
//     FROM products
//     WHERE id = ?,?,?,?,?,?,?;
//     `
//     db.query(strQry, [req.params.id], (err, results)=> {
//         if(err) throw err;
//         res.status(200).json({
//             results: results
//         })
//     })
// });

//  SHOW ALL PRODUCTS
router.get('/products',(req,res) => {
    let products = `SELECT * FROM Products`
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
    let products = `SELECT * FROM Products WHERE ID = ${req.params.id};`;
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
React
Reply








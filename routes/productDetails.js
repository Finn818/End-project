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












  module.exports = router;
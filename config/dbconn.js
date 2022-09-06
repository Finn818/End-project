require('dotenv').config();
const { createPool } = require('mysql');
// Create connection variable
let conn = createPool ({
    host: process.env.host,
    user: process.env.dbUser,
    password: process.env.dbPassword,
    port: process.env.dbPort,
    database: process.env.database,
    multipleStatements: true
});
module.exports = conn;
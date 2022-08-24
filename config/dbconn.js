require('dotenv').config();
const { createPool } = require('mysql');
// Create connection variable
let conn;
// Problem solved
(function handleConnection() {
    conn = createPool ({
        host: process.env.host,
        user: process.env.dbUser,
        password: process.env.dbPassword,
        port: process.env.dbPort,
        database: process.env.database,
        multipleStatements: true
    });
    
    // conn.connect( (err)=> {
    //     try{
    //         if(err) throw err 
    //     }catch(e){
    //         console.log(e.message);
    //     }
    // });
    
    // conn.on('error', (err)=> {
    //     if((err.code === 'PROTOCOL_CONNECTION_LOST') ||
    //     (err.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR')){
    //         handleConnection();
    //     }else {
    //         throw err;
    //     }
    // })    
})();
module.exports = conn;
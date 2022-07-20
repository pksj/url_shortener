const mysql = require('mysql');


require('dotenv').config({path: __dirname+"/../.env"});

const db_con = mysql.createConnection({
    host: process.env.HOST,
    user: `${process.env.DB_USER}`,
    password: `${process.env.PASSWORD}`,
    database: `${process.env.DATABASE}`
});

db_con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});
 
module.exports = db_con;
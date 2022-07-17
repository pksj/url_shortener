const mysql = require('mysql');

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "User@123",
    database: "url_db",
    dateStrings: true

});

// con.connect(function (err) {
//     if (err) throw err;
//     console.log("Connected!");
// });

// con.query("show columns from url_table", (err, result) => {
//     if (err) {
//         throw err;
//     }
//     else {
//         console.log(result);
//     }
// })

module.exports = con;
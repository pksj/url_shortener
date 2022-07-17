const guid = require('../modules/generateGUID');
const db_con = require("../modules/database_connection");
const { config } = require('../modules/database_connection');
const urlStart = "http://localhost:3000/";
const moment = require('moment')

db_con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

// db_con.query("show columns from url_table", (err, result) => {
//     if (err)
//         throw err;

//     console.log(result);
// });

// db_con.query(`select * from url_table`, (err, result) => {
//     if (err)
//         throw err;

//     console.log(result);
// });


const getURL = (req, res) => {

    const shortened_url = req.params.url;

    const sql = `select original_url from url_table where shortened_url = "${shortened_url}"`;

    db_con.query(sql, (err, result) => {
        if (err)
            throw err

        // console.log('result', result);

        //record not present in database
        if (Object.keys(result).length === 0) {
            res.status(404).json("url not in database");
        }
        else {

            const original_url = result[0]['original_url'];

            if (original_url.includes("//")) {
                res.redirect("//" + original_url.split("//")[1]);
            }
            else {
                res.redirect("//" + original_url);
            }

        }

    })
}


const postURL = (req, res) => {

    const original_url = req.body.url;

    //chech if url is present in database
    const sql = `select * from url_table where original_url = "${original_url}"`;

    db_con.query(sql,
        (err, result) => {
            if (err)
                throw err;

            const submission_time = moment().format("YYYY-MM-DD HH:mm:ss");
            console.log(submission_time);

            let shortenedURL = '';

            //record not present in database 
            if (Object.keys(result).length === 0) {


                do {

                    shortenedURL = guid(5);

                    const sql = `select * from url_table where shortened_url = "${shortenedURL}"`;

                    db_con.query(sql, (err, result) => {
                        if (err) throw err;

                        if (Object.keys(result).length != 0) {
                            shortenedURL = '';
                        }

                    })

                } while (shortenedURL === '');


                const sql = `insert into url_table (original_url, shortened_url, submission_time) values ("${original_url}", "${shortenedURL}", "${submission_time}")`
                // console.log(sql);
                db_con.query(sql, (err, result) => {
                    if (err) throw err;

                    console.log("Added successfully\n", result);
                })

            }

            //record present in database.........just updating time 
            else {

                const sql = `update url_table set submission_time = "${submission_time}" where original_url = "${original_url}"`;

                db_con.query(sql, (err, result) => {
                    if (err) throw err;

                    console.log("Time updated successfully\n", result);
                })
            }
        });

    res.status(201).json({ 'http-method': "POST" });
}

exports.getURL = getURL;
exports.postURL = postURL;
const guid = require('../modules/generateGUID');
const db_con = require("../modules/database_connection");
// const { config } = require('../modules/database_connection');
const urlStart = "http://localhost:3000/";
const moment = require('moment')
const cron = require("node-cron");
const util = require('util');
const db_query = util.promisify(db_con.query).bind(db_con);


// setInterval(() => {

//     const curr_time = moment().subtract(1, 'h').format("YYYY-MM-DD HH:mm:ss");
//     console.log(curr_time);
//     const sql = `delete from url_table where "${curr_time}" > submission_time`;
//     // console.log(sql);
//     db_query(sql, (err, result) => {
//         if (err) throw err

//         console.log(result);
//     })

// }, 3600000)



cron.schedule('* */30 * * * *',
    () => {

        const curr_time = moment().subtract(1, 's').format("YYYY-MM-DD HH:mm:ss");
        console.log(curr_time);
        const sql = `delete from url_table where "${curr_time}" > submission_time`;
        // console.log(sql);
        db_query(sql, (err, result) => {
            if (err) throw err

            console.log(result);
        })

    }
)

const checkAndRedirectUrl =  async(sql, res) => {

     db_query(sql, (err, result) => {

        if (err)
            throw err


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
    });
}

const inserIntoDB = async (sql) => {

    // console.log(sql);
     db_query(sql, (err, result) => {
        if (err) throw err;

        console.log("Added successfully\n", result);
    });

}

const updateRecord = async (sql) => {

     db_query(sql, (err, result) => {
        if (err) throw err;

        console.log("Time updated successfully\n", result);
    });
}

const checkIfShortUrlTaken = async (sql) => {

    db_query(sql, (err, result) => {
        if (err) throw err;

        if (Object.keys(result).length != 0) {
            return false;
        }
        else {
            return true;
        }

    })
}

const addUrlIntoDB = async  (original_url) => {

    //chech if url is present in database
    const sql = `select * from url_table where original_url = "${original_url}"`;

    await db_query(sql,
        async (err, result) => {
            if (err)
                throw err;

            const submission_time = moment().format("YYYY-MM-DD HH:mm:ss");

            let shortenedURL = '';

            //record not present in database 
            if (Object.keys(result).length === 0) {

                do {

                    shortenedURL = guid(5);

                    const sql = `select * from url_table where shortened_url = "${shortenedURL}"`;

                    if (checkIfShortUrlTaken(sql) == true) {
                        shortenedURL = '';
                    }

                } while (shortenedURL === '');


                const sql = `insert into url_table (original_url, shortened_url, submission_time) values ("${original_url}", "${shortenedURL}", "${submission_time}")`

                await inserIntoDB(sql);
            }
            //record present in database.........just updating time 
            else {

                const sql = `update url_table set submission_time = "${submission_time}" where original_url = "${original_url}"`;

                await updateRecord(sql);
            }
        });
}

const getURL = async (req, res) => {

    const shortened_url = req.params.url;

    const sql = `select original_url from url_table where shortened_url = "${shortened_url}"`;

     checkAndRedirectUrl(sql, res);

}

const postURL = async (req, res) => {

    const original_url = req.body.url;

    // for (i = 0; i < 100000;i++)
         addUrlIntoDB(original_url);

    res.status(201).json({ 'http-method': "POST" });
}

exports.getURL = getURL;
exports.postURL = postURL;
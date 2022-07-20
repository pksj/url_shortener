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



cron.schedule('* */60 * * * *',
   async () => {

        try {
            const curr_time = moment().subtract(1, 's').format("YYYY-MM-DD HH:mm:ss");
            console.log(curr_time);
            const sql = `delete from url_table where "${curr_time}" > submission_time`;
            // console.log(sql);
            let result = await db_query(sql);
            console.log(result);
        } catch (error) {
            console.log(error);
        }
        
    })



const checkAndRedirectUrl = async (sql, res) => {

    try {

        let result = await db_query(sql)

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

    }
    catch (error) {
        console.log(error)
    }
}

const insertIntoDB = async (sql) => {

    try {
        let result = await db_query(sql);
        console.log(result);
    } catch (error) {
        console.log(error)
    }

}

const updateRecord = async (sql) => {

    try {
        let result = await db_query(sql);
        console.log("Time updated successfully\n", result)
    } catch (error) {
        console.log(error)
    }

}

const checkIfShortUrlTaken = async (sql) => {

    try {
        const result = await db_query(sql)

        if (Object.keys(result).length == 0) {
            return false;
        }
        else {
            return true;
        }
    }
    catch (error) {
        console.log(error);
    }
}

const addUrlIntoDB = async (original_url) => {

    //chech if url is present in database
    const sql = `select * from url_table where original_url = "${original_url}"`;

    try {
        let result = await db_query(sql)

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

            await insertIntoDB(sql);
        }
        //record present in database.........just updating time 
        else {

            const sql = `update url_table set submission_time = "${submission_time}" where original_url = "${original_url}"`;

            await updateRecord(sql);
        }
    }
    catch (error) {
        console.log(error)
    }
}

const getURL = async (req, res) => {

    const shortened_url = req.params.url;

    const sql = `select original_url from url_table where shortened_url = "${shortened_url}"`;

    await checkAndRedirectUrl(sql, res);

}

const postURL = async (req, res) => {

    const original_url = req.body.url;

    for (i = 0; i < 1000;i++)
    await addUrlIntoDB(original_url);

    res.status(201).json({ 'http-method': "POST" });
}

exports.getURL = getURL;
exports.postURL = postURL;
const guid = require('../modules/generateGUID');

const urlStart = "http://localhost:3000/"

const database = {};

const getURL = (req, res) => {
    console.log(JSON.stringify(req.params));
    const shortenedURL = req.params.url;
    if (database[shortenedURL] != undefined) {
        // res.json({ 'http-method': "GET", originalURL: database[shortenedURL], shortenedURL: urlStart + shortenedURL });

        if (database[shortenedURL].includes("//")) {
            res.redirect("//" + database[shortenedURL].split("//")[1]);
        }
        else {
            res.redirect("//" + database[shortenedURL]);
        }


    }
    else {
        res.status(404).send(`${urlStart + shortenedURL} is not in database`);
    }
}


const postURL = (req, res) => {
    const originalURL = req.body.url;

    let shortenedURLEnd = '';

    do {
        shortenedURLEnd = guid(5);
    } while (database[shortenedURLEnd] != undefined);

    database[shortenedURLEnd] = originalURL;
    res.json({ 'http-method': "POST", originalURL: originalURL, shortenedURL: urlStart + shortenedURLEnd });

}

exports.getURL = getURL;
exports.postURL = postURL;
const express = require('express');

const router = express.Router();

let counter = 0;
const urlStart = "qwerty-"
const database = {};

router.get("/:url", (req, res) => {
    
    const shortenedURL = req.params.url;
    if (database[shortenedURL] != undefined) {

        res.json({ 'http-method': "GET", originalURL: database[shortenedURL], shortenedURL: shortenedURL });
    }
    else {
        res.send(`${shortenedURL} is not in database`);
    }

})


router.post("/", (req, res) => {

    const originalURL = req.body.url;
    const shortenedURL = urlStart + counter;
    database[shortenedURL] = originalURL;
    counter++;
    res.json({ 'http-method': "POST", originalURL: originalURL, shortenedURL: shortenedURL });

})

module.exports = router;
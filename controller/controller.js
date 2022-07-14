let counter = 0;
const urlStart = "qwerty-"
const database = {};

const getURL = (req, res) => {

    const shortenedURL = req.params.url;
    if (database[shortenedURL] != undefined) {

        res.json({ 'http-method': "GET", originalURL: database[shortenedURL], shortenedURL: shortenedURL });
    }
    else {
        res.send(`${shortenedURL} is not in database`);
    }

}

const postURL = (req, res) => {

    const originalURL = req.body.url;
    const shortenedURL = urlStart + counter;
    database[shortenedURL] = originalURL;
    counter++;
    res.json({ 'http-method': "POST", originalURL: originalURL, shortenedURL: shortenedURL });

}

exports.getURL = getURL;
exports.postURL = postURL;
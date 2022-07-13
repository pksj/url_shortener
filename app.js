const express = require('express');
const bodyParser = require('body-parser');

const app = express();
let counter = 0;
const urlStart = "qwerty-"
const port = 3000;

const database = {};

app.use(bodyParser.json())

app.get("/:url", (req, res) => {
    
    
    const shortenedURL = req.params.url;
    if (database[shortenedURL] != undefined) {
        
        res.json({ 'http-method': "GET", originalURL: database[shortenedURL], shortenedURL: shortenedURL });
    }
    else {
        res.send(`${shortenedURL} is not in database`);
    }

});

app.post("/", (req, res) => {

    
    
    const originalURL = req.body.url;
    const shortenedURL = urlStart + counter;
    database[shortenedURL] = originalURL;
    counter++;
    res.json({ 'http-method': "POST", originalURL: originalURL, shortenedURL: shortenedURL });

})

app.listen(port, (err) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log(`server listening at ${port}`)
    }
});

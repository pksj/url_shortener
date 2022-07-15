const express = require('express');
const bodyParser = require('body-parser');
const allRoutes = require('./routes/api-routes.js')

const app = express();

const port = 3000;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/", allRoutes);

app.use((req, res) => { res.status(404).json({ "message": "url not found" }) });

app.listen(port, (err) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log(`server listening at ${port}`)
    }
});

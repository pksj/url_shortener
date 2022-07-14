const express = require('express');
const bodyParser = require('body-parser');
const allRoutes = require('./routes/api-routes.js')

const app = express();

const port = 3000;

app.use(bodyParser.json())

app.use("/", allRoutes);

app.listen(port, (err) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log(`server listening at ${port}`)
    }
});

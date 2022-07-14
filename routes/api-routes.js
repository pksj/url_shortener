const express = require('express');
const router = express.Router();
const apiControllers = require('../controller/controller')

router.get("/:url", apiControllers.getURL);

router.post("/", apiControllers.postURL);

module.exports = router;
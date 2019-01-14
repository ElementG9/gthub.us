const express = require("express");
var router = express.Router();

router.get("/:file", (req, res) => {
    res.sendFile(`${__dirname}/styles/${req.params.file}`);
});
router.get("/pivot/:file", (req, res) => {
    res.sendFile(`${__dirname}/styles/pivot/${req.params.file}`);
});

module.exports = router;

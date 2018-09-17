const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("ses-index", {
        project: "ses",
        title: "SES | gthub.us"
    });
});

module.exports = router;
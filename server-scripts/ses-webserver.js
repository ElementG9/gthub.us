const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("ses-index", {
        project: "ses",
        title: "SES | gthub.us"
    });
});
router.get("/docs", (req, res) => {
    res.render("ses-docs", {
        project: "ses",
        title: "Docs | SES | gthub.us"
    });
});
router.get("/docs/:page", (req, res) => {
    res.render("ses-docs/" + req.query.page, {
        project: "ses",
        title: "Docs | SES | gthub.us"
    });
});

router.get("/download", (req, res) => {
    res.redirect("/ses");
});


module.exports = router;
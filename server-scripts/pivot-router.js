const express = require("express");
var router = express.Router();

// Render pivot.pug for /pivot/
router.get("/", (req, res) => {
	res.render("pivot/pivot.pug", {
		title: "Pivot | gthub.us",
		active: "pivot"
	});
});

// Redirect /pivot/documentation/ to /pivot/docs/.
router.get("/documentation", (req, res) => {
	res.redirect("/docs");
});
// Render docs.pug for /pivot/docs/.
router.get("/docs", (req, res) => {
	res.render("pivot/docs.pug", {
		title: "Pivot Documentation | gthub.us",
		active: "pivot"
	});
});

// Redirect /pivot/repository/ to /pivot/repo/.
router.get("/repository", (req, res) => {
	res.redirect("/repo");
});
// Redirect /pivot/repo/ to the actual repository.
router.get("/repo", (req, res) => {
	res.redirect("https://github.com/ElementG9/Pivot/");
});

module.exports = router;

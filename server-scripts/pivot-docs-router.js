const express = require("express");
var router = express.Router();

// Render docs.pug for /pivot/docs/.
router.get("/", (req, res) => {
	res.render("pivot/docs/docs.pug", {
		title: "Pivot Documentation | gthub.us",
		active: "pivot"
	});
});

module.exports = router;

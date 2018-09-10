const express = require("express");
const app = express();

app.set("view engine", "pug");

var websiteRouter = require(__dirname + "/server-scripts/webserver.js");
app.use("/", websiteRouter);

// 404 error
app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!")
});

app.listen(8080, () => {
    console.log("Listening on port " + 8080);
});
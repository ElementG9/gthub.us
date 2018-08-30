const express = require("express");
const app = express();

var websiteRouter = require(__dirname + "/scripts/webserver.js");
app.use("/", websiteRouter);

app.listen(8080, () => {
    console.log("Listening on port " + 8080);
});
const app = require(__dirname + "/scripts/webserver.js");
app.listen(8080, () => {
    console.log("Listening on port " + 8080);
});
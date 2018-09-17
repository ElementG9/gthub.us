const app = require("express")();
const http = require("http").Server(app);
var io = require("socket.io")(http);

app.set("view engine", "pug");

/* - - - Start Twitter Clone - - - */
var twitterRouter = require(__dirname + "/server-scripts/webserver.js");
app.use("/twitter-clone/", twitterRouter);
var protectRoute = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        next(); // if logged in, continue
    } else {
        res.redirect("/twitter-clone/login"); // else redirect to login
    }
};
// get the dashboard
app.get("/twitter-clone/dashboard", protectRoute, (req, res) => { // the dashboard page
    var user = req.session.user;
    res.render("dashboard", {
        loggedin: true,
        username: user.username,
        title: "gthub.us Dashboard"
    });
});
io.on("connection", (socket) => {
    socket.on("create post", () => {
        io.emit("create post");
    });
});
/* - - - End Twitter Clone - - - */

/* - - - Start SES - - - */
var sesRouter = require(__dirname + "/server-scripts/ses-webserver.js");
app.use("/ses", sesRouter);
/* - - - End SES - - - */

// serve the css and js files
app.get("/style/:file", (req, res) => {
    res.sendFile(dir + "style/" + req.params.file);
});
app.get("/scripts/:file", (req, res) => {
    res.sendFile(dir + "client-scripts/" + req.params.file);
});

// 404 error
app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!")
});

http.listen(8080, () => {
    console.log("Listening on port " + 8080);
});
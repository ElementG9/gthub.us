const app = require("express")();
const http = require("http").Server(app);
var io = require("socket.io")(http);

app.set("view engine", "pug");

/* - - - Start Twitter Clone - - - */
var twitterRouter = require(__dirname + "/twitter-clone/server-scripts/webserver.js");
app.set("views", __dirname);
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
var sesRouter = require(__dirname + "/ses/app.js");
app.set
/* - - - End SES - - - */

// 404 error
app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!")
});

http.listen(8080, () => {
    console.log("Listening on port " + 8080);
});
const app = require("express")();
const http = require("http").Server(app);
var io = require("socket.io")(http);

app.set("view engine", "pug");
var dir = __dirname;
var db = "mongodb://localhost/gthub";

var websiteRouter = require(__dirname + "/server-scripts/webserver.js");
app.use("/", websiteRouter);
var protectRoute = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        next(); // if logged in, continue
    } else {
        res.redirect("/login"); // else redirect to login
    }
};

// get the dashboard
app.get("/dashboard", protectRoute, (req, res) => { // the dashboard page
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

// 404 error
app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!")
});

http.listen(8080, () => {
    console.log("Listening on port " + 8080);
});
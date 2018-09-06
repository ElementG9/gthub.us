/* - - - Modules - - - */
const dir = "/home/ubuntu/gthub.us/";
const user = require(dir + "scripts/userCtl.js");
const post = require(dir + "scripts/postCtl.js");

const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const cookies = require("cookie-parser");

/* - - - Config - - - */
const router = express.Router();
router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(bodyParser.json());
router.use(cookies());
// set up session
router.use(session({
    key: 'user_sid',
    secret: 'somerandomstuff',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000 // 10 minutes
    }
}));

/* - - - Login - - - */
// clear previous cookie if user is not logged in
router.use((req, res, next) => {
    if (typeof req.cookies.user_sid != "undefined" && !req.session.user) {
        res.clearCookie('user_sid');
    }
    next();
});
// check for logged-in users
var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('/dashboard');
    } else {
        next();
    }
};
router.get('/logout', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.clearCookie('user_sid');
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
});
router.route("/signup")
    .get(sessionChecker, (req, res) => { // the signup page
        res.render("signup", {
            title: "gthub.us Signup"
        });
    })
    .post((req, res) => { // the signup handler
        user.createUser(req.body.username, req.body.password)
            .then((user) => {
                req.session.user = user;
                res.redirect("/dashboard");
            })
            .catch((err) => {
                res.redirect("/signup");
            });
    });
router.route("/login")
    .get(sessionChecker, (req, res) => { // the login page
        res.render("login", {
            title: "gthub.us Login"
        });
    })
    .post((req, res) => { // the login handler
        user.authUser(req.body.username, req.body.password).then((user) => {
            req.session.user = user;
            res.redirect("/dashboard");
        }).catch(() => {
            res.redirect("/login");
        });
    });

/* - - - Routes - - - */
router.get("/", (req, res) => { // the main page
    if (req.session.user && req.cookies.user_sid) {
        res.render("index", {
            title: "gthub.us",
            loggedin: true
        });
    } else {
        res.render("index", {
            title: "gthub.us"
        });
    }
});
router.get("/dashboard", (req, res) => { // the dashboard page
    if (req.session.user && req.cookies.user_sid) {
        var user = req.session.user;
        res.render("dashboard", {
            loggedin: true,
            username: user.username,
            title: "gthub.us Dashboard"
        });
    } else {
        res.redirect('/login');
    }
});
router.route("/post")
    .post((req, res) => {
        var data = req.body.content;
        console.log(req.session.user.username + " posted " + data);
        res.redirect("/dashboard");
    });;
router.get("/style/:file", (req, res) => {
    res.sendFile(dir + "style/" + req.params.file);
});
router.get("/script/:file", (req, res) => {
    res.sendFile(dir + "client-scripts/" + req.params.file);
});

/* - - - Export - - - */
module.exports = router;
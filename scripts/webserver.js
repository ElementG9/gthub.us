/* - - - Modules - - - */
const dir = "/home/ubuntu/gthub.us/";
const express = require("express");
const bodyParser = require("body-parser");
const auth = require(dir + "scripts/auth.js");
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
router.get('/login/logout', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.clearCookie('user_sid');
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
});
router.route("/login/signup")
    .get(sessionChecker, (req, res) => { // the signup page
        res.render("signup", {
            title: "Signup"
        });
    })
    .post((req, res) => { // the signup handler
        auth.createUser(req.body.username, req.body.password)
            .then((user) => {
                req.session.user = user;
                res.redirect("/dashboard");
            })
            .catch((err) => {
                res.redirect("/login/signup");
            });
    });
router.route("/login")
    .get(sessionChecker, (req, res) => { // the login page
        res.render("login", {
            title: "Login"
        });
    })
    .post((req, res) => { // the login handler
        auth.authUser(req.body.username, req.body.password).then((user) => {
            req.session.user = user;
            res.redirect("/dashboard");
        }).catch(() => {
            res.redirect("/login");
        });
    });

/* - - - Routes - - - */
router.get("/", (req, res) => { // the main page
    res.render("index", {
        title: "gthub.us"
    });
});
router.get("/dashboard", (req, res) => { // the dashboard page
    if (req.session.user && req.cookies.user_sid) {
        var user = req.session.user;
        res.render("dashboard", {
            loggedin: true,
            username: user.username,
            title: "Dashboard"
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

/* - - - Export - - - */
module.exports = router;
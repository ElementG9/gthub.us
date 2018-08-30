const dir = "/home/ubuntu/gthub.us/";

const express = require("express");
const bodyParser = require("body-parser");
const auth = require(dir + "scripts/auth.js");
const session = require("express-session");
const cookies = require("cookie-parser");

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
        res.redirect('/profile');
    } else {
        next();
    }
};

router.get("/", sessionChecker, (req, res) => { // the main page
    res.sendFile(dir + "public/index.html");
});
router.get("/profile", (req, res) => { // the profile page
    if (req.session.user && req.cookies.user_sid) {
        res.sendFile(dir + "public/profile.html");
    } else {
        res.redirect('/login');
    }
});
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
        res.sendFile(dir + "public/signup.html");
    })
    .post((req, res) => { // the signup handler
        console.log("\nSignup:");
        console.log("  Username: " + req.body.username);
        console.log("  Password: " + req.body.password);
        auth.createUser(req.body.username, req.body.password)
            .then((user) => {
                req.session.user = user;
                res.redirect("/profile");
            })
            .catch((err) => {
                res.redirect("/login/signup");
            });
    });
router.route("/login")
    .get(sessionChecker, (req, res) => { // the login page
        res.sendFile(dir + "public/login.html");
    })
    .post((req, res) => { // the login handler
        console.log("\nLogin:");
        console.log("  Username: " + req.body.username);
        console.log("  Password: " + req.body.password);
        auth.authUser(req.body.username, req.body.password).then((user) => {
            console.log("Auth success");
            req.session.user = user;
            res.redirect("/profile");
        }).catch(() => {
            console.log("Auth fail");
            res.redirect("/login");
        });
    });

module.exports = router;
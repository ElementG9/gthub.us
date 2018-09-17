/* - - - Modules - - - */
const dir = __dirname + "/../";
const userCtl = require("./twitter-dbCtrl.js").user;
const postCtl = require("./twitter-dbCtrl.js").post;

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
    key: 'twitter_clone_user_sid',
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
    if (typeof req.cookies.twitter_clone_user_sid != "undefined" && !req.session.user) {
        res.clearCookie('twitter_clone_user_sid');
    }
    next();
});
// check for logged-in users
var checkLoggedIn = (req, res, next) => {
    if (req.session.user && req.cookies.twitter_clone_user_sid) {
        res.redirect('/twitter-clone/dashboard'); // if loggedin, redirect to dashboard
    } else {
        next(); // else continue
    }
};
var protectRoute = (req, res, next) => {
    if (req.session.user && req.cookies.twitter_clone_user_sid) {
        next(); // if logged in, continue
    } else {
        res.redirect("/twitter-clone/login"); // else redirect to login
    }
};
router.get('/logout', (req, res) => {
    res.clearCookie('twitter_clone_user_sid');
    res.redirect('/twitter-clone/');
});
router.route("/signup")
    .get(checkLoggedIn, (req, res) => { // the signup page
        res.render("twitter-signup", {
            project: "twitterclone",
            title: "Signup | twitter-clone | gthub.us"
        });
    })
    .post((req, res) => { // the signup handler
        userCtl.createUser(req.body.username, req.body.password)
            .then((user) => {
                req.session.user = user;
                res.redirect("/twitter-clone/dashboard");
            })
            .catch((err) => {
                res.redirect("/twitter-clone/signup");
            });
    });
router.route("/login")
    .get(checkLoggedIn, (req, res) => { // the login page
        res.render("twitter-login", {
            project: "twitterclone",
            title: "Login | twitter-clone | gthub.us"
        });
    })
    .post((req, res) => { // the login handler
        userCtl.authUser(req.body.username, req.body.password).then((user) => {
            req.session.user = user;
            res.redirect("/twitter-clone/dashboard");
        }).catch(() => {
            res.redirect("/twitter-clone/login");
        });
    });

/* - - - Routes - - - */
router.get("/", (req, res) => { // the main page
    if (req.session.user && req.cookies.twitter_clone_user_sid) {
        res.render("twitter-index", {
            project: "twitterclone",
            title: "twitter-clone | gthub.us",
            loggedin: true
        });
    } else {
        res.render("twitter-index", {
            project: "twitterclone",
            title: "twitter-clone | gthub.us"
        });
    }
});
router.route("/post")
    .post(protectRoute, (req, res) => {
        var data = req.body.content;
        postCtl.createPost(req.session.user.username, data);
        res.redirect("/twitter-clone/dashboard");
    });;
router.get("/feed", (req, res) => {
    postCtl.getAllPosts()
        .then((docs) => {
            res.json(docs.reverse());
        });
});

/* - - - Export - - - */
module.exports = router;
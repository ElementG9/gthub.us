const dir = "/home/ubuntu/gthub.us/";

const express = require("express");
const bodyParser = require("body-parser");
const auth = require(dir + "scripts/auth.js");

const router = express.Router();
router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(bodyParser.json());


router.get("/", (req, res) => { // the main page
    res.sendFile(dir + "public/index.html");
});
router.get("/login/signup", (req, res) => { // the signup page
    res.sendFile(dir + "public/signup.html");
});
router.get("/login", (req, res) => { // the login page
    res.sendFile(dir + "public/login.html");
});
router.get("/profile", (req, res) => { // the profile page
    res.redirect("/"); // temporary
});

router.post("/login/create", (req, res) => { // the signup handler
    console.log("\nSignup:");
    console.log("  Username: " + req.body.username);
    console.log("  Password: " + req.body.password);
    auth.createUser(req.body.username, req.body.password);
    res.redirect("/");
});
router.post("/login/login", (req, res) => { // the login handler
    console.log("\nLogin:");
    console.log("  Username: " + req.body.username);
    console.log("  Password: " + req.body.password);
    auth.authUser(req.body.username, req.body.password).then(() => {
        console.log("Auth success");
    }).catch(() => {
        console.log("Auth fail");
    });
    res.redirect("/");
});

module.exports = router;
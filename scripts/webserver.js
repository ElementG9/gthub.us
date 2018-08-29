const express = require("express");
const app = express();
const dir = "/home/ubuntu/gthub.us/";
const bodyParser = require("body-parser");
const auth = require(dir + "scripts/auth.js");
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


app.get("/", (req, res) => { // the main page
    res.sendFile(dir + "public/index.html");
});
app.get("/login/signup", (req, res) => { // the signup page
    res.sendFile(dir + "public/signup.html");
});
app.get("/login", (req, res) => { // the login page
    res.sendFile(dir + "public/login.html");
});
app.get("/profile", (req, res) => { // the profile page
    res.redirect("/"); // temporary
});

app.post("/login/create", (req, res) => { // the signup handler
    console.log("\nSignup:");
    console.log("  Username: " + req.body.username);
    console.log("  Password: " + req.body.password);
    auth.createUser(req.body.username, req.body.password);
    res.redirect("/");
});
app.post("/login/login", (req, res) => { // the login handler
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

module.exports = app;

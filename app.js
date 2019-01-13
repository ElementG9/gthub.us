// Check that .env exists.
if (!require("fs").existsSync(`${__dirname}/.env`)) {
    console.error("Error: '.env' configuration file does not exist.");
    process.exit(1);
}
// Configure .env.
require('dotenv').config();

// Create and configure the app.
const app = require("express")();
const helmet = require("helmet");
const bodyParser = require("body-parser");
const session = require("express-session");
const cookies = require("cookie-parser");
app.use(helmet());
app.set("view engine", "pug");
app.set('views', './views');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cookies());
app.use(session({
    key: 'gthub_user_sid',
    secret: process.env.secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000 // 10 minutes = 1000ms * 60 * 10.
    }
}));

// Create route protection function.
var loggedin = false;
const protect = (req, res, next) => {
    if (req.session.user && req.cookies.gthub_user_sid) {
        loggedin = true;
        next(); // if logged in, continue
    } else {
        loggedin = false;
        res.redirect("/login"); // else redirect to login
    }
};

// Create a route at /.
app.get("/", (req, res) => {
    res.render("index", {
        title: "gthub.us",
        loggedin: loggedin
    });
});

// Make the app listen.
app.listen(process.env.port, () => {
    console.log(`Listening on port ${process.env.port}.`);
});

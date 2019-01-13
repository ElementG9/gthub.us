// Check that .env exists.
if (!require("fs").existsSync(`${__dirname}/.env`)) {
    console.error("Error: '.env' configuration file does not exist.");
    process.exit(1);
}
// Configure .env.
require('dotenv').config();

// Create our app.
const app = require("express")();

// Create a route at /.
app.get("/", (req, res) => {
    res.send("<h1>Hello world!</h1>");
});

// Make the app listen.
app.listen(process.env.port, () => {
    console.log(`Listening on port ${process.env.port}.`);
});

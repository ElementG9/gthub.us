if (!require("fs").existsSync(`${__dirname}/.env`)) {
    console.error("Error: '.env' configuration file does not exist.");
    process.exit(1);
}
require('dotenv').config();

const app = require("express")();

app.get("/", (req, res) => {
    res.send("<h1>Hello world!</h1>");
});

app.listen(process.env.port, () => {
    console.log(`Listening on port ${process.env.port}.`);
});
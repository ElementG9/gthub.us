require('dotenv').config();
const app = require("express")();
app.get("/", (req, res) => {
    res.send("<h1>Hello world!</h1>");
});
app.listen(process.env.port, () => {
    console.log(`Listening on port ${process.env.port}.`);
});
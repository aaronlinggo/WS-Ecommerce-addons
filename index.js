const express = require("express");
const app = express();
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

//routes:


const port = 3000;
app.listen(port, function () {
    console.log(`Listening on port ${3000}`);
});

module.exports = app;
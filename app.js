/**
 * Module dependencies
 */

const express = require("express");
const path = require("path");

/**
 * Module variables
 */

const app = express();
const port = process.env.PORT || 5000;

/**
 * Middleware
 */

app.use(express.static("public"));
app.set("views", "./src/views");
app.set("view engine", "pug");

/**
 * Routes
 */

app.get("/", function (req, res) {
    res.render("index");
});

app.get('/download_resume', function(req, res) {
    res.download(path.join(__dirname, '/public/assets/DanielRigberg_Resume.pdf'));
});

app.get("*", function (req, res) {
    res.redirect("/");
});

/**
 * Server start
 */

app.listen(port, function(err) {
    console.log("Personal site server is running on port", port);
});

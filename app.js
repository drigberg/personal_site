var express    	= require("express"),
    app        	= express(),
    bodyParser  = require("body-parser"),
    port       	= process.env.PORT || 5000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("views", "./src/views");
app.set("view engine", "ejs");
// seedDB();

//ROOT ROUTE
app.get("/", function (req, res){
    res.render("index");
});

app.get("/coding", function (req, res){
    res.render("coding");
});

app.get("/music", function (req, res){
    res.render("music");
});

app.get("/travel", function (req, res){
    res.render("travel");
});

app.get("/sandbox", function (req, res){
    res.render("sandbox");
});

app.get("/signal_processing", function (req, res){
    res.render("signal_processing");
});

//safety net redirect
app.get("*", function (req, res){
    res.redirect("/");
});

app.listen(port, function(err){
    console.log("Personal site server is running on port " + port);
});

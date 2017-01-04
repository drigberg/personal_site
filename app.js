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

app.get("/particleHub", function (req, res){
    res.render("particleHub");
});

app.get("/gravitateAndFeed", function (req, res){
    res.render("gravitateAndFeed");
});

app.get("/swarm", function (req, res){
    res.render("swarm");
});

app.get('/download_resume', function(req, res){
  var file = __dirname + '/public/assets/DanielRigberg_Resume.pdf';
  res.download(file);
});

//safety net redirect
app.get("*", function (req, res){
    res.redirect("/");
});

app.listen(port, function(err){
    console.log("Personal site server is running on port " + port);
});

var express    	= require("express"),
    app        	= express(),
    bodyParser  = require("body-parser"),
    projectRoutes      = require("./routes/projects"),
    customLogoRoutes      = require("./routes/customLogoApps"),
    indexRoutes     = require("./routes/index"),
    port       	= process.env.PORT || 5000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("views", "./src/views");
app.set("view engine", "ejs");
// seedDB();

app.use("/", indexRoutes);
app.use("/", customLogoRoutes);
app.use("/", projectRoutes);

//safety net redirect
app.get("*", function (req, res){
    res.redirect("/");
});

app.listen(port, function(err){
    console.log("Personal site server is running on port " + port);
});

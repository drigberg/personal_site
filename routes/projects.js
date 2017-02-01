var express     = require("express"),
    router      = express.Router({mergeParams: true});

router.get("/fishBuddy", function (req, res){
    res.render("fishBuddy");
});

router.get("/garden2D", function (req, res){
    res.render("garden2D");
});

router.get("/gravitateAndFeed", function (req, res){
    res.render("gravitateAndFeed");
});

router.get("/pulse2D", function (req, res){
    res.render("pulse2D");
});

router.get("/pulse3D", function (req, res){
    res.render("pulse3D");
});

router.get("/swarm2D", function (req, res){
    res.render("swarm2D");
});

router.get("/swarm3D", function (req, res){
    res.render("swarm3D");
});

module.exports = router;

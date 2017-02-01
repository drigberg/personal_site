var express     = require("express"),
    router      = express.Router({mergeParams: true});

router.get("/fishBuddy", function (req, res){
    res.render("projects/fishBuddy");
});

router.get("/garden2D", function (req, res){
    res.render("projects/garden2D");
});

router.get("/thingWantingPerson", function (req, res){
    res.render("projects/thingWantingPerson");
});

router.get("/gravitateAndFeed", function (req, res){
    res.render("projects/gravitateAndFeed");
});

router.get("/pulse2D", function (req, res){
    res.render("projects/pulse2D");
});

router.get("/pulse3D", function (req, res){
    res.render("projects/pulse3D");
});

router.get("/swarm2D", function (req, res){
    res.render("projects/swarm2D");
});

router.get("/swarm3D", function (req, res){
    res.render("projects/swarm3D");
});

module.exports = router;

var express     = require("express"),
    router      = express.Router({mergeParams: true});

//ROOT ROUTE
router.get("/", function (req, res){
    res.render("index");
});

module.exports = router;

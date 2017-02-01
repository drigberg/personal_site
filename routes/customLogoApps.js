var express     = require("express"),
    router      = express.Router({mergeParams: true});

router.get("/EscapeWantingPerson", function (req, res){
    res.render("EscapeWantingPerson");
});

router.get("/OpenSourceWantingPerson", function (req, res){
    res.render("OpenSourceWantingPerson");
});

router.get("/BitcoinWantingPerson", function (req, res){
    res.render("BitcoinWantingPerson");
});

router.get("/HoneypotWantingPerson", function (req, res){
    res.render("HoneypotWantingPerson");
});

router.get("/InventorumWantingPerson", function (req, res){
    res.render("InventorumWantingPerson");
});

router.get("/thingWantingPerson", function (req, res){
    res.render("thingWantingPerson");
});

router.get("/KayakFishBuddy", function (req, res){
    res.render("KayakFishBuddy");
});

router.get("/DeliveryFishy", function (req, res){
    res.render("DeliveryFishy");
});

router.get("/Door2DoorFishy", function (req, res){
    res.render("Door2DoorFishy");
});

router.get("/MaykinFishBuddy", function (req, res){
    res.render("MaykinFishBuddy");
});

router.get("/SociomanticFishBuddy", function (req, res){
    res.render("SociomanticFishBuddy");
});


module.exports = router;

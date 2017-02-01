var express     = require("express"),
    router      = express.Router({mergeParams: true});

router.get("/EscapeWantingPerson", function (req, res){
    res.render("customLogoApps/EscapeWantingPerson");
});

router.get("/OpenSourceWantingPerson", function (req, res){
    res.render("customLogoApps/OpenSourceWantingPerson");
});

router.get("/BitcoinWantingPerson", function (req, res){
    res.render("customLogoApps/BitcoinWantingPerson");
});

router.get("/HoneypotWantingPerson", function (req, res){
    res.render("customLogoApps/HoneypotWantingPerson");
});

router.get("/InventorumWantingPerson", function (req, res){
    res.render("customLogoApps/InventorumWantingPerson");
});

router.get("/KayakFishBuddy", function (req, res){
    res.render("customLogoApps/KayakFishBuddy");
});

router.get("/DeliveryFishy", function (req, res){
    res.render("customLogoApps/DeliveryFishy");
});

router.get("/Door2DoorFishy", function (req, res){
    res.render("customLogoApps/Door2DoorFishy");
});

router.get("/MaykinFishBuddy", function (req, res){
    res.render("customLogoApps/MaykinFishBuddy");
});

router.get("/SociomanticFishBuddy", function (req, res){
    res.render("customLogoApps/SociomanticFishBuddy");
});


module.exports = router;

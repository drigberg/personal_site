var express     = require("express"),
    router      = express.Router({mergeParams: true});

//ROOT ROUTE
router.get("/", function (req, res){
    res.render("index");
});

router.get('/download_resume', function(req, res){
  var file = __dirname + '/public/assets/DanielRigberg_Resume.pdf';
  res.download(file);
});

module.exports = router;

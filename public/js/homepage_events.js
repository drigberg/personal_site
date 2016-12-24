var _purple = "rgb(139, 29, 249)";
var _pink = "rgb(255, 11, 159)";
var _lightBlue = "rgb(31, 133, 255)";
var _white = "rgb(248, 248, 248)";
var _transparent = "rgba(0, 0, 0, 0)"
var _gold = "rgb(255, 181, 11)";
var _gray = "rgb(49, 49, 49)";
var _icon_active = _gray;
var _icon_faded = "rgba(49, 49, 49, 0.5)";

var stripIds = [
    "header-strip",
    "music-strip",
    "career-strip",
    "coding-strip"
];

var iconIds = [
    "header-icon",
    "music-icon",
    "career-icon",
    "coding-icon"
];

$("#header-icon").click(function(){
    _showOneStrip("header-strip");
    _highlightOneIcon("header-icon");
});

$("#music-icon").click(function(){
    _showOneStrip("music-strip");
    _highlightOneIcon("music-icon");
    // $("body").css("background-color", _lightBlue);
});

$("#career-icon").click(function(){
    _showOneStrip("career-strip");
    _highlightOneIcon("career-icon");
});

$("#coding-icon").click(function(){
    _showOneStrip("coding-strip");
    _highlightOneIcon("coding-icon");
});

function _showOneStrip(stripIdToShow) {
    for (var i = 0; i < stripIds.length; i++) {
        if (stripIds[i] != stripIdToShow) {
            $("#" + stripIds[i]).css("display", "none").css("opacity", 0);
        } else {
            $("#" + stripIds[i]).css("display", "block").css("opacity", 1);
        };
    };
};

function _highlightOneIcon(iconIdToShow) {
    for (var i = 0; i < iconIds.length; i++) {
        if (iconIds[i] != iconIdToShow) {
            $("#" + iconIds[i]).css("color", "rgba(24, 24, 24, 0.5)")
        } else {
            $("#" + iconIds[i]).css("color", "rgba(24, 24, 24, 1)")
        };
    };
};

var _purple = "rgb(139, 29, 249)";
var _pink = "rgb(255, 11, 159)";
var _lightBlue = "rgb(31, 133, 255)";
var _white = "rgb(248, 248, 248)";
var _transparent = "rgba(0, 0, 0, 0)"
var _gold = "rgb(255, 181, 11)";
var _gray = "rgb(49, 49, 49)";
var _icon_active = _gray;
var _icon_faded = "rgba(49, 49, 49, 0.5)";

var sections = [
    "header",
    "music",
    "coding",
    "projects",
    "interests"
];

for (var j = 0; j < sections.length; j++) {
    $("#" + sections[j] + "-icon").click(function(){
        var section = this.id.slice(0, this.id.indexOf("-"));
        _showOneStrip(section);
        _highlightOneIcon(section);
    });
};

function _showOneStrip(section) {
    for (var i = 0; i < sections.length; i++) {
        if (sections[i] != section) {
            $("#" + sections[i] + "-strip").css("display", "none").css("opacity", 0);
        } else {
            $("#" + sections[i] + "-strip").css("display", "block").css("opacity", 1);
        };
    };
};

function _highlightOneIcon(section) {
    for (var i = 0; i < sections.length; i++) {
        if (sections[i] != section) {
            $("#" + sections[i] + "-icon").css("color", "rgba(24, 24, 24, 0.5)")
        } else {
            $("#" + sections[i] + "-icon").css("color", "rgba(24, 24, 24, 1)")
        };
    };
};

const _purple = "rgb(139, 29, 249)";
const _pink = "rgb(255, 11, 159)";
const _lightBlue = "rgb(31, 133, 255)";
const _white = "rgb(248, 248, 248)";
const _transparent = "rgba(0, 0, 0, 0)"
const _gold = "rgb(255, 181, 11)";
const _gray = "rgb(49, 49, 49)";
const _icon_active = _gray;
const _icon_faded = "rgba(49, 49, 49, 0.5)";

const sections = [
    "header",
    "music",
    "work",
    "showcase"
];

for (let j = 0; j < sections.length; j++) {
    $(`#${sections[j]}-icon`).click(function(){
        const section = this.id.slice(0, this.id.indexOf("-"));
        _showOneStrip(section);
        _highlightOneIcon(section);
    });
};

function _showOneStrip(section) {
    for (let i = 0; i < sections.length; i++) {
        const id = `#${sections[i]}-strip`
        if (sections[i] != section) {
            $(id).css("display", "none").css("opacity", 0);
        } else {
            $(id).css("display", "block").css("opacity", 1);
        };
    };
    $(document).scrollTop(0);
};

function _highlightOneIcon(section) {
    for (let i = 0; i < sections.length; i++) {
        const id = `#${sections[i]}-icon`
        if (sections[i] != section) {
            $(id).css("color", "rgba(24, 24, 24, 0.5)")
        } else {
            $(id).css("color", "rgba(24, 24, 24, 1)")
        };
    };
};

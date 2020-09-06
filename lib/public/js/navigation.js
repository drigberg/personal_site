const sections = [
    "profile",
    "music",
    "work",
    "showcase",
    "travel"
];

for (let j = 0; j < sections.length; j++) {
    $(`#${sections[j]}-icon`).click(function () {
        const section = this.id.slice(0, this.id.indexOf("-"));
        location.search = `page=${section}`;
    });
};

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    console.log('Query variable %s not found', variable);
}

const selectedPage = getQueryVariable("page")
if (selectedPage && sections.includes(selectedPage)) {
    showOneStrip(selectedPage);
    highlightOneIcon(selectedPage);
} else {
    showOneStrip("profile");
    highlightOneIcon("profile");
}

function showOneStrip(section) {
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

function highlightOneIcon(section) {
    for (let i = 0; i < sections.length; i++) {
        const id = `#${sections[i]}-icon`
        if (sections[i] != section) {
            $(id).css("color", "rgba(24, 24, 24, 0.5)")
        } else {
            $(id).css("color", "rgba(24, 24, 24, 1)")
        };
    };
};

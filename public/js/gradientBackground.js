// Constants
var Y_AXIS = 1;
var X_AXIS = 2;
var colors;
var increment = 4;

function setup() {
    var canvas = createCanvas(windowWidth, windowHeight + 50);
    canvas.parent('canvas-background');
    frameRate(10);

    // Define colors
    colors = [
        {
            value : 10,
            direction : 1
        },
        {
            value : 200,
            direction : -1
        }
    ];
}

function draw() {
    for (var i = 0; i < colors.length; i++) {
        if (colors[i].value < 10) {
            colors[i].direction = 1;
        } else if (colors[i].value > 245) {
            colors[i].direction = -1;
        };
        colors[i].value += increment * colors[i].direction;
    };
    clear();
    setGradient(0, 0, width, height, Y_AXIS);
    // setGradient(width/2, 0, width/2, height, color(colors[1].value), color(colors[0].value), Y_AXIS);
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function setGradient(x, y, w, h, axis) {

    noFill();

    if (axis == Y_AXIS) {  // Top to bottom gradient
        for (var i = y; i <= y+h; i++) {
            var inter = map(i, y, y+h, 0, 1);
            color_1 = "rgba(0, " + parseInt(colors[0].value).toString() + ", 250, 0.2)";
            color_2 = "rgba(0, " + parseInt(colors[1].value).toString() + ", 250, 0.2)";
            var gradient = lerpColor(color(color_1), color(color_2), inter);
            stroke(gradient);
            line(x, i, x+w, i);
        }
    }
}

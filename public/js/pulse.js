//----------global defaults
const backgroundColor = "rgba(0, 0, 0, 0)";
const nodeSize = 8;
const emptyVector = [0,0];
const rows = 20;
const columns = 30;
const pulseForceConstant = 500;
const pulseForceExponent = 1.2;
const attractionToHome = 0.1;
const attractionExponent = 1;
const terminalVelocity = 10;
const dragStrength = 0.1;
const recurringPulseFrequency = 1;
const modes = ["grid", "space"];
var activeModeIndex = 0;
var grid;


//--------Todo
//--add pulse charging on mouse hold
//--new mode: nodes go into swarm mode towards the mouse
//--new mode: floating in space mode, with boundaries


//=========================
//Setup & draw functions
//=========================
function setup() {
    makeCanvas();
    makeGrid();
    respaceNodes();
}

function makeCanvas(){
    var canvas = createCanvas(($(window).width()), $(window).height());
    canvas.parent('canvas-background');
};

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
    respaceNodes();
}

function respaceNodes(){
    //space nodes evenly across screen
    for (var col = 0; col < columns; col++){
        for (var row = 0; row < rows; row++){
            grid[col][row].homeX = $(window).width() / columns * col + $(window).width() / columns * 0.5;
            grid[col][row].homeY = $(window).height() / rows * row + $(window).height() / columns * 0.5;
            grid[col][row].x = grid[col][row].homeX;
            grid[col][row].y = grid[col][row].homeY;
        };
    };
};

function makeGrid(){
    //draw grid of nodes
    grid = new Array(columns);
    for (var col = 0; col < columns; col++){
        grid[col] = new Array(columns);
        for (var row = 0; row < rows; row++){
            grid[col][row] = new Node(col, row)
        };
    };
};

function draw() {
    clear();
    background(backgroundColor);
    noStroke();
    fill('rgba(0, 0, 255, 0.5)');
    //draw all nodes
    for (var col = 0; col < columns; col++){
        for (var row = 0; row < rows; row++){
            grid[col][row].update();
        };
    };
};


//=========================
//Classes
//=========================
var Node = function(row, column) {
    this.row = row;
    this.column = column;
    this.radius = nodeSize;
    this.homeX = null;
    this.homeY = null;
    this.x = null;
    this.y = null;
    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.a = 0.5;
    this.vector = new Vector(0, -1, 0);
    this.acceleration = 0;
    this.count = 0;
    this.update = function() {
        //move node according to motion vector, draw
        this.accelerate(this.homeX, this.homeY);
        if (this.vector.magnitude > terminalVelocity) {
            this.vector.magnitude = terminalVelocity;
        };
        this.x += this.vector.x * this.vector.magnitude;
        this.y += this.vector.y * this.vector.magnitude;
        ellipse(this.x, this.y, this.radius, this.radius);
        this.count += 1;
    };

    this.accelerate = function(attractionSourceX, attractionSourceY) {
        if (modes[activeModeIndex] == "grid") {
            this.vector = this.findAttractionToHome(attractionSourceX, attractionSourceY);
            this.applyDrag();
        };
        if (this.vector.magnitude < 0.1) {
            this.vector.magnitude = 0;
        };
    };

    this.applyDrag = function() {
        var draggedMagnitude = 0;
        //   if (this.vector.magnitude < 0 && this.vector.magnitude + dragStrength < 0) {
        //       draggedMagnitude = this.vector.magnitude + dragStrength;
        //   } else if (this.vector.magnitude > 0 && this.vector.magnitude - dragStrength > 0) {
        //       draggedMagnitude = this.vector.magnitude - dragStrength;
        //   }

        this.vector.magnitude *= (1 - dragStrength);
            return draggedMagnitude;
    };

    this.findAttractionToHome = function(attractionSourceX, attractionSourceY ) {
        distanceFromHome = findDistance(attractionSourceX, attractionSourceY, this.x, this.y);
        // if (distanceFromHome < 0.1) {
        //     distanceFromHome = 0.1;
        // };

        var sumVector = this.vector;
        var force = attractionToHome * Math.pow(distanceFromHome, attractionExponent);

        var homeAttractionUnitVector = findUnitVector(this.x, this.y, attractionSourceX, attractionSourceY);
        var homeAttractionNormalVector = convertUnitToNormalVector(homeAttractionUnitVector, force);

        var nodeUnitVector = findUnitVector(0, 0, this.vector.x, this.vector.y);
        var nodeNormalVector = convertUnitToNormalVector(nodeUnitVector, this.vector.magnitude);

        sumVector = findUnitVector(
            0,
            0,
            nodeNormalVector.x + homeAttractionNormalVector.x,
            nodeNormalVector.y + homeAttractionNormalVector.y
        );

        sumVector.magnitude = findDistance(
            0,
            0,
            nodeNormalVector.x + homeAttractionNormalVector.x,
            nodeNormalVector.y + homeAttractionNormalVector.y
        );

        return sumVector;
    };
};

var recurringPulse = function(x, y, strength) {

}

function pulse(x, y, strength) {
    //push all nodes away from pulse location
    for (var col = 0; col < columns; col++){
        for (var row = 0; row < rows; row++){
            var node = grid[col][row];
            var distance = findDistance(x, y, node.x, node.y);
            var force = strength / Math.pow(distance, pulseForceExponent);

            var pulseUnitVector = findUnitVector(x, y, node.x, node.y);
            var pulseNormalVector = convertUnitToNormalVector(pulseUnitVector, force);

            var nodeUnitVector = findUnitVector(0, 0, node.vector.x, node.vector.y);
            var nodeNormalVector = convertUnitToNormalVector(nodeUnitVector, node.vector.magnitude);

            var sumVector = findUnitVector(
                0,
                0,
                nodeNormalVector.x + pulseNormalVector.x,
                nodeNormalVector.y + pulseNormalVector.y
            );

            sumVector.magnitude = findDistance(
                0,
                0,
                nodeNormalVector.x + pulseNormalVector.x,
                nodeNormalVector.y + pulseNormalVector.y
            );

            node.vector = sumVector;
        };
    };
};

function mouseClicked() {
    //set pulse away from mouse click
    pulse(mouseX, mouseY, pulseForceConstant);
};

function keyPressed() {
    if (keyCode === 32) {
        if (activeModeIndex == modes.length - 1) {
            activeModeIndex = 0;
        } else {
            activeModeIndex += 1;
        };
    };
};


//=========================
//Generation functions
//=========================

var Vector = function(x, y, magnitude) {
    this.x = x;
    this.y = y;
    this.magnitude = magnitude;
};

function findAngle(vector1, vector2) {
    //finds smaller angle between two vectors
    var angle = acos(dotProduct(vector1, vector2));
    return angle;
};

function findAngleFromOrigin(vector) {
    var originVector = new Vector(1, 0, 1);
    var angle = acos(dotProduct(vector, originVector));
    if (vector.y < 0) {
        angle *= -1
    };
    return angle;
};

function findUnitVector(x1, y1, x2, y2) {
    //calculates normal vector between two points (in order), converts to unit vector
    var normalVector = new Vector(x2 - x1, y2 - y1, null);
    var magnitude = sqrt((Math.pow(normalVector.x, 2)) + (Math.pow(normalVector.y, 2)));
    if (magnitude == 0) {
        var unitVector = new Vector(0, 0, 0);
    } else {
        var unitVector = new Vector(normalVector.x / magnitude, normalVector.y / magnitude, 1);
    };
    return unitVector;
};

function convertUnitToNormalVector(unitVector, magnitude) {
    normalVector = new Vector();
    normalVector.x = unitVector.x * magnitude;
    normalVector.y = unitVector.y * magnitude;
    normalVector.magnitude = magnitude;
    return normalVector;
};

function findDistance(x1, y1, x2, y2) {
    distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    return distance;
};

function dotProduct(vector1, vector2) {
    var dotProduct = vector1.x * vector2.x + vector1.y * vector2.y;
    return dotProduct;
};

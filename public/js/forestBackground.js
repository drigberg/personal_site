//----------global defaults
var backgroundColor = "rgba(255, 255, 255, 1)";
var trees = [];
var count = 0;
const fr = 100;
var branchProb = 0.01;
const defaults = {
    minDecayRate        : 0.0015,
    maxDecayRate        : 0.006,
    maxDistanceFromSeed : 700,
    yMomentum           : -1,
    numTrees            : 1,
    branchProb          : 0.001,
    thickness           : 10
};

//=========================
//Setup & draw functions
//=========================
function setup() {
    frameRate(fr);
    makeCanvas();
};

function makeCanvas(){
    var canvas = createCanvas(windowWidth, windowHeight + 50);
    canvas.parent('canvas-background');
};

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
    trees = [];
    for (var i = 0; i < 5; i++) {
        trees.push(new Tree(random(0, windowWidth)));
    };
    background(backgroundColor);
};

function draw() {
    //grow all branches
    if (frameCount < 5 || Math.floor(frameCount / fr) == frameCount / fr && trees.length < windowWidth / 50) {
        trees.push(new Tree(random(0, windowWidth)));
    };
    noStroke();
    updateTrees();
};

function updateTrees(){
    for (var i = 0; i < trees.length; i++) {
        trees[i].update();
    };
};



//=========================
//Classes
//=========================
var Tree = function(x) {
    this.update = function(){
        for (var i = 0; i < this.branches.length; i++) {
            this.branches[i].update();
        };
    };
    this.init = function() {
        let maxDecayRate = defaults.maxDecayRate;
        if (trees.length < 5) {
            let maxDecayRate = defaults.minDecayRate;
        };
        this.branches = [new Branch(this, x, windowHeight, 0, defaults.yMomentum, defaults.thickness, defaults.maxDecayRate, random(210, 250), random(210, 250), random(210, 250), 1)];
    };
    this.init();
};

var Branch = function(tree, x, y, xMomentum, yMomentum, thickness, maxDecayRate, r, g, b, a) {
    //collection of birds with a common target, speed, and color
    // to-do: give individual speeds to birds, add acceleration to flocking
    this.tree = tree;
    this.alive = true;
    this.seed = null;
    this.decayRate = random(defaults.minDecayRate, maxDecayRate);
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
    this.x = x;
    this.y = y;
    this.xMomentum = xMomentum;
    this.yMomentum = yMomentum;
    this.thickness = thickness;
    this.update = function(){
        var dead = this.a <= 0 || this.thickness <= 0;
        var outOfBounds = (this.x > windowWidth + 10) || (this.x < -10) || (this.y < -10);
        if (!(dead || outOfBounds)) {
            while (true) {
                if (random(0, 1) < branchProb) {
                    this.tree.branches.push(new Branch(this.tree, this.x, this.y, this.xMomentum, this.yMomentum, this.thickness, this.decayRate, this.r, this.g, this.b, this.a));
                } else {
                    break;
                };
            };

            this.xMomentum += random(-0.1, 0.1);
            this.yMomentum += random(-0.01, 0.01);
            this.x += this.xMomentum;
            this.y += this.yMomentum;
            this.a -= this.decayRate;
            this.thickness -= this.decayRate * 10;
            var color = 'rgba(' + Math.floor(this.r) + ', ' + Math.floor(this.g) + ', ' + Math.floor(this.b) + ', ' + parseFloat(this.a.toFixed(2)) + ')';
            fill(color);
            ellipse(this.x, this.y, this.thickness, this.thickness);
        };
    };
};

//=========================
//Other functions
//=========================

function findDistance(x1, y1, x2, y2) {
    distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    return distance;
};

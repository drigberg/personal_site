//----------global items
const fishies = [];
const bubbles = [];
const fishiesToKill = [];
const bubblesToPop = [];
const numBubblesToReleaseByX = {};
const fr = 100;
const CONFIG = {
    MIN_SPEED: 0.5,
    MAX_SPEED: 4,
    FISH_FREQUENCY: 0.04,
    BUBBLE_FREQUENCY: 0.007,
    MAX_BUBBLE_STREAM: 5,
    BUBBLE_STREAM_FREQUENCY: 0.1,
    NUM_START_FISHIES: 10,
    NUM_START_BUBBLE_STREAMS: 5,
};
const LEFT = -1
const RIGHT = 1
const SIZES = [3, 6, 9]

const images = {}
function preload() {
    images.guppy = loadImage('/public/assets/images/fishtank/guppy.png');
}

//=========================
//Setup & draw functions
//=========================
function setup() {
    frameRate(fr);
    makeCanvas();
    for (let i = 0; i < CONFIG.NUM_START_FISHIES; i++) {
        fishies.push(new Fishy(random() * windowWidth));
    }
    for (let i = 0; i < CONFIG.NUM_START_BUBBLE_STREAMS; i++) {
        const x = random() * windowWidth
        numBubblesToReleaseByX[x] = Math.ceil(random() * CONFIG.MAX_BUBBLE_STREAM)
    }
};

function makeCanvas(){
    let canvas = createCanvas(windowWidth, windowHeight + 50);
    canvas.parent('canvas-background');
};

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
};

function releaseFishies() {
    if (random() < CONFIG.FISH_FREQUENCY) {
        fishies.push(new Fishy());
    };
}

function releaseBubbles() {
    if (random() < CONFIG.BUBBLE_FREQUENCY) {
        const x = random() * windowWidth
        numBubblesToReleaseByX[x] = Math.ceil(random() * CONFIG.MAX_BUBBLE_STREAM)
    };
    Object.keys(numBubblesToReleaseByX).forEach(x => {
        if (numBubblesToReleaseByX[x] > 0 && random() < CONFIG.BUBBLE_STREAM_FREQUENCY) {
            bubbles.push(new Bubble(x))
            numBubblesToReleaseByX[x] -= 1
        }
    })
}

function cleanUpStores() {
    numBubblesToReleaseByXEmptyKeys = Object.entries(numBubblesToReleaseByX).map((x, num) => num <= 0)
    numBubblesToReleaseByXEmptyKeys.forEach(key => {
        delete numBubblesToReleaseByX[key]
    })
    while (fishiesToKill.length) {
        const fishyToKill = fishiesToKill.pop()
        const index = fishies.indexOf(fishyToKill)
        fishies.splice(index, 1)
    }
    while (bubblesToPop.length) {
        const bubbleToPop = bubblesToPop.pop()
        const index = bubbles.indexOf(bubbleToPop)
        bubbles.splice(index, 1)
    }
}

function draw() {
    releaseFishies()
    releaseBubbles()
    cleanUpStores()
    noStroke();
    clear()
    fishies.forEach(fishy => fishy.update())
    bubbles.forEach(bubble => bubble.update())
};



//=========================
// Classes
//=========================
class Fishy {
    constructor(x = null) {
        this.y = random() * windowHeight
        this.speed = random() * (CONFIG.MAX_SPEED - CONFIG.MIN_SPEED) + CONFIG.MIN_SPEED
        if (x !== null) {
            this.x = x
            this.direction = random() < 0.5 ? RIGHT : LEFT
        } else {
            if (random() < 0.5) {
                this.direction = RIGHT
                this.x = -50
            } else {
                this.direction = LEFT
                this.x = windowWidth + 50
            }
        }

        this.color = 'rgb(0, 0, 0)'
        this.size = SIZES[parseInt(random() * 3)]
    }

    update() {
        this.x += (this.speed * this.direction)
        let outOfBounds = (this.x > windowWidth + 100) || (this.x < -100);
        if (outOfBounds) {
            fishiesToKill.push(this)
        }
        if (this.direction == LEFT) {
            push()
            scale(this.direction, 1)
            image(images.guppy, this.x * -1, this.y)
            pop()
        } else {
            image(images.guppy, this.x, this.y)
        }
    };
};

class Bubble {
    constructor(x) {
        this.x = x
        this.y = windowHeight + 5
        this.speed = -0.5 * (random() * (CONFIG.MAX_SPEED - CONFIG.MIN_SPEED) + CONFIG.MIN_SPEED)
        this.color = 'rgba(0, 181, 255, 0.5)'
        this.size = SIZES[parseInt(random() * 3)]
    }

    update() {
        this.y += this.speed
        if (this.y < -20) {
            bubblesToPop.push(this)
        }
        stroke(this.color);
        noFill()
        ellipse(this.x, this.y, this.size, this.size);
        noStroke()
    }
}

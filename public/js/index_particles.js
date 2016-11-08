//TO-DO
//    -Revise terminal velocity for composite vector
//

var default_attraction = 200;
var attraction = default_attraction;
var mouseover = false;
var slow_factor = 0.25;
var max_line_distance = 175;
var default_particle_width = 2;
var planet_radius_range = [200, 2000];
var particles = [];
var planets = [];
var particle_pool = [];
var planet_pool = [];
var GridNode_pool = [];
var GridNodes = [];
var G = 500;
var terminal_velocity = 10;

var particle_field = Sketch.create({
    container: document.getElementById( 'container' )
});

function Particle( x, y, radius ) {
    this.init( x, y, radius );
}

function Planet( x, y, radius ) {
    this.init( x, y, radius );
}

function GridNode( x, y, n ) {
    this.init( x, y, n );
}

Particle.prototype = {

    init: function( x, y, radius ) {

        this.alive = true;
        this.mass = 10;
        this.feedlineOpacity = 0;
        this.x = x || 0;
        this.y = y || 0;
        this.origin = [600, 350];
        this.r_x = (this.x - 600);
        this.r_y = (this.y - 250);
        this.r = sqrt((this.r_x * this.r_x) + (this.r_y * this.r_y));

        this.radius = radius || 2;
        this.wander = 0.15;
        this.xtheta = 0;
        this.ytheta = 0;

        this.drag = 3;
        this.red = 0;
        this.green = 0;
        this.blue = 100;
        this.opacity = 0.4;

        //Coordinated orbits

        if (this.r_x > 0){
            if (this.r_y > 0) {
                this.vx = (-5 / this.r) * (this.r_y)
                this.vy = (5 / this.r) * (this.r_x)
            } else {
                this.vx = (-5 / this.r) * (this.r_y)
                this.vy = (5 / this.r) * (this.r_x)
            }
        } else {
          if (this.r_y > 0) {
              this.vx = 5 / this.r * (this.r_y)
              this.vy = 5 / this.r * (this.r_x)
          } else {
              this.vx = (5 / this.r) * (this.r_y)
              this.vy = (5 / this.r) * (this.r_x)
          }
        };
    },

    move: function() {

        if (mouseover) {
            for ( i = 0, n = particle_field.touches.length; i < n; i++ ) {
                var touch = particle_field.touches[i];
                this.r_x = (this.x - touch.x);
                this.r_y = (this.y - touch.y);
            }
        } else {
            this.r_x = (this.x - this.origin[0]);
            this.r_y = (this.y - this.origin[1]);
        }
        // this.r_x = (this.x - this.origin[0]);
        // this.r_y = (this.y - this.origin[1]);
        this.r = sqrt((this.r_x * this.r_x) + (this.r_y * this.r_y));

        if (this.r < 30 ) this.r = 30;

        this.xtheta = (-(this.r_x / (this.r * this.r)) * attraction * slow_factor);
        this.ytheta = (-(this.r_y / (this.r * this.r)) * attraction * slow_factor);
        this.vx += this.xtheta;
        this.vy += this.ytheta;
        if (this.vx > terminal_velocity) {
            this.vx = terminal_velocity;
        }
        if (this.vy > terminal_velocity) {
            this.vy = terminal_velocity;
        }
        this.x += this.vx;
        this.y += this.vy;

        if (this.x > particle_field.width - 1) {
            this.vx = this.vx * -0.7;
            this.xtheta = 0;
        } else if (this.x < 1){
            this.vx = this.vx * -0.7;
            this.xtheta = 0;
        };

        if (this.y > particle_field.height) {
            this.vy = this.vy * -0.7;
            this.ytheta = 0;
        } else if (this.y < 1){
            this.vy = this.vy * -0.7;
            this.ytheta = 0;
        };
    },

    draw: function( ctx ) {
        ctx.beginPath();
        ctx.arc( this.x, this.y, this.radius, 0, TWO_PI );
        ctx.fillStyle = 'rgba(' + this.red.toString() + ', ' + this.green.toString() + ', ' + this.blue.toString() + ', ' + this.opacity.toString() + ')';
        ctx.fill();
    }
};

Planet.prototype = {

    init: function( x, y, radius ) {
        this.alive = true;
        this.x = x || 0;
        this.y = y || 0;
        if (this.x < particle_field.width / 2) {
            this.vx = random(0,2);
        } else {
            this.vx = random(-2,0);
        }
        if (this.y < particle_field.height / 2) {
            this.vy = random(0,2);
        } else {
            this.vy = random(-2,0);
        }

        this.radius = radius || 2000;
        this.diameter = this.radius * 2;
        this.red = 0;
        this.green = random(0,255);
        this.blue = random(0,255);
        this.opacity = 0.05;
    },

    move: function() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x - this.diameter > particle_field.width) {
            this.alive = false
        } else if (this.x + this.diameter < 0){
          this.alive = false
        };

        if (this.y - this.diameter > particle_field.height) {
          this.alive = false
        } else if (this.y + this.diameter < 0){
          this.alive = false
        };
    },

    draw: function( ctx ) {
        ctx.beginPath();
        ctx.arc( this.x, this.y, this.radius, 0, TWO_PI );
        ctx.fillStyle = 'rgba(' + this.red.toString() + ', ' + this.green.toString() + ', ' + this.blue.toString() + ', ' + this.opacity.toString() + ')';
        ctx.fill();
    }
};

GridNode.prototype = {

    init: function( x, y, n_x, n_y ) {
        this.x = x || 0;
        this.y = y || 0;
        this.n_x = n_x || 0;
        this.n_y = n_y || 1;
        this.radius = 0;
    },

    move: function() {
        this.radius = 10;
        var local_gravity_well = 0;
        var distance = 0;
        for ( i = particles.length - 1; i >= 0; i-- ) {
            distance = find_distance(particles[i], this);
            local_gravity_well += G * particles[i].mass / (distance ** 1.2);
        };
        this.radius -= local_gravity_well * 0.05;
        if (this.radius < 0) {
            this.radius = 0;
        };
    },

    draw: function( ctx ) {
        ctx.beginPath();
        ctx.arc( this.x, this.y, this.radius, 0, TWO_PI );
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fill();
    }
};

particle_field.setup = function() {

    // Set off some initial particles.
    var i, x, y;

    for ( i = 0; i < 20; i++ ) {
        x = random(300,900);
        y = random(250,450);
        particle_field.spawn_particle( x, y );
    }

    for (i = 0; i < 3; i++) {
        particle_field.spawn_planet();
    }


    var n_x = 0;
    var n_y = 0;
    var gridInterval = particle_field.width / 50;
    var yCounter = gridInterval * -1;
    var xCounter = gridInterval * -1;

    while (yCounter < particle_field.height + gridInterval) {
        while (xCounter < particle_field.width + gridInterval) {
            particle_field.spawn_GridNode(xCounter, yCounter, n_x, n_y);
            xCounter += gridInterval;
            n_x += 1;
        };
        yCounter += gridInterval;
        n_y += 1;
        xCounter = 0;
        n_x = 0;
    };
};

particle_field.spawn_particle = function( x, y ) {
    var particle;
    particle = particle_pool.length ? particle_pool.pop() : new Particle();
    particle.init( x, y, default_particle_width);
    particles.push( particle );
};

particle_field.spawn_planet = function() {
    var planet, radius;
    planet = planet_pool.length ? planet_pool.pop() : new Planet();
    radius = random(planet_radius_range[0], planet_radius_range[1]);
    var x = 0
    var y = 0
    while (x + radius > 0 && x - radius < particle_field.width && y + radius > 0 && y - radius < particle_field.height) {
        x = random(-1 * radius - 200, particle_field.width + radius + 200);
        y = random(-1 * radius - 200, particle_field.height + radius + 200);
    }
    planet.init( x, y, radius );
    planets.push( planet );
};

particle_field.spawn_GridNode = function( x, y, n_x, n_y) {
  var gridNode;
  gridNode = new GridNode();
  gridNode.init( x, y, n_x, n_y);
  GridNodes.push( gridNode );
};

particle_field.update = function() {

    var i, particle, planet;

    //particles
    for ( i = particles.length - 1; i >= 0; i-- ) {

        particle = particles[i];

        if ( particle.alive ) particle.move();
        else particle_pool.push( particles.splice( i, 1 )[0] );
    }

    var j, k, touch;

    for ( j = 0, n = particle_field.touches.length; j < n; j++ ) {
        touch = particle_field.touches[j];
        // particle_field.spawn( touch.x, touch.y );
        for ( k = particles.length - 1; k >= 0; k-- ) {
            if (find_distance(particles[k], touch) < max_line_distance) {
                if (particles[k].radius < 20 && mouseover) {
                    particles[k].feedlineOpacity = 1 - (find_distance(particles[k], touch)) / 200;
                    particles[k].radius += 0.2;
                    if (particles[k].red < 250) {
                        particles[k].red += 10;
                    }
                    if (particles[k].blue > 100) {
                        particles[k].blue -= 10;
                    }
                    if (particles[k].opacity < 1) {
                        particles[k].opacity += 0.1
                    }
                };
            } else {
                particles[k].feedlineOpacity = 0;
                if (particles[k].radius > 2) {
                    particles[k].radius -= 0.2
                };
                if (particles[k].red > 10) {
                    particles[k].red -= 10;
                }
                if (particles[k].blue < 250) {
                    particles[k].blue += 10;
                }
                if (particles[k].opacity > 0.4) {
                    particles[k].opacity -= 0.1
                }
            };
        }
    }

    //planets
    for ( i = planets.length - 1; i >= 0; i-- ) {
        planet = planets[i];
        if ( planet.alive ) {
            planet.move()
        } else {
            planet_pool.push( planets.splice( i, 1 )[0] );
            radius = random(planet_radius_range)
            particle_field.spawn_planet( radius );
        };
    }

    for ( var i = GridNodes.length - 1; i >= 0; i-- ) {
        GridNodes[i].move();
    }
};

particle_field.draw = function() {
    for ( var i = planets.length - 1; i >= 0; i-- ) {
        // planets[i].draw( particle_field );
    }

    for ( var i = GridNodes.length - 1; i >= 0; i-- ) {
        GridNodes[i].draw( particle_field );
    }
    for ( var i = particles.length - 1; i >= 0; i-- ) {
        particles[i].draw( particle_field );
        for ( var j = particles.length - 1; j >= 0; j-- ) {
            if (i != j && find_distance(particles[i], particles[j]) < max_line_distance) {
                particle_field.beginPath();
                particle_field.moveTo( particles[i].x, particles[i].y );
                particle_field.lineTo( particles[j].x, particles[j].y );
                average_colors = {
                    "red" : (particles[i].red + particles[j].red)/2,
                    "green" : (particles[i].green + particles[j].green)/2,
                    "blue" :(particles[i].blue + particles[j].blue)/2
                };
                particle_field.strokeStyle = 'rgba(' + average_colors["red"].toString() + ', ' + average_colors["green"].toString() + ', ' + average_colors["blue"].toString() + ', ' + ((find_distance(particles[i], particles[j]) / 175) * 0.2).toString() + ')';
                particle_field.stroke();
            }
        }
        if (particles[i].feedlineOpacity > 0 && mouseover) {
            for ( var k = 0, n = particle_field.touches.length; k < n; k++ ) {
                var touch = particle_field.touches[k];
                particle_field.beginPath();
                particle_field.moveTo( particles[i].x, particles[i].y );
                particle_field.lineTo( touch.x, touch.y );
                particle_field.strokeStyle = 'rgba(' + particles[i].red.toString() + ', ' + particles[i].green.toString() + ', ' + particles[i].blue.toString() + ', ' + (particles[i].feedlineOpacity).toString() + ')';
                particle_field.stroke();
            }
        }
    }
};


particle_field.mousedown = function() {
    attraction = default_attraction * 2;
}

particle_field.mouseup = function() {
    attraction = default_attraction;
}

particle_field.mouseover = function() {
    mouseover = true;
}

particle_field.mouseout = function() {
    mouseover = false;
}

find_distance = function(object_1, object_2) {
    return sqrt((object_1.x - object_2.x) ** 2 + (object_1.y - object_2.y) ** 2)
}

degrees_to_radians = function(degrees) {
    return degrees / 180 * PI;
}

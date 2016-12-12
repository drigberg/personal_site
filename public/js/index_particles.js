//TO-DO
//    -Revise terminal velocity for composite vector
//

var default_attraction = 200;
var attraction = default_attraction;
var mouseover = false;
var slow_factor = 0.25;
var max_line_distance = 175;
var default_particle_width = 1;
var number_of_particles = 35;
var max_particle_radius = 10;
var particles = [];
var particle_pool = [];
var G = 500;
var terminal_velocity = 10;

var particle_field = Sketch.create({
    container: document.getElementById( 'container' )
});

function Particle( x, y, radius ) {
    this.init( x, y, radius );
}

Particle.prototype = {

    init: function( x, y, radius ) {
        this.mass = 10;
        this.feedlineOpacity = 0;
        this.x = x || 0;
        this.y = y || 0;
        this.origin = [600, 350];
        this.r_x = (this.x - 600);
        this.r_y = (this.y - 250);
        this.r = sqrt((this.r_x * this.r_x) + (this.r_y * this.r_y));

        this.radius = radius || 2;
        this.xtheta = 0;
        this.ytheta = 0;

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

particle_field.setup = function() {

    // Set off some initial particles.
    var i, x, y;

    for ( i = 0; i < number_of_particles; i++ ) {
        x = random(300,900);
        y = random(250,450);
        particle_field.spawn_particle( x, y );
    }
};

particle_field.spawn_particle = function( x, y ) {
    var particle;
    particle = particle_pool.length ? particle_pool.pop() : new Particle();
    particle.init( x, y, default_particle_width);
    particles.push( particle );
};

particle_field.update = function() {

    var i, particle;

    //particles
    for ( i = particles.length - 1; i >= 0; i-- ) {

        particle = particles[i];

        particle.move();
    }

    var j, k, touch;

    for ( j = 0, n = particle_field.touches.length; j < n; j++ ) {
        touch = particle_field.touches[j];
        // particle_field.spawn( touch.x, touch.y );
        for ( k = particles.length - 1; k >= 0; k-- ) {
            if (find_distance(particles[k], touch) < max_line_distance) {
                if (particles[k].radius < max_particle_radius && mouseover) {
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
};

particle_field.draw = function() {
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

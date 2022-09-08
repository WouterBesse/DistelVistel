let flowFieldSketch = function (p) {
    const black = p.color(0, 0, 0);
    const white = p.color(255, 255, 255);
    const SCENEID = 1;
    let canvas;
    const fireworks = [];
    let gravity;
    const letters = ['D', 'I', 'S', 'T', 'E', 'L'];
    let div = 0;


    var scl = 0.005;    // scale of noisefield, [+/-] to zoom in/out

    var moveNoise = true;       //[n] is movement in noise space on
    var moveParticles = true;   //[space] is particle movement on

    var particleCount = 1000;   // max number of particles
    // [right/left arrow] add/subtract 50

    var numberOfSlices = 10;     // number of slices in noise space (along z-axis)
    // [c/v] change number of slices

    var visibility = 80;    // [,/.] alpha value of particles
    var deletionSpeed = 20; // [g/h] alpha value of black background drawn every
    // frame, between 0-255, lower means slower deletion
    /////////

    // movement per second
    const xSpeed = 0.0008;
    const ySpeed = 0.01;
    const zSpeed = 0.05;

    const sliceDistance = 0.005;    // distance between noise slices
    const maxspeed = 6;     // maxspeed of particles, independent of framerate 
    // (so higher framerate will make them go faster)

    const hueMultiplier = 500.0;    // particles will multiply noise result 
    // by this to get hue
    const accMultiplier = 8 * Math.PI;
    /////////

    // position in noise field
    var zMove = 0.0;
    var xMove = 0.0;
    var yMove = 0.0;

    var particles = []; // array for particles
    var timeLastFrame = 0.0;    // record time ellapsed since last frame to move noise 
    // field with the same speed, independent of framerate

    p.setup = function () {
        canvas = p.createCanvas(windowWidth, windowHeight);
        canvas.position(0, 0);
        p.smooth(); // Anti aliasing
        p.frameRate(FRAMERATE);

        timeLastFrame = p.millis();
        gravity = createVector(0, 0);

        p.colorMode(HSB, 255);
        p.textSize(15);

        p.addParticles(300);

    }

    class Particle {
        constructor() {
            this.pos = p.createVector(p.random(windowWidth), p.random(windowHeight));
            this.vel = p.createVector(0, 0);
            this.acc = p.createVector(0, 0);
            this.hue = 0; // hue

            this.slice = p.int(p.random(numberOfSlices)) * sliceDistance;

            this.prevPos = this.pos.copy();


            this.update = function () {
                this.vel.add(this.acc);
                this.vel.limit(maxspeed);
                this.pos.add(this.vel);
                this.acc.mult(0);
            };

            this.applyForce = function (force) {
                this.acc.add(force);
            };
            this.calculateForce = function () {
                var force = p.calculateForce(this.pos.x, this.pos.y, this.slice);

                this.setHue(force * hueMultiplier);

                var vector = p5.Vector.fromAngle(force * accMultiplier);

                this.acc.add(vector);
            };
            this.setHue = function (force) {
                if (force > 255) {
                    this.hue = force % 256;
                } else {
                    this.hue = force;
                }
                p.stroke(this.hue, 255, 255, visibility);
                p.strokeWeight(3);
            };
            this.show = function () {
                p.line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
                this.updatePrev();
            };
            this.updatePrev = function () {
                this.prevPos.x = this.pos.x;
                this.prevPos.y = this.pos.y;
            };
            this.edges = function () {
                if (this.pos.x > windowWidth || this.pos.x < 0 ||
                    this.pos.y > windowHeight || this.pos.y < 0) {
                    this.pos = p.createVector(random(windowWidth), random(windowHeight));
                    this.vel = p.createVector(0, 0);
                    this.updatePrev();
                }
            };
            this.done = function () {
                return false;
            }
        }
    }

    class fireParticle {
        constructor(x, y, hu, firework) {
            this.pos = p.createVector(x, y);
            this.prevPos = this.pos.copy();
            this.firework = firework;
            this.lifespan = 512;
            this.doner = false;
            this.hu = hu;
            this.slice = p.int(p.random(numberOfSlices)) * sliceDistance;
            this.acc = p.createVector(0, 0);
            
            if (this.firework) {
                this.vel = p.createVector(0, 0);
                //p.random(-12, -8));
            } else {
                this.vel = p5.Vector.random2D();
                this.vel.mult(p.random(2, 10));
            }

            this.calculateForce = function () {
                if (!this.doner) {
                    var force = p.calculateForce(this.pos.x, this.pos.y, this.slice);
        
                    this.setHue(force * hueMultiplier);
        
                    var vector = p5.Vector.fromAngle(force * accMultiplier);
                    this.acc.add(vector.mult(0.0005 * (513 - this.lifespan)));
                }
            };

            this.updatePrev = function () {
                this.prevPos.x = this.pos.x;
                this.prevPos.y = this.pos.y;
            };

            this.edges = function () {
                if (this.pos.x > windowWidth || this.pos.x < 0 ||
                    this.pos.y > windowHeight || this.pos.y < 0) {
                    this.pos = p.createVector(random(windowWidth), random(windowHeight));
                    this.vel = p.createVector(0, 0);
                    this.updatePrev();
                }
            };

            this.setHue = function (force) {
                if (force > 255) {
                    this.hue = force % 256;
                } else {
                    this.hue = force;
                }
                p.stroke(this.hue, 255, 255, visibility);
                p.strokeWeight(3);
            };

            this.show = function () {
                if(!this.doner) {
                    p.colorMode(HSB);

                    if (!this.firework) {
                        p.strokeWeight(2);
                        p.stroke(this.hu, 255, 255, this.lifespan);
                    } else {
                        p.strokeWeight(4);
                        p.stroke(this.hu, 255, 255);
                    }

                    p.circle(this.pos.x, this.pos.y, 4)
                    p.line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
                    this.updatePrev();
                }
            };
            
        }

        applyForce(force) {
            this.acc.add(force);
        }

        update() {
            if (!this.firework) {
                this.vel.mult(0.9);
                this.lifespan -= 4;
            }
            this.vel.add(this.acc);
            this.vel.limit(maxspeed);
            this.pos.add(this.vel);
            this.acc.mult(0);

            
        }

        done() {
            if (this.lifespan < 0) {
                this.doner = true;
                return true;
            } else {
                return false;
            }
        }
    }

    class Firework {
        constructor() {
            this.hu = p.random(255);
            this.firework = new fireParticle(p.random(windowWidth), p.random(windowHeight), this.hu, true);
            this.exploded = false;
            this.particles = [];
        }

        done() {
            if (this.exploded && this.particles.length === 0) {
                for (let i = this.particles.length - 1; i >= 0; i--) {
                    this.particles[i].update();
    
                    if (this.particles[i].done()) {
                        this.particles.splice(i, 1);
                    }
                }
                return true;
            } else {
                return false;
            }
        }

        update() {
            if (!this.exploded) {
                this.firework.applyForce(gravity);
                this.firework.update();

                if (this.firework.vel.y >= 0) {
                    this.exploded = true;
                    this.explode();
                }
            }

            for (let i = this.particles.length - 1; i >= 0; i--) {
                this.particles[i].applyForce(gravity);
                this.particles[i].update();

                if (this.particles[i].done()) {
                    this.particles.splice(i, 1);
                }
            }
        }

        explode() {
            for (let i = 0; i < 100; i++) {
                const p = new fireParticle(this.firework.pos.x, this.firework.pos.y, this.hu, false);
                this.particles.push(p);
            }
        }

        show() {
            if (!this.exploded) {
                this.firework.show();
            }

            for (var i = 0; i < this.particles.length; i++) {
                this.particles[i].show();
            }
        }

        getParticles() {
            return this.particles;
        }
    }

    p.draw = function () {
        if (!lightMode && manual) {
            xMove = p.random();
            yMove = p.random();
            zMove = p.random();
        } else {
            if (!lightMode && !manual) {
                if(div==10){
                    xMove = p.random();
                    yMove = p.random();
                    zMove = p.random(); 
                    div = 0;
                } else {
                    div++;
                }
            }
        }

        if (moveParticles) {
            var timePassed = (p.millis() - timeLastFrame) / 1000.0;
            timeLastFrame = p.millis();

            // add/delete particle, if there are not enough/too many
            if (particles.length < particleCount) {
                p.addParticles(1);
            } else if (particles.length > particleCount) {
                p.deleteParticles(1);
            }

            if (moveNoise) {
                xMove += xSpeed * timePassed;
                yMove += ySpeed * timePassed;
                zMove += zSpeed * timePassed;
            }

            p.background(0, 0, 0, deletionSpeed);

            // loop through every particle
            for (var i = 0; i < particles.length; i++) {
                particles[i].calculateForce();  // calculate force from noise field
                // will also set hue
                particles[i].update();          // move particle
                particles[i].show();            // draw particle
                particles[i].edges();           // check if still in bounds
            }
        }

        if (p.random(1) < 0.04) {
            fireworks.push(new Firework());
        }

        for (let i = fireworks.length - 1; i >= 0; i--) {
            if(fireworks[i]!= undefined) {
                for (let e = 0; e < fireworks[i].particles.length; e++) {
                    particles.unshift(fireworks[i].particles[e]);
                }
            }

            fireworks[i].update();
            fireworks[i].show();

            if (fireworks[i].done()) {
                // for (var f = 0; f < particles.length; f++) {
                //     if (particles[f].done()) {
                //         particles.splice(f, 1);
                //     }
                // }
                fireworks.splice(i, 1);
            }

            
        }

    }

    p.calculateForce = function (x, y, z) {
        return p.noise(x * scl + xMove, y * scl + yMove, z + zMove);
    }

    // add/delete/set particles
    p.addParticles = function (num) {
        for (var i = 0; i < num; i++) {
            particles.unshift(new Particle());
        }
    }
    p.deleteParticles = function (num) {
        num = p.min(num, particles.length);
        for (var i = 0; i < num; i++) {
            particles.pop();
        }
        for (var f = 0; f < particles.length; f++) {
            if (particles[f].done()) {
                particles.splice(f, 1);
            }
        }
    }
    p.setParticles = function (num) {
        particleCount = num;
        var dif = particleCount - particles.length;
        if (dif > 0) {
            p.addParticles(dif);
        } else {
            p.deleteParticles(-dif);
        }
    }

    // some helpers
    p.resetCanvas = function () {
        p.deleteParticles(particles.length);  // delete all particles
        p.setParticles(particleCount);        // add new particles
        p.background(0);                      // draw over everything
        moveParticles = true;               // start drawing
    }
    p.windowResized = function () {
        p.resizeCanvas(windowWidth, windowHeight);
    }
}
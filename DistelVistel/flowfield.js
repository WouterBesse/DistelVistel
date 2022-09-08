let flowFieldSketch = function (p) {
    const black = p.color(0, 0, 0);
    const white = p.color(255, 255, 255);
    const SCENEID = 1;
    let canvas;
    const fireworks = [];
    let gravity;
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
        constructor(x = p.random(windowWidth), y = p.random(windowHeight), hue = 0,) {
            this.pos = p.createVector(x, y);
            this.vel = p.createVector(0, 0);
            this.acc = p.createVector(0, 0);
            this.hue = hue; // hue
            this.slice = p.int(p.random(numberOfSlices)) * sliceDistance;
            this.prevPos = this.pos.copy();
        }

        update() {
            this.vel.add(this.acc);
            this.vel.limit(maxspeed);
            this.pos.add(this.vel);
            this.acc.mult(0);
        };

        applyForce(force) {
            this.acc.add(force);
        };

        calculateForce() {
            var force = p.calculateForce(this.pos.x, this.pos.y, this.slice);

            this.setHue(force * hueMultiplier);

            var vector = p5.Vector.fromAngle(force * accMultiplier);

            this.acc.add(vector.mult(this.forceMult()));
        };

        setHue(force) {
            if (force > 255) {
                this.hue = force % 256;
            } else {
                this.hue = force;
            }
            p.stroke(this.hue, 255, 255, visibility);
            p.strokeWeight(3);
        };

        show() {
            p.line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
            this.updatePrev();
        };

        updatePrev() {
            this.prevPos.x = this.pos.x;
            this.prevPos.y = this.pos.y;
        };

        edges() {
            if (this.pos.x > windowWidth || this.pos.x < 0 ||
                this.pos.y > windowHeight || this.pos.y < 0) {
                this.pos = p.createVector(random(windowWidth), random(windowHeight));
                this.vel = p.createVector(0, 0);
                this.updatePrev();
            }
        };

        forceMult() {
            return 1;
        };
    }

    class fireParticle extends Particle {
        constructor(x, y, hue) {
            super(x, y, hue);
            this.velocityInfluence = 512;
            this.vel = p5.Vector.random2D();
            this.vel.mult(p.random(2, 10));
        }

        update() {
            this.vel.mult(0.9);
            this.lifespan -= 4;
            this.vel.add(this.acc);
            this.vel.limit(maxspeed);
            this.pos.add(this.vel);
            this.acc.mult(0);
        }

        show(opacity) {
            p.colorMode(HSB);

            
            p.strokeWeight(2);
            p.stroke(this.hue, 255, 255, opacity);
            

            p.circle(this.pos.x, this.pos.y, 4)
            p.line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
            this.updatePrev();
        }

        forceMult() {
            this.velocityInfluence += -4;
            return 0.0005 * (513 - this.velocityInfluence);
        }
    }

    class Firework {
        constructor() {
            this.hue = p.random(255);
            this.x = p.random(windowWidth);
            this.y = p.random(windowHeight);
            this.exploded = false;
            this.particles = [];
            this.lifespan = 512;
            this.doner = false;
        }

        done() {
            if (this.lifespan <= 0) {
                for (let i = 0; i < this.particles.length; i++) {
                    
                    this.particles.splice(i, 1);
                    
                }
                this.doner = true;
            }
        }

        update() {
            for (let i = this.particles.length - 1; i >= 0; i--) {
                this.particles[i].applyForce(gravity);
                this.particles[i].update();
            }
            this.done();
            this.lifespan += -4;
        }

        explode() {
            for (let i = 0; i < 100; i++) {
                const p = new fireParticle(this.x, this.y, this.hue, false);
                this.particles.push(p);
            }
        }

        show() {
            for (var i = 0; i < this.particles.length; i++) {
                this.particles[i].show(this.lifespan/2);
            }
        }

        splicePart(k) {
            particles.splice(k, 1);
        }
    }

    p.draw = function () {
        if (!lightMode && manual) {
            xMove = p.random();
            yMove = p.random();
            zMove = p.random();
        } else {
            if (!lightMode && !manual) {
                if (div == 10) {
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
            f = new Firework();
            f.explode();
            fireworks.push(f);
        }

        for (let i = fireworks.length - 1; i >= 0; i--) {
            for (var k = 0; k < fireworks[i].particles.length; k++) {
                fireworks[i].particles[k].calculateForce();  // calculate force from noise field
                // will also set hue
                fireworks[i].particles[k].edges();           // check if still in bounds
            }

            fireworks[i].update();
            fireworks[i].show();

            if (fireworks[i].doner) {
                for (var k = 0; k < fireworks[i].particles.length; k++) {
                    fireworks[i].splicePart(k);
                }
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
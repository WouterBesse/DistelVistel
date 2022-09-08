let flowFieldSketch = function (p) {
    const black = p.color(0, 0, 0);
    const white = p.color(255, 255, 255);
    const SCENEID = 1;
    let canvas;

    let particles = [];
    const num = 1000;

    const noiseScale = 0.01 / 2;

    p.setup = function () {
        canvas = p.createCanvas(windowWidth, windowHeight);
        canvas.position(0,0);
        p.smooth(); // Anti aliasing
        p.frameRate(FRAMERATE);
        for (let i = 0; i < num; i++) {
            particles.push(p.createVector(p.random(windowWidth), p.random(windowHeight)));
        }

        p.stroke(255);
        // For a cool effect try uncommenting this line
        // And comment out the background() line in draw
        // stroke(255, 50);
        p.clear();
    }

    p.draw = function () {
        p.background(0, 10);
        for (let i = 0; i < num; i++) {
            let par = particles[i];
            p.point(par.x, par.y);
            let n = p.noise(par.x * noiseScale, par.y * noiseScale, frameCount * noiseScale * noiseScale);
            let a = TAU * n;
            par.x += p.cos(a);
            par.y += p.sin(a);
            if (p.onScreen(par)==false) {
                par.x = p.random(windowWidth);
                par.y = p.random(windowHeight);
            }
        }
    }

    p.mouseReleased = function () {
        p.noiseSeed(p.millis());
    }

    p.onScreen = function (v) {
        return v.x >= 0 && v.x <= windowWidth && v.y >= 0 && v.y <= windowHeight;
    }

}
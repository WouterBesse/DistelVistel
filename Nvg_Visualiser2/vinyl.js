let vinylSketch = function (p) {
    const black = color(0, 0, 0);
    const white = color(255, 255, 255);
    const DISTELXINSTANCES = 1;
    const DISTELYINSTANCES = 1;

    p.preload = function () {
        distelRondModel = p.loadModel('assets/Distel.obj', true);
        vinylModel = p.loadModel('assets/Vinyl_disc.obj', true);
    }

    p.setup = function () {
        let canvas = p.createCanvas(windowWidth, windowHeight, p.WEBGL);
        canvas.position(0, 0);
        p.smooth(); // Anti aliasing
        p.frameRate(FRAMERATE);
    }

    p.drawBackgroundRond = function () {
        p.blendMode(p.BLEND);
        if (lightMode) {
            p.background(black);
            p.stroke(white);
        } else {
            p.background(white);
            p.stroke(black);
        }
    }

    p.drawDistelRond = function () {
        p.push();
        p.translate(0, 0, 40 * lightMode);
        p.rotateY(180 * lightMode);
        p.emissiveMaterial(255, 0, 146);
        p.model(distelRondModel);
        p.pop();
    }

    p.drawVinyl = function () {
        p.push();
        p.rotateY(90);
        p.translate(20, 0, 0);
        p.scale(1.5);
        p.strokeWeight(0.5);
        p.emissiveMaterial(0, 255, 0);
        p.model(vinylModel);
        p.pop();
    }

    p.draw = function () {
        p.drawBackgroundRond();

        // Distel properties 
        p.angleMode(p.DEGREES);
        p.strokeWeight(1);
        p.scale(3.5);
        p.rotateZ(millis() / -15);
        p.drawVinyl();
        p.drawDistelRond();
    }
}
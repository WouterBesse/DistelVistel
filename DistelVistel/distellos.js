let distelLosSketch = function (p) {
    const black = color(0, 0, 0);
    const white = color(255, 255, 255);
    const SCENEID = 1;
    const SINES = 5;

    p.summ = function (startIndex, endIndexInclusive) {
        let accumulator = 0;
        for (let i = startIndex; i <= endIndexInclusive; ++i) {
            accumulator += p.iterator(i);
        }
        return accumulator;
    }

    p.iterator = function (n) {
        let t = millis()/1000;
        let sineN = 4/PI*sin((2*n - 1) * t) / (2*n - 1);
        return sineN;
    }

    p.preload = function () {
        fontRegular = p.loadFont('DDCHardware-Regular.ttf');
        distelModel = p.loadModel('assets/Distel2.obj', true);
    }

    p.setup = function () {
        let canvas = p.createCanvas(windowWidth, windowHeight, p.WEBGL);
        canvas.position(0, 0);
        p.smooth(); // Anti aliasing
        p.frameRate(FRAMERATE);
    }

    p.drawBackground = function () {
        p.blendMode(p.ADD);
        if (lightMode) {
            p.background(black);
            p.stroke(white);
        } else {
            p.background(white);
            p.stroke(black);
        }
    }

    p.drawDistel = function (distel) {
        p.push();
        p.scale(p.map(wFrequencyAmplitude[0], 0, 1000, 1.5, 4.5));
        p.model(distel);
        p.pop();
    }

    p.draw = function () {
        let randomRot = p.map(p.summ(1, SINES), -1, 1, 0, 360);
        p.drawBackground();
        p.angleMode(p.DEGREES);
        p.strokeWeight(1);
        p.rotateY(180);
        p.scale(0.75);
        p.rotateY(randomRot);
        p.emissiveMaterial(255, 0, 146);
        p.drawDistel(distelModel);

    }
}
class vinylSketch {
    final static color black = color(0, 0, 0);
    final static color white = color(255, 255, 255);
    final static int DISTELXINSTANCES = 1;
    final static int DISTELYINSTANCES = 1;

    preload  () {
        distelRondModel = loadModel('assets/Distel.obj', true);
        vinylModel = loadModel('assets/Vinyl_disc.obj', true);
    }

    setup  () {
        let canvas = createCanvas(windowWidth, windowHeight, WEBGL);
        canvas.position(0, 0);
        smooth(); // Anti aliasing
        frameRate(FRAMERATE);
    }

    drawBackgroundRond  () {
        blendMode(BLEND);
        if (lightMode) {
            background(black);
            stroke(white);
        } else {
            background(white);
            stroke(black);
        }
    }

    drawDistelRond  () {
        push();
        translate(0, 0, 40 * lightMode);
        rotateY(180 * lightMode);
        emissiveMaterial(255, 0, 146);
        model(distelRondModel);
        pop();
    }

    drawVinyl  () {
        push();
        rotateY(90);
        translate(20, 0, 0);
        scale(1.5);
        strokeWeight(0.5);
        emissiveMaterial(0, 255, 0);
        model(vinylModel);
        pop();
    }

    draw  () {
        drawBackgroundRond();

        // Distel properties 
        angleMode(DEGREES);
        strokeWeight(1);
        scale(3.5);
        rotateZ(millis() / -15);
        drawVinyl();
        drawDistelRond();
    }
}

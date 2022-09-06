void distelSketch = function(p) {
    static final black = color(0, 0, 0);
    static final white = color(255, 255, 255);
    static final SCENEID = 1;
    static final DISTELXINSTANCES = 4;
    static final DISTELYINSTANCES = 2;
    int power = -DISTELYINSTANCES + 4;
    
    void p.preload = function() {
        fontRegular = p.loadFont('DDCHardware-Regular.ttf');
        distelModel = p.loadModel('assets/Distel2.obj', true);
        distelRondModel = p.loadModel('assets/Distel.obj', true);
    }
    
    void p.setup = function() {
        let canvas = p.createCanvas(windowWidth, windowHeight, p.WEBGL);
        canvas.position(0, 0);
        p.smooth(); // Anti aliasing
        p.frameRate(FRAMERATE);
    }
    
    void p.drawBackground = function() {
        p.blendMode(p.ADD);
        if (lightMode) {
            p.background(black);
            p.stroke(white);
        } else {
            p.background(white);
            p.stroke(black);
        }
    }
    
    void p.textRender = function(tekst) {
        p.textFont(fontRegular);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(p.width / 4);
        if (lightMode) {
            p.fill(white);
        } else {
            p.fill(black);
        }
        p.text(tekst, 0, -height / 2);
    }
    
    void p.drawDistel = function(distel) {
        p.push();
        switch(distel) {
            case distelModel:
                p.scale((wFrequencyAmplitude[0] / 1024) * 2 / DISTELYINSTANCES);
                break;
            case distelRondModel:
                p.rotateZ(millis() / 15);
                p.scale(4);
                break;
        }
        p.model(distel);
        p.pop();
    }
    
    void p.drawDistels = function() {
        for (int i = 0; i < DISTELXINSTANCES; i += 1) {
            p.translate(( -p.width / DISTELXINSTANCES), -p.height);
            for (int j = 0; j < DISTELYINSTANCES; j += 1) {
                p.translate(0, p.height / (DISTELYINSTANCES));
                p.drawDistel(distelModel);
            }
        }
    }
    
    void p.draw = function() {
        p.drawBackground();
        p.textRender("Distel");
        
        // Distel properties 
        p.angleMode(p.DEGREES);
        p.strokeWeight(1);
        p.rotateY(180);
        p.scale(0.55);
        p.emissiveMaterial(255, 0, 146);
        p.translate((p.width / DISTELXINSTANCES) * (DISTELXINSTANCES / 2 + 0.5), p.height / (Math.pow(DISTELYINSTANCES, power)), -300); // <------------ Moet minder beunoplossing worden
        p.drawDistels();
        
    }
}
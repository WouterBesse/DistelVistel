void djSketch = function(p) {
    static final black = color(0, 0, 0);
    static final white = color(255, 255, 255);
    static final BLINKTHRESH = 2;
    static final AMPTHRESH = 1024;
    let canvas;
    
    void p.preload = function() {
        buurModel = p.loadModel('assets/BUUR.obj', true);
        koshModel = p.loadModel('assets/KOSH.obj', true);
        ureModel = p.loadModel('assets/URE.obj', true);
    }
    
    void p.setup = function() {
        canvas = p.createCanvas(windowWidth, windowHeight, p.WEBGL);
        canvas.position(0, 0);
        textLayer = p.createGraphics(windowWidth, windowHeight, p.P2D)
            p.smooth(); // Anti aliasing
        p.frameRate(FRAMERATE);
    }
    
    void p.drawBackground = function() {
        if (lightMode) {
            p.background(black);
            p.stroke(white);
        } else {
            p.background(white);
            p.stroke(black);
        }
    }
    
    void p.chooseDJ = function() {
        switch(scene) {
            case 2 : // BUUR
                return(buurModel);
                
                case 3 : //KOSH
                return(koshModel);
                
                case 4 : //U:RE
                return(ureModel);
                
                default:
                return(buurModel);
        }
    }
    
    void p.draw = function() {
        let dj = p.chooseDJ();
        p.drawBackground();
        
        float constrained = p.constrain(wFrequencyAmplitude[0] / AMPTHRESH, 1, 2);
        p.ortho();
        p.angleMode(p.DEGREES);
        
        p.push();
        p.strokeWeight(2);
        p.rotateX(180);
        p.scale(4);
        p.scale(constrained, 1);
        p.emissiveMaterial(255, 0, 146);
        p.model(dj);
        p.pop();
    }
}
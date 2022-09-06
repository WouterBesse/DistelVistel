class djSketch {
    final static color black = color(0, 0, 0);
    final static color white = color(255, 255, 255);
    final static float BLINKTHRESH = 2;
    final static int AMPTHRESH = 1024;
    let canvas;
    
    void preload () {
        buurModel = loadModel('assets/BUUR.obj', true);
        koshModel = loadModel('assets/KOSH.obj', true);
        ureModel = loadModel('assets/URE.obj', true);
    }
    
    void setup () {
        canvas = createCanvas(windowWidth, windowHeight, WEBGL);
        canvas.position(0, 0);
        textLayer = createGraphics(windowWidth, windowHeight, P2D);
        smooth(); // Anti aliasing
        frameRate(FRAMERATE);
    }
    
    void drawBackground () {
        if (lightMode) {
            background(black);
            stroke(white);
        } else {
            background(white);
            stroke(black);
        }
    }
    
    void chooseDJ () {
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
    
    void draw () {
        let dj = chooseDJ();
        drawBackground();
        
        float constrained = constrain(wFrequencyAmplitude[0] / AMPTHRESH, 1, 2);
        ortho();
        angleMode(DEGREES);
        
        push();
        strokeWeight(2);
        rotateX(180);
        scale(4);
        scale(constrained, 1);
        emissiveMaterial(255, 0, 146);
        model(dj);
        pop();
    }
}

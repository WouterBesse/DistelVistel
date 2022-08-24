let djSketch = function (p) {
    const BLINKTHRESH = 2;
    const AMPTHRESH = 208;
    const BGCOLORS = [
      p.color(255, 255, 255),
      p.color(0, 0, 0)
    ];
    const STROKECOLORS = [
      p.color(0, 0, 0),
      p.color(255, 255, 255)
    ];
    let canvas;
  
    p.preload = function () {
      buurModel = p.loadModel('assets/BUUR.obj', true);
      koshModel = p.loadModel('assets/KOSH.obj', true);
      ureModel = p.loadModel('assets/URE.obj', true);
    }
  
    p.setup = function () {
      canvas = p.createCanvas(windowWidth, windowHeight, p.WEBGL);
      canvas.position(0, 0);
      textLayer = p.createGraphics(windowWidth, windowHeight, p.P2D)
      p.smooth(); // Anti aliasing
      p.frameRate(FRAMERATE);
    }
  
    p.drawBackground = function () {
      //p.blendMode(p.ADD);
      p.background(BGCOLORS[lightMode]);
      p.stroke(STROKECOLORS[lightMode]);
    }
  
    p.chooseDJ = function () {
      switch (scene) {
        case 2: // BUUR
          return(buurModel);
  
        case 3: // KOSH
          return(koshModel);
  
        case 4: // U:RE
          return(ureModel);
        
        default:
          return(buurModel);
      }
    }
  
    p.draw = function () {
      let dj = p.chooseDJ();
  
      let blink = 0; //<--------------------------------- Kan miss beter in max worden gedaan // Ja, maar ik laat het voor nu ff in javascript
      if (wFrequencyAmplitude[0] / AMPTHRESH > BLINKTHRESH) {
        blink = 0;
      } else {
        blink = 1;
      }
  
      p.drawBackground();
  
      let constrained = p.constrain(wFrequencyAmplitude[0] / AMPTHRESH, 1, 2);
      p.ortho();
      p.angleMode(p.DEGREES);
      
      
      
      p.push();
      p.strokeWeight(2);
      p.rotateX(180);
      p.scale(4);
      p.scale(constrained, 1);
      p.emissiveMaterial(255, 0, 146);
      p.model(dj);
  
      p.erase();
      p.rect(300, -windowHeight/2, 55, windowHeight);
      
      //p.image(textLayer, -windowWidth/2, -windowHeight/2);
      p.noErase();
  
      p.pop();
      
  
      
    }
  }
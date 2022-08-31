let djSketch = function (p) {
  const black = color(0, 0, 0);
  const white = color(255, 255, 255);
  const BLINKTHRESH = 2;
  const AMPTHRESH = 400;
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
    if (lightMode) {
      p.background(black);
      p.stroke(white);
    } else {
      p.background(white);
      p.stroke(black);
    }
  }

  p.chooseDJ = function () {
    switch (scene) {
      case 2: // BUUR
        return (buurModel);

      case 3: // KOSH
        return (koshModel);

      case 4: // U:RE
        return (ureModel);

      default:
        return (buurModel);
    }
  }

  p.draw = function () {
    let dj = p.chooseDJ();
    p.drawBackground();

    let constrained = p.map(wFrequencyAmplitude[0], 0, 1000, 1, 1.6);
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
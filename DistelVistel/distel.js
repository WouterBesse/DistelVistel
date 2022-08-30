let distelSketch = function (p) {
  const black = color(0, 0, 0);
  const white = color(255, 255, 255);
  const SCENEID = 1;
  const DISTELXINSTANCES = 4;
  const DISTELYINSTANCES = 2;
  let power = -DISTELYINSTANCES + 4;

  p.preload = function () {
    fontRegular = p.loadFont('DDCHardware-Regular.ttf');
    distelModel = p.loadModel('assets/Distel2.obj', true);
    distelRondModel = p.loadModel('assets/Distel.obj', true);
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

  p.textRender = function (tekst) {
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

  p.drawDistel = function (distel) {
    p.push();
    switch (distel) {
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

  p.drawDistels = function () {
    for (var i = 0; i < DISTELXINSTANCES; i += 1) {
      p.translate((-p.width / DISTELXINSTANCES), -p.height);
      for (var j = 0; j < DISTELYINSTANCES; j += 1) {
        p.translate(0, p.height / (DISTELYINSTANCES));
        p.drawDistel(distelModel);
      }
    }
  }

  p.draw = function () {
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
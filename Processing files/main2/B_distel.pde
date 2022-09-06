class distelSketch {
  final static color black = color(0, 0, 0);
  final static color white = color(255, 255, 255);
  final static int SCENEID = 1;
  final static int DISTELXINSTANCES = 4;
  final static int DISTELYINSTANCES = 2;
  int power = -DISTELYINSTANCES + 4;

  void preload () {
    fontRegular = loadFont('DDCHardware-Regular.ttf');
    distelModel = loadModel('assets/Distel2.obj', true);
    distelRondModel = loadModel('assets/Distel.obj', true);
  }

  void setup () {
    let canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    canvas.position(0, 0);
    smooth(); // Anti aliasing
    frameRate(FRAMERATE);
  }

  void drawBackground () {
    blendMode(ADD);
    if (lightMode) {
      background(black);
      stroke(white);
    } else {
      background(white);
      stroke(black);
    }
  }

  void textRender (String tekst) {
    textFont(fontRegular);
    textAlign(CENTER, CENTER);
    textSize(width / 4);
    if (lightMode) {
      fill(white);
    } else {
      fill(black);
    }
    text(tekst, 0, -height / 2);
  }

  void drawDistel () {
    push();
    scale((wFrequencyAmplitude[0] / 1024) * 2 / DISTELYINSTANCES);
    model(distel);
    pop();
  }

  void drawDistels () {
    for (int i = 0; i < DISTELXINSTANCES; i += 1) {
      translate(( -width / DISTELXINSTANCES), -height);
      for (int j = 0; j < DISTELYINSTANCES; j += 1) {
        translate(0, height / (DISTELYINSTANCES));
        drawDistel(distelModel);
      }
    }
  }

  void draw () {
    drawBackground();
    textRender("Distel");

    // Distel properties
    angleMode(DEGREES);
    strokeWeight(1);
    rotateY(180);
    scale(0.55);
    emissiveMaterial(255, 0, 146);
    translate((width / DISTELXINSTANCES) * (DISTELXINSTANCES / 2 + 0.5), height / (Math.pow(DISTELYINSTANCES, power)), -300); // <------------ Moet minder beunoplossing worden
    drawDistels();
  }
}

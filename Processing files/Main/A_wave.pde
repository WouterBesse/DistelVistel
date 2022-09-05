class waveSketch {
  final static color LINECOLORS [] = {{color(255, 0, 0), color(0, 255, 0), color(0, 0, 255)},
    {color(255, 255, 255), color(255, 255, 255), color(255, 255, 255)}};// Set wave line colors
  float phase = 1;

  void setup() {
    let canvas = createCanvas(windowWidth, windowHeight, P2D);
    canvas.position(0, 0);
    smooth(); // Anti aliasing
    frameRate(FRAMERATE);
  }

  void drawBackground() {
    blendMode(BLEND);

    // Kiezen tussen witte of zwarte achtergrond
    switch(lightMode) {
    case 0:
      background(255, 255, 255, wBlurWhiteMode);
      blendMode(EXCLUSION);
      break;
    case 1:
      background(0, 0, 0, wBlurDarkMode);
      blendMode(SCREEN);
      break;
    }
  }

  void calcWave (float amplitude, int line, int w) {
    // De algemene formule voor de waves, in principe een sinusgolf waarvan de hoogte wordt gemoduleerd met een sinusgolf van lagere frequentie
    float h = amplitude * sin(w * 0.03 + phase * 0.07 + line * TWO_PI / 3) * pow(abs(sin(w * wFrequency + phase * 0.02)), 5);

    // Dit is een array van 3 "distortion" formules om de waves nog cooler en meer responsive te maken
    float waveTypes[] ={height / 2 + sin(wDistortionAmount * w) * wDistortionAmount * 100,
      height / 2 + sin(w * 0.0015 * TWO_PI * wDistortionAmount) * ((500 * wDistortionAmount) - 500),
      height / 2 * wDistortionAmount};
    h += waveTypes[wDistortionType];
    curveVertex(w, h);
  }

  void drawWave (int line) {
    // Deze waves krijgen elk de amplitude van een ander frequentie gebied
    float ampl = wFrequencyAmplitude[line];
    // Deze waves krijgen elk een eigen kleur uit de waveColors array
    stroke(LINECOLORS[wColorMode][line]);

    beginShape();
    for (int w = -20; w < width + 20; w += 5) { // Hier wordt horizontaal voor elke pixel berekend hoe hoog de wave daar moet zijn
      calcWave(ampl, line, w);
    }
    endShape();
  }

  void drawLines (int strokeWeight) {
    // Aantal properties voor de lines
    noFill();
    strokeWeight(strokeWeight);

    // Dit is de code om de waves horizontaal te laten scrollen
    // Dit gebeurt door een getal om hoog te tellen
    // De hoeveelheid dat hij per frame omhoog is geteld wordt omgezet naar de hoeveelheid dat hij scrollt
    float movementDelta = wMovementCounter - phase;
    phase += movementDelta * 0.05;

    // Hier maakt hij 3 waves (i < 3; i++)
    for (int i = 0; i < 3; i++) {
      drawWave(i);
    }
  }

  void draw () {

    waveVerbose();

    drawBackground();

    drawLines(20);
  }
}

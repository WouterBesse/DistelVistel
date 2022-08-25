let waveSketch = function (p) {
  const LINECOLORS = [
    [p.color(255, 0, 0),
    p.color(0, 255, 0),
    p.color(0, 0, 255)]
    ,
    [p.color(255, 255, 255),
    p.color(255, 255, 255),
    p.color(255, 255, 255)]
  ]; // Set wave line colors
  let phase = 1;

  p.setup = function () {
    let canvas = p.createCanvas(windowWidth, windowHeight, p.P2D);
    canvas.position(0, 0);
    p.smooth(); // Anti aliasing
    p.frameRate(FRAMERATE);
  }

  p.drawBackground = function () {
    p.blendMode(p.BLEND);

    // Kiezen tussen witte of zwarte achtergrond
    switch (lightMode) {
      case 0:
        p.background(255, 255, 255, wBlurWhiteMode);
        p.blendMode(p.EXCLUSION);
        break;
      case 1:
        p.background(0, 0, 0, wBlurDarkMode);
        p.blendMode(p.SCREEN);
        break;
    }
  }

  p.calcWave = function (amplitude, line, w) {
    // De algemene formule voor de waves, in principe een sinusgolf waarvan de hoogte wordt gemoduleerd met een sinusgolf van lagere frequentie
    var h = amplitude * p.sin(w * 0.03 + phase * 0.07 + line * p.TWO_PI / 3) * p.pow(p.abs(p.sin(w * wFrequency + phase * 0.02)), 5);

    // Dit is een array van 3 "distortion" formules om de waves nog cooler en meer responsive te maken
    var waveTypes = [p.height / 2 + p.sin(wDistortionAmount * w) * wDistortionAmount * 100, p.height / 2 + p.sin(w * 0.0015 * p.TWO_PI * wDistortionAmount) * ((500 * wDistortionAmount) - 500), p.height / 2 * wDistortionAmount];
    h += waveTypes[wDistortionType];
    p.curveVertex(w, h);
  }

  p.drawWave = function (line) {
    // Deze waves krijgen elk de amplitude van een ander frequentie gebied
    let ampl = wFrequencyAmplitude[line];
    // Deze waves krijgen elk een eigen kleur uit de waveColors array
    p.stroke(LINECOLORS[wColorMode][line]);

    p.beginShape();
    for (var w = -20; w < p.width + 20; w += 5) { // Hier wordt horizontaal voor elke pixel berekend hoe hoog de wave daar moet zijn
      p.calcWave(ampl, line, w);
    }
    p.endShape();
  }

  p.drawLines = function (strokeWeight) {
    // Aantal properties voor de lines
    p.noFill();
    p.strokeWeight(strokeWeight);

    // Dit is de code om de waves horizontaal te laten scrollen
    // Dit gebeurt door een getal om hoog te tellen
    // De hoeveelheid dat hij per frame omhoog is geteld wordt omgezet naar de hoeveelheid dat hij scrollt
    let movementDelta = wMovementCounter - phase;
    phase += movementDelta * 0.05;

    // Hier maakt hij 3 waves (i < 3; i++)
    for (var i = 0; i < 3; i++) {
      p.drawWave(i);
    }
  }

  p.draw = function () {

    waveVerbose();

    p.drawBackground();

    p.drawLines(20);
  }
}
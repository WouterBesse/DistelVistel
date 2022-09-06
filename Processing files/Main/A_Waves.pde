public class Waves {
    private color[][] LINECOLORS = {
    {
        color(255, 0, 0),
        color(0, 255, 0),
        color(0, 0, 255)
    }
    ,
    {
        color(255, 255, 255),
        color(255, 255, 255),
        color(255, 255, 255)
    }
    };// Set wave line colors
    private float phase;

   Waves() {
        this.phase = 1;
    }

    private void drawBackground() {
        blendMode(BLEND);
        
        // Kiezen tussen witte of zwarte achtergrond
        switch(lightMode) {
            case 1:
                background(255, 255, 255, wBlurWhiteMode);
                blendMode(EXCLUSION);
                break;
            case 0:
                background(0, 0, 0, wBlurDarkMode);
                blendMode(SCREEN);
        }
    }

    private float calcDistortion(float w) {
        switch(wDistortionType) {
            case 0:
                return sin(wDistortionAmount * w) * wDistortionAmount * 100;
            case 1:
                return sin(w * 0.0015 * TWO_PI * wDistortionAmount) * ((500 * wDistortionAmount) - 500);
            case 2:
                return wDistortionAmount;
            default:
                return wDistortionAmount;
        }
    }

    private void calcWave(float amplitude, int line, float w) {
        // De algemene formule voor de waves, in principe een sinusgolf waarvan de hoogte wordt gemoduleerd met een sinusgolf van lagere frequentie
        float h = amplitude * sin(w * 0.03 + 1 * 0.07 + line * 6.28 / 3) * pow(Math.abs(sin(w * wFrequency + 1 * 0.02)), 5);
        
        // // Bereken een van de 3 "distortion" formules om de waves nog cooler en meer responsive te maken
        h += calcDistortion(w);
        curveVertex(w, h);
    }

    private void drawWave(int line) {
        // Deze waves krijgen elk de amplitude van een ander frequentie gebied
        float ampl = wFrequencyAmplitude[line];
        // Deze waves krijgen elk een eigen kleur uit de waveColors array
        stroke(LINECOLORS[wColorMode][line]);
        
        
        beginShape();
        for (float d = 0; d < 30; d += 1) {
            for (float w = -20; w < width + 20; w += 5) { // Hier wordt horizontaal voor elke pixel berekend hoe hoog de wave daar moet zijn
                calcWave(ampl, line, w);
            }
            translate(1, 1);
        }
        endShape();
        
    }

    private void drawLines(int strokeWeight) {
        // Aantal properties voor de lines
        noFill();
        //strokeWeight(strokeWeight);
        
        // Dit is de code om de waves horizontaal te laten scrollen
        // Dit gebeurt door een getal om hoog te tellen
        // De hoeveelheid dat hij per frame omhoog is geteld wordt omgezet naar de hoeveelheid dat hij scrollt
        float movementDelta = wMovementCounter - this.phase;
        phase += movementDelta * 0.05;
        //scale(4);
        //translate(0, height);
        // Hier maakt hij 3 waves (i < 3; i++)
        for (int i = 0; i < 3; i++) {
            drawWave(i);
        }
    }

    public void draw() {
        drawBackground();
        push();
        drawLines(20);
        pop();
    }
}

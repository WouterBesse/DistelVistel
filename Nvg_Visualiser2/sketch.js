// Global Vars
const VERBOSE = false;
const FRAMERATE = 60;
let scene = 3;
let sceneChange = false;
let createdCanvas = 0;
let lightMode = 0; // Bepaalt of de achtergrond wit of zwart is
const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;

let sceneDoms;
let scenes;
let sceneAllocations = [0, 1, 2, 2, 2];

// Global Waves Vars
let wColorMode = 0; // 0 = kleur, 1 = monochroom
let wBlurWhiteMode;
let wBlurDarkMode;
let wFrequency;
let wMovementCounter = 1;
let wFrequencyAmplitude = [1, 1, 1];
let wDistortionAmount;
let wDistortionType = 0;

function preload() {
  scenes = [ // set Scenes
    new p5(waveSketch),
    new p5(distelSketch),
    new p5(djSketch)
  ];
  sceneDoms = document.getElementsByClassName("p5Canvas");
}

function setup() {
  frameRate(FRAMERATE);

  //maak een connect-object aan dat zorgt voor de communicatie met oscServer.js
  connect = new Connect();

  //maak verbinding met oscServer.js, en voor code tussen {} uit zodra deze verbinding tot stand is gekomen.
  connect.connectToServer(function() {
    //maak een nieuw server-object aan.
    server = new Server();

    //start de server en zorg dat deze gaat luisteren naar poort 7000
    server.startServer(7000);

    //als de server een bericht ontvangt voert deze de functie oscReceiver uit en geeft deze twee argumenten mee: address en msg.
    server.getMessage(function(address,msg) {
      oscReceiver(address,msg);
    });
  });
}

function waveVerbose() {
  const SCENEID = 0;

  if (VERBOSE) {
    console.group("Wave Variables");
    console.debug("wColorMode: ", wColorMode);
    console.debug("lightMode: ", lightMode);
    console.debug("wBlurDarkMode: ", wBlurDarkMode);
    console.debug("wBlurWhiteMode: ", wBlurWhiteMode);
    console.debug("wFrequencyAmplitude: ", wFrequencyAmplitude);
    console.debug("wFrequency: ", wFrequency);
    console.debug("wMovementCounter: ", wMovementCounter);
    console.debug("wDistortionAmount: ", wDistortionAmount);
    console.debug("wDistortionType: ", wDistortionType);
    console.groupEnd();
  }
}

// Ontvang de osc messages
function oscReceiver(address, msg) {
  //als de variabele address gelijk is aan /y wordt de code tussen de {} uitegevoerd
  switch (address) {
    case "/wColorMode":
      wColorMode = msg;
      break;
    case "/lightMode":
      lightMode = msg;
      break;
    case "/wBlurDarkMode":
      wBlurDarkMode = msg;
      break;
    case "/wBlurWhiteMode":
      wBlurWhiteMode = msg;
      break;
    case "/ampLo":
      wFrequencyAmplitude[0] = msg;
      break;
    case "/ampMid":
      wFrequencyAmplitude[1] = msg;
      break;
    case "/ampHi":
      wFrequencyAmplitude[2] = msg;
      break;
    case "/wFrequency":
      wFrequency = msg;
      break;
    case "/wMovementCounter":
      wMovementCounter = msg;
      break;
    case "/wDistortionAmount":
      wDistortionAmount = msg;
      break;
    case "/wDistortionType":
      wDistortionType = msg;
      break;
    case "/scene":
      scene = msg;
      sceneChange = true;
      break;
  }
}

// All sketch instances
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

let distelSketch = function (p) {
  const SCENEID = 1;
  const DISTELXINSTANCES = 4;
  const DISTELYINSTANCES = 2;
  const TEXTCOLORS = [
    p.color(0, 0, 0),
    p.color(255, 255, 255)
  ];
  const BGCOLORS = [
    p.color(255, 255, 255),
    p.color(0, 0, 0)
  ];
  const STROKECOLORS = [
    p.color(0, 0, 0),
    p.color(255, 255, 255)
  ];
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
    p.background(BGCOLORS[lightMode]);
    p.stroke(STROKECOLORS[lightMode]);
  }

  p.textRender = function (tekst) {
    p.textFont(fontRegular);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(p.width / 4);
    p.fill(TEXTCOLORS[lightMode])
    p.text(tekst, 0, 0);
  }

  p.drawDistel = function (distel) {
    p.push();
    switch (distel) {
      case distelModel:
        p.scale((wFrequencyAmplitude[0] / 192) * 2 / DISTELYINSTANCES);
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
    p.strokeWeight(2);
    p.rotateY(180);
    p.scale(0.55);
    p.emissiveMaterial(255, 0, 146);
    p.translate((p.width / DISTELXINSTANCES) * (DISTELXINSTANCES / 2 + 0.5), p.height / (Math.pow(DISTELYINSTANCES, power)), -300); // <------------ Moet minder beunoplossing worden
    p.drawDistels();

  }
}

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
    p.smooth(); // Anti aliasing
    p.frameRate(FRAMERATE);
  }

  p.playstate = function () {
    canvas.hide();
    p.noLoop();
  }

  p.drawBackground = function () {
    p.blendMode(p.ADD);
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
    p.strokeWeight(2);
    p.rotateX(180);
    p.scale(4);
    p.scale(constrained, 1);
    p.emissiveMaterial(255, 0, 146);
    p.model(dj);
  }
}

function setScene(newScene) {
  for(s = 0; s < scenes.length; s++) {
    switch (s) {
      case newScene:
        scenes[s].loop();
        break;
      default:
        scenes[s].noLoop();
        scenes[s].clear();
    }
  }
}

function draw() {
  if(sceneDoms.length >= 4) {
    setScene(sceneAllocations[scene]);
  }
}
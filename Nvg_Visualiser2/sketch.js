// Global Vars
const NUMOFSCENES = 5;
const VERBOSE = false;
const FRAMERATE = 60;
const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;

let scene = 6;
let sceneChange = false;
let createdCanvas = 0;
let lightMode; // Bepaalt of de achtergrond wit of zwart is

let wCrossType = 2;
let crossReset;

let sceneDoms;
let scenes;
let sceneAllocations = [0, 1, 2, 2, 2, 3, 4];

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
    new p5(djSketch),
    new p5(pharmacySketch),
    new p5(terrainSketch)
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
    case "/wCrossType":
      wCrossType = msg;
      break;
  }
}

// All sketch instances
// Some extra info, each one is kind of it's own p5js instance
// If you want to use any feature from p5js, put p. before it
// For example p.color(255), p.blendMode(p.ADD) etc.
// If you want to make a new function you can do that in the following way:
// p.functionName = function () {insert function};
// which you can call like this: p.functionName();
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

let pharmacySketch = function (p) {
  const CROSSAMOUNT = 2;
  const CROSSSIZE = 800/CROSSAMOUNT; // width/height of the cross in pixels
  let crossArray = [];


  p.setup = function () {
    canvas = p.createCanvas(windowWidth, windowHeight, p.P2D);
    canvas.position(0, 0);
    //textLayer = p.createGraphics(windowWidth, windowHeight, p.P2D)
    p.smooth(); // Anti aliasing
    p.frameRate(FRAMERATE);

    p.pushCrosses();
  }

  p.pushCrosses = function () {
    // Calculation to evenly distribute objects along x axis
    let totalObjectWidth = CROSSAMOUNT * CROSSSIZE;
    let screenWidth = p.width;
    let totalMarginSpace = screenWidth - totalObjectWidth;
    let amountToDisplace = totalMarginSpace/(CROSSAMOUNT+1) + CROSSSIZE;
    let xPos = -CROSSSIZE/2;

    if(VERBOSE){
      console.log("totalObjectWidth: ", totalObjectWidth);
      console.log("screenWidth: ", screenWidth);
      console.log("totalMarginSpace: ", totalMarginSpace);
      console.log("amountToDisplace: ", amountToDisplace);
    }

    for (let i = 0;i < CROSSAMOUNT;i++) {
      //met de push-functie voeg je een element toe
      //aan het eind van de array.
      //
      //Het nieuwe object dat aangemaakt is vanuit 
      //de class-omschrijving wordt in de array gezet.
      //tegelijk wordt de constructor-method uit de
      //class-omschrijving uitgevoerd.
      xPos += amountToDisplace;
      crossArray.push(new Cross(xPos, p.height/2, CROSSSIZE));
    }
  }

  p.drawCrosses = function () {
    for (let i = 0; i < crossArray.length; i++) {
      //voer de teken-method uit de class-
      //omschrijving uit.
      crossArray[i].draw();
    }
  }

  p.draw = function () {
    p.background(0);

    p.drawCrosses();
  }

  class Cross {
    //deze constructor-method wordt uitgevoerd zodra er 
    //een nieuwe object vanuit deze class-omschrijving wordt
    //gemaakt.
    constructor(xPos, yPos, size) {
        p.rectMode(p.CENTER);
        //met this.x, this.y, etc. wordt er een unieke 
        //variabele gemaakt die alleen voor het object
        //dat wordt gemaakt geldt.
        this.bigSize = size;
        this.smallSize = size/3;
        this.x = xPos;
        this.y = yPos;

        // Mask Variables
        this.maskSize = size * 2;
        this.maskLayer = createGraphics(this.maskSize, this.maskSize);
        this.xMask = xPos - this.maskSize / 2;
        this.yMask = yPos - this.maskSize / 2;

        // Line Variables
        this.lineAmount = 15;
        this.lineRotateSpeed = 0.1;
        this.lineRot = 0;

        this.lineGrowSpeed = 0.5;
        this.lineGrowWidth = 0;

        this.lineLayer = createGraphics(this.bigSize, this.bigSize);
        this.lineHeight = Math.sqrt(Math.pow(this.maskSize, 2) / 2); // Make the line height so that the diagonal is not bigger than the size of the mask
        this.lineWidth = this.lineHeight / 2 / this.lineAmount;
        this.lineX = 0 - this.lineHeight / 2;
        this.xLines = xPos - this.bigSize/2;
        this.yLines = yPos - this.bigSize/2;

        // Circle Variables
        this.circleAmount = 50;
        this.circleGrowSpeed = 3;
        this.circleMargin = size / 2 / this.circleAmount * 5;
        this.circleGrowth = this.circleAmount * this.circleMargin * -1;

        this.circleLayer = createGraphics(this.bigSize, this.bigSize);

        // Flash variables
        this.flashCounter = 0;

        this.previousCross = wCrossType;  
        this.crossReset = false;

        
        
    }
    // je kan oneindig veel methods (functies binnen
    // een object) aanmaken in je class-
    // omschrijving.
    draw() {
      this.checkReset();
      switch(wCrossType){
        case 0:
          this.makeRotateLines();
          this.crossReset = false;
          break;
        case 1:
          this.makeRotateLines();
          this.crossReset = false;
          break;
        case 2:
          this.makeGrowingLines();
          this.crossReset = false;
          break;
        case 3:
          this.makeHypnoCircles();
          this.crossReset = false;
          break;
        case 4:
          this.makeFlashes();
          this.crossReset = false;
          break;
      }
      this.makeCrossMask();
      
    }

    checkReset(){ 
      if(wCrossType != this.previousCross){
        this.crossReset = true;
      }
      this.previousCross = wCrossType;
    }

    makeCrossMask() {
      this.maskLayer.background(0);
      this.maskLayer.rectMode(p.CENTER);

      this.maskLayer.erase();
      this.maskLayer.rect(this.maskSize/2, this.maskSize/2, this.bigSize, this.smallSize);
      this.maskLayer.rect(this.maskSize/2, this.maskSize/2, this.smallSize, this.bigSize);
      this.maskLayer.noErase();

      p.image(this.maskLayer, this.xMask, this.yMask);
    }

    makeRotateLines() {
      this.lineLayer.background(0);
      this.lineLayer.rectMode(p.CENTER);
      
      this.lineLayer.push();
      this.lineLayer.fill(0, 255, 0);
      this.lineLayer.noStroke();
      this.lineLayer.translate(this.bigSize/2, this.bigSize/2);
      this.lineLayer.rotate(this.lineRot+=this.lineRotateSpeed);
      
      for (var s=0; s<this.lineAmount; s = s+1){ 
        let curX = this.lineX + s * this.lineWidth * 2 + this.lineWidth;
        this.lineLayer.rect(curX, 0, this.lineWidth, this.lineHeight);
      }
      
      this.lineLayer.pop();
      
      p.image(this.lineLayer, this.xLines, this.yLines);
    }

    makeGrowingLines() {
      this.lineLayer.background(0);
      
      this.lineLayer.push();
      this.lineLayer.fill(0, 255, 0);
      this.lineLayer.noStroke();
      this.lineLayer.translate(this.bigSize/2, 0);

      for (var s=0; s<this.lineAmount; s = s+1){ 
        let curX = this.lineX + s * this.lineWidth * 2;
        this.lineLayer.rect(curX, 0, this.lineGrowWidth, this.lineHeight);
      } 
      this.lineLayer.pop();

      this.lineGrowWidth += this.lineGrowSpeed;
      if(this.lineGrowWidth > this.lineWidth * 2 ) {
        this.lineGrowWidth = 0;
      }
      
      p.image(this.lineLayer, this.xLines, this.yLines);
    }

    makeHypnoCircles() {
      this.circleLayer.background(0);

      this.circleLayer.push();
      this.circleLayer.fill(0, 255, 0);
      this.circleLayer.noStroke();

      if(this.crossReset){
        this.circleGrowth = this.circleAmount * this.circleMargin * -1;
      } else {
        this.circleGrowth += this.circleGrowSpeed;
      }

      for (let i = this.circleAmount; i>0; i += -1) {
        let diameter =  i * this.circleMargin + this.circleGrowth;
        if(diameter > 0) {
          this.circleLayer.fill(0, 255 * (i%2), 0);
          this.circleLayer.circle(this.bigSize/2, this.bigSize/2, diameter);
        }

      }
      this.circleLayer.pop();
      p.image(this.circleLayer, this.xLines, this.yLines);
    }

    makeFlashes() {
      this.flashCounter += 1;
      p.push();
      if(this.flashCounter % 10 < 5) {
        p.fill(0);
      } else {
        p.fill(0, 255, 0);
      }
      //p.rectMode(p.CENTER);
      p.rect(this.x, this.y, this.bigSize, this.bigSize);
      p.pop();
    }
  }

}

let terrainSketch = function (p) {
  var cols, rows;
  var scl = 30;
  var w = windowWidth;
  var h = windowHeight;

  var flying = 0;

  var terrain = [];

  p.setup = function () {
    let canvas = p.createCanvas(windowWidth, windowHeight, p.WEBGL);
    canvas.position(0, 0);
    p.smooth(); // Anti aliasing
    p.frameRate(FRAMERATE);
    cols = w / scl;
    rows = h / scl;
    for (var x = 0; x < cols; x++) {
      terrain[x] = [];
      for (var y = 0; y < rows; y++) {
        terrain[x][y] = 0; //specify a default value for now
      }
    }
  }

  p.drawBackground = function () {
    p.blendMode(p.BLEND);

    // Kiezen tussen witte of zwarte achtergrond
    switch (lightMode) {
      case 0:
        p.background(255, 255, 255, wBlurWhiteMode);
        p.blendMode(p.EXCLUSION);
        p.stroke(0,0,0);
        break;
      case 1:
        p.background(0, 0, 0, wBlurDarkMode);
        p.blendMode(p.SCREEN);
        p.stroke(255,255,255);
        break;
    }
  }

  p.draw = function(){
    p.background(0,0,0);
    p.stroke(255,255,255);
    flying -= 0.2;
    var yoff = flying;
    for (var y = 0; y < rows; y++) {
      var xoff = 0;
      for (var x = 0; x < cols; x++) {
        terrain[x][y] = p.map(p.noise(xoff, yoff), 0, 1, -100, 100);
        xoff += 0.2;
      }
      yoff += 0.2;
    }

    p.translate(0, 50);
    p.rotateX(PI / 3);
    p.fill(0, 0, 0);
    p.translate(-w / 2, -h / 2);
    for (var y = 0; y < rows - 1; y++) {
      p.beginShape(TRIANGLE_STRIP);
      for (var x = 0; x < cols; x++) {
        p.vertex(x * scl, y * scl, terrain[x][y]);
        p.vertex(x * scl, (y + 1) * scl, terrain[x][y + 1]);
      }
      p.endShape();
    }
  }

}

// Draw scenes
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
  //console.log(sceneDoms.length);
  if(sceneDoms.length >= NUMOFSCENES+1) {
    setScene(sceneAllocations[scene]);
  } else {
    sceneDoms = document.getElementsByClassName("p5Canvas");
  }
}
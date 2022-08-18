// Global Vars
const VERBOSE = false;
let scene;
let scenechange = 0;
let createdCanvas = 0;
let lightMode; // Bepaalt of de achtergrond wit of zwart is

// Functie om asset bestanden van tevoren in te laden
function preload() {
  fontRegular = loadFont('DDCHardware-Regular.ttf'); 
  distelModel = loadModel('assets/Distel2.obj', true);
  buurModel = loadModel('assets/BUUR.obj', true);
  koshModel = loadModel('assets/KOSH.obj', true);
  ureModel = loadModel('assets/URE.obj', true);
  //distelRondModel = loadModel('assets/Distel.obj', true); // <------------------------ Breaks it all :(
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Preset voor de kleuren van de lijnen bij kleur mode en monochroom mode
  wColors = [
    [color(255, 0, 0),
    color(0, 255, 0),
    color(0, 0, 255)]
    ,
    [color(255, 255, 255),
    color(255, 255, 255),
    color(255, 255, 255)]
  ]

  smooth(); // Anti aliasing

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
  if(VERBOSE){
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
function oscReceiver(address,msg) {
  //als de variabele address gelijk is aan /y wordt de code tussen de {} uitegevoerd
  switch(address){
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
      scenechange = 1;
      break;
  }
}

// Waves Vars
let wColors = [[],[],[]];
let wColorMode = 0; // 0 = kleur, 1 = monochroom
let wBlurWhiteMode;
let wBlurDarkMode;
let wFrequency;
let wPhase = 1;
let wMovementCounter = 1;
let wFrequencyAmplitude = [1,1,1];
let wDistortionAmount;
let wDistortionType = 0;

// Creëert een nieuwe canvas voor de scène indien nodig
function uniqueCanvasCreator(id, engine) {
  if(createdCanvas != id){
    createCanvas(windowWidth, windowHeight, engine);
    createdCanvas = id;
  }
}

// Functie voor het renderen van dewaves
function waveRender() {
  waveVerbose();
  uniqueCanvasCreator(1, P2D);
  blendMode(BLEND);

  // Kiezen tussen witte of zwarte achtergrond
  switch(lightMode){
    case 0:
      background(255, 255, 255, wBlurWhiteMode);
      blendMode(EXCLUSION);
      break;
    case 1:
      background(0, 0, 0, wBlurDarkMode);
      blendMode(SCREEN);
      break;
  }

  // Aantal properties voor de lines
  noFill();
  strokeWeight(20);

  // Dit is de code om de waves horizontaal te laten scrollen
  // Dit gebeurt door een getal om hoog te tellen
  // De hoeveelheid dat hij per frame omhoog is geteld wordt omgezet naar de hoeveelheid dat hij scrollt
  let movementDelta = wMovementCounter - wPhase;
  wPhase += movementDelta * 0.05;

  // Hier maakt hij 3 waves (i < 3; i++)
  for(var i = 0; i < 3; i++) {
    // Deze waves krijgen elk de amplitude van een ander frequentie gebied
    let ampl = wFrequencyAmplitude[i];
    // Deze waves krijgen elk een eigen kleur uit de waveColors array
    stroke(wColors[wColorMode][i]);

    beginShape();

    // Hier wordt horizontaal voor elke pixel berekend hoe hoog de wave daar moet zijn
    for(var w = -20; w < width + 20; w += 5) {
      // De algemene formule voor de waves, in principe een sinusgolf waarvan de hoogte wordt gemoduleerd met een sinusgolf van lagere frequentie
      var h = ampl * sin(w * 0.03 + wPhase * 0.07 + i * TWO_PI / 3) * pow(abs(sin(w * wFrequency + wPhase * 0.02)), 5);

      // Dit is een array van 3 "distortion" formules om de waves nog cooler en meer responsive te maken
      var waveTypes = [height / 2 + sin(wDistortionAmount * w)*wDistortionAmount*100, height / 2 + sin(w * 0.0015 * TWO_PI * wDistortionAmount)*((500*wDistortionAmount)-500), height / 2 * wDistortionAmount];
      h += waveTypes[wDistortionType];
      curveVertex(w, h);
    }
    endShape();
  }
}

// Tekent de achtergrond
function drawBackground(){
  uniqueCanvasCreator(2, WEBGL);
  blendMode(ADD);

  // Kiezen tussen witte of zwarte achtergrond
  switch(lightMode){
    case 0:
      background(255, 255, 255, 255);
      stroke(0, 0, 0);
      break;
    case 1:
      background(0, 0, 0, 255);
      stroke(255, 255, 255);
      break;
  }
}

function distelRender(distel, DISTELXINSTANCES, DISTELYINSTANCES){
  // Distel properties 
  angleMode(DEGREES); 
  strokeWeight(2);
  rotateY(180);
  scale(0.55); 
  emissiveMaterial(255,0,146);
  let power = -DISTELYINSTANCES+4;
  translate((width/DISTELXINSTANCES)*(DISTELXINSTANCES/2+0.5), height/(Math.pow(DISTELYINSTANCES, power)), -300); // <------------ Moet minder beunoplossing worden
  
  for(var i = 0; i < DISTELXINSTANCES; i += 1){
    translate((-width/DISTELXINSTANCES), -height);
    for(var j = 0; j < DISTELYINSTANCES; j += 1){ 
      translate(0, height/(DISTELYINSTANCES));
      push();
      switch(distel){
        case distelModel:
          scale((wFrequencyAmplitude[0]/192)*2/DISTELYINSTANCES);
          break;
        case distelRondModel:
          rotateZ(millis() / 15);
          scale(4);
          break;
      }
      model(distel);
      pop();
    }
  }
}

//Render een aangegeven tekst op het scherm
function textRender(tekst){
  textFont(fontRegular);
  textAlign(CENTER,CENTER);
  textSize(width/4);
  switch(lightMode){
    case 0:
      fill(0, 0, 0);
      break;
    case 1:
      fill(255, 255, 255);
      break;

  }
  text(tekst, 0, 0);
}

//Render de naam van de aangegeven DJ op het scherm
function djRender(dj){
  const blinkThresh = 2;
  const ampThresh = 208;
  uniqueCanvasCreator(2, WEBGL);
  blendMode(ADD);

  let blink = 0; //<--------------------------------- Kan miss beter in max worden gedaan
  if(wFrequencyAmplitude[0]/ampThresh > blinkThresh){
    blink = 0;
  } else {
    blink = 1;
  }

  switch(blink){
    case 0:
      background(255, 255, 255, 255);
      stroke(0, 0, 0);
      break;
    case 1:
      background(0, 0, 0, 255);
      stroke(255, 255, 255);
      break;
  }

  let constrained = constrain(wFrequencyAmplitude[0]/ampThresh, 1 , 2);
  ortho();
  angleMode(DEGREES); 
  strokeWeight(2);
  rotateX(180);
  scale(4);
  scale(constrained, 1);
  emissiveMaterial(255,0,146);
  model(dj);
}

// De functie waarin de frame getekend wordt
function draw() {
  switch(scene) {
    case 0: // Waves
      if(scenechange){
        uniqueCanvasCreator(1, P2D);
        scenechange = 0;
      }
      waveRender();
      break;

    case 1: // Distel
      if(scenechange){
        uniqueCanvasCreator(2, WEBGL);
        scenechange = 0;
      }
      drawBackground();
      textRender("Distel");
      distelRender(distelModel, 4, 2);
      break;

    case 2: // BUUR
      if(scenechange){
        uniqueCanvasCreator(2, WEBGL);
        scenechange = 0;
      }
      djRender(buurModel);
      break; 

    case 3: // KOSH
      if(scenechange){
        uniqueCanvasCreator(2, WEBGL);
        scenechange = 0;
      }
      djRender(koshModel);
      break;

    case 4: // U:RE
      if(scenechange){
        uniqueCanvasCreator(2, WEBGL);
        scenechange = 0;
      }
      djRender(ureModel);
      break; 

    case 5: // Distel rond <-------------------- Problematisch idk wrm
      if(scenechange){
        uniqueCanvasCreator(2, WEBGL);
        scenechange = 0;
      }
      drawBackground();
      distelRender(distelRondModel, 1, 1);
      break; 

  }

}
import processing.net.*;
import processing.serial.*;

// Global Vars
static final int NUMOFSCENES = 8;
static final boolean VERBOSE = false;
static final int FRAMERATE = 60;
static final int windowWidth = window.innerWidth;
static final int windowHeight = window.innerHeight;

int scene = 9;
boolean sceneChange = false;
int createdCanvas = 0;
boolean lightMode = 1; // Bepaalt of de achtergrond wit of zwart is

let sceneDoms;
let scenes[];
int sceneAllocations = [0, 1, 2, 2, 2, 3, 4, 5, 6, 7];

// Global Waves Vars
boolean wColorMode = 0; // 0 = kleur, 1 = monochroom
let wBlurWhiteMode;
let wBlurDarkMode;
let wFrequency;
let wMovementCounter = 1;
float wFrequencyAmplitude = [1, 1, 1];
float wDistortionAmount;
int wDistortionType = 0;
int wCrossType = 7;
int wShapeType = 0;
boolean wMaterial = 0;
float wTemp = 0;

void function preload() {
  scenes = [ // set Scenes
    new processing(waveSketch),
    new processing(distelSketch),
    new processing(djSketch),
    new processing(pharmacySketch),
    new processing(terrainSketch),
    new processing(vinylSketch),
    new processing(shapeSketch),
    new processing(ASCIISketch)
  ];
  sceneDoms = document.getElementsByClassName("p5Canvas");
}

void function setup() {
  frameRate(FRAMERATE);

  //maak een connect-object aan dat zorgt voor de communicatie met oscServer.js
  connect = new Connect();

  //maak verbinding met oscServer.js, en voor code tussen {} uit zodra deze verbinding tot stand is gekomen.
  connect.connectToServer(function () {
    //maak een nieuw server-object aan.
    server = new Server();

    //start de server en zorg dat deze gaat luisteren naar poort 7000
    server.startServer(7000);

    //als de server een bericht ontvangt voert deze de functie oscReceiver uit en geeft deze twee argumenten mee: address en msg.
    server.getMessage(function (address, msg) {
      oscReceiver(address, msg);
    });
  });
}

void function waveVerbose() {
  static final SCENEID = 0;
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
void function oscReceiver(address, msg) {
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
    case "/wShapeType":
      wShapeType = msg;
      break;
    case "/wMaterial":
      wMaterial = msg;
      break;
    case "/wTemp":
      wTemp = msg;
      break;
    case "/crossRecursionX":
      crossRecursionX = msg;
      break;
  }
}

// Draw scenes
void function setScene(newScene) {
  for (s = 0; s < scenes.length; s++) {
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

void function draw() {
  //console.log(sceneDoms.length);
  if (sceneDoms.length >= NUMOFSCENES + 1) {
    setScene(sceneAllocations[scene]);
  } else {
    sceneDoms = document.getElementsByClassName("p5Canvas");
  }
}

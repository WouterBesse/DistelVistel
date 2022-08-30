// Global Vars
const NUMOFSCENES = 7;
const VERBOSE = false;
const FRAMERATE = 60;
const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;

let scene = 5;
let sceneChange = false;
let createdCanvas = 0;
let lightMode = 1; // Bepaalt of de achtergrond wit of zwart is

let sceneDoms;
let scenes;
let sceneAllocations = [0, 1, 2, 2, 2, 3, 4, 5, 6];

// Global Waves Vars
let wColorMode = 0; // 0 = kleur, 1 = monochroom
let wBlurWhiteMode;
let wBlurDarkMode;
let wFrequency;
let wMovementCounter = 1;
let wFrequencyAmplitude = [1, 1, 1];
let wDistortionAmount;
let wDistortionType = 0;
let wCrossType = 4;
let wShapeType = 0;
let wMaterial = 0;
let wTemp = 0;

function preload() {
  scenes = [ // set Scenes
    new p5(waveSketch),
    new p5(distelSketch),
    new p5(djSketch),
    new p5(pharmacySketch),
    new p5(terrainSketch),
    new p5(vinylSketch),
    new p5(shapeSketch)
  ];
  sceneDoms = document.getElementsByClassName("p5Canvas");
}

function setup() {
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
function setScene(newScene) {
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

function draw() {
  //console.log(sceneDoms.length);
  if (sceneDoms.length >= NUMOFSCENES + 1) {
    setScene(sceneAllocations[scene]);
  } else {
    sceneDoms = document.getElementsByClassName("p5Canvas");
  }
}
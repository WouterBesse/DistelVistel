import processing.net.*;
import processing.serial.*;
import oscP5.*;
import netP5.*;

// Global Vars
static final int NUMOFSCENES = 8;
static final boolean VERBOSE = false;
static final int FRAMERATE = 60;
static final int windowWidth = 50;
static final int windowHeight = 50;

int scene = 9;
boolean sceneChange = false;
int createdCanvas = 0;
boolean lightMode = true; // Bepaalt of de achtergrond wit of zwart is

// Scenes
Waves waveScene = new Waves();

// OSC Vars
OscP5 oscP5;
NetAddress myRemoteLocation;



//let sceneDoms;
//let scenes[];
//int sceneAllocations = [0, 1, 2, 2, 2, 3, 4, 5, 6, 7];

// Global Waves Vars
boolean wColorMode = true; // 0 = kleur, 1 = monochroom
int wBlurWhiteMode;
int wBlurDarkMode;
float wFrequency;
int wMovementCounter = 1;
float[] wFrequencyAmplitude = {1, 1, 1};
float wDistortionAmount;
int wDistortionType = 0;
int wCrossType = 7;
int wShapeType = 0;
boolean wMaterial = true;
float wTemp = 0;

//void function preload() {
//  scenes = [ // set Scenes
//    new processing(waveSketch),
//    new processing(distelSketch),
//    new processing(djSketch),
//    new processing(pharmacySketch),
//    new processing(terrainSketch),
//    new processing(vinylSketch),
//    new processing(shapeSketch),
//    new processing(ASCIISketch)
//  ];
//  sceneDoms = document.getElementsByClassName("p5Canvas");
//}

void setup() {
  size(50, 50);
  frameRate(FRAMERATE);
  
  
  oscP5 = new OscP5(this,7000);
  myRemoteLocation = new NetAddress("127.0.0.1",7000);
  
}

// Ontvang de osc messages
void draw() {
  //console.log(sceneDoms.length);
  //if (sceneDoms.length >= NUMOFSCENES + 1) {
  //  setScene(sceneAllocations[scene]);
  //} else {
  //  sceneDoms = document.getElementsByClassName("p5Canvas");
  //}

  waveScene.draw();
  
  background(0);
}

// Turn osc int 1 to true and 0 to false
boolean intToBool(int maxInt) {
  switch(maxInt) {
    case 0:
      return false;
    case 1:
      return true;
    default:
      print("intToBool() error: input is not 1 or 0");
      return false;
  }
}

void oscEvent(OscMessage msg) {
  if (msg.checkAddrPattern("/wColorMode")==true) {
    wColorMode = intToBool(msg.get(0).intValue());
  }
  else if (msg.checkAddrPattern("/lightMode")==true) {
    lightMode = intToBool(msg.get(0).intValue());
  }
  else if (msg.checkAddrPattern("/wBlurDarkMode")==true) {
    wBlurDarkMode = msg.get(0).intValue();
  }
  else if (msg.checkAddrPattern("/wBlurWhiteMode")==true) {
    wBlurWhiteMode = msg.get(0).intValue();
  }
  else if (msg.checkAddrPattern("/ampLo")==true) {
    wFrequencyAmplitude[0] = msg.get(0).floatValue();
  }
  else if (msg.checkAddrPattern("/ampMid")==true) {
    wFrequencyAmplitude[1] = msg.get(0).floatValue();
  }
  else if (msg.checkAddrPattern("/ampHi")==true) {
    wFrequencyAmplitude[2] = msg.get(0).floatValue();
  }
  else if (msg.checkAddrPattern("/wFrequency")==true) {
    wFrequency = msg.get(0).floatValue();
  }
  else if (msg.checkAddrPattern("/wMovementCounter")==true) {
    wMovementCounter = msg.get(0).intValue();
  }
  else if (msg.checkAddrPattern("/wDistortionAmount")==true) {
    wDistortionAmount = msg.get(0).floatValue();
  }
  else if (msg.checkAddrPattern("/wDistortionType")==true) {
    wDistortionType = msg.get(0).intValue();
  }
  else if (msg.checkAddrPattern("/scene")==true) {
    scene = msg.get(0).intValue();
  }
  else if (msg.checkAddrPattern("/wCrossType")==true) {
    wCrossType = msg.get(0).intValue();
  }
  else if (msg.checkAddrPattern("/wShapeType")==true) {
    wShapeType = msg.get(0).intValue();
  }
  else if (msg.checkAddrPattern("/wMaterial")==true) {
    wMaterial = intToBool(msg.get(0).intValue());
  }
  else if (msg.checkAddrPattern("/wTemp")==true) {
    wTemp = msg.get(0).floatValue();
  }
  // else if (msg.checkAddrPattern("/crossRecursionX")==true) {
  //   wTemp = msg.get(0).floatValue();
  // }
}

// Draw scenes
//void function setScene(newScene) {
//  for (s = 0; s < scenes.length; s++) {
//    switch (s) {
//      case newScene:
//        scenes[s].loop();
//        break;
//      default:
//        scenes[s].noLoop();
//        scenes[s].clear();
//    }
//  }
//}

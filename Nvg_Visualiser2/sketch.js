// Global Vars
let scene = 1;
let createdCanvas = 0;

// Waves Vars
var colors;
var zw;
var monoc;
let blurw;
let blurz;
var ampl;
var freq;
var count = 1;
var tel = 1;
var ampl = 1;
var vol = [1,1,1];
var rndm;
var wilk;
var vert;
var scenetype;

// Distel Vars
let distel;

function preload() {
  fontRegular = loadFont('LilitaOne-Regular.ttf');
  distel = loadModel('assets/Distel2.obj', true);
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  colors = [
    color(255, 0, 0),
    color(0, 255, 0),
    color(0, 0, 255)
  ];

  type = 1;
  monoc = 0;
  smooth();

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

function waveRender() {
  if(createdCanvas != 1){
    createCanvas(windowWidth, windowHeight);
    createdCanvas = 1;
  }
  blendMode(BLEND);
    if(monoc == 0) {
      colors = [
        color(255, 0, 0),
        color(0, 255, 0),
        color(0, 0, 255)
      ];
    } else {
      colors = [
        color(255, 255, 255),
        color(255, 255, 255),
        color(255, 255, 255)
      ];
    }

    if(zw == 0) {
      console.log("Blurw", blurw);
      background(255, 255, 255, blurw);
      blendMode(EXCLUSION);
    } else {
      console.log("Blurz", blurz);
      background(0, 0, 0, blurz);
      blendMode(SCREEN);
    }

    noFill();
    strokeWeight(20);



    let target = tel;
    let delta = target - count;
    count += delta * 0.05;

    

    rndm = random(-wilk + 2, wilk);
    print(rndm);

    for(var i = 0; i < 3; i++) {
      let ampl = vol[i];
      //let ampd = amptarg - ampl;
      //ampl += ampd * 0.05;

      stroke(colors[i]);
      // print(frameCount);
      beginShape();
      for(var w = -20; w < width + 20; w += 5) {
        var wavtypes = [height / 2 + sin(wilk * w)*wilk*100, height / 2 + sin(w * 0.0015 * TWO_PI * wilk)*((500*wilk)-500), height / 2 * wilk];
        var h = wavtypes[scenetype];
        h += ampl * sin(w * 0.03 + count * 0.07 + i * TWO_PI / 3) * pow(abs(sin(w * freq + count * 0.02)), 5);

        curveVertex(w, h);
      }
      endShape();
  }
}

function distelRender() {
  blendMode(SCREEN);
  if(createdCanvas != 2){
    createCanvas(windowWidth, windowHeight, WEBGL);
    createdCanvas = 2;
  }
  blendMode(BLEND);
  if(zw == 0) {
    //console.log("Blurw", blurw);
    background(255, 255, 255, 255);
    stroke(0, 0, 0);
  } else {
    //console.log("Blurz", blurz);
    background(0, 0, 0, 255);
    stroke(255, 255, 255);

  }
  
  let Xinstances = 4;
  let Yinstances = 2;
  angleMode(DEGREES); 
  strokeWeight(2);
  rotateY(180);
  scale(0.75);
  emissiveMaterial(255,0,146);
  translate((width/Xinstances)*2.5, height/(2*Yinstances));
  
  for(var i = 0; i < Xinstances; i += 1){
    translate((-width/Xinstances), -2*height/(Yinstances));
    for(var j = 0; j < Yinstances; j += 1){ 
      //push();
      translate(0,height/(Yinstances));
      push();
      rotateY((wilk - 1) * 512);
      scale(vol[0]/256);
      model(distel);
      pop();
      //translate(0,-height/(2*Yinstances));
    }
  }
}

function draw() {
  switch(scene) {
    case 0:
      waveRender();
      break;
    case 1:
      distelRender();
      break;
  }

}

function oscReceiver(address,msg) {
  //als de variabele address gelijk is aan /y wordt de code tussen de {} uitegevoerd
  if (address === "/monoch") {
    monoch = msg;
    monoc = monoch;
  }
  if (address === "/bw") {
    bw = msg;
    zw = bw;
    
  }
  if (address === "/blurb"){
    blurb = msg;
    blurz = blurb;
  }
  if (address === "/blurwh") {
    blurwh = msg;
    blurw = blurwh;
  }
  if (address === "/ampLo") {
    amp = msg;
    vol[0] = amp;
  }
  if (address === "/ampMid") {
    amp = msg;
    vol[1] = amp;
  }
  if (address === "/ampHi") {
    amp = msg;
    vol[2] = amp;
  }
  if (address === "/freqy") {
    freqy = msg;
    freq = freqy;
  }
  if (address === "/graaftel") {
    graaftel = msg;
    tel = graaftel;
  }
  if (address === "/willek") {
    willek = msg;
    wilk = willek;
  }
  if (address === "/wavtype") {
    st = msg;
    scenetype = st;
  }
}

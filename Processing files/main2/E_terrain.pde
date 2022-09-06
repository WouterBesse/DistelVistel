class terrainSketch  {
  final static int cols, rows;
  final static int scl = 50;
  float w = 1.8 * windowWidth;
  float h = 1.2 * windowHeight;
  float flying = 0;
  float terrain []= {};

  void setup  () {
    let canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    canvas.position(0, 0);
    smooth(); // Anti aliasing
    frameRate(FRAMERATE);
    cols = w / scl;
    rows = h / scl;
    for (int x = 0; x < cols; x++) {
      terrain [x] = 0;
      for (int y = 0; y < rows; y++) {
        terrain[x][y] = 0; //specify a default value for now
      }
    }
  }

  void drawBackground  () {
    blendMode(BLEND);

    // Kiezen tussen witte of zwarte achtergrond
    switch (lightMode) {
      case 0:
        background(255, 255, 255, wBlurWhiteMode);
        blendMode(EXCLUSION);
        stroke(0, 0, 0);
        break;
      case 1:
        background(0, 0, 0, wBlurDarkMode);
        blendMode(SCREEN);
        stroke(255, 255, 255);
        break;
    }
  }

  draw  () {
    push();
    background(0, 0, 0);
    stroke(255, 255, 255);
    rotateX(PI / 3);
    fill(0, 0, 0);
    translate(-w / 2, -h / 2);

    flying -= 0.1;
    amplitude = map(wFrequencyAmplitude[0] / 3, 0, 1, -1, 1);
    var yoff = flying;

    // if (!lightMode) {
    //   let rot = 0;
    //   for (var i = 0; i < HALF_PI; i += 0.01) {
    //     rot += i;
    //     rotateY(rot);

    //   }
    //   rot = 0;
    // }

    for (var y = 0; y < rows; y++) {
      var xoff = map(wFrequencyAmplitude[1], 0, 1, -0.01, 0.01);
      for (var x = 0; x < cols; x++) {
        terrain[x][y] = map(noise(xoff, yoff), 0, 1, -amplitude, amplitude);
        xoff += 0.2;
      }
      yoff += 0.2;
    }

    for (var y = 0; y < rows - 1; y++) {
      beginShape(TRIANGLE_STRIP);
      for (var x = 0; x < cols; x++) {
        vertex(x * scl, y * scl, terrain[x][y]);
        vertex(x * scl, (y + 1) * scl, terrain[x][y + 1]);
      }
      endShape();
    }
    pop();


    /*********************************************************************** */
    /*************  UNCOMMENT BELOW TO TRY ADDING GLITCH AGAIN ************* */
    /*********************************************************************** */

    // loadPixels();

    // // Update to the graphics buffer
    // updatePixelsGL(p);

    // // draw to 2d buffer
    // image(p, 0, 0);
    // }

    // function updatePixelsGL(buf){

    // // New empty image
    // const img = new p5.Image(buf.width, buf.height);

    // // Load like normal
    // img.loadPixels();

    // // Seems silly that you have to loop the pixels to copy them but I couldn't figure out another way
    // for(let i =0; i<buf.pixels.length; i++){
    //     img.pixels[i] = buf.pixels[i];
    // }

    // if(frameCount % 60 === 0){
    //     pixels.slice(0, 50) = random(255);
    // }

    // // Update the pixels
    // img.updatePixels();

    // // write the data to the screen
    // buf.image(img, -buf.width/2, -buf.height/2);
  }
}

let terrainSketch = function (p) {
    var cols, rows;
    var scl = 50;
    var w = 2*windowWidth;
    var h = 2*windowHeight;
  
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
        ampl = wFrequencyAmplitude[0];
        p.background(0,0,0);
        p.stroke(255,255,255);
        flying -= 0.1;
        amplitude = p.map(ampl, 0, 1, -1, 0.8);
        var yoff = flying;
        for (var y = 0; y < rows; y++) {
            var xoff = p.map(wFrequencyAmplitude[1], 0, 1, -0.01, 0.01);
            for (var x = 0; x < cols; x++) {
            terrain[x][y] = p.map(p.noise(xoff, yoff), 0, 1, -amplitude, amplitude);
            xoff += 0.2;
            }
            yoff += 0.2;
        }
    
        //p.translate(0, 50);
        if(!lightMode){
            let rot = 0;
            for(var i = 0; i<HALF_PI; i+=0.01){
                rot += i;
                p.rotateY(rot);

            }
            rot = 0;
        }
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

        /*********************************************************************** */
        /*************  UNCOMMENT BELOW TO TRY ADDING GLITCH AGAIN ************* */
        /*********************************************************************** */

        // p.loadPixels();
        
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
        //     p.pixels.slice(0, 50) = random(255);
        // }
        
        // // Update the pixels
        // img.updatePixels();
        
        // // write the data to the screen
        // buf.image(img, -buf.width/2, -buf.height/2);
    }
}
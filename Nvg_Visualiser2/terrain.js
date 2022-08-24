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
let pharmacySketch = function (p) {
  const CROSSAMOUNT = 1;
  const CROSSSIZE = 800 / CROSSAMOUNT; // width/height of the cross in pixels
  let crossArray = [];
  let fontRegular;
  let snakeModel;

  p.preload = function () {
    fontRegular = p.loadFont('DDCHardware-Regular.ttf');
    snakeModel = p.loadModel('assets/Spiraal.obj', true);
  }

  p.setup = function () {
    canvas = p.createCanvas(windowWidth, windowHeight, p.P2D);
    canvas.position(0, 0);

    p.smooth(); // Anti aliasing
    p.frameRate(FRAMERATE);
    p.pushCrosses();
    p.textFont(fontRegular);
  }

  p.pushCrosses = function () {
    // Calculation to evenly distribute objects along x axis
    let totalObjectWidth = CROSSAMOUNT * CROSSSIZE;
    let screenWidth = p.width;
    let totalMarginSpace = screenWidth - totalObjectWidth;
    let amountToDisplace = totalMarginSpace / (CROSSAMOUNT + 1) + CROSSSIZE;
    let xPos = -CROSSSIZE / 2;

    if (VERBOSE) {
      console.log("totalObjectWidth: ", totalObjectWidth);
      console.log("screenWidth: ", screenWidth);
      console.log("totalMarginSpace: ", totalMarginSpace);
      console.log("amountToDisplace: ", amountToDisplace);
    }

    for (let i = 0; i < CROSSAMOUNT; i++) {
      xPos += amountToDisplace;
      crossArray.push(new Cross(xPos, p.height / 2, CROSSSIZE));
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

      // Global variables
      this.bigSize = size;
      this.smallSize = size / 3;
      this.x = xPos;
      this.y = yPos;

      // Switching variables
      this.previousCross = wCrossType;
      this.crossReset = false;

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
      this.xLines = xPos - this.bigSize / 2;
      this.yLines = yPos - this.bigSize / 2;

      // Circle Variables
      this.circleAmount = 50;
      this.circleGrowSpeed = 3;
      this.circleMargin = size / 2 / this.circleAmount * 5;
      this.circleGrowth = this.circleAmount * this.circleMargin * -1;

      this.circleLayer = createGraphics(this.bigSize, this.bigSize);

      // Flash variables
      this.counter = 0;

      // Temperature variables
      p.textSize(this.bigSize / 5);
      this.rawTemp = 0;
      this.celsius = 0.0;
      
      // The matrix variables

      // Recursieve Kruiskes
      this.recursiveLayer = createGraphics(this.maskSize, this.maskSize);
      this.recursiveAmount = 1
      this.crossOutlines = [];
      this.crossOutlineWidth = size/100*3;
      this.crossOutlines.push(new crossOutline(this.x, this.y, this.bigSize, this.smallSize, this.crossOutlineWidth));
      

      // Snake variables
      this.snakeLayer = createGraphics(this.maskSize, this.maskSize, p.WEBGL);
      
      this.snakeLayer.smooth();

      // Farmacia Variables
      this.farmLayer = createGraphics(this.bigSize, this.bigSize);
      this.xSpeed = 5
      this.xStart = 0;
      p.textAlign(CENTER, CENTER);
      this.farmLayer.textSize(this.bigSize /5);
      this.scrollSize = this.bigSize * 2;
      this.textSize = this.bigSize/5;
      this.farmLayer.textFont(fontRegular);
    }

    draw() {
      this.checkReset();
      switch (wCrossType) {
        case 0:
          this.makeFlashes();
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
          this.makeTemperature();
          this.crossReset = false;
          break;
        case 5:
          this.makeRecursion();
          this.crossReset = false;
          break;
        case 6:
          this.makeSnakes();
          this.crossReset = false;
          break;
        case 7:
          this.makeFarmacia();
          this.crossReset = false;
          break;
      }
      this.makeCrossMask();

    }

    checkReset() {
      if (wCrossType != this.previousCross) {
        this.crossReset = true;
      }
      this.previousCross = wCrossType;
    }

    makeCrossMask() {
      this.maskLayer.background(0);
      this.maskLayer.rectMode(p.CENTER);

      this.maskLayer.erase();
      this.maskLayer.rect(this.maskSize / 2, this.maskSize / 2, this.bigSize, this.smallSize);
      this.maskLayer.rect(this.maskSize / 2, this.maskSize / 2, this.smallSize, this.bigSize);
      this.maskLayer.noErase();

      p.image(this.maskLayer, this.xMask, this.yMask);
    }

    makeRotateLines() {
      this.lineLayer.background(0);
      this.lineLayer.rectMode(p.CENTER);

      this.lineLayer.push();
      this.lineLayer.fill(0, 255, 0);
      this.lineLayer.noStroke();
      this.lineLayer.translate(this.bigSize / 2, this.bigSize / 2);
      this.lineLayer.rotate(this.lineRot += this.lineRotateSpeed);

      for (var s = 0; s < this.lineAmount; s = s + 1) {
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
      this.lineLayer.translate(this.bigSize / 2, 0);

      for (var s = 0; s < this.lineAmount; s = s + 1) {
        let curX = this.lineX + s * this.lineWidth * 2;
        this.lineLayer.rect(curX, 0, this.lineGrowWidth, this.lineHeight);
      }
      this.lineLayer.pop();

      this.lineGrowWidth += this.lineGrowSpeed;
      if (this.lineGrowWidth > this.lineWidth * 2) {
        this.lineGrowWidth = 0;
      }

      p.image(this.lineLayer, this.xLines, this.yLines);
    }

    resetCircle() {
      if (this.crossReset) {
        this.circleGrowth = this.circleAmount * this.circleMargin * -1;
      } else {
        this.circleGrowth += this.circleGrowSpeed;
      }
    };

    drawCircles() {
      for (let i = this.circleAmount; i > 0; i += -1) {
        let diameter = i * this.circleMargin + this.circleGrowth;
        console.log(diameter);
        if (diameter > 0) {
          this.circleLayer.fill(0, 255 * (i % 2), 0);
          this.circleLayer.circle(this.bigSize / 2, this.bigSize / 2, diameter);
        }
        if (diameter > this.bigSize){
          this.crossReset = true;
        }
      }
    }

    makeHypnoCircles() {
      this.circleLayer.background(0);

      this.circleLayer.push();
      this.circleLayer.fill(0, 255, 0);
      this.circleLayer.noStroke();

      this.resetCircle();

      this.drawCircles();
      
      this.circleLayer.pop();
      p.image(this.circleLayer, this.xLines, this.yLines);
    }

    makeFlashes(color = p.color(0, 255, 0)) {
      this.counter += 1;
      p.push();
      if (this.counter % 10 < 5) {
        p.fill(0);
      } else {
        p.fill(color);
      }

      p.rect(this.x, this.y, this.bigSize, this.bigSize);
      p.pop();
    }

    makeTemperature() {
      this.celsius = wTemp;
      //console.log (this.celsius.toFixed(2));

      p.push();
      p.fill(0, 255, 0);
      p.rect(this.x, this.y, this.bigSize, this.bigSize);
      p.pop();

      p.push();
      p.fill(255, 0, 146);
      p.textAlign(CENTER, CENTER);
      p.text(this.celsius.toFixed(2) + " C", this.x, this.y - 10);
      p.pop();
      this.counter += 1;
    }

    makeRecursion() {
      this.counter += 1;
      for (let i=0;i<this.crossOutlines.length;i++) {
        this.crossOutlines[i].draw(-0.03, 0, 0, 7);
      }
      if(this.counter%10 == 0) {
        this.crossOutlines.push(new crossOutline(this.x, this.y, this.bigSize, this.smallSize, this.crossOutlineWidth));
      }

      if(this.crossOutlines[0].getColor() > 230) {
        this.crossOutlines.shift();
      }
    }

    makeSnakes() {
      this.makeFlashes(p.color(255, 0, 146));

      //this.snakeLayer.background(0);
      this.snakeLayer.angleMode(p.DEGREES);
      this.snakeLayer.push();
      this.snakeLayer.rotateY(5 * this.counter);
      this.snakeLayer.rotateX(180);
      this.snakeLayer.scale(2.0);

      this.snakeLayer.clear();
      this.snakeLayer.stroke(0, 255, 0);
      this.snakeLayer.fill(0, 255, 0);
      this.snakeLayer.model(snakeModel);
      

      p.image(this.snakeLayer, this.xMask, this.yMask);
      this.snakeLayer.pop();
    }

    makeFarmacia() {
      this.farmLayer.background(0, 255, 0);
      this.farmLayer.fill(255, 0, 0);
      for (let x = this.xStart; x <= this.farmLayer.width + this.scrollSize; x += this.scrollSize) { //use a for loop to draw the line of text multiple times down the vertical axis
        
        
        this.farmLayer.text("Farmacia Distel", x, this.farmLayer.height/2 + this.textSize/2 - 10); //display text
      }
      this.xStart -= this.xSpeed; 

      p.image(this.farmLayer, this.xLines, this.yLines);
      
      this.counter += 1;
    }
  }

  class crossOutline {
    constructor(posX, posY, bigSize, smallSize, stroke) {
        this.x = posX;
        this.y = posY;
        this.bigSize = bigSize;
        this.smallSize = smallSize;
        this.scale = 1;
        this.color = 0;
        this.stroke = stroke;
    }

    draw(scale, transX, transY, colour) {
      p.push();
      p.noFill();
      p.strokeWeight(this.stroke);

      this.color += colour;
      p.stroke(this.color, 255, this.color);

      this.x += transX;
      this.y += transY;
      p.translate(this.x, this.y);

      this.scale += scale;
      p.scale(this.scale);
      
      p.beginShape();
      p.vertex(this.smallSize / 2, -this.bigSize / 2) // Top Right
      p.vertex(-this.smallSize / 2, -this.bigSize / 2) // Top Left
      p.vertex(-this.smallSize/2, -this.smallSize / 2) // Top left corner
      p.vertex(-this.bigSize/2, -this.smallSize / 2) // Left top
      p.vertex(-this.bigSize/2, this.smallSize / 2) // Left bot
      p.vertex(-this.smallSize/2, this.smallSize / 2) // Bot left corner
      p.vertex(-this.smallSize / 2, this.bigSize / 2) // Bot Left
      p.vertex(this.smallSize / 2, this.bigSize / 2) // Bot Left
      p.vertex(this.smallSize/2, this.smallSize / 2) // Bot right corner
      p.vertex(this.bigSize/2, this.smallSize / 2) // Right bot
      p.vertex(this.bigSize/2, -this.smallSize / 2) // Right top
      p.vertex(this.smallSize/2, -this.smallSize / 2) // Top right corner
      p.endShape(CLOSE);
      p.pop();
    }

    getColor() {
      return(this.color);
    }
  }

}
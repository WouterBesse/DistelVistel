class pharmacySketchd {
  final static int CROSSAMOUNT = 1;
  final static int CROSSSIZE = 800 / CROSSAMOUNT; // width/height of the cross in pixels
  let crossArray []= {};
  let fontRegular;
  let snakeModel;

  // Global functions

  void preload  () {
    fontRegular = loadFont('DDCHardware-Regular.ttf');
    snakeModel = loadModel('assets/Spiraal.obj', true);
  }

  void setup  () {
    canvas = createCanvas(windowWidth, windowHeight, P2D);
    canvas.position(0, 0);

    smooth(); // Anti aliasing
    frameRate(FRAMERATE);
    pushCrosses();
    textFont(fontRegular);
  }

  void pushCrosses  () {
    // Calculation to evenly distribute objects along x axis
    int totalObjectWidth = CROSSAMOUNT * CROSSSIZE;
    int screenWidth = width;
    int totalMarginSpace = screenWidth - totalObjectWidth;
    int amountToDisplace = totalMarginSpace / (CROSSAMOUNT + 1) + CROSSSIZE;
    int xPos = -CROSSSIZE / 2;

    if (VERBOSE) {
      console.log("totalObjectWidth: ", totalObjectWidth);
      console.log("screenWidth: ", screenWidth);
      console.log("totalMarginSpace: ", totalMarginSpace);
      console.log("amountToDisplace: ", amountToDisplace);
    }

    for (int i = 0; i < CROSSAMOUNT; i++) {
      xPos += amountToDisplace;
      crossArray.push(new Cross(xPos, height / 2, CROSSSIZE));
    }
  }

  void drawCrosses  () {
    for (int i = 0; i < crossArray.length; i++) {
      //voer de teken-method uit de class-
      //omschrijving uit.
      crossArray[i].draw();
    }
  }

  void draw  () {
    background(0);
    drawCrosses();
  }

  class Cross {
    // Deze constructor-method wordt uitgevoerd zodra er
    // een nieuw object vanuit deze class-omschrijving wordt
    // gemaakt.
    public constructor(int xPos, int yPos, int size) {
      rectMode(CENTER);
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

      this.lineGrowSpeed = 1.;
      this.lineGrowWidth = 0;

      this.lineLayer = createGraphics(this.bigSize, this.bigSize);
      this.lineLayer.rectMode(CENTER);
      this.lineHeight = Math.sqrt(Math.pow(this.maskSize, 2) / 2); // Make the line height so that the diagonal is not bigger than the size of the mask
      this.lineWidth = this.lineHeight / 2 / this.lineAmount;
      this.lineX = 0 - this.lineHeight / 2;
      this.xLines = xPos - this.bigSize / 2;
      this.yLines = yPos - this.bigSize / 2;

      // Circle Variables
      this.circleAmount = 50;
      this.circleGrowSpeed = 5;
      this.circleMargin = size / 2 / this.circleAmount * 5;
      this.circleGrowth = this.circleAmount * this.circleMargin * -1;
      this.circleLayer = createGraphics(this.bigSize, this.bigSize);

      // Flash variables
      this.counter = 0;

      // Temperature variables
      textSize(this.bigSize / 5);
      this.rawTemp = 0;
      this.celsius = 0.0;

      // The matrix variables

      // Recursieve Kruiskes
      this.recursiveLayer = createGraphics(this.maskSize, this.maskSize);
      this.recursiveAmount = 1;
      this.crossOutlines = new float [] {};
      this.crossOutlineWidth = size / 100 * 3;
      this.crossOutlines.push(new crossOutline(this.x, this.y, this.bigSize, this.smallSize, this.crossOutlineWidth));


      // Snake variables
      this.snakeLayer = createGraphics(this.maskSize, this.maskSize, WEBGL);
      this.snakeLayer.smooth();

      // Farmacia Variables
      this.farmLayer = createGraphics(this.bigSize, this.bigSize);
      this.xSpeed = 5;
      this.xStart = 0;
      textAlign(CENTER, CENTER);
      this.farmLayer.textSize(this.bigSize / 5);
      this.scrollSize = this.bigSize * 2;
      this.textSize = this.bigSize / 5;
      this.farmLayer.textFont(fontRegular);
    }

    // For all crosses
    void draw() {
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

    void checkReset() {
      if (wCrossType != this.previousCross) {
        this.crossReset = true;
      }
      this.previousCross = wCrossType;
    }

    void makeCrossMask() {
      this.maskLayer.background(0);
      this.maskLayer.rectMode(CENTER);

      this.maskLayer.erase();
      this.maskLayer.rect(this.maskSize / 2, this.maskSize / 2, this.bigSize, this.smallSize);
      this.maskLayer.rect(this.maskSize / 2, this.maskSize / 2, this.smallSize, this.bigSize);
      this.maskLayer.noErase();

      image(this.maskLayer, this.xMask, this.yMask);


      // Create outline <---------------------------------------------------------------- Willen we dit? Staat beter bij temperatuur, snake, farmacia en
      //                                                                                  flashes, maar maakt de illusie minder bij de andere kruizen.
      //                                                                                  Miss sws even naar de kleuren kijken
      push();
      translate(windowWidth / 2, windowHeight / 2);
      stroke(255, 0, 0);
      noFill();
      strokeWeight(5);
      beginShape();
      vertex(this.smallSize / 2, -this.bigSize / 2); // Top Right
        vertex(-this.smallSize / 2, -this.bigSize / 2); // Top Left
        vertex(-this.smallSize / 2, -this.smallSize / 2); // Top left corner
        vertex(-this.bigSize / 2, -this.smallSize / 2); // Left top
        vertex(-this.bigSize / 2, this.smallSize / 2); // Left bot
        vertex(-this.smallSize / 2, this.smallSize / 2); // Bot left corner
        vertex(-this.smallSize / 2, this.bigSize / 2); // Bot Left
        vertex(this.smallSize / 2, this.bigSize / 2); // Bot Left
        vertex(this.smallSize / 2, this.smallSize / 2); // Bot right corner
        vertex(this.bigSize / 2, this.smallSize / 2); // Right bot
        vertex(this.bigSize / 2, -this.smallSize / 2); // Right top
        vertex(this.smallSize / 2, -this.smallSize / 2); // Top right corner
        endShape(CLOSE);
      pop();
    }

    // Cross 0: Flashing crosses
    void makeFlashes () {
      this.counter += 1;
      push();
      if (this.counter % 10 < 5) {
        fill(0);
      } else {
        fill(0,255,0);
      }

      rect(this.x, this.y, this.bigSize, this.bigSize);
      pop();
    }

    // Cross 1: Rotating lines

    void makeRotateLines() {
      this.lineLayer.background(0);


      this.lineLayer.push();
      this.lineLayer.fill(0, 255, 0);
      this.lineLayer.noStroke();
      this.lineLayer.translate(this.bigSize / 2, this.bigSize / 2);
      this.lineLayer.rotate(this.lineRot += this.lineRotateSpeed);

      for (int s = 0; s < this.lineAmount; s++) {
        float curX = this.lineX + s * this.lineWidth * 2 + this.lineWidth;
        this.lineLayer.rect(curX, 0, this.lineWidth, this.lineHeight);
      }

      this.lineLayer.pop();

      image(this.lineLayer, this.xLines, this.yLines);
    }

    // Cross 2: Growing lines
    void makeGrowingLines() {
      this.lineLayer.background(0);

      this.lineLayer.push();
      this.lineLayer.fill(0, 255, 0);
      this.lineLayer.noStroke();

      for (int s = 0; s < this.lineAmount; s++) {
        float curX = s * this.lineWidth * 2;
        this.lineLayer.rect(curX, this.bigSize / 2, this.lineGrowWidth, this.lineHeight);
      }
      this.lineLayer.pop();

      this.lineGrowWidth += this.lineGrowSpeed;
      if (this.lineGrowWidth > this.lineWidth * 2) {
        this.lineGrowWidth = 0;
      }

      image(this.lineLayer, this.xLines, this.yLines);
    }

    // Cross 3: Growing circles
    void resetCircle() {
      if (this.crossReset) {
        this.circleGrowth = this.circleAmount * this.circleMargin * -1;
      } else {
        this.circleGrowth += this.circleGrowSpeed;
      }
    };

    void drawCircles() {
      for (int i = this.circleAmount; i > 0; i += -1) {
        float diameter = i * this.circleMargin + this.circleGrowth;
        if (diameter > 0) {
          this.circleLayer.fill(0, 255 * (i % 2), 0);
          this.circleLayer.circle(this.bigSize / 2, this.bigSize / 2, diameter);
        }
        if (diameter > this.smallSize * 0.1) {
          this.crossReset = true;
        }
      }
    }

    void makeHypnoCircles() {
      this.circleLayer.background(0);

      this.circleLayer.push();
      this.circleLayer.fill(0, 255, 0);
      this.circleLayer.noStroke();

      this.resetCircle();

      this.drawCircles();

      this.circleLayer.pop();
      image(this.circleLayer, this.xLines, this.yLines);
    }

    // Cross 4: Temperature
    void makeTemperature() {
      this.celsius = wTemp;
      //console.log (this.celsius.toFixed(2));

      push();
      fill(0, 255, 0);
      rect(this.x, this.y, this.bigSize, this.bigSize);
      stroke(255, 255, 255);
      pop();

      push();
      fill(255, 0, 0);
      textAlign(CENTER, CENTER);
      text(this.celsius.toFixed(2) + " °C", this.x, this.y - 10);
      pop();
      this.counter += 1;
    }

    // Cross 5: Recursion
    void makeRecursion() {
      this.counter += 1;
      float xMovement = (wFrequency - 0.0025) * 10;
      for (int i = 0; i < this.crossOutlines.length; i++) {
        this.crossOutlines[i].draw(-0.03, xMovement, 0, 7);
      }
      if (this.counter % 10 == 0) {
        this.crossOutlines.push(new crossOutline(this.x, this.y, this.bigSize, this.smallSize, this.crossOutlineWidth));
      }

      if (this.crossOutlines[0].getColor() > 230) {
        this.crossOutlines.shift();
      }
    }

    // Cross 6: Rotating snakes
    void makeSnakes() {
      this.makeFlashes(color(255, 0, 0));

      //this.snakeLayer.background(0);
      this.snakeLayer.angleMode(DEGREES);
      this.snakeLayer.push();
      this.snakeLayer.rotateY(5 * this.counter);
      this.snakeLayer.rotateX(180);
      this.snakeLayer.scale(this.bigSize / 200);

      this.snakeLayer.clear();
      this.snakeLayer.stroke(255, 255, 255);
      this.snakeLayer.fill(0, 255, 0);
      this.snakeLayer.model(snakeModel);


      image(this.snakeLayer, this.xMask, this.yMask);
      this.snakeLayer.pop();
    }

    // Cross 7: Farmacia Distel
    void makeFarmacia() {
      this.farmLayer.background(0, 255, 0);
      this.farmLayer.fill(255, 0, 0);
      for (float x = this.xStart; x <= this.farmLayer.width + this.scrollSize; x += this.scrollSize) { //use a for loop to draw the line of text multiple times down the vertical axis
        this.farmLayer.text("Farmacia Distel", x, this.farmLayer.height / 2 + this.textSize / 2 - 10); //display text
      }
      this.xStart -= this.xSpeed;

      image(this.farmLayer, this.xLines, this.yLines);

      this.counter += 1;
    }
  }

  // Hoort bij Recursion kruis
  class crossOutline {
    public constructor(int posX, int posY, int bigSize, int smallSize, int stroke) {
      this.x = posX;
      this.y = posY;
      this.bigSize = bigSize;
      this.smallSize = smallSize;
      this.scale = 1;
      this.colour = color(0,0,0);
      this.stroke = stroke;
    }

    void draw(float scale, float transX, float transY, color colour) {
      push();
      noFill();
      strokeWeight(this.stroke);

      this.colour += colour;
      stroke(this.colour, 255, this.colour);


      translate(this.x, this.y);

      this.scale += scale;
      scale(this.scale);

      beginShape();
      vertex(this.smallSize / 2, -this.bigSize / 2); // Top Right
        vertex(-this.smallSize / 2, -this.bigSize / 2); // Top Left
        vertex(-this.smallSize / 2, -this.smallSize / 2); // Top left corner
        vertex(-this.bigSize / 2, -this.smallSize / 2); // Left top
        vertex(-this.bigSize / 2, this.smallSize / 2); // Left bot
        vertex(-this.smallSize / 2, this.smallSize / 2); // Bot left corner
        vertex(-this.smallSize / 2, this.bigSize / 2); // Bot Left
        vertex(this.smallSize / 2, this.bigSize / 2); // Bot Left
        vertex(this.smallSize / 2, this.smallSize / 2); // Bot right corner
        vertex(this.bigSize / 2, this.smallSize / 2); // Right bot
        vertex(this.bigSize / 2, -this.smallSize / 2); // Right top
        vertex(this.smallSize / 2, -this.smallSize / 2); // Top right corner
        endShape(CLOSE);
      pop();

      this.x = this.x + this.x * transX;
      this.y += transY;
    }

    int getColor() {
      return (this.colour);
    }
  }
}

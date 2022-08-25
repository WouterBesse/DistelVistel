let pharmacySketch = function (p) {
  const CROSSAMOUNT = 2;
  const CROSSSIZE = 800 / CROSSAMOUNT; // width/height of the cross in pixels
  let crossArray = [];
  let wCrossType = 0;
  let crossReset;


  p.setup = function () {
    canvas = p.createCanvas(windowWidth, windowHeight, p.P2D);
    canvas.position(0, 0);
    //textLayer = p.createGraphics(windowWidth, windowHeight, p.P2D)
    p.smooth(); // Anti aliasing
    p.frameRate(FRAMERATE);

    p.pushCrosses();
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
      //met de push-functie voeg je een element toe
      //aan het eind van de array.
      //
      //Het nieuwe object dat aangemaakt is vanuit 
      //de class-omschrijving wordt in de array gezet.
      //tegelijk wordt de constructor-method uit de
      //class-omschrijving uitgevoerd.
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
      this.bigSize = size;
      this.smallSize = size / 3;
      this.x = xPos;
      this.y = yPos;

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
      this.flashCounter = 0;

      this.previousCross = wCrossType;
      this.crossReset = false;



    }
    // je kan oneindig veel methods (functies binnen
    // een object) aanmaken in je class-
    // omschrijving.
    draw() {
      this.checkReset();
      switch (wCrossType) {
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
        case 0:
          this.makeFlashes();
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

    makeHypnoCircles() {
      this.circleLayer.background(0);

      this.circleLayer.push();
      this.circleLayer.fill(0, 255, 0);
      this.circleLayer.noStroke();

      if (this.crossReset) {
        this.circleGrowth = this.circleAmount * this.circleMargin * -1;
      } else {
        this.circleGrowth += this.circleGrowSpeed;
      }

      for (let i = this.circleAmount; i > 0; i += -1) {
        let diameter = i * this.circleMargin + this.circleGrowth;
        if (diameter > 0) {
          this.circleLayer.fill(0, 255 * (i % 2), 0);
          this.circleLayer.circle(this.bigSize / 2, this.bigSize / 2, diameter);
        }

      }
      this.circleLayer.pop();
      p.image(this.circleLayer, this.xLines, this.yLines);
    }

    makeFlashes() {
      this.flashCounter += 1;
      p.push();
      if (this.flashCounter % 10 < 5) {
        p.fill(0);
      } else {
        p.fill(0, 255, 0);
      }
      //p.rectMode(p.CENTER);
      p.rect(this.x, this.y, this.bigSize, this.bigSize);
      p.pop();
    }
  }

}
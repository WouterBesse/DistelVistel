class Distels {
  final static int SCENEID = 1;
  final static int DISTELXINSTANCES = 4;
  final static int DISTELYINSTANCES = 2;
  private color black = color(0);
  private color white = color(255);

  private int power = -DISTELYINSTANCES + 4;
  private float distelXMargin;
  private float distelYMargin;
  
  
  private PGraphics distelGraphics;
  private PFont fontRegular;
  private PShape distelModel;
  private PShape distelRondModel;

  public void preload () {
    
  }

  public void setup () {
    distelGraphics = createGraphics(500, 500, P3D);
    
    fontRegular = createFont("assets/DDCHardware-Regular.ttf", width / 4, true);
    distelModel = loadShape("assets/Distel2Origin.obj");
    distelRondModel = loadShape("assets/Distel.obj");
    
    distelXMargin = 500 / 4;
    distelYMargin = 500 / 2;
  }

  public void initiateDraw () {
    textFont(fontRegular);
    textAlign(CENTER, CENTER);
  }

  public void draw () {
    drawBackground();
    textRender("Distel");
    
    drawDistels();
  }
  
  private void drawBackground() {
        // Kiezen tussen witte of zwarte achtergrond
        switch (lightMode) {
            case 0:
                background(black);
                stroke(white);
                break;
            case 1:
                background(white);
                stroke(black);
        }
    }

  private void textRender (String tekst) {
    switch (lightMode) {
      case 0:
        fill(white);
        break;
      case 1:
        fill(black);
        break;
    }
    text(tekst, width / 2, height / 2);
  }

  private void drawDistel (float x, float y) {
    distelGraphics.pushMatrix();
    
    distelGraphics.scale((wFrequencyAmplitude[0] / 1024) * 2 / DISTELYINSTANCES + 50);
    //distelGraphics.translate(100, 100, 0);
    println(x);
    distelGraphics.translate(312.5, 250, 0);
    //distelGraphics.translate(x, 0);
    distelGraphics.shape(distelModel);
    distelGraphics.popMatrix();
  }

  private void drawDistels () {
    distelGraphics.beginDraw();
    distelGraphics.background(white);

    // Distel properties
    distelGraphics.translate(0, 0, 0);
    distelGraphics.strokeWeight(1);
    //distelGraphics.rotateY(radians(180));
    distelGraphics.shapeMode(CENTER);
    distelGraphics.fill(255, 0, 146);
    distelGraphics.stroke(white);
    //distelGraphics.translate((float) ((width / DISTELXINSTANCES) * (DISTELXINSTANCES / 2 + 0.5)),(float) (height / (Math.pow(DISTELYINSTANCES, power))), (float) -300); // <------------ Moet minder beunoplossing worden

    float distelX = distelXMargin / -2;
    
    for (int x = 0; x < DISTELXINSTANCES; x += 1) {
      distelX = distelX + distelXMargin;
      float distelY = distelYMargin / -2;
      for (int y = 0; y < DISTELYINSTANCES; y += 1) {
        distelY += distelYMargin;
        drawDistel(distelX, distelY);
      }
    }
    distelGraphics.endDraw();
    imageMode(CENTER);
    image(distelGraphics, width/2, height/2);
    println("kaas");
  }
}

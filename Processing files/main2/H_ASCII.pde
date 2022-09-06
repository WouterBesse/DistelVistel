class ASCIISketch {
  final static String density = "Ñ@#W$9876543210?!abc;:+=-,._                    ";
  // final static density = '       .:-i|=+%O#@'
  // final static density = '        .:░▒▓█';
  final static int w = 64;
  final static int h = 48;

  let video;
  let frame;

    void setup() {
    canvas = createCanvas(windowWidth, windowHeight, P2D);
    canvas.position(0, 0);
    smooth(); // Anti aliasing
    frameRate(FRAMERATE);
    pixelDensity(1);

    video = createCapture(VIDEO);
    video.size(w, h);
    //video.hide();
  }

  void draw  () {
    background(0);
    textSize(windowWidth / w);
    textAlign(CENTER, CENTER);

    image(video, 0, 0, width, width * video.height / video.width);
    //frame = image(video, 0, 0, width, width * video.height / video.width);


    video.loadPixels();

    //console.log(frame.pixels);

    for (let j = 0; j < video.height; j++) {
      for (let i = 0; i < video.width; i++) {
        let pixelIndex = (i + j * w) * 4;
        let r = video.pixels[pixelIndex + 0];
        let g = video.pixels[pixelIndex + 1];
        let b = video.pixels[pixelIndex + 2];
        let avg = (r + g + b) / 3;
        //console.log(g);

        noStroke();
        fill(255);

        let len = density.length;
        let charIndex = floor(map(avg, 0, 255, 0, len));
        //console.log(charIndex);

        let c = density.charAt(charIndex);

        text(c, i * w + w * 0.5, j * h + h * 0.5);
      }
    }
  }
}

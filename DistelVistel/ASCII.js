let ASCIISketch = function (p) {

    const density = "Ñ@#W$9876543210?!abc;:+=-,._                    ";
    // const density = '       .:-i|=+%O#@'
    // const density = '        .:░▒▓█';
    const w = 64;
    const h = 48;

    let video;

    p.setup = function () {
        canvas = p.createCanvas(windowWidth, windowHeight, p.P2D);
        canvas.position(0, 0);
        p.smooth(); // Anti aliasing
        p.frameRate(FRAMERATE);
        p.pixelDensity(1);

        video = p.createCapture(VIDEO);
        video.size(w, h);
        //video.hide();
    }

    p.draw = function () {
        p.background(0);
        //p.image(video, 0, 0, width, width * video.height / video.width);
        p.textSize(windowWidth / w);
        p.textAlign(CENTER, CENTER);
        video.loadPixels();
        d = pixelDensity();
        for (let j = 0; j < video.height; j++) {
            for (let i = 0; i < video.width; i++) {
                //let pixelIndex = (i + j * w) * 4;
                let pixelIndex = 4 * (i + j * video.width);
                let r = video.pixels[pixelIndex + 0];
                let g = video.pixels[pixelIndex + 1];
                let b = video.pixels[pixelIndex + 2];
                let avg = (r + g + b) / 3;
                //console.log(g);

                p.noStroke();
                p.fill(255);

                let len = density.length;
                let charIndex = p.floor(p.map(avg, 0, 255, 0, len));
                //console.log(charIndex);

                let c = density.charAt(charIndex);

                p.text(c, i * w + w * 0.5, j * h + h * 0.5);
            }
        }
    }
}

let shapeSketch = function (p) {
    var globe;
    var total = 40;

    var offset = 0;

    var m = 0;
    var mchange = 0;

    var a = 1;
    var b = 1;

    p.setup = function () {
        p.createCanvas(windowWidth, windowHeight, p.WEBGL);
        p.colorMode(HSB);
        globe = new Array((total + 1) * (total + 1));
    }



    p.superShape = function (theta, m, n1, n2, n3) {
        var t1 = abs((1 / a) * cos(m * theta / 4));
        t1 = pow(t1, n2);
        var t2 = abs((1 / b) * sin(m * theta / 4));
        t2 = pow(t2, n3);
        var t3 = t1 + t2;
        var r = pow(t3, - 1 / n1);
        return r;
    }

    p.draw = function () {

        m1 = p.map(sin(p.millis() / 1000), -1, 1, -1, 5);
        n11 = 0.04;
        n21 = 1.7;
        n31 = 1.7;

        m2 = p.map(sin(p.millis() / 1500), -1, 1, -1, 5);
        n12 = 1;
        n22 = 1;
        n32 = 1;
        //mchange += 0.02;

        p.rotateY(millis() / 300);
        p.rotateX(millis() / 550)

        p.background(0);
        p.noStroke();
        p.scale(1.5);
        var r = 200;
        for (var i = 0; i < total + 1; i++) {
            var lat = p.map(i, 0, total, -HALF_PI, HALF_PI);
            var r2 = p.superShape(lat, m, n11, n21, n31);
            //var r2 = supershape(lat, 2, 10, 10, 10);
            for (var j = 0; j < total + 1; j++) {
                var lon = p.map(j, 0, total, -PI, PI);
                var r1 = p.superShape(lon, m2, n12, n22, n32);
                //var r1 = supershape(lon, 8, 60, 100, 30);
                var x = r * r1 * cos(lon) * r2 * cos(lat);
                var y = r * r1 * sin(lon) * r2 * cos(lat);
                var z = r * r2 * sin(lat);
                var index = i + j * (total + 1);
                globe[index] = p.createVector(x, y, z);
            }
        }

        p.stroke(255);
        //fill(255);
        p.noFill();
        offset += 5;
        for (var i = 0; i < total; i++) {
            // var hu = map(i, 0, total, 0, 255 * 6);
            // fill((hu + offset) % 255, 255, 255);
            p.beginShape(TRIANGLE_STRIP);
            for (var j = 0; j < total + 1; j++) {
                var index1 = i + j * (total + 1);
                var v1 = globe[index1];
                p.vertex(v1.x, v1.y, v1.z);
                var index2 = (i + 1) + j * (total + 1);
                var v2 = globe[index2];
                p.vertex(v2.x, v2.y, v2.z);
            }
            p.endShape();
        }
    }
}
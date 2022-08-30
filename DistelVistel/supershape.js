let shapeSketch = function (p) {
    var globe;
    var total = 40;
    var offset = 0;
    var a = 1;
    var b = 1;

    const n =
        [
            [[0.3, 0.3, 0.3], [1, 1, 1]],
            [[0.04, 1.7, 1.7], [1, 1, 1]],
            [[0.765169, 52.2728, -0.202], [37.6514, 0.523097, -18.99]],
            [[0.375393, 50.7442, -0.657], [-74.1592, -0.68202, -41.4]],
            [[0.2, 1.7, 1.7], [0.2, 1.7, 1.7]],
            [[0.7, 0.3, 0.2], [100, 100, 100]],
            [[1, 1, 1], [1, 1, 1]],
            [[60, 55, 1000], [250, 100, 100]],
            [[0.1, 1.7, 1.7], [0.3, 0.5, 0.5]],
            [[0.5, 1, 2.5], [3, 0.2, 1]]
        ];


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
        console.log("amp: ", wFrequencyAmplitude[0]);
        mult = p.map(wFrequencyAmplitude[0], 0, 1000, 0, 3);
        console.log("mult: ", mult);
        m1 = p.map(sin(p.millis() / 1000), -1, 1, 0, 5) + mult;
        m2 = p.map(sin(p.millis() / 3333), -1, 1, 0, 5);

        let nRow = wShapeType;
        console.log(nRow);

        p.rotateY(millis() / 600);
        p.rotateX(millis() / 1100)

        p.background(0);
        p.scale(1 + mult / 3);
        var r = 200;
        for (var i = 0; i < total + 1; i++) {
            var lat = p.map(i, 0, total, -HALF_PI, HALF_PI);
            var r2 = p.superShape(lat, m1, n[nRow][0][0], n[nRow][0][1], n[nRow][0][2]);
            //var r2 = supershape(lat, 2, 10, 10, 10);
            for (var j = 0; j < total + 1; j++) {
                var lon = p.map(j, 0, total, -PI, PI);
                var r1 = p.superShape(lon, m2, n[nRow][1][0], n[nRow][1][1], n[nRow][1][2]);
                //var r1 = supershape(lon, 8, 60, 100, 30);
                var x = r * r1 * cos(lon) * r2 * cos(lat);
                var y = r * r1 * sin(lon) * r2 * cos(lat);
                var z = r * r2 * sin(lat);
                var index = i + j * (total + 1);
                globe[index] = p.createVector(x, y, z);
            }
        }

        switch (wMaterial) {
            case 0:
                p.normalMaterial();
                break;
            case 1:
                p.stroke(255);
                p.noFill();
            //p.fill(200);
        }

        offset += 5;
        for (var i = 0; i < total; i++) {
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
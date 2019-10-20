// Shaders
const V_SHADER_SOURCE = `
    attribute vec4 a_Position;
    
    void main() {
        gl_Position = a_Position;
        gl_PointSize = 2.5;
    }
`;

const F_SHADER_SOURCE =`
    void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
`;

// Data
const vert = [];
vert.addPoints = (n = 1) => {
    for(let i = 0; i < n; i++) {
        vert.push(Math.random() * 2 - 1);
        vert.push(Math.random() * 2 - 1);
    }
};
vert.addPoints(3);

function main() {
    const canvas = document.getElementById('webgl');

    const gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    if (!initShaders(gl, V_SHADER_SOURCE, F_SHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }

    gl.clearColor(0, 0, 0, 1);

    (function tick() {
        const arr = animatedBSpline();
        // const arr = animatedBezierCurve(vert);

        gl.clear(gl.COLOR_BUFFER_BIT);

        // Draw curve
        const curve_n = initVertexBuffers(gl, arr);
        if (curve_n < 0) {
            console.log('Failed to set the positions of the vertices for curve');
            return;
        }
        gl.drawArrays(gl.LINE_STRIP, 0, curve_n);

        // Draw points
        // const dots_n = initVertexBuffers(gl, vert);
        // if (dots_n < 0) {
        //     console.log('Failed to set the positions of the vertices for points');
        //     return;
        // }
        // gl.drawArrays(gl.POINTS, 0, dots_n);

        window.requestAnimationFrame(tick)
    }());
}
setTimeout(main, 0);

function initVertexBuffers(gl, arr) {
    const n = arr.length / 2;
    const vertices = new Float32Array(arr);

    const vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return -1;
    }

    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    return n;
}

// B-SPLINE CURVES
function makeCoeff(vert, i) {
    return {
        a: vert[i - 1],
        b: vert[i],
        c: vert[i + 1],
        d: vert[i + 2]
    }
}

function makeParams(c) {
    return {
        0: (c.a + 4 * c.b + c.c) / 6,
        1: (-c.a + c.c) / 2,
        2: (c.a - 2 * c.b + c.c) / 2,
        3: (-c.a + 3 * (c.b - c.c) + c.d) / 6
    }
}

function calcCoord(t, p) {
    return ((p[3] * t + p[2]) * t + p[1]) * t + p[0];
}

function createBSplineCurve(vert, n = 30) {
    const arr = [];
    const vertX = vert.filter((a, i) => i % 2 === 0);
    const vertY = vert.filter((a, i) => i % 2 !== 0);

    for (let i = 1; i < vert.length / 2 - 2; i++) {
        const xCoeff = makeCoeff(vertX, i);
        const yCoeff = makeCoeff(vertY, i);

        const a = makeParams(xCoeff);
        const b = makeParams(yCoeff);

        for (let k = 0; k <= n; k++) {
            const step = k / n;

            const x = calcCoord(step, a);
            const y = calcCoord(step, b);

            arr.push(x, y);
        }
    }

    return arr;
}

// ANIMATION
let newArr = [];
let startIndex = 0;
let arr = undefined;
let lastUpdate = Date.now();
function animatedBSpline(n = 30, frequency = 500, length = 5) {
    if(!arr) {
        arr = createBSplineCurve(vert, n);
    }
    const now = Date.now();

    const step = frequency / n;
    const endIndex = Math.floor((now - lastUpdate) / step);

    // Add points
    if(endIndex > arr.length - 2) {
        vert.addPoints();
        arr = createBSplineCurve(vert, n);
    }
    // Remove points
    if(newArr.length > n * length) {
        startIndex += 2;
    }

    newArr = arr.slice(startIndex, endIndex);
    return newArr;
}

// BEZIER CURVES
const lut = [
    [1],
    [1, 1],
    [1, 2, 1],
    [1, 3, 3, 1],
    [1, 4, 6, 4, 1],
    [1, 5, 10, 10, 5, 1],
    [1, 6, 15, 20, 15, 6, 1]
];

function binomial(n, k) {
    // If we do not have enough data in lut.
    while (n >= lut.length) {
        const l = lut.length;
        const prev = l - 1;

        const nextRow = [];
        nextRow[0] = 1;
        nextRow[l] = 1;
        for (let i = 1; i < l; i++) {
            nextRow[i] = lut[prev][i - 1] + lut[prev][i];
        }
        lut.push(nextRow)
    }

    return lut[n][k];
}

function bezier(n, t, w) {
    // n - type of curve (2 -quadratic, 3 - cubic, etc.)
    // t - {0, 1} percent of path
    // w - control points (wight)
    let sum = 0;
    for (let k = 0; k <= n; k++) {
        sum += w[k] * binomial(n, k) * ((1 - t) ** (n - k)) * (t ** k)
    }

    return sum
}

function createBezierCurve(vert, n = 2, l = 30) {
    // n - type of curve (2 -quadratic, 3 - cubic, etc.)
    // l - amount of line parts
    const arr = [];
    const step = Math.floor(100 / l) / 100;
    const vertX = vert.filter((a, i) => i % 2 === 0);
    const vertY = vert.filter((a, i) => i % 2 !== 0);

    for (let t = 0; t <= 1; t = Math.floor((t + step) * 100) / 100) {
        const x = bezier(n, t, vertX);
        const y = bezier(n, t, vertY);

        arr.push(x, y);
    }

    return arr;
}

// ANIMATION
// let arr = undefined;
// let lastUpdate = Date.now();
let prevVert = undefined;

function animatedBezierCurve(vert, n = 2, l = 50, duration = 1000) {
    const now = Date.now();
    if (prevVert !== vert) {
        prevVert = vert;
        arr = createBezierCurve(vert, n, l);
    }

    const step = duration / l;
    const endIndex = Math.floor((now - lastUpdate) / step);

    return arr.slice(0, endIndex);
}

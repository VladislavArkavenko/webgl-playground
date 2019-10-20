// Shaders
const V_SHADER_SOURCE = `
    attribute vec4 a_Position;
    
    void main() {
        gl_Position = a_Position;
        gl_PointSize = 2.5;
    }
`;

const F_SHADER_SOURCE = `
    void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
`;

// Data
const vert = [
    0.0, -0.75,
    0.0, 0.75
];

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
        const arr = createTree(vert);

        gl.clear(gl.COLOR_BUFFER_BIT);

        // Draw tree
        const tree_n = initVertexBuffers(gl, arr);
        if (tree_n < 0) {
            console.log('Failed to set the positions of the vertices for tree');
            return;
        }
        gl.drawArrays(gl.LINES, 0, tree_n);

        // Draw points
        const dots_n = initVertexBuffers(gl, arr);
        if (dots_n < 0) {
            console.log('Failed to set the positions of the vertices for points');
            return;
        }
        gl.drawArrays(gl.POINTS, 0, dots_n);

        // window.requestAnimationFrame(tick)
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

function randomize(n, amp) {
    // n - number
    // amp - amplitude
    return n + (Math.random() * (amp * 2) - amp);
}

const rad = 180 / Math.PI;

function rotatePoint(angle, point, rotatePoint = [0, 0]) {
    const x = point[0] - rotatePoint[0];
    const y = point[1] - rotatePoint[1];
    const c = Math.cos(angle / rad);
    const s = Math.sin(angle / rad);

    return [x * c - y * s + rotatePoint[0], x * s + y * c + rotatePoint[1]];
}

function createTree(vert, n = 5, a = 30, amp = 0, sfs = [0.25, 0.75], lf = 1) {
    // n - recursion deepness
    // a - rotate angle for left and right subtrees
    // amp - amplitude angle for randomizing default angel
    // sfs - start factors, percent of initial line where branches will be built
    // lf - length factor, percent of initial line length for subtree base
    if (n === 0) {
        return vert;
    }

    const l = vert.length;
    const prevLineX = [vert[l - 4], vert[l - 2]];
    const prevLineY = [vert[l - 3], vert[l - 1]];

    const lengthX = prevLineX[1] - prevLineX[0];
    const lengthY = prevLineY[1] - prevLineY[0];

    const subtrees = sfs.map(sf => {
        const startX = prevLineX[0] + sf * lengthX;
        const startY = prevLineY[0] + sf * lengthY;
        const startPoint = [startX, startY];

        const endX = prevLineX[0] + lf * lengthX;
        const endY = prevLineY[0] + lf * lengthY;
        let endPoint = [endX, endY];

        const endPoints = [
            rotatePoint(randomize(a, amp), endPoint, startPoint),
            rotatePoint(randomize(-a, amp), endPoint, startPoint)
        ];

        const leftLine = [...startPoint, ...endPoints[0]];
        const rightLine = [...startPoint, ...endPoints[1]];

        const leftTree = createTree(leftLine, n - 1, a, amp, sfs, lf);
        const rightTree = createTree(rightLine, n - 1, a, amp, sfs, lf);

        return [...vert, ...leftTree, ...rightTree];
    });

    return subtrees.reduce((a, b) => a.concat(b));
}

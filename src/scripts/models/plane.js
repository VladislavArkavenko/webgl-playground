//  v1------v0
//  |        |
//  |        |
//  |        |
//  v2------v3

const indices = new Uint8Array([0, 1, 2, 0, 2, 3]);

// prettier-ignore
const vertices = new Float32Array([
    3.0, -1.7, 2.5,//   v0
    -3.0, -1.7, 2.5, // v1
    -3.0, -1.7, -2.5,// v2
    3.0, -1.7, -2.5 //  v3
]);

// prettier-ignore
const colors = new Float32Array([
    1.0, 1.0, 1.0, // v0
    1.0, 1.0, 1.0, // v1
    1.0, 1.0, 1.0, // v2
    1.0, 1.0, 1.0 //  v3
]);

const plane = {
  colors,
  indices,
  vertices
};

export default plane;

//       v2
//      / |
//     /  |
//    /   |
//  v0----v1

const indices = new Uint8Array([0, 1, 2]);

// prettier-ignore
const vertices = new Float32Array([
    -0.8, 3.5, 0.0, // v0
    0.8, 3.5, 0.0, //  v1
    0.0, 3.5, 1.8 //   v2
]);

// prettier-ignore
const colors = new Float32Array([
    1.0, 0.5, 0.0, // v0
    1.0, 0.5, 0.0, // v1
    1.0, 0.0, 0.0 //  v2
]);

const triangle = {
  colors,
  indices,
  vertices
};

export default triangle;

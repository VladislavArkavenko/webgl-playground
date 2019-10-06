// prettier-ignore
const vertices = new Float32Array([
 0, 0, 0,
 0, 0, 1,
 0, 1, 0,
 1, 0, 0
]);

// prettier-ignore
const indices = new Uint8Array([
  0, 1,
  0, 2,
  0, 3
]);

const axisModel = {
  indices,
  vertices
};

export default axisModel;

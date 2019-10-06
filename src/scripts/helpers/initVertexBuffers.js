import initArrayBuffer from './initArrayBuffer';
import initElementArrayBuffer from './initElementArrayBuffer';

export default function initVertexBuffers(gl, model) {
  const { colors, indices, vertices, normals } = model;

  const obj = {};

  if (colors) {
    obj.colorBuffer = initArrayBuffer(gl, colors, 3, gl.FLOAT);
    if (!obj.colorBuffer) return null;
  }
  if (vertices) {
    obj.n = vertices.length / 3;
    obj.vertexBuffer = initArrayBuffer(gl, vertices, 3, gl.FLOAT);
    if (!obj.vertexBuffer) return null;
  }
  if (indices) {
    obj.n = indices.length;
    obj.indicesBuffer = initElementArrayBuffer(gl, indices, gl.UNSIGNED_BYTE);
    if (!obj.indicesBuffer) return null;
  }
  if (normals) {
    obj.normalsBuffer = initArrayBuffer(gl, normals, 3, gl.FLOAT);
    if (!obj.normalsBuffer) return null;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  return obj;
}

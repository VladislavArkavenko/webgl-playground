// Coordinate transformation matrix
import { Matrix4 } from '../../lib/cuon-matrix';
import initAttributeVariable from './helpers/initAttributeVariable';

const g_modelMatrix = new Matrix4();
const g_mvpMatrix = new Matrix4();

function draw(gl, program, o, viewProjMatrix) {
  initAttributeVariable(gl, program.a_Position, o.vertexBuffer);
  if (program.a_Color !== undefined) {
    initAttributeVariable(gl, program.a_Color, o.colorBuffer);
  }

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, o.indexBuffer);

  g_mvpMatrix.set(viewProjMatrix);
  g_mvpMatrix.multiply(g_modelMatrix);
  gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);

  gl.drawElements(gl.TRIANGLES, o.numIndices, gl.UNSIGNED_BYTE, 0);
}

function drawTriangle(gl, program, triangle, angle, viewProjMatrix) {
  g_modelMatrix.setRotate(angle, 0, 1, 0);
  draw(gl, program, triangle, viewProjMatrix);
}

function drawPlane(gl, program, plane, viewProjMatrix) {
  g_modelMatrix.setRotate(-45, 0, 1, 1);
  draw(gl, program, plane, viewProjMatrix);
}

export { drawTriangle, drawPlane, g_mvpMatrix };

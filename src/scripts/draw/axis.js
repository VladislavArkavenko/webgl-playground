import initAttributeVariable from '../helpers/initAttributeVariable';
import { Matrix4 } from '../../../lib/cuon-matrix';

export default function drawAxis(gl, program, obj, vpMatrix) {
  gl.useProgram(program);

  initAttributeVariable(gl, program.a_Position, obj.vertexBuffer);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indicesBuffer);

  const mvpMatrix = new Matrix4(vpMatrix);
  mvpMatrix.scale(10.0, 10.0, 10.0);
  gl.uniformMatrix4fv(program.u_MvpMatrix, false, mvpMatrix.elements);

  gl.drawElements(gl.LINES, obj.n, gl.UNSIGNED_BYTE, 0);
}

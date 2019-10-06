import initAttributeVariable from '../helpers/initAttributeVariable';
import { Matrix4 } from '../../../lib/cuon-matrix';

export default function drawTicks(gl, program, obj, vpMatrix) {
  gl.useProgram(program);

  initAttributeVariable(gl, program.a_Position, obj.vertexBuffer);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indicesBuffer);

  for (let a = 0; a < 3; a += 1) {
    for (let i = 1; i <= 20; i += 1) {
      const mvpMatrix = new Matrix4(vpMatrix);

      const x = a === 0 ? i : 0;
      const y = a === 1 ? i : 0;
      const z = a === 2 ? 0 : 0;

      mvpMatrix.translate(x, y, z);
      mvpMatrix.scale(20.0, 10.0, 0.0);
      if (a === 0) {
        mvpMatrix.rotate(90, 0, 0, 1);
      }
      gl.uniformMatrix4fv(program.u_MvpMatrix, false, mvpMatrix.elements);

      gl.drawArrays(gl.LINES, 0, obj.n);
    }
  }
}

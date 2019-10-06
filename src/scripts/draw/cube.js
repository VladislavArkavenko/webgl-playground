import { Matrix4, Vector3 } from '../../../lib/cuon-matrix';

import initAttributeVariable from '../helpers/initAttributeVariable';

const LIGHT_COLOR = [1, 1, 1];
const LIGHT_DIRECTION = new Vector3([0.5, 3.0, 4.0]).normalize();

export function drawCube(gl, program, obj, mvpMatrix) {
  initAttributeVariable(gl, program.a_Color, obj.colorBuffer);
  initAttributeVariable(gl, program.a_Normal, obj.normalsBuffer);
  initAttributeVariable(gl, program.a_Position, obj.vertexBuffer);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indicesBuffer);

  gl.uniformMatrix4fv(program.u_MvpMatrix, false, mvpMatrix.elements);

  gl.drawElements(gl.TRIANGLES, obj.n, gl.UNSIGNED_BYTE, 0);
}

export function drawArrayOfCubes(gl, program, obj, vpMatrix, data) {
  gl.useProgram(program);

  gl.uniform3f(program.u_LightColor, ...LIGHT_COLOR);
  gl.uniform3fv(program.u_LightDirection, LIGHT_DIRECTION.elements);
  // eslint-disable-next-line no-unused-vars
  data.forEach((y, i) => {
    const mvpMatrix = new Matrix4(vpMatrix);
    mvpMatrix.translate(2 * i + 1.5, 0.0, 1.5);
    mvpMatrix.scale(1.0, y * 1.0, 1.0);

    drawCube(gl, program, obj, mvpMatrix);
  });
}

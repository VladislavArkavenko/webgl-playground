import { createProgram } from '../../../lib/cuon-utils';

import LINE_VSHADER_SOURCE from '../../shaders/line/vert.glsl';
import LINE_FSHADER_SOURCE from '../../shaders/line/frag.glsl';

const createAxisProgram = (gl) => {
  const axisProgram = createProgram(gl, LINE_VSHADER_SOURCE, LINE_FSHADER_SOURCE);
  axisProgram.a_Position = gl.getAttribLocation(axisProgram, 'a_Position');
  axisProgram.u_MvpMatrix = gl.getUniformLocation(axisProgram, 'u_MvpMatrix');

  if (axisProgram.a_Position < 0) {
    console.log('Failed to get the storage location of attribute variable from axisProgram');
    return null;
  }
  if (!axisProgram.u_MvpMatrix) {
    console.log('Failed to get the storage location of uniform variable from axisProgram');
    return null;
  }

  return axisProgram;
};

export default createAxisProgram;

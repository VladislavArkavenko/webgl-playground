import { createProgram } from '../../../lib/cuon-utils';

import LINE_VSHADER_SOURCE from '../../shaders/line/vert.glsl';
import LINE_FSHADER_SOURCE from '../../shaders/line/frag.glsl';

const createTicksProgram = (gl) => {
  const ticksProgram = createProgram(gl, LINE_VSHADER_SOURCE, LINE_FSHADER_SOURCE);
  ticksProgram.a_Position = gl.getAttribLocation(ticksProgram, 'a_Position');
  ticksProgram.u_MvpMatrix = gl.getUniformLocation(ticksProgram, 'u_MvpMatrix');

  if (ticksProgram.a_Position < 0) {
    console.log('Failed to get the storage location of attribute variable from ticksProgram');
    return null;
  }
  if (!ticksProgram.u_MvpMatrix) {
    console.log('Failed to get the storage location of uniform variable from ticksProgram');
    return null;
  }

  return ticksProgram;
};

export default createTicksProgram;

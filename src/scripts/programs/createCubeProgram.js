import { createProgram } from '../../../lib/cuon-utils';

import CUBE_VSHADER_SOURCE from '../../shaders/cube/vert.glsl';
import CUBE_FSHADER_SOURCE from '../../shaders/cube/frag.glsl';

const createCubeProgram = (gl) => {
  const cubeProgram = createProgram(gl, CUBE_VSHADER_SOURCE, CUBE_FSHADER_SOURCE);
  cubeProgram.a_Color = gl.getAttribLocation(cubeProgram, 'a_Color');
  cubeProgram.a_Normal = gl.getAttribLocation(cubeProgram, 'a_Normal');
  cubeProgram.a_Position = gl.getAttribLocation(cubeProgram, 'a_Position');
  cubeProgram.u_MvpMatrix = gl.getUniformLocation(cubeProgram, 'u_MvpMatrix');
  cubeProgram.u_LightColor = gl.getUniformLocation(cubeProgram, 'u_LightColor');
  cubeProgram.u_LightDirection = gl.getUniformLocation(cubeProgram, 'u_LightDirection');

  if (cubeProgram.a_Position < 0 || cubeProgram.a_Normal < 0 || cubeProgram.a_Position < 0) {
    console.log('Failed to get the storage location of attribute variable from cubeProgram');
    return null;
  }
  if (!cubeProgram.u_MvpMatrix || !cubeProgram.u_LightColor || !cubeProgram.u_LightDirection) {
    console.log('Failed to get the storage location of uniform variable from cubeProgram');
    return null;
  }

  return cubeProgram;
};

export default createCubeProgram;

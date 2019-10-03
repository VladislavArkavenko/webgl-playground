/* eslint-disable */
import { Matrix4 } from '../../lib/cuon-matrix';
import CONST from './const';

import animate from './animate';
import { drawTriangle, drawPlane, g_mvpMatrix } from './draw';

// Helpers
import { getWebGLContext, createProgram } from '../../lib/cuon-utils';
import initFrameBuffer from './helpers/initFrameBuffer';
import initVertexBuffers from './helpers/initVertexBuffers';

// Models
import { default as planeModel } from './models/plane';
import { default as triangleModel } from './models/triangle';

// Shaders
import SHADOW_VSHADER_SOURCE from '../shaders/shadow.vert';
import SHADOW_FSHADER_SOURCE from '../shaders/shadow.frag';
import NORMAL_VSHADER_SOURCE from '../shaders/normal.vert';
import NORMAL_FSHADER_SOURCE from '../shaders/normal.frag';

const { CLEAR_COLOR, OFFSCREEN, LIGHT, EYE, CENTER } = CONST;

function main() {
  const canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  const gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Initialize shadow shaders
  const shadowProgram = createProgram(gl, SHADOW_VSHADER_SOURCE, SHADOW_FSHADER_SOURCE);
  shadowProgram.a_Position = gl.getAttribLocation(shadowProgram, 'a_Position');
  shadowProgram.u_MvpMatrix = gl.getUniformLocation(shadowProgram, 'u_MvpMatrix');

  if (shadowProgram.a_Position < 0 || !shadowProgram.u_MvpMatrix) {
    console.log('Failed to get the storage location of variable from shadowProgram');
    return;
  }

  // Initialize normal shaders
  const normalProgram = createProgram(gl, NORMAL_VSHADER_SOURCE, NORMAL_FSHADER_SOURCE);
  normalProgram.a_Color = gl.getAttribLocation(normalProgram, 'a_Color');
  normalProgram.a_Position = gl.getAttribLocation(normalProgram, 'a_Position');
  normalProgram.u_MvpMatrix = gl.getUniformLocation(normalProgram, 'u_MvpMatrix');
  normalProgram.u_ShadowMap = gl.getUniformLocation(normalProgram, 'u_ShadowMap');
  normalProgram.u_MvpMatrixFromLight = gl.getUniformLocation(normalProgram, 'u_MvpMatrixFromLight');

  if (
    normalProgram.a_Position < 0 ||
    normalProgram.a_Color < 0 ||
    !normalProgram.u_MvpMatrix ||
    !normalProgram.u_MvpMatrixFromLight ||
    !normalProgram.u_ShadowMap
  ) {
    console.log('Failed to get the storage location of variable from normalProgram');
    return;
  }

  // Set the vertex information
  const triangle = initVertexBuffers(gl, triangleModel);
  const plane = initVertexBuffers(gl, planeModel);
  if (!triangle || !plane) {
    console.log('Failed to set the vertex information');
    return;
  }

  // Initialize framebuffer object (FBO)
  const fbo = initFrameBuffer(gl);
  if (!fbo) {
    console.log('Failed to initialize frame buffer object');
    return;
  }

  // Set a texture object to the texture unit
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, fbo.texture);

  // Set the clear color and enable the depth test
  gl.clearColor(...CLEAR_COLOR);
  gl.enable(gl.DEPTH_TEST);

  // Prepare matrix for generating a shadow map
  const viewProjMatrixFromLight = new Matrix4();
  viewProjMatrixFromLight.setPerspective(70.0, OFFSCREEN.width / OFFSCREEN.height, 1.0, 200.0);
  viewProjMatrixFromLight.lookAt(
    LIGHT.x,
    LIGHT.y,
    LIGHT.z,
    CENTER.x,
    CENTER.y,
    CENTER.z,
    0.0,
    1.0,
    0.0
  );

  // Prepare matrix for regular drawing
  const viewProjMatrix = new Matrix4();
  viewProjMatrix.setPerspective(45, canvas.width / canvas.height, 1.0, 100.0);
  viewProjMatrix.lookAt(EYE.x, EYE.y, EYE.z, CENTER.x, CENTER.y, CENTER.z, 0.0, 1.0, 0.0);

  let currentAngle = 0.0; // in deg
  const mvpMatrixFromLight_t = new Matrix4(); // for triangle
  const mvpMatrixFromLight_p = new Matrix4(); // for plane

  const tick = function() {
    currentAngle = animate(currentAngle);

    // Change the drawing destination to frame buffer
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.viewport(0, 0, OFFSCREEN.width, OFFSCREEN.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Draw in frame buffer
    gl.useProgram(shadowProgram);
    drawTriangle(gl, shadowProgram, triangle, currentAngle, viewProjMatrixFromLight);
    mvpMatrixFromLight_t.set(g_mvpMatrix);
    drawPlane(gl, shadowProgram, plane, viewProjMatrixFromLight);
    mvpMatrixFromLight_p.set(g_mvpMatrix);

    // Change the drawing destination to color buffer
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Draw in color buffer
    gl.useProgram(normalProgram);
    gl.uniform1i(normalProgram.u_ShadowMap, 0); // Pass 0 for gl.TEXTURE0
    gl.uniformMatrix4fv(normalProgram.u_MvpMatrixFromLight, false, mvpMatrixFromLight_t.elements);
    drawTriangle(gl, normalProgram, triangle, currentAngle, viewProjMatrix);
    gl.uniformMatrix4fv(normalProgram.u_MvpMatrixFromLight, false, mvpMatrixFromLight_p.elements);
    drawPlane(gl, normalProgram, plane, viewProjMatrix);

    window.requestAnimationFrame(tick);
  };
  tick();
}
// To start drawing after DOM has loaded.
setTimeout(main, 0);

/* eslint-disable */
import { Matrix4 } from '../../lib/cuon-matrix';
import { getWebGLContext } from '../../lib/cuon-utils';

import linearAnimation from './animations/linearAnimation';
import drawAxis from './draw/axis';
import drawTicks from './draw/ticks';
import { drawArrayOfCubes } from './draw/cube';
import initVertexBuffers from './helpers/initVertexBuffers';

// Programs
import createCubeProgram from './programs/createCubeProgram';
import createAxisProgram from './programs/createAxisProgram';
import createTicksProgram from './programs/createTicksProgram';

// Models
import cubeModel from './models/cubeModel';
import axisModel from './models/axisModel';
import ticksModel from './models/ticksModel';
import drawLabels from './draw/labels';

const UP = [0, 1, 0];
const EYE = [8, 10, 25];
const CENTER = [8, 0, 0];
const FOV = 40;
const CLIPPING_PLANES = [1, 100];
const CLEAR_COLOR = [0.8, 0.8, 0.8, 1];
const DURATION = 1.5;

const data = [1, 2, 5, 2, 4, 6, 7, 2, 1];

// Init Canvas
const canvas = document.getElementById('webgl');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.aspect = canvas.width / canvas.height;

let dragStartPosition = [0, 0];

let angles = [0, 0];
let oldAngles = [0, 0];

let translate = [0, 0];
let oldTranslate = [0, 0];

window.addEventListener('mousemove', (e) => {
  if(e.which === 1) {
    const rotateX = (e.clientX - dragStartPosition[0]) / canvas.width * 360;
    const rotateY = (e.clientX - dragStartPosition[1]) / canvas.height * 360;
    angles = [oldAngles[0] + rotateX, oldAngles[1] + rotateY];
  } else if(e.which === 3) {
    const translateX = (e.clientX - dragStartPosition[0]) / canvas.width * 40;
    const translateY = (e.clientY - dragStartPosition[1]) / canvas.height * 40;
    translate = [oldTranslate[0] + translateX, oldTranslate[1] + translateY];
  }
});
window.addEventListener('mousedown', (e) => {
  dragStartPosition = [e.clientX, e.clientY];
});
window.addEventListener('mouseup', () => {
  oldAngles = [...angles];
  oldTranslate = [...translate];
});

function index() {
  const gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // TODO: Create initAllPrograms
  const cubeProgram = createCubeProgram(gl);
  if (!cubeProgram) {
    console.log('Failed to initialize cube program');
    return;
  }

  const axisProgram = createAxisProgram(gl);
  if (!axisProgram) {
    console.log('Failed to initialize axis program');
    return;
  }

  const ticksProgram = createTicksProgram(gl);
  if (!ticksProgram) {
    console.log('Failed to initialize axis program');
    return;
  }

  const cube = initVertexBuffers(gl, cubeModel);
  if (!cube) {
    console.log('Failed to set the vertex information');
    return;
  }

  const axis = initVertexBuffers(gl, axisModel);
  if (!axis) {
    console.log('Failed to set the vertex information');
    return;
  }

  const ticks = initVertexBuffers(gl, ticksModel);
  if (!ticks) {
    console.log('Failed to set the vertex information');
    return;
  }

  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(...CLEAR_COLOR);

  const vpMatrix = new Matrix4();

  (function tick() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    vpMatrix.setPerspective(FOV, canvas.aspect, ...CLIPPING_PLANES);
    vpMatrix.lookAt(...EYE, ...CENTER, ...UP);
    vpMatrix.rotate(angles[0], 0, 1,0);
    vpMatrix.translate(translate[0], 0, translate[1]); // TODO: Fix when rotation.

    drawLabels(canvas, vpMatrix);
    drawAxis(gl, axisProgram, axis, vpMatrix);
    drawTicks(gl, ticksProgram, ticks, vpMatrix);
    drawArrayOfCubes(gl, cubeProgram, cube, vpMatrix, linearAnimation(data, DURATION));

    requestAnimationFrame(tick);
  }());
}

// To start drawing after DOM has loaded.
setTimeout(index, 0);

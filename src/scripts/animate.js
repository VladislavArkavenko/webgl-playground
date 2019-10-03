import CONST from './const';

const { ANGLE_STEP } = CONST;

let last = Date.now();

function animate(angle) {
  const now = Date.now(); // Calculate the elapsed time
  const elapsed = now - last;
  last = now;
  // Update the current rotation angle (adjusted by the elapsed time)
  const newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
  return newAngle % 360;
}

export default animate;

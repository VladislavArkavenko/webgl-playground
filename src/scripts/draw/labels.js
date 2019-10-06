import { Vector4 } from '../../../lib/cuon-matrix';

const textCanvas = document.getElementById('hud');
textCanvas.width = window.innerWidth;
textCanvas.height = window.innerHeight;
textCanvas.aspect = textCanvas.width / textCanvas.height;

const ctx = textCanvas.getContext('2d');

function drawLabel(vpMatrix, index) {
  const transformedPosition = vpMatrix.multiplyVector4(new Vector4([0, index, 0, 1])).elements;

  transformedPosition[0] /= transformedPosition[3];
  transformedPosition[1] /= transformedPosition[3];

  const pixelX = (transformedPosition[0] * 0.5 + 0.5) * textCanvas.width;
  const pixelY = (transformedPosition[1] * -0.5 + 0.5) * textCanvas.height;

  ctx.save();
  ctx.translate(pixelX, pixelY);
  ctx.fillText(`${index * 100}`, 2, -8);
  ctx.restore();
}

export default function drawLabels(canvas, vpMatrix) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  for (let i = 0; i < 7; i += 1) {
    drawLabel(vpMatrix, i + 1);
  }
}

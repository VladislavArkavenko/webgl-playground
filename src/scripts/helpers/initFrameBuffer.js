import CONST from '../const';

const {
  OFFSCREEN: { width, height }
} = CONST;

function error(gl, framebuffer, texture, depthBuffer) {
  if (framebuffer) {
    gl.deleteFramebuffer(framebuffer);
  }
  if (texture) {
    gl.deleteTexture(texture);
  }
  if (depthBuffer) {
    gl.deleteRenderbuffer(depthBuffer);
  }
  return null;
}

function initFrameBuffer(gl) {
  let texture;
  let framebuffer;
  let depthBuffer;

  const te = () => error(gl, framebuffer, texture, depthBuffer);

  // Create a framebuffer
  framebuffer = gl.createFramebuffer();
  if (!framebuffer) {
    console.log('Failed to create frame buffer object');
    return te();
  }

  // Create a texture
  texture = gl.createTexture();
  if (!texture) {
    console.log('Failed to create texture object');
    return te();
  }
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  // Create a renderbuffer
  depthBuffer = gl.createRenderbuffer();
  if (!depthBuffer) {
    console.log('Failed to create renderbuffer object');
    return te();
  }
  gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);

  // Attach the texture and the renderbuffer object to the FBO
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
  gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);

  // Check for errors
  const e = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
  if (e !== gl.FRAMEBUFFER_COMPLETE) {
    console.log(`Frame buffer object is incomplete: ${e.toString()}`);
    return te();
  }

  framebuffer.texture = texture;

  // Unbind the buffer object
  gl.bindTexture(gl.TEXTURE_2D, null);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.bindRenderbuffer(gl.RENDERBUFFER, null);

  return framebuffer;
}

export default initFrameBuffer;

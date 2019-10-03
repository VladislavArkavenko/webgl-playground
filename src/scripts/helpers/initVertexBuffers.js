function prepareArrayBuffer(gl, data, num, type) {
  const buffer = gl.createBuffer();
  if (!buffer) {
    console.log('Failed to create the buffer object');
    return null;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

  buffer.num = num;
  buffer.type = type;

  return buffer;
}

function prepareElementArrayBuffer(gl, data, type) {
  const buffer = gl.createBuffer();
  if (!buffer) {
    console.log('Failed to create the buffer object');
    return null;
  }
  // Write date into the buffer object
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);

  buffer.type = type;

  return buffer;
}

export default function initVertexBuffers(gl, model) {
  const { colors, indices, vertices } = model;

  const obj = {
    numIndices: indices.length,
    colorBuffer: prepareArrayBuffer(gl, colors, 3, gl.FLOAT),
    vertexBuffer: prepareArrayBuffer(gl, vertices, 3, gl.FLOAT),
    indexBuffer: prepareElementArrayBuffer(gl, indices, gl.UNSIGNED_BYTE)
  };

  if (!obj.vertexBuffer || !obj.colorBuffer || !obj.indexBuffer) {
    return null;
  }

  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  return obj;
}

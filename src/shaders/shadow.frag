#ifdef GL_ES
precision mediump float;
#endif

#pragma glslify: packDepth = require('./helpers/packDepth')

void main() {
    gl_FragColor = packDepth(gl_FragCoord.z);
}

#ifdef GL_ES
precision mediump float;
#endif

#pragma glslify: floatToVec4 = require('./helpers/floatToVec4')

void main() {
    gl_FragColor = floatToVec4(gl_FragCoord.z);
}

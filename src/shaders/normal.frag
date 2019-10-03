#ifdef GL_ES
precision mediump float;
#endif

#pragma glslify: vec4ToFloat = require('./helpers/vec4ToFloat')

uniform sampler2D u_ShadowMap;
varying vec4 v_PositionFromLight;
varying vec4 v_Color;

void main() {
    vec3 shadowCoord = (v_PositionFromLight.xyz/v_PositionFromLight.w)/2.0 + 0.5;
    vec4 rgbaDepth = texture2D(u_ShadowMap, shadowCoord.xy);
    float depth = vec4ToFloat(rgbaDepth);
    float visibility = (shadowCoord.z > depth + 0.0015) ? 0.7 : 1.0;
    gl_FragColor = vec4(v_Color.rgb * visibility, v_Color.a);
}

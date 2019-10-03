float vec4ToFloat(const in vec4 v) {
    const vec4 bitShift = vec4(1.0, 1.0/256.0, 1.0/(256.0*256.0), 1.0/(256.0*256.0*256.0));
    float f = dot(v, bitShift);
    return f;
}

#pragma glslify: export(vec4ToFloat)

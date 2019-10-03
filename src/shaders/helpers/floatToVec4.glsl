vec4 floatToVec4(const in float f) {
    const vec4 bitShift = vec4(1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0);
    const vec4 bitMask = vec4(1.0/256.0, 1.0/256.0, 1.0/256.0, 0.0);
    vec4 v = fract(f * bitShift);
    v -= v.gbaa * bitMask;
    return v;
}

#pragma glslify: export(floatToVec4)

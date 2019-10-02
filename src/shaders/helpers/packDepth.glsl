vec4 packDepth(const in float depth) {
    const vec4 bitShift = vec4(1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0);
    const vec4 bitMask = vec4(1.0/256.0, 1.0/256.0, 1.0/256.0, 0.0);
    vec4 color = fract(depth * bitShift);
    color -= color.gbaa * bitMask;
    return color;
}

#pragma glslify: export(packDepth)

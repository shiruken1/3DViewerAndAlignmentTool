precision highp float;

varying vec3 vColor;
varying float vAlpha;

void main() {
  float dist = distance(gl_PointCoord, vec2(0.5));
  if (dist > 0.5) discard;

  gl_FragColor = vec4(vColor, vAlpha);
}

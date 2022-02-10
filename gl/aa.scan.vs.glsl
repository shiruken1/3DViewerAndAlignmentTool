@import ./noise;

varying vec3 vColor;
varying float vAlpha;

void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  addNoise(mvPosition);

  // rendered point sizes range from 2 to 5, with inverse distance
  gl_PointSize = max(2.0, min(5.0, 1.0 / -mvPosition.z));
  gl_Position = projectionMatrix * mvPosition;

  // alpha ranges from 0.5 to 1.0, with inverse distance squared
  vAlpha = max(0.5, min(1.0, 50.0 / (mvPosition.z * mvPosition.z)));
  vColor = vec3(0.733, 0.733, 0.733); // gray
}

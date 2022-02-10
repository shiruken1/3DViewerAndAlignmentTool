precision highp float;

uniform vec3 color;
uniform int objectId;
uniform vec4 selectedPlane1;
uniform vec4 selectedPlane2;
uniform vec4 selectedPlane3;
uniform vec3 selectedColor1;
uniform vec3 selectedColor2;
uniform vec3 selectedColor3;
uniform int selectedId1;
uniform int selectedId2;
uniform int selectedId3;

varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec3 vColor;
varying float vAlpha;
varying float vMetalness;
varying float vRoughness;

#define NORMAL_TOLERANCE 0.8 // 0.8 is about 35 degrees
#define DISTANCE_TOLERANCE 0.1
#define PARALLEL_ALPHA 0.25
#define UNSELECTED_COLOR vec3(0.733, 0.733, 0.733)

void main() {
  // Coordinate projection
  vec3 objectNormal = vec3( normal );
  vec3 transformedNormal = normalMatrix * objectNormal;
  vNormal = normalize( transformedNormal );

  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
  vViewPosition = -mvPosition.xyz;
  gl_Position = projectionMatrix * mvPosition;

  vMetalness = 0.25;
  vRoughness = 0.5;
  vAlpha = 1.0;

  float dot1 = dot(normal, selectedPlane1.xyz);
  if (abs(dot1) > NORMAL_TOLERANCE) {
    vColor = selectedColor1;
    if (objectId != selectedId1 || dot1 < 0.0) {
        vAlpha = PARALLEL_ALPHA;
    }
    float dist = abs(dot(position, selectedPlane1.xyz) + selectedPlane1.w);
    if (dist > DISTANCE_TOLERANCE) {
      vAlpha = PARALLEL_ALPHA;
    }
    return;
  }
  float dot2 = dot(normal, selectedPlane2.xyz);
  if (abs(dot2) > NORMAL_TOLERANCE) {
    vColor = selectedColor2;
    if (objectId != selectedId2 || dot2 < 0.0) {
        vAlpha = PARALLEL_ALPHA;
    }
    float dist = abs(dot(position, selectedPlane2.xyz) + selectedPlane2.w);
    if (dist > DISTANCE_TOLERANCE) {
      vAlpha = PARALLEL_ALPHA;
    }
    return;
  }
  float dot3 = dot(normal, selectedPlane3.xyz);
  if (abs(dot3) > NORMAL_TOLERANCE) {
    vColor = selectedColor3;
    if (objectId != selectedId3 || dot3 < 0.0) {
        vAlpha = PARALLEL_ALPHA;
    }
    float dist = abs(dot(position, selectedPlane3.xyz) + selectedPlane3.w);
    if (dist > DISTANCE_TOLERANCE) {
      vAlpha = PARALLEL_ALPHA;
    }
    return;
  }
  vColor = UNSELECTED_COLOR;
}

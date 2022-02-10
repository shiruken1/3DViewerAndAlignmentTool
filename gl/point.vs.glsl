@import ./noise;

attribute float dist;

uniform int displayEnabled;
uniform float cropLimit;
uniform float redLimit;
uniform float yellowLimit;
uniform float greenLimit;
uniform int objectMode;
uniform int focusIndex;
uniform vec3 focusCenter;
uniform float focusRadius;

varying float vDiscard;
varying vec3 vColor;
varying float vAlpha;

// define display flags
#define DISPLAY_GREEN   1
#define DISPLAY_YELLOW  2
#define DISPLAY_RED     4
#define DISPLAY_CROPPED 8

// define bitwise operators
bool odd(int val)
{
  return val != (val / 2) * 2;
}

bool testFlag(int val, int flag)
{
  return odd(val / flag);
}

/*
#define BITSIZE 31
#define OR 0
#define AND 1
int bitwise(int op, int val1, int val2)
{
  int b = 1;
  int result = 0;
  for (int i=0; i<BITSIZE; i++)
  {
    bool odd1 = odd(val1);
    bool odd2 = odd(val2);

    if ((op == AND && odd1 && odd2) ||
        (op == OR && (odd1 || odd2))) result += b;

    val1 /= 2;
    val2 /= 2;

    if ((op == AND && (val1 == 0 || val2 == 0)) ||
        (op == OR && (val1 == 0 && val2 == 0))) break;
    b *= 2;
  }
  return result;
}
*/

// object mode
#define OBJMODE_ISOLATE   0
#define OBJMODE_CONTEXT   1
#define OBJMODE_EXPAND    2

// define some hues
#define RED 0.0
#define YELLOW 0.1666667
#define GREEN 0.3333333

vec3 hsv2rgb( in vec3 c ){
  vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );
  return c.z * mix( vec3(1.0), rgb, c.y);
}


void main() {
  if (displayEnabled == 0)
  {
    vDiscard = 1.0;
    return;
  }
  vDiscard = 0.0;

  if (focusIndex != -1)
  {
    float dist = distance(focusCenter, position);
    if (dist > focusRadius) {
      vDiscard = 1.0;
      return;
    }
  }

  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  addNoise(mvPosition);

  // rendered point sizes range from 2 to 5, with inverse distance
  gl_PointSize = max(2.0, min(5.0, 1.0 / -mvPosition.z));
  gl_Position = projectionMatrix * mvPosition;
  // alpha ranges from 0.5 to 1.0, with inverse distance squared
  vAlpha = max(0.5, min(1.0, 50.0 / (mvPosition.z * mvPosition.z)));

  // map dist to color
  float ad = abs(dist);
  if (ad > cropLimit) {
    if (!testFlag(displayEnabled, DISPLAY_CROPPED)) {
      vDiscard = 1.0;
      return;
    }
    vColor = vec3(0.5, 0.5, 0.5); // gray
  } else {
    float hue = GREEN;

    if (ad > redLimit) {
      if (!testFlag(displayEnabled, DISPLAY_RED)) {
        vDiscard = 1.0;
        return;
      }
      hue = RED;
    } else if (ad > yellowLimit) {
      if (!testFlag(displayEnabled, DISPLAY_YELLOW)) {
        vDiscard = 1.0;
        return;
      }
      hue = mix(YELLOW, RED, (ad - yellowLimit) / (redLimit - yellowLimit));
    } else if (!testFlag(displayEnabled, DISPLAY_GREEN)) {
      vDiscard = 1.0;
      return;
    } else if (ad > greenLimit) {
       hue = mix(GREEN, YELLOW, (ad - greenLimit) / (yellowLimit - greenLimit));
    }

    vColor = hsv2rgb(vec3(hue, 0.8, 1.0));
  }
}

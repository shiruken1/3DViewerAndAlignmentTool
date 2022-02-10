precision highp float;
//precision highp int;

//uniform vec3 color;
//attribute vec3 color;

uniform int displayEnabled;
uniform int objectMode;
uniform int symbolDisplay;
uniform int focusIndex;
uniform int objectIndex;
uniform float transparent;
// uniform float opacity;
uniform float unselectAlpha;
uniform float missing;
uniform int seen;
uniform float variance;
uniform float cropLimit;
uniform float redLimit;
uniform float yellowLimit;
// uniform float greenLimit;
uniform vec3 focusCenter;
uniform float focusRadius;

varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec3 vColor;
varying float vAlpha;
varying float vDiscard;
varying float vMetalness;
varying float vRoughness;

// object mode
#define OBJMODE_ISOLATE   0
#define OBJMODE_CONTEXT   1
#define OBJMODE_EXPAND    2

// define display flags
#define DISPLAY_GREEN     1
#define DISPLAY_YELLOW    2
#define DISPLAY_RED       4
#define DISPLAY_CROPPED   8
#define DISPLAY_MISSING   16
#define DISPLAY_UNSCANNED 32

// define symbol flags
#define SYMBOL_VARIAMCE    1

// define bitwise operators
bool odd(int val)
{
  return val != (val / 2) * 2;
}

bool testFlag(int val, int flag)
{
  return odd(val / flag);
}

// define some hues
#define RED 0.0
#define YELLOW 0.1666667
#define GREEN 0.3333333
#define MISSING vec3(1.0, 0.75, 0.5) // orange
#define INSUFFICIENT vec3(1.0, 0.95, 0.85) // buff
#define CROP vec3(1.0, 1.0, 1.0) // white

vec3 hsv2rgb( in vec3 c ) {
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

  // Coordinate projection
  vec3 objectNormal = vec3( normal );
  vec3 transformedNormal = normalMatrix * objectNormal;
  vNormal = normalize( transformedNormal );

  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
  vViewPosition = -mvPosition.xyz;
  gl_Position = projectionMatrix * mvPosition;


  if (symbolDisplay != 0)
  {
    vAlpha = 0.5;
    vColor = vec3(0.0, 1.0, 1.0);
    return;
  }

  // Set matte surfaces
  vMetalness = 0.0;
  vRoughness = 1.0;
  vAlpha = 1.0;

  /*
  // Debugging
  vColor = vec3(variance,variance,variance);
  vColor = vec3(1.0, 1.0, 1.0);
  return;
  */

  if (symbolDisplay != 0)
  {
    vColor = vec3(0.0, 1.0, 1.0);
    return;
  }

  // Handle object selection
  bool unseen = seen == 0;
  bool focusOn = focusIndex != -1;
  bool focusedObject = focusIndex == objectIndex;
  if (focusOn && !focusedObject)
  {
    if (objectMode == OBJMODE_ISOLATE ||
      unselectAlpha == 0.0 || unseen)
    {
      vDiscard = 1.0;
      return;
    }

    if (objectMode == OBJMODE_CONTEXT)
    {
      vAlpha = unselectAlpha;
      vColor = vec3(0.5, 0.5, 0.5);
      return;
    }

    if (objectMode == OBJMODE_EXPAND)
    {
      float dist = distance(focusCenter, position);
      if (dist > focusRadius) {
        vDiscard = 1.0;
        return;
      }
    }
  }

  // Handle special cases
  if (missing > 0.0)
  {
    if (!testFlag(displayEnabled, DISPLAY_MISSING))
    {
      vDiscard = 1.0;
      return;
    }
    vColor = MISSING;
    return;
  }

  if (unseen)
  {
    vColor = INSUFFICIENT;
    if (focusOn && focusedObject)  return;

    if (!testFlag(displayEnabled, DISPLAY_UNSCANNED))
    {
      vDiscard = 1.0;
      return;
    }

    vAlpha = 1.0; // testing for SD-2700
    // vAlpha = 0.75;
    // vAlpha = max(seen * 10.0, 0.125);

    return;
  }

  // map variance to color
  float ad = abs(variance);

  bool displayCropped = testFlag(displayEnabled, DISPLAY_GREEN) ||
    testFlag(displayEnabled, DISPLAY_YELLOW) ||
    testFlag(displayEnabled, DISPLAY_RED);

  if (ad > cropLimit && displayCropped)
  {
    vColor = CROP;
    if (focusOn && focusedObject)  return;

    /*
    if (!testFlag(displayEnabled, DISPLAY_CROPPED))
    {
      vDiscard = 1.0;
      return;
    }
    */
    vAlpha = 0.25;
    // vAlpha = 1.0 - (ad - cropLimit) / (1.0 - cropLimit);
    return;
  }

  // Set semi-shiny surfaces
  vMetalness = 0.25;
  vRoughness = 0.5;

  float hue = GREEN;
  if (ad > redLimit)
  {
    if (!testFlag(displayEnabled, DISPLAY_RED))
    {
      vDiscard = 1.0;
      return;
    }
    hue = RED;
  }
  else if (ad > yellowLimit)
  {
    if (!testFlag(displayEnabled, DISPLAY_YELLOW))
    {
      vDiscard = 1.0;
      return;
    }
    hue = YELLOW;
  }
  else if (!testFlag(displayEnabled, DISPLAY_GREEN))
  {
    vDiscard = 1.0;
    return;
  }
  /*
  else if (ad == 0.0)
  {
    vColor = vec3(1.0, 0.75, 0.75); // pink
    return;
  }
  */

  vColor = hsv2rgb(vec3(hue, 0.8, 1.0));

  if (focusOn && !focusedObject)
  {
    //vAlpha = 0.25;
    vColor *= 0.5;
  }
  // vColor = color;
}

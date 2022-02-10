// Introduce noise to reduce moire patterns
#define USE_NOISE 1
#if USE_NOISE
  // define noise factor; 1.0 is no noise
  #define NOISE 40.0

  #define NOISIER 0
  #if NOISIER
    // More accurate but slower rand generator
    highp float rand(vec2 co)
    {
        highp float a = 12.9898;
        highp float b = 78.233;
        highp float c = 43758.5453;
        highp float dt= dot(co.xy ,vec2(a,b));
        highp float sn= mod(dt,3.14);
        return (fract(sin(sn) * c) - 0.5) / NOISE;
    }
  #else
    // Faster "canonical" rand generator
    highp float rand(vec2 co)
    {
       return (fract(sin(dot(co.xy,vec2(12.9898,78.233))) * 43758.5453) -0.5) / NOISE;
    }
  #endif

  void addNoise(inout vec4 p) {
    p.x += rand(p.yz);
    p.y += rand(p.xz);
    p.z += rand(p.xy);
  }
#else
  void addNoise(inout vec4 p) {

  }
#endif

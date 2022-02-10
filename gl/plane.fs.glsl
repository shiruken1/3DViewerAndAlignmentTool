precision highp float;
precision highp int;

uniform int symbolDisplay;

#define PI 3.14159265359
#define RECIPROCAL_PI 0.31830988618
#define EPSILON 1e-6
#define MAXIMUM_SPECULAR_COEFFICIENT 0.16
#define DEFAULT_SPECULAR_COEFFICIENT 0.04


struct DirectionalLight {
	vec3 direction;
	vec3 color;
	int shadow;
	float shadowBias;
	float shadowRadius;
	vec2 shadowMapSize;
};

uniform DirectionalLight directionalLights[2];
uniform vec3 ambientLightColor;
//uniform vec3 emissive;

varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec3 vColor;
varying float vAlpha;
varying float vDiscard;
varying float vMetalness;
varying float vRoughness;


struct PhysicalMaterial {
	vec3	diffuseColor;
	float	specularRoughness;
	vec3	specularColor;
	#ifndef STANDARD
		float clearCoat;
		float clearCoatRoughness;
	#endif
};

struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};

struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};

struct GeometricContext {
	vec3 position;
	vec3 normal;
	vec3 viewDir;
};

float pow2( const in float x ) { return x*x; }

vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
//	#ifndef PHYSICALLY_CORRECT_LIGHTS
//		irradiance *= PI;
//	#endif
	return irradiance;
}

vec3 BRDF_Diffuse_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}

void RE_IndirectDiffuse_Physical( const in vec3 irradiance,
  const in GeometricContext geometry, const in PhysicalMaterial material,
  inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * ( material.diffuseColor );
}

void getDirectionalDirectLightIrradiance( const in DirectionalLight directionalLight, const
  in GeometricContext geometry, out IncidentLight directLight ) {
	directLight.color = directionalLight.color;
	directLight.direction = directionalLight.direction;
	directLight.visible = true;
}

float clearCoatDHRApprox( const in float roughness, const in float dotNL ) {
	return DEFAULT_SPECULAR_COEFFICIENT + ( 1.0 - DEFAULT_SPECULAR_COEFFICIENT ) * ( pow( 1.0 - dotNL, 5.0 ) * pow( 1.0 - roughness, 2.0 ) );
}

vec3 F_Schlick( const in vec3 specularColor, const in float dotLH ) {
	float fresnel = exp2( ( -5.55473 * dotLH - 6.98316 ) * dotLH );
	return ( 1.0 - specularColor ) * fresnel + specularColor;
}
float G_GGX_Smith( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gl = dotNL + sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	float gv = dotNV + sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	return 1.0 / ( gl * gv );
}
float G_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}

vec3 BRDF_Specular_GGX( const in IncidentLight incidentLight, const in GeometricContext
  geometry, const in vec3 specularColor, const in float roughness ) {
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( incidentLight.direction + geometry.viewDir );
	float dotNL = saturate( dot( geometry.normal, incidentLight.direction ) );
	float dotNV = saturate( dot( geometry.normal, geometry.viewDir ) );
	float dotNH = saturate( dot( geometry.normal, halfDir ) );
	float dotLH = saturate( dot( incidentLight.direction, halfDir ) );
	vec3 F = F_Schlick( specularColor, dotLH );
	float G = G_GGX_SmithCorrelated( alpha, dotNL, dotNV );
	float D = D_GGX( alpha, dotNH );
	return F * ( G * D );
}

void RE_Direct_Physical( const in IncidentLight directLight, const in GeometricContext
  geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometry.normal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
//	#ifndef PHYSICALLY_CORRECT_LIGHTS
//		irradiance *= PI;
//	#endif
//	#ifndef STANDARD
		float clearCoatDHR = material.clearCoat *
    clearCoatDHRApprox( material.clearCoatRoughness, dotNL );
//	#else
//		float clearCoatDHR = 0.0;
//	#endif
	reflectedLight.directSpecular += ( 1.0 - clearCoatDHR ) * irradiance * BRDF_Specular_GGX( directLight, geometry, material.specularColor, material.specularRoughness );
	reflectedLight.directDiffuse += ( 1.0 - clearCoatDHR ) * irradiance * BRDF_Diffuse_Lambert( material.diffuseColor );
//	#ifndef STANDARD
		reflectedLight.directSpecular += irradiance * material.clearCoat *
    BRDF_Specular_GGX( directLight, geometry, vec3( DEFAULT_SPECULAR_COEFFICIENT ),
      material.clearCoatRoughness );
//	#endif
}


void main() {
  if (vDiscard != 0.0) discard;

	vec4 diffuseColor = vec4( vColor, vAlpha );
	//vec4 diffuseColor = vec4( vColor, 1.0 );

	if (symbolDisplay != 0)
	{
	  gl_FragColor = diffuseColor;
	  return;
	}

	PhysicalMaterial material;
	material.diffuseColor = diffuseColor.rgb * ( 1.0 - vMetalness );
	material.specularRoughness = clamp( vRoughness, 0.04, 1.0 );

	material.specularColor = mix( vec3( DEFAULT_SPECULAR_COEFFICIENT ), diffuseColor.rgb,
	  vMetalness );


	vec3 normal = normalize( vNormal );

	GeometricContext geometry;
	geometry.position = -vViewPosition;
	geometry.normal = normal;
	geometry.viewDir = normalize( vViewPosition );

	IncidentLight directLight;

	// Initialize reflected light
	ReflectedLight reflectedLight =
    ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );

	DirectionalLight directionalLight = directionalLights[0];
	if (vColor.r != vColor.g || vColor.g != vColor.b || vColor.b != vColor.r)
	{
  	//directionalLight.color = vColor;
	}
	getDirectionalDirectLightIrradiance( directionalLight, geometry, directLight );
	RE_Direct_Physical( directLight, geometry, material, reflectedLight );

  directionalLight = directionalLights[1];
	if (vColor.r != vColor.g || vColor.g != vColor.b || vColor.b != vColor.r)
	{
  	//directionalLight = directionalLights[1];
	}
	getDirectionalDirectLightIrradiance( directionalLight, geometry, directLight );
	RE_Direct_Physical( directLight, geometry, material, reflectedLight );

	//vec3 totalEmissiveRadiance = emissive;
	vec3 totalEmissiveRadiance = vec3(0.0, 0.0, 0.0);
  //vec3 totalEmissiveRadiance = vec3(0.5, 0.5, 0.5);

	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );

	RE_IndirectDiffuse_Physical( irradiance, geometry, material, reflectedLight );

	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
 	gl_FragColor = vec4( outgoingLight, diffuseColor.a );
	//gl_FragColor = vec4( outgoingLight, 0.25 );

  //gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
}


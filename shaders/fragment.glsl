#version 300 es
precision highp float;

in vec3 fs_pos;
in vec3 fs_norm;
in vec2 fs_uv;

// uniform vec4 lightDir1;
// uniform vec4 lightDir2;
// uniform vec4 lightDir3;
uniform vec4 selector;
uniform vec3 eyePos;

uniform vec4 shown;
uniform vec4 effect;
uniform vec4 texSelect;
uniform vec4 monoSelect;
uniform vec4 repMetRough;

uniform sampler2D u_texture;
// uniform sampler2D u_tex_NormalMap;
// uniform sampler2D u_tex_RMAO;
uniform samplerCube u_tex_Env;

//-----------------------
uniform vec4 LAlightType;
uniform vec3 LAPos;
uniform vec3 LADir;
uniform float LAConeOut;
uniform float LAConeIn;
uniform float LADecay;
uniform float LATarget;
uniform vec4 LAlightColor;

uniform vec4 LBlightType;
uniform vec3 LBPos;
uniform vec3 LBDir;
uniform float LBConeOut;
uniform float LBConeIn;
uniform float LBDecay;
uniform float LBTarget;
uniform vec4 LBlightColor;

uniform vec4 LClightType;
uniform vec3 LCPos;
uniform vec3 LCDir;
uniform float LCConeOut;
uniform float LCConeIn;
uniform float LCDecay;
uniform float LCTarget;
uniform vec4 LClightColor;

uniform vec4 ambientType;
uniform vec4 diffuseType;
uniform vec4 specularType;
uniform vec4 emissionType;

uniform float DTexMix;
uniform float DToonTh;
uniform float SToonTh;

uniform vec4 ambientLightColor;
uniform vec4 ambientLightLowColor;
uniform vec4 SHLeftLightColor;
uniform vec4 SHRightLightColor;
uniform vec3 ADir;
uniform vec4 diffuseColor;
uniform vec4 specularColor;
uniform vec4 ambientMatColor;
uniform vec4 emitColor;
uniform float SpecShine;
//----------------------

const float ambEmuFact = 0.0;

out vec4 color;

//const float heightScale = 0.02;

// vec2 ParallaxMapping(vec2 texCoords, vec3 viewDir)
// { 

// //    float height =  texture(u_tex_NormalMap, texCoords).w;    
// //    vec2 p = viewDir.xy / viewDir.z * (height * heightScale);
// //    return texCoords - p;

//     // number of depth layers
//     const float minLayers = 8.0;
//     const float maxLayers = 32.0;
//     float numLayers = mix(maxLayers, minLayers, abs(dot(vec3(0.0, 0.0, 1.0), viewDir)));  
//     // calculate the size of each layer
//     float layerDepth = 1.0 / numLayers;
//     // depth of current layer
//     float currentLayerDepth = 0.0;
//     // the amount to shift the texture coordinates per layer (from vector P)
//     vec2 P = viewDir.xy / viewDir.z * heightScale; 
//     vec2 deltaTexCoords = P / numLayers;
  
//     // get initial values
//     vec2  currentTexCoords     = texCoords;
//     float currentDepthMapValue = texture(u_texture, currentTexCoords).w;
      
//     while(currentLayerDepth < currentDepthMapValue)
//     {
//         // shift texture coordinates along direction of P
//         currentTexCoords -= deltaTexCoords;
//         // get depthmap value at current texture coordinates
//         currentDepthMapValue = texture(u_texture, currentTexCoords).w;  
//         // get depth of next layer
//         currentLayerDepth += layerDepth;  
//     }
    
//     // get texture coordinates before collision (reverse operations)
//     vec2 prevTexCoords = currentTexCoords + deltaTexCoords;

//     // get depth after and before collision for linear interpolation
//     float afterDepth  = currentDepthMapValue - currentLayerDepth;
//     float beforeDepth = texture(u_texture, prevTexCoords).w - currentLayerDepth + layerDepth;
 
//     // interpolation of texture coordinates
//     float weight = afterDepth / (afterDepth - beforeDepth);
//     vec2 finalTexCoords = prevTexCoords * weight + currentTexCoords * (1.0 - weight);

//     return finalTexCoords;

// }

vec3 compLightDir(vec3 LPos, vec3 LDir, vec4 lightType) {
	//lights
	// -> Point
	vec3 pointLightDir = normalize(LPos - fs_pos);
	// -> Direct
	vec3 directLightDir = LDir;
	// -> Spot
	vec3 spotLightDir = normalize(LPos - fs_pos);

	return            directLightDir * lightType.x +
					  pointLightDir * lightType.y +
					  spotLightDir * lightType.z;
}

vec4 compLightColor(vec4 lightColor, float LTarget, float LDecay, vec3 LPos, vec3 LDir,
					float LConeOut, float LConeIn, vec4 lightType) {
	float LCosOut = cos(radians(LConeOut / 2.0));
	float LCosIn = cos(radians(LConeOut * LConeIn / 2.0));

	//lights
	// -> Point
	vec4 pointLightCol = lightColor * pow(LTarget / length(LPos - fs_pos), LDecay);
	// -> Direct
	vec4 directLightCol = lightColor;
	// -> Spot
	vec3 spotLightDir = normalize(LPos - fs_pos);
	float CosAngle = dot(spotLightDir, LDir);
	vec4 spotLightCol = lightColor * pow(LTarget / length(LPos - fs_pos), LDecay) *
						clamp((CosAngle - LCosOut) / (LCosIn - LCosOut), 0.0, 1.0);
	// ----> Select final component
	return          directLightCol * lightType.x +
					pointLightCol * lightType.y +
					spotLightCol * lightType.z;
}

vec4 compDiffuse(vec3 lightDir, vec4 lightCol, vec3 normalVec, vec4 diffColor, vec3 eyedirVec) {
	// Diffuse
	float LdotN = max(0.0, dot(normalVec, lightDir));
	vec4 LDcol = lightCol * diffColor;
	// --> Lambert
	vec4 diffuseLambert = LDcol * LdotN;
	// --> Toon
	vec4 diffuseToon = max(sign(LdotN- DToonTh),0.0) * LDcol;
	// ----> Select final component
	return         diffuseLambert * diffuseType.x +
				   diffuseToon * diffuseType.y;
}

vec4 compSpecular(vec3 lightDir, vec4 lightCol, vec3 normalVec, vec3 eyedirVec) {
	// Specular
	float LdotN = max(0.0, dot(normalVec, lightDir));
	vec3 reflection = -reflect(lightDir, normalVec);
	float LdotR = max(dot(reflection, eyedirVec), 0.0);
	vec3 halfVec = normalize(lightDir + eyedirVec);
	float HdotN = max(dot(normalVec, halfVec), 0.0);
	
	vec4 LScol = lightCol * specularColor * max(sign(LdotN),0.0);
	// --> Phong
	vec4 specularPhong = LScol * pow(LdotR, SpecShine);
	// --> Blinn
	vec4 specularBlinn = LScol * pow(HdotN, SpecShine);
	// --> Toon Phong
	vec4 specularToonP = max(sign(LdotR - SToonTh), 0.0) * LScol;
	// --> Toon Blinn
	vec4 specularToonB = max(sign(HdotN - SToonTh), 0.0) * LScol;

	// ----> Select final component
	return          specularPhong * specularType.x * (1.0 - specularType.z) * (1.0 - specularType.w) +
					specularBlinn * specularType.y * (1.0 - specularType.z) * (1.0 - specularType.w) +
					specularToonP * specularType.z * specularType.x * (1.0 - specularType.w) +
					specularToonB * specularType.z * specularType.y * (1.0 - specularType.w);
}

vec4 compAmbient(vec4 ambColor, vec3 normalVec) {
	// Ambient
	// --> Ambient
	vec4 ambientAmbient = ambientLightColor * ambColor;
	// --> Hemispheric
	float amBlend = (dot(normalVec, ADir) + 1.0) / 2.0;
	vec4 ambientHemi = (ambientLightColor * amBlend + ambientLightLowColor * (1.0 - amBlend)) * ambColor;
	// --> Spherical Harmonics
	const mat4 McInv = mat4(vec4(0.25,0.0,-0.25,0.7071),vec4(0.25,0.6124,-0.25,-0.3536),vec4(0.25,-0.6124,-0.25,-0.3536),vec4(0.25,0.0,0.75,0.0));
	mat4 InCols = transpose(mat4(ambientLightLowColor, SHRightLightColor, SHLeftLightColor, ambientLightColor));
	mat4 OutCols = McInv * InCols;
	vec4 ambientSH = vec4((vec4(1,normalVec) * OutCols).rgb, 1.0) * ambColor;

	// ----> Select final component
	return 		   ambientAmbient * ambientType.x +
				   ambientHemi    * ambientType.y +
				   ambientSH      * ambientType.z;
}

void main() {
	//vec3 n_norm = normalize(fs_norm);

	//// online computation of tangent and bitangent

	// compute derivations of the world position
	// vec3 p_dx = dFdx(fs_pos);
	// vec3 p_dy = dFdy(fs_pos);
	// // compute derivations of the texture coordinate
	// vec2 tc_dx = dFdx(fs_uv);
	// vec2 tc_dy = dFdy(fs_uv);
	// // compute initial tangent and bi-tangent
	// vec3 t = (tc_dy.y * p_dx - tc_dx.y * p_dy) / (tc_dx.x*tc_dy.y - tc_dy.x*tc_dx.y);

	// t = normalize(t - n_norm * dot(n_norm, t));
	// vec3 b = normalize(cross(n_norm,t));
	
	// mat3 tbn = mat3(t, b, n_norm);
	
	// // parallax mapping
	// vec3 v = normalize(eyePos - fs_pos);

    // vec3 viewDir = transpose(tbn) * v;
    // vec2 texCoords = fs_uv; // mix(fs_uv, ParallaxMapping(fs_uv,  viewDir), 0.0);       
	
	// vec4 nMap = texture(u_texture, texCoords);
	// vec3 n = n_norm; // mix(n_norm, normalize(tbn * (nMap.xyz * 2.0 - 1.0)), 0.0);

	//OUR TEXTURE LINE
	vec4 texCol = texture(u_texture, fs_uv);
	vec3 normalVec = normalize(fs_norm);
	vec3 eyedirVec = normalize(eyePos - fs_pos);

	vec4 diffColor = diffuseColor * (1.0 - DTexMix) + texCol * DTexMix;
	vec4 ambColor = ambientMatColor * (1.0 - DTexMix) + texCol * DTexMix;
	vec4 emit = (emitColor * (1.0 - DTexMix) + texCol * DTexMix * max(max(emitColor.r, emitColor.g), emitColor.b)) * emissionType.r;
	
	//LIGHTS
	vec3 LAlightDir = compLightDir(LAPos, LADir, LAlightType);
	vec4 LAlightCol = compLightColor(LAlightColor, LATarget, LADecay, LAPos, LADir,
								     LAConeOut, LAConeIn, LAlightType);

	vec3 LBlightDir = compLightDir(LBPos, LBDir, LBlightType);
	vec4 LBlightCol = compLightColor(LBlightColor, LBTarget, LBDecay, LBPos, LBDir,
								     LBConeOut, LBConeIn, LBlightType);

	vec3 LClightDir = compLightDir(LCPos, LCDir, LClightType);
	vec4 LClightCol = compLightColor(LClightColor, LCTarget, LCDecay, LCPos, LCDir,
								     LCConeOut, LCConeIn, LClightType);
	
	//DIFFUSE
	vec4 diffuse = compDiffuse(LAlightDir, LAlightCol, normalVec, diffColor, eyedirVec) + 
				   compDiffuse(LBlightDir, LBlightCol, normalVec, diffColor, eyedirVec) +
				   compDiffuse(LClightDir, LClightCol, normalVec, diffColor, eyedirVec);
	diffuse = diffuse * selector.a + (1.0 - selector.a) * vec4(0.5, 0.5, 0.5, 1.0);

	//SPECULAR
	vec4 specular = compSpecular(LAlightDir, LAlightCol, normalVec, eyedirVec) +
					compSpecular(LBlightDir, LBlightCol, normalVec, eyedirVec) +
					compSpecular(LClightDir, LClightCol, normalVec, eyedirVec);

	//AMBIENT
	vec4 ambient = compAmbient(ambColor, normalVec);

	// Diffuse + ambient (cHANGE WITH OUR DIF AND AMB CODE)
// 	float dimFact = /*LAlightDir.w */ max(dot(normalVec, LAlightDir.xyz),0.0);
// 	dimFact += /*LBlightDir.w */ max(dot(normalVec, LBlightDir.xyz),0.0);
// 	dimFact += /*LClightDir.w */ max(dot(normalVec, LClightDir.xyz),0.0);
// 	//dimFact *= mix(1.0, RMAO.b, effect.b);
// //	dimFact = dimFact * matcol.a + (1.0 - matcol.a);
	
// 	// Phong specular (CHANGE WITH OUR SPECULAR CODE)
// 	float Rough = texCol.g; //mix(RMAO.g, repMetRough.g, 0.0); //matcol.a);
// 	float rf = 1.0 - Rough;
// 	rf = 250.0 * rf * rf + 1.0;
// 	float specFact = /*LAlightDir.w */ pow(max(dot(eyedirVec, -reflect(LAlightDir.xyz, normalVec)),0.0), rf);
// 	specFact += /*LBlightDir.w */ pow(max(dot(eyedirVec, -reflect(LBlightDir.xyz, normalVec)),0.0), rf);
// 	specFact += /*LClightDir.w */ pow(max(dot(eyedirVec, -reflect(LClightDir.xyz, normalVec)),0.0), rf);
	
// 	//vec4 albedo = vec4(texCol.rgb, 1.0);
// 	// vec4 texout = albedo;
// 	//texout = mix(texout, vec4(nMap.rgb, 1.0), texSelect.g);
// 	// vec4 mono = vec4(vec3(dot(vec4(texCol.rgb, nMap.a), monoSelect)), 1.0);
// 	// texout = mix(texout, mono, texSelect.b);
	
// 	float Metal = 0.5; //mix(texCol.r, repMetRough.r, matcol.a);
// 	// vec4 diffColor = albedo * 0.96 * (1.0 - Metal);
// 	// diffColor = mix(diffColor, vec4(1.0), ambEmuFact);
// 	// vec4 specColor = 1.0 + 0.96 * Metal * (albedo - 1.0);
// 	// specColor = mix(specColor, vec4(1.0), ambEmuFact);
	
// 	vec3 refDir = -reflect(eyedirVec, normalVec);
//     float mipCount = 9.0; // resolution of 512x512
//     float lod = (Rough * mipCount);
// 	vec4 specFactFromEnvMap = textureLod(u_tex_Env, refDir, lod);
	
// 	vec4 selSpecFact = mix(specFactFromEnvMap * mix(0.4, 1.0, Metal), vec4(specFact), repMetRough.b);
// 	vec4 selDimFact = mix(textureLod(u_tex_Env, normalVec, 8.0), vec4(dimFact), repMetRough.b);
	
//	color = mix(specFactFromEnvMap, texture(u_tex_Env, -v) ,repMetRough.a);
//	color = mix(specFactFromEnvMap, vec4(0.5,0.5,0.5,1.0) ,repMetRough.a);
	
	//Environment
	color =  mix(texture(u_tex_Env, -eyedirVec), vec4(0.5,0.5,0.5,1.0), repMetRough.b); //mix(specFactFromEnvMap, mix(texture(u_tex_Env, -v), vec4(0.5,0.5,0.5,1.0), repMetRough.b) ,repMetRough.a);
	
	//Rubik's cube
	vec4 out_color = clamp(ambient + diffuse + specular + emit, 0.0, 1.0);
	//color = vec4(out_color.rgb, 1.0);
	color = mix(color, vec4(out_color.rgb, 1.0), shown.r);
	// color = mix(color, texCol , shown.g);
	// color = mix(color, vec4(0.5+0.5*normalVec, 1.0), shown.b);
	//color = mix(color, vec4(0.5+0.5*(10.0*fs_uv-9.0*fs_uv), 0.0, 1.0), shown.a);

	// color = mix(color, vec4((ambient + diffuse * selDimFact + specular * selSpecFact + emit).rgb, 1.0), shown.r);
	// color = mix(color, texout, shown.g);
	// color = mix(color, vec4(0.5+0.5*n, 1.0), shown.b);
	// color = mix(color, vec4(0.5+0.5*(10.0*texCoords-9.0*fs_uv), 0.0, 1.0), shown.a);
}
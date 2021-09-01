#version 300 es
precision highp float;

in vec3 fs_pos;
in vec3 fs_norm;
in vec2 fs_uv;

//-----select cube----------
uniform vec4 selector;
uniform vec3 eyePos;
//---------texture--------------
uniform vec4 shown;
uniform vec4 env_select;
uniform sampler2D u_texture;
uniform samplerCube u_tex_Env;

//---------lights--------------
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

out vec4 color;

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
	
	//texture
	vec4 texCol = texture(u_texture, fs_uv);
	vec3 normalVec = normalize(fs_norm);
	vec3 eyedirVec = normalize(eyePos - fs_pos);

	vec4 diffColor = diffuseColor * (1.0 - DTexMix) + texCol * DTexMix;
	vec4 ambColor = ambientMatColor * (1.0 - DTexMix) + texCol * DTexMix;
	vec4 emit = (emitColor * (1.0 - DTexMix) + texCol * DTexMix * max(max(emitColor.r, emitColor.g), emitColor.b)) * emissionType.r;
	
	//lights
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
	
	//Environment
	color =  mix(texture(u_tex_Env, -eyedirVec), vec4(0.5,0.5,0.5,1.0), env_select.b);

	//Rubik's cube
	vec4 out_color = clamp(ambient + diffuse + specular + emit, 0.0, 1.0);
	
	color = mix(color, vec4(out_color.rgb, 1.0), shown.r);
}
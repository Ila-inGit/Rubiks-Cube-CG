#version 300 es
precision highp float;

in vec3 fs_pos;
in vec3 fs_norm;
in vec2 fs_uv;

uniform vec4 lightDir1;
uniform vec4 lightDir2;
uniform vec4 lightDir3;
uniform vec4 matcol;
uniform vec3 eyePos;

uniform vec4 shown;
uniform vec4 effect;
uniform vec4 texSelect;
uniform vec4 monoSelect;
uniform vec4 repMetRough;

uniform sampler2D u_tex_Albedo;
uniform sampler2D u_tex_NormalMap;
uniform sampler2D u_tex_RMAO;
uniform samplerCube u_tex_Env;

const float ambEmuFact = 0.08;

out vec4 color;

const float heightScale = 0.02;

vec2 ParallaxMapping(vec2 texCoords, vec3 viewDir)
{ 

//    float height =  texture(u_tex_NormalMap, texCoords).w;    
//    vec2 p = viewDir.xy / viewDir.z * (height * heightScale);
//    return texCoords - p;

    // number of depth layers
    const float minLayers = 8.0;
    const float maxLayers = 32.0;
    float numLayers = mix(maxLayers, minLayers, abs(dot(vec3(0.0, 0.0, 1.0), viewDir)));  
    // calculate the size of each layer
    float layerDepth = 1.0 / numLayers;
    // depth of current layer
    float currentLayerDepth = 0.0;
    // the amount to shift the texture coordinates per layer (from vector P)
    vec2 P = viewDir.xy / viewDir.z * heightScale; 
    vec2 deltaTexCoords = P / numLayers;
  
    // get initial values
    vec2  currentTexCoords     = texCoords;
    float currentDepthMapValue = texture(u_tex_NormalMap, currentTexCoords).w;
      
    while(currentLayerDepth < currentDepthMapValue)
    {
        // shift texture coordinates along direction of P
        currentTexCoords -= deltaTexCoords;
        // get depthmap value at current texture coordinates
        currentDepthMapValue = texture(u_tex_NormalMap, currentTexCoords).w;  
        // get depth of next layer
        currentLayerDepth += layerDepth;  
    }
    
    // get texture coordinates before collision (reverse operations)
    vec2 prevTexCoords = currentTexCoords + deltaTexCoords;

    // get depth after and before collision for linear interpolation
    float afterDepth  = currentDepthMapValue - currentLayerDepth;
    float beforeDepth = texture(u_tex_NormalMap, prevTexCoords).w - currentLayerDepth + layerDepth;
 
    // interpolation of texture coordinates
    float weight = afterDepth / (afterDepth - beforeDepth);
    vec2 finalTexCoords = prevTexCoords * weight + currentTexCoords * (1.0 - weight);

    return finalTexCoords;

}


void main() {
	vec3 n_norm = normalize(fs_norm);

	//// online computation of tangent and bitangent

	// compute derivations of the world position
	vec3 p_dx = dFdx(fs_pos);
	vec3 p_dy = dFdy(fs_pos);
	// compute derivations of the texture coordinate
	vec2 tc_dx = dFdx(fs_uv);
	vec2 tc_dy = dFdy(fs_uv);
	// compute initial tangent and bi-tangent
	vec3 t = (tc_dy.y * p_dx - tc_dx.y * p_dy) / (tc_dx.x*tc_dy.y - tc_dy.x*tc_dx.y);

	t = normalize(t - n_norm * dot(n_norm, t));
	vec3 b = normalize(cross(n_norm,t));
	
	mat3 tbn = mat3(t, b, n_norm);



	
	// parallax mapping
	vec3 v = normalize(eyePos - fs_pos);

    vec3 viewDir = transpose(tbn) * v;
    vec2 texCoords = mix(fs_uv, ParallaxMapping(fs_uv,  viewDir), effect.g);       
	
	vec4 nMap = texture(u_tex_NormalMap, texCoords);
	vec3 n = mix(n_norm, normalize(tbn * (nMap.xyz * 2.0 - 1.0)), effect.r);

	vec4 RMAO = texture(u_tex_RMAO, texCoords);
	
	// Diffuse + ambient
	float dimFact = lightDir1.w * max(dot(n, lightDir1.xyz),0.0);
	dimFact += lightDir2.w * max(dot(n, lightDir2.xyz),0.0);
	dimFact += lightDir3.w * max(dot(n, lightDir3.xyz),0.0);
	dimFact *= mix(1.0, RMAO.b, effect.b);
//	dimFact = dimFact * matcol.a + (1.0 - matcol.a);
	
	// Phong specular
	float Rough = mix(RMAO.g, repMetRough.g, matcol.a);
	float rf = 1.0 - Rough;
	rf = 250.0 * rf * rf + 1.0;
	float specFact = lightDir1.w * pow(max(dot(v, -reflect(lightDir1.xyz,n)),0.0), rf);
	specFact += lightDir2.w * pow(max(dot(v, -reflect(lightDir2.xyz,n)),0.0), rf);
	specFact += lightDir3.w * pow(max(dot(v, -reflect(lightDir3.xyz,n)),0.0), rf);
	
	vec4 albedo = vec4(mix(texture(u_tex_Albedo, texCoords).rgb, matcol.rgb, matcol.a), 1.0);
	vec4 texout = albedo;
	texout = mix(texout, vec4(nMap.rgb, 1.0), texSelect.g);
	vec4 mono = vec4(vec3(dot(vec4(RMAO.rgb, nMap.a), monoSelect)), 1.0);
	texout = mix(texout, mono, texSelect.b);
	
	float Metal = mix(RMAO.r, repMetRough.r, matcol.a);
	vec4 diffColor = albedo * 0.96 * (1.0 - Metal);
	diffColor = mix(diffColor, vec4(1.0), ambEmuFact);
	vec4 specColor = 1.0 + 0.96 * Metal * (albedo - 1.0);
	specColor = mix(specColor, vec4(1.0), ambEmuFact);
	
	vec3 refDir = -reflect(v,n);
    float mipCount = 9.0; // resolution of 512x512
    float lod = (Rough * mipCount);
	vec4 specFactFromEnvMap = textureLod(u_tex_Env, refDir, lod);
	
	vec4 selSpecFact = mix(specFactFromEnvMap * mix(0.4, 1.0, Metal), vec4(specFact), repMetRough.b);
	vec4 selDimFact = mix(textureLod(u_tex_Env, n, 8.0), vec4(dimFact), repMetRough.b);
	
//	color = mix(specFactFromEnvMap, texture(u_tex_Env, -v) ,repMetRough.a);
//	color = mix(specFactFromEnvMap, vec4(0.5,0.5,0.5,1.0) ,repMetRough.a);
	color = mix(specFactFromEnvMap, mix(texture(u_tex_Env, -v), vec4(0.5,0.5,0.5,1.0), repMetRough.b) ,repMetRough.a);
	
	color = mix(color, vec4((diffColor * selDimFact + specColor * selSpecFact).rgb, 1.0), shown.r);
	color = mix(color, texout, shown.g);
	color = mix(color, vec4(0.5+0.5*n, 1.0), shown.b);
	color = mix(color, vec4(0.5+0.5*(10.0*texCoords-9.0*fs_uv), 0.0, 1.0), shown.a);
}
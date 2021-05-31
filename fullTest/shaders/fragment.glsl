#version 300 es
//Fragment Shader contains source code for operations that are meant to occur on each fragment that results from vertex shader rasterization
precision mediump float;

in vec3 normal, surfaceLight, surfaceCam;

uniform float shininess;
uniform vec4 ambient, diffuse, specular;
	 		
out vec4 color;

void main() {
	vec4 fragColor;

	vec3 H = normalize(surfaceLight + surfaceCam);
	vec3 R = normalize(reflect(-surfaceLight, normal));

	float Kd = max(dot(surfaceLight, normal), 0.0);
    vec4 diffuseProduct = Kd*diffuse;

    float Ks = pow(max(dot(surfaceCam, R), 0.0), shininess);
    vec4 specularProduct = Ks * specular;
			    
    if(dot(surfaceLight, normal) < 0.0) {
		specularProduct = vec4(0.0, 0.0, 0.0, 1.0);
    }

    fragColor = ambient + diffuseProduct + specularProduct;

	color = vec4(fragColor.rgb, 1.0);
}
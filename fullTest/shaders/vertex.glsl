#version 300 es
//Vertex Shader contains source code for operations that are meant to occur on each vertex that is processed

in vec3 vertPosition;
in vec3 vertNormal;
in vec3 vertColor;

uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProj;

uniform float shininess;
uniform vec4 ambient, diffuse, specular;

out vec3 normal, surfaceLight, surfaceCam;

void main(){
	vec4 position = mView * vec4(vertPosition, 1.0);
	gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);

	vec3 pos = -(mView * position).xyz;
	vec3 lightPos = vec3(-1, 5, -1);
	vec3 light = vec3(1, 1, 1);

	surfaceLight = normalize(light - pos);
    surfaceCam = normalize(-pos);

	normal = normalize(vertNormal.xyz);
}
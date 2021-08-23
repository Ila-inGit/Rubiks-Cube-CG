#version 300 es
#define POSITION_LOCATION 0
#define NORMAL_LOCATION 1
#define UV_LOCATION 2

layout(location = POSITION_LOCATION) in vec3 in_pos;
layout(location = NORMAL_LOCATION) in vec3 in_norm;
layout(location = UV_LOCATION) in vec2 in_uv;

uniform mat4 wvpMatrix;
uniform mat4 wMatrix;
uniform mat4 nMatrix;

out vec3 fs_pos;
out vec3 fs_norm;
out vec2 fs_uv;

void main() {
	fs_pos = (wMatrix * vec4(in_pos, 1.0)).xyz;
	fs_norm = mat3(nMatrix) * in_norm; //fs_norm = (wMatrix * vec4(in_norm, 0.0)).xyz;
	fs_uv = in_uv;
	
	gl_Position = wvpMatrix * vec4(in_pos, 1.0);
}
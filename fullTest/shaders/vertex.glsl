#version 300 es
precision mediump float;

			attribute vec3 vertPosition;
			attribute vec3 vertNormal;

			attribute vec3 vertColor;
			varying vec3 fragColor;

			uniform mat4 mWorld;
			uniform mat4 mView;
			uniform mat4 mProj;

			varying vec4 position;
			varying vec3 normal, surfaceLight, surfaceCam;

			uniform float shininess;
			uniform vec4 ambient, diffuse, specular;

			void main(){
				position = mView * vec4(vertPosition, 1.0);
				gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);

				vec3 pos = -(mView * position).xyz;
				vec3 lightPos = vec3(-1, 5, -1);
				vec3 light = vec3(1, 1, 1);

				surfaceLight = normalize(light - pos);
			    surfaceCam = normalize(-pos);

				normal = normalize(vertNormal.xyz);
			}
function buildGeometry() {
	var i;
	
	// Draws a pyramid --- Already done, just for inspiration
	var vert1 = [[0.0,1.0,0.0],[ 1.0,-1.0,-1.0],[-1.0,-1.0,-1.0],
				 [0.0,1.0,0.0],[ 1.0,-1.0, 1.0],[ 1.0,-1.0,-1.0], 
				 [0.0,1.0,0.0],[-1.0,-1.0, 1.0],[ 1.0,-1.0, 1.0], 
				 [0.0,1.0,0.0],[-1.0,-1.0,-1.0],[-1.0,-1.0, 1.0], 
				 [-1.0,-1.0,-1.0],[1.0,-1.0,-1.0], [1.0,-1.0,1.0], [-1.0,-1.0,1.0],
				];
	var norm1 = [[0.0, 0.4472,-0.8944], [0.0, 0.4472,-0.8944], [0.0, 0.4472,-0.8944],
				 [ 0.8944, 0.4472,0.0], [ 0.8944, 0.4472,0.0], [ 0.8944, 0.4472,0.0],
				 [ 0.0, 0.4472,0.8944], [ 0.0, 0.4472,0.8944], [ 0.0, 0.4472,0.8944],
				 [-0.8944, 0.4472,0.0], [-0.8944, 0.4472,0.0], [-0.8944, 0.4472,0.0],
				 [ 0.0,-1.0,0.0],[ 0.0,-1.0,0.0],[ 0.0,-1.0,0.0],[ 0.0,-1.0,0.0]
				 ];
	var uv1 =  [[0.5, 1.0],[1.0,0.0],[0.0,0.0],[0.5, 1.0],[1.0,0.0],[0.0,0.0],
				[0.5, 1.0],[1.0,0.0],[0.0,0.0],[0.5, 1.0],[1.0,0.0],[0.0,0.0],
				[0.0,0.0],[0.0,1.0],[1.0,1.0],[1.0,0.0]];
	var ind1 = [0, 1, 2,  3, 4, 5,  6, 7, 8,  9, 10, 11,  12, 13, 14,  12, 14, 15];
	var color1 = [0.0, 0.0, 1.0];
	addMesh(vert1, norm1, uv1, ind1, color1);
	
	// Draws a cube -- To do for the assignment.
	var vert2 = [[-1.0,-1.0,1.0], [1.0,-1.0,1.0], [1.0,1.0,1.0], [-1.0,1.0,1.0],
				 [-1.0,-1.0,-1.0],[1.0,-1.0,-1.0],[1.0,1.0,-1.0],[-1.0,1.0,-1.0]];
	var norm2 = [[ 0.0, 0.0,1.0], [0.0, 0.0,1.0], [0.0,0.0,1.0], [ 0.0,0.0,1.0],
				 [ 0.0, 0.0,-1.0],[0.0, 0.0,-1.0],[0.0,0.0,-1.0],[ 0.0,0.0,-1.0]];
	var uv2 = [[1.0,0.0],[0.0,0.0],[0.0,1.0],[1.0,1.0],[0.0,0.0],[1.0,0.0],[1.0,1.0],[0.0,1.0]];
	var ind2 = [0, 1, 2,  0, 2, 3,  4, 6, 5,  4, 7, 6];
	
	for(i = 0; i < 8; i++) {
		vert2[i+ 8] = [ vert2[i][0],-vert2[i][2], vert2[i][1]];
		vert2[i+16] = [ vert2[i][2], vert2[i][1],-vert2[i][0]];
		norm2[i+ 8] = [ norm2[i][0],-norm2[i][2], norm2[i][1]];
		norm2[i+16] = [ norm2[i][2], norm2[i][1],-norm2[i][0]];
		uv2[i+ 8] = uv2[i];
		uv2[i+16] = uv2[i];
	}
	for(i = 0; i < 12; i ++) {
		ind2[i+12] = ind2[i] + 8;
		ind2[i+24] = ind2[i] +16;
	}
	
	var color2 = [0.0, 1.0, 1.0];
	addMesh(vert2, norm2, uv2, ind2, color2);
	
	// Draws a Cylinder --- Already done, just for inspiration
	///// Creates vertices
	var vert3 = [[0.0, 1.0, 0.0]];
	var norm3 = [[0.0, 1.0, 0.0]];
	var uv3 = [[0.5,0.5]];
	for(i = 0; i < 36; i++) {
		vert3[i+1] = [Math.sin(i*10.0/180.0*Math.PI), 1.0, Math.cos(i*10.0/180.0*Math.PI)];
		norm3[i+1] = [0.0, 1.0, 0.0];
		uv3[i+1] = [0.5+Math.sin(i*10.0/180.0*Math.PI)/2.0, 0.5+Math.cos(i*10.0/180.0*Math.PI)/2.0];
		vert3[i+37] = [Math.sin(i*10.0/180.0*Math.PI), 1.0, Math.cos(i*10.0/180.0*Math.PI)];
		norm3[i+37] = [Math.sin(i*10.0/180.0*Math.PI), 0.0, Math.cos(i*10.0/180.0*Math.PI)];
		uv3[i+37] = [1-i/36.0, 1.0];
		vert3[i+73] = [Math.sin(i*10.0/180.0*Math.PI),-1.0, Math.cos(i*10.0/180.0*Math.PI)];
		norm3[i+73] = [Math.sin(i*10.0/180.0*Math.PI), 0.0, Math.cos(i*10.0/180.0*Math.PI)];
		uv3[i+73] = [1-i/36.0, 0.0];
		vert3[i+109] = [Math.sin(i*10.0/180.0*Math.PI),-1.0, Math.cos(i*10.0/180.0*Math.PI)];
		norm3[i+109] = [0.0, -1.0, 0.0];
		uv3[i+109] = [0.5-Math.sin(i*10.0/180.0*Math.PI)/2.0, 0.5+Math.cos(i*10.0/180.0*Math.PI)/2.0];
	}
	vert3[145] = [0.0, -1.0, 0.0];
	norm3[145] = [0.0, -1.0, 0.0];
	uv3[145] = [0.5,0.5];
	////// Creates indices
	var ind3 = [];
	//////// Upper part
	j = 0;
	for(i = 0; i < 36; i++) {
		ind3[j++] = 0;
		ind3[j++] = i + 1;
		ind3[j++] = (i + 1) % 36 + 1;
	}
	//////// Lower part
	for(i = 0; i < 36; i++) {
		ind3[j++] = 145;
		ind3[j++] = (i + 1) % 36 + 109;
		ind3[j++] = i + 109;
	}
	//////// Mid part
	for(i = 0; i < 36; i++) {
		ind3[j++] = i + 73;
		ind3[j++] = (i + 1) % 36 + 37;
		ind3[j++] = i + 37;

		ind3[j++] = (i + 1) % 36 + 37;
		ind3[j++] = i + 73;
		ind3[j++] = (i + 1) % 36 + 73;
	}
	var color3 = [1.0, 0.0, 1.0];
	addMesh(vert3, norm3, uv3, ind3, color3);

	// Draws a Sphere --- Already done, just for inspiration
	var vert5 = [[0.0, 1.0,0.0]];
	var norm5 = [[0.0, 1.0,0.0]];
	var uv5 = [[0.5,1.0]];
	///// Creates vertices
	k = 1;
	for(j = 1; j < 18; j++) {
		for(i = 0; i < 36; i++) {
			x = Math.sin(i*10.0/180.0*Math.PI) * Math.sin(j*10.0/180.0*Math.PI);
			y = Math.cos(j*10.0/180.0*Math.PI);
			z = Math.cos(i*10.0/180.0*Math.PI) * Math.sin(j*10.0/180.0*Math.PI);
			norm5[k] = [x, y, z];
			vert5[k] = [x, y, z];
			uv5[k++] = [i/36, j/18];
		}
	}
	lastVert = k;
	norm5[k] = [0.0,-1.0,0.0];
	vert5[k] = [0.0,-1.0,0.0];
	uv5[k++] = [0.5,0.0];
	
	////// Creates indices
	var ind5 = [];
	k = 0;
	///////// Lateral part
	for(i = 0; i < 36; i++) {
		for(j = 1; j < 17; j++) {
			ind5[k++] = i + (j-1) * 36 + 1;
			ind5[k++] = i + j * 36 + 1;
			ind5[k++] = (i + 1) % 36 + (j-1) * 36 + 1;

			ind5[k++] = (i + 1) % 36 + (j-1) * 36 + 1;
			ind5[k++] = i + j * 36 + 1;
			ind5[k++] = (i + 1) % 36 + j * 36 + 1;
		}
	}	
	//////// Upper Cap
	for(i = 0; i < 36; i++) {
		ind5[k++] = 0;
		ind5[k++] = i + 1;
		ind5[k++] = (i + 1) % 36 + 1;
	}
	//////// Lower Cap
	for(i = 0; i < 36; i++) {
		ind5[k++] = lastVert;
		ind5[k++] = (i + 1) % 36 + 541;
		ind5[k++] = i + 541;
	}
	var color5 = [0.8, 0.8, 1.0];
	addMesh(vert5, norm5, uv5, ind5, color5);

	// Draws a Torus -- To do for the assignment.
	var vert6 = [];
	var norm6 = [];
	var uv6 = [];
	k = 0;
	for(j = 0; j < 36; j++) {
		for(i = 0; i < 36; i++) {
			r = 2*Math.sin(j*10.0/180.0*Math.PI);
			x = Math.sin(i*10.0/180.0*Math.PI) * (1+r/4);
			y = 0.5 * Math.cos(j*10.0/180.0*Math.PI);
			z = Math.cos(i*10.0/180.0*Math.PI) * (1+r/4);
			vert6[k] = [x, y, z];
			x = Math.sin(i*10.0/180.0*Math.PI) * r/2;
			y = Math.cos(j*10.0/180.0*Math.PI);
			z = Math.cos(i*10.0/180.0*Math.PI) * r/2;
			norm6[k] = [x, y, z];
			uv6[k++] = [i/36, j/36];
		}
	}
	
	var ind6 = [];
	k = 0;
	for(j = 0; j < 36; j++) {
		for(i = 0; i < 36; i++) {
			ind6[k++] = j * 36 + (i + 1) % 36;
			ind6[k++] = j * 36 + i;
			ind6[k++] = ((j+1) % 36) * 36 + i;

			ind6[k++] = ((j+1) % 36) * 36 + (i + 1) % 36;
			ind6[k++] = j * 36 + (i + 1) % 36;
			ind6[k++] = ((j+1) % 36) * 36 + i;
		}
	}
	var color6 = [1.0, 0.0, 0.0];
	addMesh(vert6, norm6, uv6, ind6, color6);
	
	










	// Draws a cube -- To do for the assignment.
	var vert20 = [[-100.0,-100.0,-100.0], [100.0,-100.0,-100.0], [100.0,100.0,-100.0], [-100.0,100.0,-100.0],
				 [-100.0,-100.0,100.0],[100.0,-100.0,100.0],[100.0,100.0,100.0],[-100.0,100.0,100.0]];
	var norm20 = [[ 0.0, 0.0,1.0], [0.0, 0.0,1.0], [0.0,0.0,1.0], [ 0.0,0.0,1.0],
				 [ 0.0, 0.0,-1.0],[0.0, 0.0,-1.0],[0.0,0.0,-1.0],[ 0.0,0.0,-1.0]];
	var uv20 = [[1.0,0.0],[0.0,0.0],[0.0,1.0],[1.0,1.0],[0.0,0.0],[1.0,0.0],[1.0,1.0],[0.0,1.0]];
	var ind20 = [0, 1, 2,  0, 2, 3,  4, 6, 5,  4, 7, 6];
	
	for(i = 0; i < 8; i++) {
		vert20[i+ 8] = [ vert20[i][0],-vert20[i][2], vert20[i][1]];
		vert20[i+16] = [ vert20[i][2], vert20[i][1],-vert20[i][0]];
		norm20[i+ 8] = [ norm20[i][0],-norm20[i][2], norm20[i][1]];
		norm20[i+16] = [ norm20[i][2], norm20[i][1],-norm20[i][0]];
		uv20[i+ 8] = uv20[i];
		uv20[i+16] = uv20[i];
	}
	for(i = 0; i < 12; i ++) {
		ind20[i+12] = ind20[i] + 8;
		ind20[i+24] = ind20[i] +16;
	}
	
	var color20 = [0.0, 1.0, 1.0];
	addMesh(vert20, norm20, uv20, ind20, color20);
}


function ModelsManager() {
  this.startIndex = [0];
  this.startVertex = [0];
  this.totMesh = 0;
  this.cubeStartIndex;
  this.cubeEndIndex;
  this.environmentStartIndex;
  this.environmentEndIndex;
  this.createModels = function () {
    var i;
    var vert;
    var norm;
    var uv;
    var ind;
    var color;
    // Draws a cube -- To do for the assignment.
    vert = [
      [-1.0, -1.0, 1.0],
      [1.0, -1.0, 1.0],
      [1.0, 1.0, 1.0],
      [-1.0, 1.0, 1.0],
      [-1.0, -1.0, -1.0],
      [1.0, -1.0, -1.0],
      [1.0, 1.0, -1.0],
      [-1.0, 1.0, -1.0],
    ];
    norm = [
      [0.0, 0.0, 1.0],
      [0.0, 0.0, 1.0],
      [0.0, 0.0, 1.0],
      [0.0, 0.0, 1.0],
      [0.0, 0.0, -1.0],
      [0.0, 0.0, -1.0],
      [0.0, 0.0, -1.0],
      [0.0, 0.0, -1.0],
    ];

    uv = [
      [164 / 804, 246 / 523], //White
      [246 / 804, 246 / 523],
      [246 / 804, 164 / 523],
      [164 / 804, 164 / 523],
      [446 / 804, 246 / 523], //Red
      [528 / 804, 246 / 523],
      [528 / 804, 164 / 523],
      [446 / 804, 164 / 523],
      [640 / 804, 164 / 523], //Blue
      [560 / 804, 164 / 523],
      [560 / 804, 246 / 523],
      [640 / 804, 246 / 523],
      [164 / 804, 279 / 523], //Orange
      [246 / 804, 279 / 523],
      [246 / 804, 360 / 523],
      [164 / 804, 360 / 523],
      [446 / 804, 360 / 523], //Green
      [528 / 804, 360 / 523],
      [528 / 804, 279 / 523],
      [446 / 804, 279 / 523],
      [640 / 804, 360 / 523], //Yellow
      [560 / 804, 360 / 523],
      [560 / 804, 279 / 523],
      [640 / 804, 279 / 523],
    ];
    // uv = [
    //   [1.0, 0.0],
    //   [0.0, 0.0],
    //   [0.0, 1.0],
    //   [1.0, 1.0],
    //   [0.0, 0.0],
    //   [1.0, 0.0],
    //   [1.0, 1.0],
    //   [0.0, 1.0],
    // ];
    ind = [0, 1, 2, 0, 2, 3, 4, 6, 5, 4, 7, 6];

    for (i = 0; i < 8; i++) {
      vert[i + 8] = [vert[i][0], -vert[i][2], vert[i][1]];
      vert[i + 16] = [vert[i][2], vert[i][1], -vert[i][0]];
      norm[i + 8] = [norm[i][0], -norm[i][2], norm[i][1]];
      norm[i + 16] = [norm[i][2], norm[i][1], -norm[i][0]];
      // uv[i + 8] = uv[i];
      // uv[i + 16] = uv[i];
    }
    for (i = 0; i < 12; i++) {
      ind[i + 12] = ind[i] + 8;
      ind[i + 24] = ind[i] + 16;
    }

    color = [0.0, 1.0, 1.0];
    this.addMesh(vert, norm, uv, ind, color);
    this.cubeStartIndex = 0;
    this.cubeEndIndex = ind.length;
    //environment cube
    var vert20 = [
      [-100.0, -100.0, -100.0],
      [100.0, -100.0, -100.0],
      [100.0, 100.0, -100.0],
      [-100.0, 100.0, -100.0],
      [-100.0, -100.0, 100.0],
      [100.0, -100.0, 100.0],
      [100.0, 100.0, 100.0],
      [-100.0, 100.0, 100.0],
    ];
    var norm20 = [
      [0.0, 0.0, 1.0],
      [0.0, 0.0, 1.0],
      [0.0, 0.0, 1.0],
      [0.0, 0.0, 1.0],
      [0.0, 0.0, -1.0],
      [0.0, 0.0, -1.0],
      [0.0, 0.0, -1.0],
      [0.0, 0.0, -1.0],
    ];
    var uv20 = [
      [1.0, 0.0],
      [0.0, 0.0],
      [0.0, 1.0],
      [1.0, 1.0],
      [0.0, 0.0],
      [1.0, 0.0],
      [1.0, 1.0],
      [0.0, 1.0],
    ];
    var ind20 = [0, 1, 2, 0, 2, 3, 4, 6, 5, 4, 7, 6];

    for (i = 0; i < 8; i++) {
      vert20[i + 8] = [vert20[i][0], -vert20[i][2], vert20[i][1]];
      vert20[i + 16] = [vert20[i][2], vert20[i][1], -vert20[i][0]];
      norm20[i + 8] = [norm20[i][0], -norm20[i][2], norm20[i][1]];
      norm20[i + 16] = [norm20[i][2], norm20[i][1], -norm20[i][0]];
      uv20[i + 8] = uv20[i];
      uv20[i + 16] = uv20[i];
    }
    for (i = 0; i < 12; i++) {
      ind20[i + 12] = ind20[i] + 8;
      ind20[i + 24] = ind20[i] + 16;
    }

    var color20 = [0.0, 1.0, 1.0];
    this.addMesh(vert20, norm20, uv20, ind20, color20);
    this.environmentStartIndex = this.cubeEndIndex;
    this.environmentEndIndex = this.environmentStartIndex + ind20.length;
  };

  this.addMesh = function (i_vertices, i_norm, i_uv, i_indices, i_color) {
    var i;
    //console.log(i_vertices);
    for (i = 0; i < i_vertices.length; i++) {
      vertices[(i + this.startVertex[this.totMesh]) * 3 + 0] = i_vertices[i][0];
      vertices[(i + this.startVertex[this.totMesh]) * 3 + 1] = i_vertices[i][1];
      vertices[(i + this.startVertex[this.totMesh]) * 3 + 2] = i_vertices[i][2];
      normals[(i + this.startVertex[this.totMesh]) * 3 + 0] = i_norm[i][0];
      normals[(i + this.startVertex[this.totMesh]) * 3 + 1] = i_norm[i][1];
      normals[(i + this.startVertex[this.totMesh]) * 3 + 2] = i_norm[i][2];
      uvs[(i + this.startVertex[this.totMesh]) * 2 + 0] = i_uv[i][0];
      uvs[(i + this.startVertex[this.totMesh]) * 2 + 1] = i_uv[i][1];
    }
    for (i = 0; i < i_indices.length; i++) {
      indices[i + this.startIndex[this.totMesh]] =
        this.startVertex[this.totMesh] + i_indices[i];
    }
    colors[this.totMesh] = i_color;

    this.totMesh++;

    this.startVertex[this.totMesh] =
      this.startVertex[this.totMesh - 1] + i_vertices.length;
    this.startIndex[this.totMesh] =
      this.startIndex[this.totMesh - 1] + i_indices.length;
  };
}

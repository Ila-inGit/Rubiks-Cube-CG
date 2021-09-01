function ModelsManager() {
  this.startIndex = [0];
  this.startVertex = [0];
  this.stVertex = [0];
  this.totMesh = 0;
  this.cubeStartIndex;
  this.cubeEndIndex;
  this.environmentStartIndex;
  this.environmentEndIndex;
  this.vertTmp;
  this.uvTmp;
  this.newUv = [
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
  ];
  this.whiteTexture = [
    [175 / 804, 237 / 523], //White
    [237 / 804, 237 / 523],
    [237 / 804, 175 / 523],
    [175 / 804, 175 / 523],
  ];

  this.createModels = function () {
    var i;
    var vert;
    var norm;
    var uv;
    var ind;
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
      [446 / 804, 246 / 523], //Red
      [528 / 804, 246 / 523],
      [528 / 804, 164 / 523],
      [446 / 804, 164 / 523],
      [164 / 804, 164 / 523], //White
      [164 / 804, 246 / 523],
      [246 / 804, 246 / 523],
      [246 / 804, 164 / 523],
      [560 / 804, 246 / 523], //Blue
      [640 / 804, 246 / 523],
      [640 / 804, 164 / 523],
      [560 / 804, 164 / 523],
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
    ind = [0, 1, 2, 0, 2, 3, 4, 6, 5, 4, 7, 6];

    for (i = 0; i < 8; i++) {
      vert[i + 8] = [vert[i][0], -vert[i][2], vert[i][1]];
      vert[i + 16] = [vert[i][2], vert[i][1], -vert[i][0]];
      norm[i + 8] = [norm[i][0], -norm[i][2], norm[i][1]];
      norm[i + 16] = [norm[i][2], norm[i][1], -norm[i][0]];
    }
    for (i = 0; i < 12; i++) {
      ind[i + 12] = ind[i] + 8;
      ind[i + 24] = ind[i] + 16;
    }

    this.vertTmp = vert;
    this.uvTmp = uv;
    this.addMesh(vert, norm, uv, ind);
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

    
    this.addMesh(vert20, norm20, uv20, ind20);
    this.environmentStartIndex = this.cubeEndIndex;
    this.environmentEndIndex = this.environmentStartIndex + ind20.length;
  };

  this.addMesh = function (i_vertices, i_norm, i_uv, i_indices) {
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

    this.totMesh++;

    this.startVertex[this.totMesh] =
      this.startVertex[this.totMesh - 1] + i_vertices.length;
    this.startIndex[this.totMesh] =
      this.startIndex[this.totMesh - 1] + i_indices.length;
  };

  this.setWhite = function (startPosArray) {
    let i;
    for (i = 0; i < 4; i++) {
      this.newUv[startPosArray + i][0] = this.whiteTexture[i][0];
      this.newUv[startPosArray + i][1] = this.whiteTexture[i][1];
    }
  };

  this.copyArray = function () {
    let i;
    for (i = 0; i < 24; i++) {
      this.newUv[i][0] = this.uvTmp[i][0];
      this.newUv[i][1] = this.uvTmp[i][1];
    }
  };

  this.setUVs = function (x, y, z) {
    modelsManager.copyArray();

    if (x != 2) {
      modelsManager.setWhite(16);
    }
    if (x != 0) {
      modelsManager.setWhite(20);
    }

    if (y != 2) {
      modelsManager.setWhite(12);
    }
    if (y != 0) {
      modelsManager.setWhite(8);
    }

    if (z != 2) {
      modelsManager.setWhite(0);
    }
    if (z != 0) {
      modelsManager.setWhite(4);
    }

    let i;
    let count = 0;
    for (i = 0; i < 24; i++) {
      uvs[(i + this.stVertex[count]) * 2 + 0] = this.newUv[i][0];
      uvs[(i + this.stVertex[count]) * 2 + 1] = this.newUv[i][1];
    }

    this.stVertex = [0];
  };
}

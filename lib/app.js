var raycastManager = new RaycastManager();
var mouseEventsManager = new MouseEventsManager();
var loadingManager = new LoadingManager();
var modelsManager = new ModelsManager();
var rubiksCube = new RubiksCube();
var isScrambling = false;

var canvas;

var gl = null,
  program = null;

var projectionMatrix,
  perspProjectionMatrix,
  viewMatrix,
  worldMatrix = utils.MakeRotateYMatrix(0);
//Parameters for Camera
var cx = 4.5;
var cy = 0.0;
var cz = 10.0;
var elevation = 0.0;
var angle = 0.0;

var lookRadius = 10.0;

var matnames = ["tex/colorRubiksCube.png"];

function doResize() {
  // set canvas dimensions
  var canvas = document.getElementById("my-canvas");
  if (window.innerWidth > 40 && window.innerHeight > 240) {
    canvas.width = window.innerWidth - 16;
    canvas.height = window.innerHeight - 200;
    gl.viewport(0.0, 0.0, canvas.width, canvas.height);
  }
}
var shownUnifVals;
var repMetRough = [0.5, 0.5, 0.0, 0.0];

function setEffectSelector() {
  shownUnifVals = [1, 0, 0, 0];
}

function setEnvSelType(v) {
  if (v < 0) {
    repMetRough[2] = 1;
  } else {
    loadingManager.loadEnvironment(v);
    repMetRough[2] = 0;
  }
}

var vertices = [];
var normals = [];
var uvs = [];
var indices = [];
var colors = [];

//Varibles for lights and BRDF
UIonOff = {
  LAlightType: {
    none: {
      LA13: false,
      LA14: false,
      LA21: false,
      LA22: false,
      LA23: false,
      LA24: false,
      LA31: false,
      LA32: false,
      LA33: false,
      LA34: false,
      LA41: false,
      LA42: false,
      LA43: false,
      LA44: false,
      LA51: false,
      LA52: false,
      LA53: false,
      LA54: false,
      LA61: false,
      LA62: false,
    },
    direct: {
      LA13: true,
      LA14: true,
      LA21: false,
      LA22: false,
      LA23: false,
      LA24: false,
      LA31: false,
      LA32: false,
      LA33: false,
      LA34: false,
      LA41: false,
      LA42: false,
      LA43: false,
      LA44: false,
      LA51: true,
      LA52: true,
      LA53: false,
      LA54: false,
      LA61: true,
      LA62: true,
    },
    point: {
      LA13: true,
      LA14: true,
      LA21: true,
      LA22: true,
      LA23: true,
      LA24: true,
      LA31: true,
      LA32: true,
      LA33: true,
      LA34: true,
      LA41: true,
      LA42: true,
      LA43: false,
      LA44: false,
      LA51: false,
      LA52: false,
      LA53: false,
      LA54: false,
      LA61: false,
      LA62: false,
    },
    spot: {
      LA13: true,
      LA14: true,
      LA21: true,
      LA22: true,
      LA23: true,
      LA24: true,
      LA31: true,
      LA32: true,
      LA33: true,
      LA34: true,
      LA41: true,
      LA42: true,
      LA43: true,
      LA44: true,
      LA51: true,
      LA52: true,
      LA53: true,
      LA54: true,
      LA61: true,
      LA62: true,
    },
  },
  LBlightType: {
    none: {
      LB13: false,
      LB14: false,
      LB21: false,
      LB22: false,
      LB23: false,
      LB24: false,
      LB31: false,
      LB32: false,
      LB33: false,
      LB34: false,
      LB41: false,
      LB42: false,
      LB43: false,
      LB44: false,
      LB51: false,
      LB52: false,
      LB53: false,
      LB54: false,
      LB61: false,
      LB62: false,
    },
    direct: {
      LB13: true,
      LB14: true,
      LB21: false,
      LB22: false,
      LB23: false,
      LB24: false,
      LB31: false,
      LB32: false,
      LB33: false,
      LB34: false,
      LB41: false,
      LB42: false,
      LB43: false,
      LB44: false,
      LB51: true,
      LB52: true,
      LB53: false,
      LB54: false,
      LB61: true,
      LB62: true,
    },
    point: {
      LB13: true,
      LB14: true,
      LB21: true,
      LB22: true,
      LB23: true,
      LB24: true,
      LB31: true,
      LB32: true,
      LB33: true,
      LB34: true,
      LB41: true,
      LB42: true,
      LB43: false,
      LB44: false,
      LB51: false,
      LB52: false,
      LB53: false,
      LB54: false,
      LB61: false,
      LB62: false,
    },
    spot: {
      LB13: true,
      LB14: true,
      LB21: true,
      LB22: true,
      LB23: true,
      LB24: true,
      LB31: true,
      LB32: true,
      LB33: true,
      LB34: true,
      LB41: true,
      LB42: true,
      LB43: true,
      LB44: true,
      LB51: true,
      LB52: true,
      LB53: true,
      LB54: true,
      LB61: true,
      LB62: true,
    },
  },
  LClightType: {
    none: {
      LC13: false,
      LC14: false,
      LC21: false,
      LC22: false,
      LC23: false,
      LC24: false,
      LC31: false,
      LC32: false,
      LC33: false,
      LC34: false,
      LC41: false,
      LC42: false,
      LC43: false,
      LC44: false,
      LC51: false,
      LC52: false,
      LC53: false,
      LC54: false,
      LC61: false,
      LC62: false,
    },
    direct: {
      LC13: true,
      LC14: true,
      LC21: false,
      LC22: false,
      LC23: false,
      LC24: false,
      LC31: false,
      LC32: false,
      LC33: false,
      LC34: false,
      LC41: false,
      LC42: false,
      LC43: false,
      LC44: false,
      LC51: true,
      LC52: true,
      LC53: false,
      LC54: false,
      LC61: true,
      LC62: true,
    },
    point: {
      LC13: true,
      LC14: true,
      LC21: true,
      LC22: true,
      LC23: true,
      LC24: true,
      LC31: true,
      LC32: true,
      LC33: true,
      LC34: true,
      LC41: true,
      LC42: true,
      LC43: false,
      LC44: false,
      LC51: false,
      LC52: false,
      LC53: false,
      LC54: false,
      LC61: false,
      LC62: false,
    },
    spot: {
      LC13: true,
      LC14: true,
      LC21: true,
      LC22: true,
      LC23: true,
      LC24: true,
      LC31: true,
      LC32: true,
      LC33: true,
      LC34: true,
      LC41: true,
      LC42: true,
      LC43: true,
      LC44: true,
      LC51: true,
      LC52: true,
      LC53: true,
      LC54: true,
      LC61: true,
      LC62: true,
    },
  },
  ambientType: {
    none: {
      A20: false,
      A21: false,
      A22: false,
      A30: false,
      A31: false,
      A32: false,
      A33: false,
      A40: false,
      A41: false,
      A42: false,
      A43: false,
      A50: false,
      A51: false,
      A52: false,
      MA1: false,
      MA2: false,
    },
    ambient: {
      A20: false,
      A21: true,
      A22: true,
      A30: false,
      A31: false,
      A32: false,
      A33: false,
      A40: false,
      A41: false,
      A42: false,
      A43: false,
      A50: false,
      A51: false,
      A52: false,
      MA1: true,
      MA2: true,
    },
    hemispheric: {
      A20: true,
      A21: false,
      A22: true,
      A30: false,
      A31: true,
      A32: true,
      A33: false,
      A40: false,
      A41: true,
      A42: true,
      A43: false,
      A50: false,
      A51: true,
      A52: true,
      MA1: true,
      MA2: true,
    },
    SH: {
      A20: true,
      A21: false,
      A22: true,
      A30: true,
      A31: false,
      A32: false,
      A33: true,
      A40: true,
      A41: false,
      A42: false,
      A43: true,
      A50: true,
      A51: false,
      A52: true,
      MA1: true,
      MA2: true,
    },
  },
  diffuseType: {
    none: {
      D21: false,
      D22: false,
      D41: false,
      D42: false,
    },
    lambert: {
      D21: true,
      D22: true,
      D41: false,
      D42: false,
    },
    toon: {
      D21: true,
      D22: true,
      D41: true,
      D42: true,
    },
  },
  specularType: {
    none: {
      S21: false,
      S22: false,
      S31: false,
      S32: false,
      S41: false,
      S42: false,
    },
    phong: {
      S21: true,
      S22: true,
      S31: true,
      S32: true,
      S41: false,
      S42: false,
    },
    blinn: {
      S21: true,
      S22: true,
      S31: true,
      S32: true,
      S41: false,
      S42: false,
    },
    toonP: {
      S21: true,
      S22: true,
      S31: false,
      S32: false,
      S41: true,
      S42: true,
    },
    toonB: {
      S21: true,
      S22: true,
      S31: false,
      S32: false,
      S41: true,
      S42: true,
    },
  },
  emissionType: {
    Yes: { ME1: true, ME2: true },
    No: { ME1: false, ME2: false },
  },
};

function showHideUI(tag, sel) {
  for (var name in UIonOff[tag][sel]) {
    document.getElementById(name).style.display = UIonOff[tag][sel][name]
      ? "block"
      : "none";
  }
}

function showLight(sel) {
  document.getElementById("LA").style.display = sel == "LA" ? "block" : "none";
  document.getElementById("LB").style.display = sel == "LB" ? "block" : "none";
  document.getElementById("LC").style.display = sel == "LC" ? "block" : "none";
}

defShaderParams = {
  ambientType: "ambient",
  diffuseType: "lambert",
  specularType: "phong",
  ambientLightColor: "#222222",
  diffuseColor: "#00ffff",
  specularColor: "#ffffff",
  ambientLightLowColor: "#002200",
  SHLeftLightColor: "#550055",
  SHRightLightColor: "#005555",
  ambientMatColor: "#00ffff",
  emitColor: "#000000",

  LAlightType: "direct",
  LAlightColor: "#ffffff",
  LAPosX: 20,
  LAPosY: 30,
  LAPosZ: 50,
  LADirTheta: 60,
  LADirPhi: 45,
  LAConeOut: 30,
  LAConeIn: 80,
  LADecay: 0,
  LATarget: 61,

  LBlightType: "point",
  LBlightColor: "#ffffff",
  LBPosX: -30,
  LBPosY: 10,
  LBPosZ: -200,
  LBDirTheta: 60,
  LBDirPhi: 135,
  LBConeOut: 30,
  LBConeIn: 80,
  LBDecay: 0,
  LBTarget: 61,

  LClightType: "direct",
  LClightColor: "#ffffff",
  LCPosX: 60,
  LCPosY: 30,
  LCPosZ: 50,
  LCDirTheta: 60,
  LCDirPhi: -45,
  LCConeOut: 30,
  LCConeIn: 80,
  LCDecay: 0,
  LCTarget: 61,

  ADirTheta: 0,
  ADirPhi: 0,
  DTexMix: 100,
  SpecShine: 100,
  DToonTh: 50,
  SToonTh: 90,

  emissionType: "No",
};

function resetShaderParams() {
  for (var name in defShaderParams) {
    value = defShaderParams[name];
    document.getElementById(name).value = value;
    if (document.getElementById(name).type == "select-one") {
      showHideUI(name, value);
    }
  }
}

function unifPar(pHTML, pGLSL, type) {
  this.pHTML = pHTML;
  this.pGLSL = pGLSL;
  this.type = type;
}

function val(gl) {
  gl.uniform1f(
    program[this.pGLSL + "Uniform"],
    document.getElementById(this.pHTML).value
  );
}

function valD10(gl) {
  gl.uniform1f(
    program[this.pGLSL + "Uniform"],
    document.getElementById(this.pHTML).value / 10
  );
}

function valD100(gl) {
  gl.uniform1f(
    program[this.pGLSL + "Uniform"],
    document.getElementById(this.pHTML).value / 100
  );
}

function valCol(gl) {
  col = document.getElementById(this.pHTML).value.substring(1, 7);
  R = parseInt(col.substring(0, 2), 16) / 255;
  G = parseInt(col.substring(2, 4), 16) / 255;
  B = parseInt(col.substring(4, 6), 16) / 255;
  gl.uniform4f(program[this.pGLSL + "Uniform"], R, G, B, 1);
}

function valVec3(gl) {
  var lightPos = [
    document.getElementById(this.pHTML + "X").value / 10,
    document.getElementById(this.pHTML + "Y").value / 10,
    document.getElementById(this.pHTML + "Z").value / 10,
    1.0,
  ];
  var posTransformed = utils.multiplyMatrixVector(viewMatrix, lightPos);
  gl.uniform3fv(program[this.pGLSL + "Uniform"], posTransformed.slice(0, 3));
}

function valDir(gl) {
  var t = utils.degToRad(document.getElementById(this.pHTML + "Theta").value);
  var p = utils.degToRad(document.getElementById(this.pHTML + "Phi").value);
  var dir = [Math.sin(t) * Math.sin(p), Math.cos(t), Math.sin(t) * Math.cos(p)];
  var dirTransformed = utils.multiplyMatrix3Vector3(
    utils.sub3x3from4x4(viewMatrix),
    dir
  );
  gl.uniform3fv(program[this.pGLSL + "Uniform"], dirTransformed);
}

valTypeDecoder = {
  LAlightType: {
    none: [0, 0, 0, 0],
    direct: [1, 0, 0, 0],
    point: [0, 1, 0, 0],
    spot: [0, 0, 1, 0],
  },
  LBlightType: {
    none: [0, 0, 0, 0],
    direct: [1, 0, 0, 0],
    point: [0, 1, 0, 0],
    spot: [0, 0, 1, 0],
  },
  LClightType: {
    none: [0, 0, 0, 0],
    direct: [1, 0, 0, 0],
    point: [0, 1, 0, 0],
    spot: [0, 0, 1, 0],
  },
  ambientType: {
    none: [0, 0, 0, 0],
    ambient: [1, 0, 0, 0],
    hemispheric: [0, 1, 0, 0],
    SH: [0, 0, 1, 0],
  },
  diffuseType: {
    none: [0, 0, 0, 0],
    lambert: [1, 0, 0, 0],
    toon: [0, 1, 0, 0],
  },
  specularType: {
    none: [0, 0, 0, 0],
    phong: [1, 0, 0, 0],
    blinn: [0, 1, 0, 0],
    toonP: [1, 0, 1, 0],
    toonB: [0, 1, 1, 0],
  },
  emissionType: {
    No: [0, 0, 0, 0],
    Yes: [1, 0, 0, 0],
  },
};

function valType(gl) {
  var v = valTypeDecoder[this.pHTML][document.getElementById(this.pHTML).value];
  gl.uniform4f(program[this.pGLSL + "Uniform"], v[0], v[1], v[2], v[3]);
}

unifParArray = [
  new unifPar("ambientType", "ambientType", valType),
  new unifPar("diffuseType", "diffuseType", valType),
  new unifPar("specularType", "specularType", valType),
  new unifPar("emissionType", "emissionType", valType),

  new unifPar("LAlightType", "LAlightType", valType),
  new unifPar("LAPos", "LAPos", valVec3),
  new unifPar("LADir", "LADir", valDir),
  new unifPar("LAConeOut", "LAConeOut", val),
  new unifPar("LAConeIn", "LAConeIn", valD100),
  new unifPar("LADecay", "LADecay", val),
  new unifPar("LATarget", "LATarget", valD10),
  new unifPar("LAlightColor", "LAlightColor", valCol),

  new unifPar("LBlightType", "LBlightType", valType),
  new unifPar("LBPos", "LBPos", valVec3),
  new unifPar("LBDir", "LBDir", valDir),
  new unifPar("LBConeOut", "LBConeOut", val),
  new unifPar("LBConeIn", "LBConeIn", valD100),
  new unifPar("LBDecay", "LBDecay", val),
  new unifPar("LBTarget", "LBTarget", valD10),
  new unifPar("LBlightColor", "LBlightColor", valCol),

  new unifPar("LClightType", "LClightType", valType),
  new unifPar("LCPos", "LCPos", valVec3),
  new unifPar("LCDir", "LCDir", valDir),
  new unifPar("LCConeOut", "LCConeOut", val),
  new unifPar("LCConeIn", "LCConeIn", valD100),
  new unifPar("LCDecay", "LCDecay", val),
  new unifPar("LCTarget", "LCTarget", valD10),
  new unifPar("LClightColor", "LClightColor", valCol),

  new unifPar("ambientLightColor", "ambientLightColor", valCol),
  new unifPar("ambientLightLowColor", "ambientLightLowColor", valCol),
  new unifPar("SHLeftLightColor", "SHLeftLightColor", valCol),
  new unifPar("SHRightLightColor", "SHRightLightColor", valCol),
  new unifPar("ADir", "ADir", valDir),
  new unifPar("diffuseColor", "diffuseColor", valCol),
  new unifPar("DTexMix", "DTexMix", valD100),
  new unifPar("specularColor", "specularColor", valCol),
  new unifPar("SpecShine", "SpecShine", val),
  new unifPar("DToonTh", "DToonTh", valD100),
  new unifPar("SToonTh", "SToonTh", valD100),
  new unifPar("ambientMatColor", "ambientMatColor", valCol),
  new unifPar("emitColor", "emitColor", valCol),
];

//main
async function main() {
  resetShaderParams();

  // setup
  var canvas = document.getElementById("my-canvas");
  canvas.addEventListener("mousedown", mouseEventsManager.doMouseDown, false);
  canvas.addEventListener("mouseup", mouseEventsManager.doMouseUp, false);
  canvas.addEventListener("mousemove", mouseEventsManager.doMouseMove, false);
  canvas.addEventListener("mousewheel", mouseEventsManager.doMouseWheel, false);
  window.onresize = doResize;
  canvas.width = window.innerWidth - 16;
  canvas.height = window.innerHeight - 180;

  try {
    gl = canvas.getContext("webgl2");
  } catch (e) {
    console.log(e);
  }

  if (gl) {
    await loadingManager.loadProgram();
    loadingManager.loadTexture(0);
    loadingManager.loadEnvironment(1);

    modelsManager.createModels();
    setEffectSelector();

    vertexBuffer = gl.createBuffer();
    vertices = new Float32Array(vertices);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices.byteLength, gl.STATIC_DRAW);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertices);

    normalBuffer = gl.createBuffer();
    normals = new Float32Array(normals);
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, normals.byteLength, gl.STATIC_DRAW);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, normals);

    UVBuffer = gl.createBuffer();
    uvs = new Float32Array(uvs);
    gl.bindBuffer(gl.ARRAY_BUFFER, UVBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, uvs.byteLength, gl.STATIC_DRAW);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, uvs);

    indexBuffer = gl.createBuffer();
    indices = new Uint16Array(indices);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices.byteLength, gl.STATIC_DRAW);
    gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, 0, indices);

    // links mesh attributes to shader attributes
    program.vertexPositionAttribute = gl.getAttribLocation(program, "in_pos");
    gl.enableVertexAttribArray(program.vertexPositionAttribute);

    program.vertexNormalAttribute = gl.getAttribLocation(program, "in_norm");
    gl.enableVertexAttribArray(program.vertexNormalAttribute);

    program.vertexUVAttribute = gl.getAttribLocation(program, "in_uv");
    gl.enableVertexAttribArray(program.vertexUVAttribute);

    for (var i = 0; i < unifParArray.length; i++) {
      program[unifParArray[i].pGLSL + "Uniform"] = gl.getUniformLocation(
        program,
        unifParArray[i].pGLSL
      );
    }

    program.WVPmatrixUniform = gl.getUniformLocation(program, "wvpMatrix");
    program.WmatrixUniform = gl.getUniformLocation(program, "wMatrix");
    program.normMatrix = gl.getUniformLocation(program, "nMatrix");
    program.eyePosUniform = gl.getUniformLocation(program, "eyePos");
    program.selector = gl.getUniformLocation(program, "selector");
    program.shown = gl.getUniformLocation(program, "shown");
    program.repMetRough = gl.getUniformLocation(program, "repMetRough");
    program.texture = gl.getUniformLocation(program, "u_texture");
    program.textureEnv = gl.getUniformLocation(program, "u_tex_Env");

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    doResize();

    // selects the mesh
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(
      program.vertexPositionAttribute,
      3,
      gl.FLOAT,
      false,
      0,
      0
    );

    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.vertexAttribPointer(
      program.vertexNormalAttribute,
      3,
      gl.FLOAT,
      false,
      0,
      0
    );

    gl.bindBuffer(gl.ARRAY_BUFFER, UVBuffer);
    gl.vertexAttribPointer(program.vertexUVAttribute, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    // turn on depth testing and back-face culling
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

    drawScene();
  } else {
    alert("Error: WebGL not supported by your browser!");
  }
}

function drawScene() {
  if (isScrambling && !rubiksCube.isRotating) {
    rubiksCube.setRotation(
      generalUtils.getRandomCube(),
      generalUtils.getRandomAxis(),
      generalUtils.getRandomBool()
    );
  }
  if (rubiksCube.isRotating) rubiksCube.rotateChunk();

  // update perspective matrix
  var canvas = document.getElementById("my-canvas");

  perspProjectionMatrix = utils.MakePerspective(
    65,
    canvas.width / canvas.height,
    0.1,
    180.0
  );

  // update WV matrix
  cz =
    lookRadius *
    Math.cos(utils.degToRad(-angle)) *
    Math.cos(utils.degToRad(-elevation));
  cx =
    lookRadius *
    Math.sin(utils.degToRad(-angle)) *
    Math.cos(utils.degToRad(-elevation));
  cy = lookRadius * Math.sin(utils.degToRad(-elevation));
  viewMatrix = utils.MakeView(cx, cy, cz, elevation, -angle);
  projectionMatrix = utils.multiplyMatrices(perspProjectionMatrix, viewMatrix);

  //rotation
  projectionMatrix = utils.multiplyMatrices(projectionMatrix, worldMatrix);
  var normalsMatrix = utils.invertMatrix(utils.transposeMatrix(worldMatrix));

  for (var i = 0; i < unifParArray.length; i++) {
    program[unifParArray[i].pGLSL + "Uniform"] = gl.getUniformLocation(
      program,
      unifParArray[i].pGLSL
    );
  }

  // draws the request
  gl.uniformMatrix4fv(
    program.normMatrix,
    gl.FALSE,
    utils.transposeMatrix(normalsMatrix)
  );

  gl.uniformMatrix4fv(
    program.WVPmatrixUniform,
    gl.FALSE,
    utils.transposeMatrix(projectionMatrix)
  );

  gl.uniformMatrix4fv(
    program.WmatrixUniform,
    gl.FALSE,
    utils.transposeMatrix(worldMatrix)
  );

  gl.uniform3f(program.eyePosUniform, cx, cy, cz);

  gl.uniform1i(program.texture, 0);
  gl.uniform1i(program.textureEnv, 3);

  gl.enable(gl.CULL_FACE);

  gl.uniform4f(
    program.repMetRough,
    repMetRough[0],
    repMetRough[1],
    repMetRough[2],
    repMetRough[3]
  );

  //environment cube
  gl.uniformMatrix4fv(
    program.WVPmatrixUniform,
    gl.FALSE,
    utils.transposeMatrix(projectionMatrix)
  );

  gl.uniformMatrix4fv(
    program.WmatrixUniform,
    gl.FALSE,
    utils.transposeMatrix(worldMatrix)
  );

  //Environment
  gl.uniform4f(program.shown, 0, 0, 0, 0);
  gl.uniform4f(program.repMetRough, 0, 0, repMetRough[2], 1);

  for (var i = 0; i < unifParArray.length; i++) {
    unifParArray[i].type(gl);
  }

  gl.drawElements(
    gl.TRIANGLES,
    modelsManager.environmentStartIndex,
    gl.UNSIGNED_SHORT,
    modelsManager.environmentEndIndex
  );
  //rubiks cube
  rubiksCube.draw();

  window.requestAnimationFrame(drawScene);
}

var count = 1;
function changeColorButton(btn) {
  var property = document.getElementById(btn);
  if (count == 0) {
    property.style.backgroundColor = "#4CAF50";
    count = 1;
  } else {
    property.style.backgroundColor = "#2b662d";
    count = 0;
  }
}

function scramble(bnt) {
  changeColorButton(bnt);
  isScrambling = !isScrambling;
}

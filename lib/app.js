//new

var isRotating = false;

var raycastManager = new RaycastManager();
var mouseEventsManager = new MouseEventsManager();
var loadingManager = new LoadingManager();
var modelsManager = new ModelsManager();
var rubiksCube = new RubiksCube();

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

var matnames = [
  "tex/1/flat-cobble-moss-",
  "tex/2/redbricks2b-",
  "tex/3/space-crate1-",
  "tex/4/scuffed-metal1-",
  "tex/5/rustediron-streaks-",
];
//var matcomp = ["alb.png", "normal-ogl.png", "met_rou_ao.png"];
var matcomp = ["alb.png", "norm_hei.png", "met_rou_ao.png"];

var visTypes = ["Complete", "Albedo"];
// event handler

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
var effectUnifVals;
var texSelectUnifVals;
var monoSelectUnifVals;
var repColor = [1, 1, 1, 0];
var repMetRough = [0.5, 0.5, 0.0, 0.0];

function setEffectSelector() {
  effectUnifVals = [1, 1, 1, 0];

  texSelectUnifVals = [1, 0, 0, 0];
  monoSelectUnifVals = [0, 0, 0, 0];
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

// The real app starts here
async function main() {
  // setup everything else
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
    //console.log(indices.byteLength);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices.byteLength, gl.STATIC_DRAW);
    gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, 0, indices);
    //
    //		mesh = new OBJ.Mesh(objStr);
    //		OBJ.initMeshBuffers(gl, mesh);

    // links mesh attributes to shader attributes
    program.vertexPositionAttribute = gl.getAttribLocation(program, "in_pos");
    gl.enableVertexAttribArray(program.vertexPositionAttribute);

    program.vertexNormalAttribute = gl.getAttribLocation(program, "in_norm");
    gl.enableVertexAttribArray(program.vertexNormalAttribute);

    program.vertexUVAttribute = gl.getAttribLocation(program, "in_uv");
    gl.enableVertexAttribArray(program.vertexUVAttribute);

    program.WVPmatrixUniform = gl.getUniformLocation(program, "wvpMatrix");
    program.WmatrixUniform = gl.getUniformLocation(program, "wMatrix");
    program.eyePosUniform = gl.getUniformLocation(program, "eyePos");
    program.lightDir1 = gl.getUniformLocation(program, "lightDir1");
    program.lightDir2 = gl.getUniformLocation(program, "lightDir2");
    program.lightDir3 = gl.getUniformLocation(program, "lightDir3");
    program.matcol = gl.getUniformLocation(program, "matcol");
    program.shown = gl.getUniformLocation(program, "shown");
    program.effect = gl.getUniformLocation(program, "effect");
    program.texSelect = gl.getUniformLocation(program, "texSelect");
    program.monoSelect = gl.getUniformLocation(program, "monoSelect");
    program.repMetRough = gl.getUniformLocation(program, "repMetRough");
    program.textureAlbedo = gl.getUniformLocation(program, "u_tex_Albedo");
    program.textureNormalMap = gl.getUniformLocation(
      program,
      "u_tex_NormalMap"
    );
    program.textureRMAO = gl.getUniformLocation(program, "u_tex_RMAO");
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

    gLightDir1 = [0.0, 0.70711, 0.707106, 1.0];
    gLightDir2 = [0.73855, 0.60302, -0.30151, 0.7];
    gLightDir3 = [-0.73855, -0.60302, -0.30151, 0.5];

    drawScene();
  } else {
    alert("Error: WebGL not supported by your browser!");
  }
}

function drawScene() {
  if (isRotating) rubiksCube.rotateChunk();

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
  //	gl.uniform1i(program.textureUniform, 0);

  // draws the request
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

  gl.uniform4f(
    program.lightDir1,
    gLightDir1[0],
    gLightDir1[1],
    gLightDir1[2],
    gLightDir1[3]
  );
  gl.uniform4f(
    program.lightDir2,
    gLightDir2[0],
    gLightDir2[1],
    gLightDir2[2],
    gLightDir2[3]
  );
  gl.uniform4f(
    program.lightDir3,
    gLightDir3[0],
    gLightDir3[1],
    gLightDir3[2],
    gLightDir3[3]
  );

  gl.uniform1i(program.textureAlbedo, 0);
  gl.uniform1i(program.textureNormalMap, 1);
  gl.uniform1i(program.textureRMAO, 2);
  gl.uniform1i(program.textureEnv, 3);

  gl.enable(gl.CULL_FACE);
  gl.uniform4f(
    program.matcol,
    repColor[0],
    repColor[1],
    repColor[2],
    repColor[3]
  );
  gl.uniform4f(
    program.shown,
    shownUnifVals[0],
    shownUnifVals[1],
    shownUnifVals[2],
    shownUnifVals[3]
  );
  gl.uniform4f(
    program.effect,
    effectUnifVals[0],
    effectUnifVals[1],
    effectUnifVals[2],
    effectUnifVals[3]
  );
  gl.uniform4f(
    program.texSelect,
    texSelectUnifVals[0],
    texSelectUnifVals[1],
    texSelectUnifVals[2],
    texSelectUnifVals[3]
  );
  gl.uniform4f(
    program.monoSelect,
    monoSelectUnifVals[0],
    monoSelectUnifVals[1],
    monoSelectUnifVals[2],
    monoSelectUnifVals[3]
  );
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

  gl.uniform4f(program.shown, 0, 0, 0, 0);
  gl.uniform4f(program.repMetRough, 0, 0, repMetRough[2], 1);

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

function LoadingManager() {
  this.loadProgram = async function () {
    let path = window.location.pathname;
    let page = path.split("/").pop();
    let baseDir = window.location.href.replace(page, "");
    let shaderDir = baseDir + "shaders/";

    await utils.loadFiles(
      [shaderDir + "vertex.glsl", shaderDir + "fragment.glsl"],
      function (shaderText) {
        var vertexShader = utils.createShader(
          gl,
          gl.VERTEX_SHADER,
          shaderText[0]
        );
        var fragmentShader = utils.createShader(
          gl,
          gl.FRAGMENT_SHADER,
          shaderText[1]
        );

        program = utils.createProgram(gl, vertexShader, fragmentShader);
      }
    );

    gl.useProgram(program);
  };

  // Load a texture set
  this.loadTexture = function (id) {
    imgtx = new Image();
    imgtx.onload = this.textureLoaderCallback;
    imgtx.src = matnames[id];
  };

  // texture loader callback
  this.textureLoaderCallback = function () {
    console.log("Loaded: " + this.src);
    var textureId = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textureId);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this);

    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(
      gl.TEXTURE_2D,
      gl.TEXTURE_MIN_FILTER,
      gl.LINEAR_MIPMAP_LINEAR
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  };

  // load the environment map
  this.loadEnvironment = function (id) {
    // Create a texture.
    var texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + 3);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);

    baseName = "env/" + id + "/";

    const faceInfos = [
      {
        target: gl.TEXTURE_CUBE_MAP_POSITIVE_X,
        url: baseName + "posx.jpg",
      },
      {
        target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
        url: baseName + "negx.jpg",
      },
      {
        target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
        url: baseName + "posy.jpg",
      },
      {
        target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
        url: baseName + "negy.jpg",
      },
      {
        target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
        url: baseName + "posz.jpg",
      },
      {
        target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
        url: baseName + "negz.jpg",
      },
    ];
    faceInfos.forEach((faceInfo) => {
      const { target, url } = faceInfo;

      // Upload the canvas to the cubemap face.
      const level = 0;
      const internalFormat = gl.RGBA;
      const width = 512;
      const height = 512;
      const format = gl.RGBA;
      const type = gl.UNSIGNED_BYTE;

      // setup each face so it's immediately renderable
      gl.texImage2D(
        target,
        level,
        internalFormat,
        width,
        height,
        0,
        format,
        type,
        null
      );

      // Asynchronously load an image
      const image = new Image();
      image.src = url;
      image.addEventListener("load", function () {
        // Now that the image has loaded upload it to the texture.
        gl.activeTexture(gl.TEXTURE0 + 3);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
        gl.texImage2D(target, level, internalFormat, format, type, image);
        gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
      });
    });
    gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
    gl.texParameteri(
      gl.TEXTURE_CUBE_MAP,
      gl.TEXTURE_MIN_FILTER,
      gl.LINEAR_MIPMAP_LINEAR
    );
  };
}

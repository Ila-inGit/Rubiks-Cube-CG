function RubiksCube() {
  /* wrapper class for all sub-cubes that make up rubiks cube */
  this.cubes = new Array(3);
  this.chunkToRotate = null;
  this.rotationAxis = null;
  this.rotationAngle = 0;
  this.cycles = 0;

  this.init = function () {
    for (x = 0; x < 3; x++) {
      this.cubes[x] = new Array(3);
      for (y = 0; y < 3; y++) {
        this.cubes[x][y] = new Array(3);
        for (z = 0; z < 3; z++) {
          var coordinates = [x - 1, y - 1, z - 1];
          var color = [x / 3, y / 3, z / 3, 1.0];
          this.cubes[x][y][z] = new Cube(this, coordinates, color);
        }
      }
    }
  };

  this.draw = function () {
    for (x = 0; x < 3; x++) {
      for (y = 0; y < 3; y++) {
        for (z = 0; z < 3; z++) {
          var cube = this.cubes[x][y][z];
          cube.draw();
        }
      }
    }
  };

  this.setRotation = function (
    cubeToRotateCoordinates,
    axisToRotate,
    isClockwise
  ) {
    if (this.cycles == 0) {
      state.isRotating = false;
      return;
    }

    this.axisToRotate = axisToRotate;

    switch (this.axisToRotate) {
      case 0:
        this.rotationAxis = [1, 0, 0];
        break;
      case 1:
        this.rotationAxis = [0, 1, 0];
        break;
      case 2:
        this.rotationAxis = [0, 0, 1];
        break;
      default:
        break;
    }

    for (x = 0; x < 3; x++) {
      for (y = 0; y < 3; y++) {
        for (z = 0; z < 3; z++) {
          var cube = this.cubes[x][y][z];
          // dont want to compare floats for equality
          if (
            Math.abs(cube.coordinates[0] - cubeToRotateCoordinates[0]) <
              state.EPSILON &&
            Math.abs(cube.coordinates[1] - cubeToRotateCoordinates[1]) <
              state.EPSILON &&
            Math.abs(cube.coordinates[2] - cubeToRotateCoordinates[2]) <
              state.EPSILON
          ) {
            // find cube that matches coordinates and add to chunk
            console.log("yo" + cube.coordinates);
            this.cubeToRotate = state.rubiksCube.cubes[x][y][z];
          }
        }
      }
    }

    if (isClockwise) vec3.scale(this.rotationAxis, this.rotationAxis, -1);

    this.setChunk();
    state.isRotating = true;
    this.cycles -= 1;
  };

  this.setChunk = function () {
    // iterate through cubes matrix to find matches

    var selectedChunk = this.cubeToRotate.coordinates[this.axisToRotate];
    var chunk = [];
    for (x = 0; x < 3; x++) {
      for (y = 0; y < 3; y++) {
        for (z = 0; z < 3; z++) {
          var cube = this.cubes[x][y][z];
          // dont want to compare floats for equality
          if (
            Math.abs(cube.coordinates[this.axisToRotate] - selectedChunk) <
            state.EPSILON
          ) {
            // find cube that matches coordinates and add to chunk
            chunk.push(cube);
          }
        }
      }
    }
    this.chunkToRotate = chunk;
  };

  this.rotateChunk = function () {
    if (Math.abs(this.rotationAngle) == 90) {
      // chunk has finished rotating
      this.rotationAngle = 0;
      isRotating = false;
      this.scramble();
      return;
    }

    this.rotationAngle += 5;

    var newRotationMatrix = mat4.create();
    mat4.rotate(
      newRotationMatrix,
      newRotationMatrix,
      degreesToRadians(5),
      this.rotationAxis
    );

    for (i = 0; i < this.chunkToRotate.length; i++) {
      // rotate each cube
      var cube = this.chunkToRotate[i];
      vec3.transformMat4(cube.coordinates, cube.coordinates, newRotationMatrix);
      mat4.multiply(
        cube.rotationMatrix,
        newRotationMatrix,
        cube.rotationMatrix
      );
    }
  };

  this.hasWon = function () {
    const offset = 1;
    for (x = 0; x < 3; x++) {
      for (y = 0; y < 3; y++) {
        for (z = 0; z < 3; z++) {
          var cube = this.cubes[x][y][z];
          var originalPosition = [x, y, z];
          /* dont want to compare floats for equality */
          if (
            Math.abs(cube.coordinates[0] - originalPosition[0]) >
              state.EPSILON + offset ||
            Math.abs(cube.coordinates[1] - originalPosition[1]) >
              state.EPSILON + offset ||
            Math.abs(cube.coordinates[2] - originalPosition[2]) >
              state.EPSILON + offset
          ) {
            console.log("original: " + originalPosition);
            console.log("cube's: " + cube.coordinates);
            return false;
          }
        }
      }
    }
    return true;
  };

  this.init();
}

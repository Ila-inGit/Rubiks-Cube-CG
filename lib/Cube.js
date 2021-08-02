function Cube(rubiksCube, coordinates, color) {
  this.rubiksCube = rubiksCube;
  this.coordinates = coordinates;
  this.color = color;
  this.rotationMatrix;
  this.q = new Quaternion(1, 0, 0);
  const spacing = 2.1;

  this.COLORS = {
    blue: [0.0, 0.0, 1.0, 1.0],
    green: [0.0, 1.0, 0.0, 1.0],
    orange: [1.0, 0.5, 0.0, 1.0],
    red: [1.0, 0.0, 0.0, 1.0],
    white: [1.0, 1.0, 1.0, 1.0],
    yellow: [1.0, 1.0, 0.0, 1.0],
  };

  this.rotate = function () {
    /*
		  mat4.multiply(viewMatrix, viewMatrix, this.rotationMatrix);
		  mat4.translate(viewMatrix, viewMatrix, this.translationVector);
		  */
  };

  this.init = function () {
    this.rotationMatrix = getQuaternionMatrix(0, 0, 0);
  };

  this.draw = function () {
    let worldMatrix3 = utils.multiplyMatrices(
      utils.MakeTranslateMatrix(
        coordinates[0] * spacing,
        coordinates[1] * spacing,
        coordinates[2] * spacing
      ),
      this.rotationMatrix
    );

    projectionMatrix = utils.multiplyMatrices(
      perspProjectionMatrix,
      viewMatrix
    );

    let projectionMatrix2 = utils.multiplyMatrices(
      projectionMatrix,
      worldMatrix3
    );

    gl.uniformMatrix4fv(
      program.WVPmatrixUniform,
      gl.FALSE,
      utils.transposeMatrix(projectionMatrix2)
    );

    gl.uniformMatrix4fv(
      program.WmatrixUniform,
      gl.FALSE,
      utils.transposeMatrix(worldMatrix3)
    );
    gl.drawElements(
      gl.TRIANGLES,
      startIndex[1] - startIndex[0],
      gl.UNSIGNED_SHORT,
      startIndex[0] * 2
    );
  };

  this.init();
}

function Cube(rubiksCube, coordinates, color) {
  this.rubiksCube = rubiksCube;
  this.coordinates = coordinates;
  this.color = color;
  this.rotationMatrix;
  this.q = new Quaternion(1, 0, 0);
  this.translationMatrix;
  this.isSelected = false;
  const spacing = 2.1;
  this.localRotation;

  this.COLORS = {
    blue: [0.0, 0.0, 1.0, 1.0],
    green: [0.0, 1.0, 0.0, 1.0],
    orange: [1.0, 0.5, 0.0, 1.0],
    red: [1.0, 0.0, 0.0, 1.0],
    white: [1.0, 1.0, 1.0, 1.0],
    yellow: [1.0, 1.0, 0.0, 1.0],
  };

  this.resetRotation = function () {
    transformMat4(
      this.coordinates,
      this.coordinates,
      utils.invertMatrix(this.rotationMatrix)
    );
    this.updateTranslationMatrix();
    this.localRotation = utils.multiplyMatrices(
      this.rotationMatrix,
      this.localRotation
    );

    this.rotationMatrix = raycastManager.getQuaternionMatrix(0, 0, 0);
  };

  this.init = function () {
    this.rotationMatrix = raycastManager.getQuaternionMatrix(0, 0, 0);
    this.localRotation = raycastManager.getQuaternionMatrix(0, 0, 0);
    this.updateTranslationMatrix();
  };

  this.updateTranslationMatrix = function () {
    this.translationMatrix = utils.MakeTranslateMatrix(
      this.coordinates[0] * spacing,
      this.coordinates[1] * spacing,
      this.coordinates[2] * spacing
    );
  };

  this.draw = function () {
    if (this.isSelected) gl.uniform4f(program.selector, 0, 0, 1, 0);
    else gl.uniform4f(program.selector, 1, 1, 1, 1);
    worldMatrix2 = utils.multiplyMatrices(
      utils.multiplyMatrices(this.rotationMatrix, this.translationMatrix),
      this.localRotation
    );

    projectionMatrix = utils.multiplyMatrices(
      perspProjectionMatrix,
      viewMatrix
    );

    let projectionMatrix2 = utils.multiplyMatrices(
      projectionMatrix,
      worldMatrix2
    );

    gl.uniformMatrix4fv(
      program.WVPmatrixUniform,
      gl.FALSE,
      utils.transposeMatrix(projectionMatrix2)
    );

    gl.uniformMatrix4fv(
      program.WmatrixUniform,
      gl.FALSE,
      utils.transposeMatrix(worldMatrix2)
    );

    gl.drawElements(
      gl.TRIANGLES,
      modelsManager.cubeEndIndex,
      gl.UNSIGNED_SHORT,
      modelsManager.cubeStartIndex
    );
  };

  this.init();
}

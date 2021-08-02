/*jslint white: false, onevar: false, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, sub: true, nomen: false */

/** @type {Object} */
var GLU = {};

(function ($) {
  /**
   * Unproject a screen point.
   *
   * @param {number} winX the window point for the x value.
   * @param {number} winY the window point for the y value.
   * @param {number} winZ the window point for the z value.
   * @param {Array.<number>} model the model-view matrix.
   * @param {Array.<number>} proj the projection matrix.
   * @param {Array.<number>} objPos the model point result.
   * @return {boolean} true if the unproject operation was successful, false otherwise.
   */
  $.unProject = function (winX, winY, winZ, model, proj, objPos) {
    /** @type {Array.<number>} */
    var inp = [winX, winY, winZ, 1.0];

    /** @type {Array.<number>} */
    var finalMatrix = [];

    $.multMatrices(model, proj, finalMatrix);
    if (!$.invertMatrix(finalMatrix, finalMatrix)) {
      return false;
    }

    /** @type {Array.<number>} */
    var out = [];

    $.multMatrixVec(finalMatrix, inp, out);

    if (out[3] === 0.0) {
      return false;
    }

    // divide for w
    out[0] /= out[3];
    out[1] /= out[3];
    out[2] /= out[3];

    objPos[0] = out[0];
    objPos[1] = out[1];
    objPos[2] = out[2];

    return true;
  };
  /**
   * Unproject_profs a screen point made by the professor.
   *
   * @param {number} winX the window point for the x value.
   * @param {number} winY the window point for the y value.
   * @param {number} winZ the window point for the z value.
   * @param {Array.<number>} model the model-view matrix.
   * @param {Array.<number>} proj the projection matrix.
   * @param {Array.<number>} objPos the model point result.
   * @return {boolean} true if the unproject operation was successful, false otherwise.
   */
  $.unProjectProf = function (winX, winY, winZ, model, proj, objPos) {
    /** @type {Array.<number>} */
    var inp = [winX, winY, winZ, 1.0];

    /** @type {Array.<number>} */
    var projInv = [];
    /** @type {Array.<number>} */
    var viewInv = [];

    $.invertMatrix(model, viewInv);

    $.invertMatrix(proj, projInv);
    /** @type {Array.<number>} */
    var pointEyeCoords = [];

    $.multMatrixVec(projInv, inp, pointEyeCoords);

    /** @type {Array.<number>} */
    var rayEyeCoords = [
      pointEyeCoords[0],
      pointEyeCoords[1],
      pointEyeCoords[2],
      0,
    ];

    /** @type {Array.<number>} */
    var rayDir = [];

    $.multMatrixVec(viewInv, rayEyeCoords, rayDir);
    console.log("Ray direction " + rayDir);

    objPos[0] = rayDir[0];
    objPos[1] = rayDir[1];
    objPos[2] = rayDir[2];

    return true;
  };
  /**
   * Multiply the matrix by the specified vector.
   *
   * @param {Array.<number>} matrix the matrix.
   * @param {Array.<number>} inp the vector.
   * @param {Array.<number>} out the output.
   */
  $.multMatrixVec = function (matrix, inp, out) {
    for (var i = 0; i < 4; i = i + 1) {
      out[i] =
        inp[0] * matrix[0 * 4 + i] +
        inp[1] * matrix[1 * 4 + i] +
        inp[2] * matrix[2 * 4 + i] +
        inp[3] * matrix[3 * 4 + i];
    }
  };

  /**
   * Multiply the specified matrices.
   *
   * @param {Array.<number>} a the first matrix.
   * @param {Array.<number>} b the second matrix.
   * @param {Array.<number>} r the result.
   */
  $.multMatrices = function (a, b, r) {
    for (var i = 0; i < 4; i = i + 1) {
      for (var j = 0; j < 4; j = j + 1) {
        r[i * 4 + j] =
          a[i * 4 + 0] * b[0 * 4 + j] +
          a[i * 4 + 1] * b[1 * 4 + j] +
          a[i * 4 + 2] * b[2 * 4 + j] +
          a[i * 4 + 3] * b[3 * 4 + j];
      }
    }
  };

  /**
   * Invert a matrix.
   *
   * @param {Array.<number>} m the matrix.
   * @param {Array.<number>} invOut the inverted output.
   * @return {boolean} true if successful, false otherwise.
   */
  $.invertMatrix = function (m, invOut) {
    /** @type {Array.<number>} */
    var inv = [];

    inv[0] =
      m[5] * m[10] * m[15] -
      m[5] * m[11] * m[14] -
      m[9] * m[6] * m[15] +
      m[9] * m[7] * m[14] +
      m[13] * m[6] * m[11] -
      m[13] * m[7] * m[10];
    inv[4] =
      -m[4] * m[10] * m[15] +
      m[4] * m[11] * m[14] +
      m[8] * m[6] * m[15] -
      m[8] * m[7] * m[14] -
      m[12] * m[6] * m[11] +
      m[12] * m[7] * m[10];
    inv[8] =
      m[4] * m[9] * m[15] -
      m[4] * m[11] * m[13] -
      m[8] * m[5] * m[15] +
      m[8] * m[7] * m[13] +
      m[12] * m[5] * m[11] -
      m[12] * m[7] * m[9];
    inv[12] =
      -m[4] * m[9] * m[14] +
      m[4] * m[10] * m[13] +
      m[8] * m[5] * m[14] -
      m[8] * m[6] * m[13] -
      m[12] * m[5] * m[10] +
      m[12] * m[6] * m[9];
    inv[1] =
      -m[1] * m[10] * m[15] +
      m[1] * m[11] * m[14] +
      m[9] * m[2] * m[15] -
      m[9] * m[3] * m[14] -
      m[13] * m[2] * m[11] +
      m[13] * m[3] * m[10];
    inv[5] =
      m[0] * m[10] * m[15] -
      m[0] * m[11] * m[14] -
      m[8] * m[2] * m[15] +
      m[8] * m[3] * m[14] +
      m[12] * m[2] * m[11] -
      m[12] * m[3] * m[10];
    inv[9] =
      -m[0] * m[9] * m[15] +
      m[0] * m[11] * m[13] +
      m[8] * m[1] * m[15] -
      m[8] * m[3] * m[13] -
      m[12] * m[1] * m[11] +
      m[12] * m[3] * m[9];
    inv[13] =
      m[0] * m[9] * m[14] -
      m[0] * m[10] * m[13] -
      m[8] * m[1] * m[14] +
      m[8] * m[2] * m[13] +
      m[12] * m[1] * m[10] -
      m[12] * m[2] * m[9];
    inv[2] =
      m[1] * m[6] * m[15] -
      m[1] * m[7] * m[14] -
      m[5] * m[2] * m[15] +
      m[5] * m[3] * m[14] +
      m[13] * m[2] * m[7] -
      m[13] * m[3] * m[6];
    inv[6] =
      -m[0] * m[6] * m[15] +
      m[0] * m[7] * m[14] +
      m[4] * m[2] * m[15] -
      m[4] * m[3] * m[14] -
      m[12] * m[2] * m[7] +
      m[12] * m[3] * m[6];
    inv[10] =
      m[0] * m[5] * m[15] -
      m[0] * m[7] * m[13] -
      m[4] * m[1] * m[15] +
      m[4] * m[3] * m[13] +
      m[12] * m[1] * m[7] -
      m[12] * m[3] * m[5];
    inv[14] =
      -m[0] * m[5] * m[14] +
      m[0] * m[6] * m[13] +
      m[4] * m[1] * m[14] -
      m[4] * m[2] * m[13] -
      m[12] * m[1] * m[6] +
      m[12] * m[2] * m[5];
    inv[3] =
      -m[1] * m[6] * m[11] +
      m[1] * m[7] * m[10] +
      m[5] * m[2] * m[11] -
      m[5] * m[3] * m[10] -
      m[9] * m[2] * m[7] +
      m[9] * m[3] * m[6];
    inv[7] =
      m[0] * m[6] * m[11] -
      m[0] * m[7] * m[10] -
      m[4] * m[2] * m[11] +
      m[4] * m[3] * m[10] +
      m[8] * m[2] * m[7] -
      m[8] * m[3] * m[6];
    inv[11] =
      -m[0] * m[5] * m[11] +
      m[0] * m[7] * m[9] +
      m[4] * m[1] * m[11] -
      m[4] * m[3] * m[9] -
      m[8] * m[1] * m[7] +
      m[8] * m[3] * m[5];
    inv[15] =
      m[0] * m[5] * m[10] -
      m[0] * m[6] * m[9] -
      m[4] * m[1] * m[10] +
      m[4] * m[2] * m[9] +
      m[8] * m[1] * m[6] -
      m[8] * m[2] * m[5];

    /** @type {number} */
    var det = m[0] * inv[0] + m[1] * inv[4] + m[2] * inv[8] + m[3] * inv[12];

    if (det === 0) {
      return false;
    }

    det = 1.0 / det;

    for (var i = 0; i < 16; i = i + 1) {
      invOut[i] = inv[i] * det;
    }

    return true;
  };
})(GLU);

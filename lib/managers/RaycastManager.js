function RaycastManager() {
  this.getNormalizedRayDirection = function (ev) {
    //This is a way of calculating the coordinates of the click in the canvas taking into account its possible displacement in the page
    var top = 0.0,
      left = 0.0;
    canvas = gl.canvas;
    while (canvas && canvas.tagName !== "BODY") {
      top += canvas.offsetTop;
      left += canvas.offsetLeft;
      canvas = canvas.offsetParent;
    }

    canvas = document.getElementById("web_gl_canvas");
    var x = ev.clientX - left;
    var y = ev.clientY - top;

    //Here we calculate the normalised device coordinates from the pixel coordinates of the canvas
    var normX = (2 * x) / gl.canvas.width - 1;
    var normY = 1 - (2 * y) / gl.canvas.height;

    //We need to go through the transformation pipeline in the inverse order so we invert the matrices
    var projInv = utils.invertMatrix(perspProjectionMatrix);
    var viewInv = utils.invertMatrix(viewMatrix);

    //Find the point (un)projected on the near plane, from clip space coords to eye coords
    //z = -1 makes it so the point is on the near plane
    //w = 1 is for the homogeneous coordinates in clip space
    var pointEyeCoords = utils.multiplyMatrixVector(projInv, [
      normX,
      normY,
      -1,
      1,
    ]);
    //This finds the direction of the ray in eye space
    //Formally, to calculate the direction you would do dir = point - eyePos but since we are in eye space eyePos = [0,0,0]
    //w = 0 is because this is not a point anymore but is considered as a direction
    var rayEyeCoords = [
      pointEyeCoords[0],
      pointEyeCoords[1],
      pointEyeCoords[2],
      0,
    ];

    //We find the direction expressed in world coordinates by multipling with the inverse of the view matrix
    var rayDir = utils.multiplyMatrixVector(viewInv, rayEyeCoords);
    return utils.normaliseVector(rayDir);
  };

  this.getHitCubeIndexes = function (normalisedRayDir) {
    eye = [cx, cy, cz];
    center = [0, 0, 0];

    let collidedCubes = [];
    let collidedCubesDistances = [];
    //We iterate on all the cubes to check for collisions
    for (x = 0; x < 3; x++) {
      for (y = 0; y < 3; y++) {
        for (z = 0; z < 3; z++) {
          spacing = 2.1;
          center = [
            x * spacing - spacing,
            y * spacing - spacing,
            z * spacing - spacing,
          ];
          if (this.doesIntersectCube(eye, normalisedRayDir, center)) {
            let collidedCube = [x, y, z];
            collidedCubes.push(collidedCube);
            //distance
            let distanceVector = [
              center[0] - eye[0],
              center[1] - eye[1],
              center[2] - eye[2],
            ];
            var distanceSquared =
              distanceVector[0] * distanceVector[0] +
              distanceVector[1] * distanceVector[1] +
              distanceVector[2] * distanceVector[2];
            collidedCubesDistances.push(distanceSquared);
          }
        }
      }
    }
    if (collidedCubes.length == 0) return null;
    else {
      let minDistance = constants.VERY_LARGE_NUMBER;
      //only the closest collided cube is returned
      for (i = 0; i < collidedCubes.length; i++) {
        if (collidedCubesDistances[i] < minDistance) {
          minDistance = collidedCubesDistances[i];
          cubeToRotateCoordinates = collidedCubes[i];
        }
      }
      return cubeToRotateCoordinates;
    }
  };

  //This algorithm is taken from the book Real Time Rendering fourth edition
  this.doesIntersectCube = function (rayStartPoint, rayNormalisedDir, center) {
    var centerToRayDistance = [
      center[0] - rayStartPoint[0],
      center[1] - rayStartPoint[1],
      center[2] - rayStartPoint[2],
    ];
    //Projection of centerToRayDistance onto the ray direction
    var projScalar =
      centerToRayDistance[0] * rayNormalisedDir[0] +
      centerToRayDistance[1] * rayNormalisedDir[1] +
      centerToRayDistance[2] * rayNormalisedDir[2];
    var projVec = [
      rayNormalisedDir[0] * projScalar,
      rayNormalisedDir[1] * projScalar,
      rayNormalisedDir[2] * projScalar,
    ];
    var xDistanceSquared = Math.abs(projVec[0] - centerToRayDistance[0]);
    var yDistanceSquared = Math.abs(projVec[1] - centerToRayDistance[1]);
    var zDistanceSquared = Math.abs(projVec[2] - centerToRayDistance[2]);
    if (xDistanceSquared > constants.SMALL_CUBE_HALF_SIZE) {
      return false;
    }
    if (yDistanceSquared > constants.SMALL_CUBE_HALF_SIZE) {
      return false;
    }
    if (zDistanceSquared > constants.SMALL_CUBE_HALF_SIZE) {
      return false;
    }
    return true;
  };

  this.getAxisAndDirectionToRotate = function (
    faceMainDirection,
    rotationMainDirection
  ) {
    let axisToRotate;
    let isClockwise;

    let face_X = faceMainDirection[0];
    let face_Y = faceMainDirection[1];
    let face_Z = faceMainDirection[2];
    let rotation_X = rotationMainDirection[0];
    let rotation_Y = rotationMainDirection[1];
    let rotation_Z = rotationMainDirection[2];
    if (face_X != 0) {
      if (face_X > 0) {
        if (rotation_Y != 0) {
          axisToRotate = [0, 0, 1];
          isClockwise = rotation_Y < 0;
        } else if (rotation_Z != 0) {
          axisToRotate = [0, 1, 0];
          isClockwise = rotation_Z > 0;
        }
      } else {
        if (rotation_Y != 0) {
          axisToRotate = [0, 0, 1];
          isClockwise = rotation_Y > 0;
        } else if (rotation_Z != 0) {
          axisToRotate = [0, 1, 0];
          isClockwise = rotation_Z < 0;
        }
      }
    } else if (face_Y != 0) {
      if (face_Y > 0) {
        if (rotation_X != 0) {
          axisToRotate = [0, 0, 1];
          isClockwise = rotation_X > 0;
        } else if (rotation_Z != 0) {
          axisToRotate = [1, 0, 0];
          isClockwise = rotation_Z < 0;
        }
      } else {
        if (rotation_X != 0) {
          axisToRotate = [0, 0, 1];
          isClockwise = rotation_X < 0;
        } else if (rotation_Z != 0) {
          axisToRotate = [1, 0, 0];
          isClockwise = rotation_Z > 0;
        }
      }
    } else if (face_Z != 0) {
      if (face_Z > 0) {
        if (rotation_X != 0) {
          axisToRotate = [0, 1, 1];
          isClockwise = rotation_X < 0;
        } else if (rotation_Y != 0) {
          axisToRotate = [1, 0, 0];
          isClockwise = rotation_Y > 0;
        }
      } else {
        if (rotation_X != 0) {
          axisToRotate = [0, 1, 0];
          isClockwise = rotation_X > 0;
        } else if (rotation_Y != 0) {
          axisToRotate = [1, 0, 0];
          isClockwise = rotation_Y < 0;
        }
      }
    }
    return [axisToRotate, isClockwise];
  };

  this.getMainDirection = function (inputVector, intersectedSide) {
    var x = Math.abs(inputVector[0]);
    var y = Math.abs(inputVector[1]);
    var z = Math.abs(inputVector[2]);
    if (intersectedSide[0] != 0) {
      if (y > z) return [0, inputVector[1], 0];
      else return [0, 0, inputVector[2]];
    } else if (intersectedSide[1] != 0) {
      if (x > z) return [inputVector[0], 0, 0];
      else return [0, 0, inputVector[2]];
    } else if (intersectedSide[2] != 0) {
      if (x > y) return [inputVector[0], 0, 0];
      else return [0, inputVector[1], 0];
    }
  };

  this.getQuaternionMatrix = function (rvx, rvy, rvz, q) {
    // compute the rotation matrix
    //quaternion useful because avoid gimbal lock, 3 var for vector 1 for rotation around that vector
    let deltaQ = Quaternion.fromEuler(
      utils.degToRad(rvz),
      utils.degToRad(rvx),
      utils.degToRad(rvy),
      (order = "ZXY")
    );
    q = deltaQ.mul(q);
    return q.toMatrix4();
  };

  var isInsideBound = function (length, bound) {
    return Math.abs(length) < bound;
  };
  var getPointToPointDistance = function (point1, point2) {
    let distanceVector = [
      point1[0] - point2[0],
      point1[1] - point2[1],
      point1[2] - point2[2],
    ];
    var distanceSquared =
      distanceVector[0] * distanceVector[0] +
      distanceVector[1] * distanceVector[1] +
      distanceVector[2] * distanceVector[2];
    return distanceSquared;
  };

  this.getRaycastPointOnSide = function (rayOrigin, rayTip, side) {
    let x_coeff = rayTip[0];
    let y_coeff = rayTip[1];
    let z_coeff = rayTip[2];
    if (generalUtils.arrayEquals(side, constants.sides.UP)) {
      t = (constants.WHOLE_CUBE_HALF_SIZE - rayOrigin[1]) / y_coeff;
      x = t * x_coeff + rayOrigin[0];
      y = constants.WHOLE_CUBE_HALF_SIZE;
      z = t * z_coeff + rayOrigin[2];
    } else if (generalUtils.arrayEquals(side, constants.sides.DOWN)) {
      t = (-constants.WHOLE_CUBE_HALF_SIZE - rayOrigin[1]) / y_coeff;
      x = t * x_coeff + rayOrigin[0];
      y = -constants.WHOLE_CUBE_HALF_SIZE;
      z = t * z_coeff + rayOrigin[2];
    } else if (generalUtils.arrayEquals(side, constants.sides.RIGHT)) {
      t = (constants.WHOLE_CUBE_HALF_SIZE - rayOrigin[0]) / x_coeff;
      x = constants.WHOLE_CUBE_HALF_SIZE;
      y = t * y_coeff + rayOrigin[1];
      z = t * z_coeff + rayOrigin[2];
    } else if (generalUtils.arrayEquals(side, constants.sides.LEFT)) {
      t = (-constants.WHOLE_CUBE_HALF_SIZE - rayOrigin[0]) / x_coeff;
      x = -constants.WHOLE_CUBE_HALF_SIZE;
      y = t * y_coeff + rayOrigin[1];
      z = t * z_coeff + rayOrigin[2];
    } else if (generalUtils.arrayEquals(side, constants.sides.FRONT)) {
      t = (constants.WHOLE_CUBE_HALF_SIZE - rayOrigin[2]) / z_coeff;
      x = t * x_coeff + rayOrigin[0];
      y = t * y_coeff + rayOrigin[1];
      z = constants.WHOLE_CUBE_HALF_SIZE;
    } else if (generalUtils.arrayEquals(side, constants.sides.BACK)) {
      t = (-constants.WHOLE_CUBE_HALF_SIZE - rayOrigin[2]) / z_coeff;
      x = t * x_coeff + rayOrigin[0];
      y = t * y_coeff + rayOrigin[1];
      z = -constants.WHOLE_CUBE_HALF_SIZE;
    }
    return [x, y, z];
  };

  this.getIntersectedSide = function (rayOrigin, r2) {
    let x_coeff = r2[0];
    let y_coeff = r2[1];
    let z_coeff = r2[2];
    let t;
    let x;
    let y;
    let z;
    let closestIntersectedSide;
    let distance;
    let closestDistance = 10000;
    //line equation:
    //r1[0] + r1[1] + r1[2] + x_coeff * t + y_coeff * t + z_coeff * t
    //now let's find t
    //up side
    t = (constants.WHOLE_CUBE_HALF_SIZE - rayOrigin[1]) / y_coeff;
    x = t * x_coeff + rayOrigin[0];
    y = constants.WHOLE_CUBE_HALF_SIZE;
    z = t * z_coeff + rayOrigin[2];
    if (
      isInsideBound(x, constants.WHOLE_CUBE_HALF_SIZE) &&
      isInsideBound(z, constants.WHOLE_CUBE_HALF_SIZE)
    ) {
      distance = getPointToPointDistance([x, y, z], rayOrigin);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIntersectedSide = [0, 1, 0];
      }
    }
    //down side
    t = (-constants.WHOLE_CUBE_HALF_SIZE - rayOrigin[1]) / y_coeff;
    x = t * x_coeff + rayOrigin[0];
    y = -constants.WHOLE_CUBE_HALF_SIZE;
    z = t * z_coeff + rayOrigin[2];
    if (
      isInsideBound(x, constants.WHOLE_CUBE_HALF_SIZE) &&
      isInsideBound(z, constants.WHOLE_CUBE_HALF_SIZE)
    ) {
      distance = getPointToPointDistance([x, y, z], rayOrigin);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIntersectedSide = [0, -1, 0];
      }
    }
    //right side
    t = (constants.WHOLE_CUBE_HALF_SIZE - rayOrigin[0]) / x_coeff;
    x = constants.WHOLE_CUBE_HALF_SIZE;
    y = t * y_coeff + rayOrigin[1];
    z = t * z_coeff + rayOrigin[2];
    if (
      isInsideBound(y, constants.WHOLE_CUBE_HALF_SIZE) &&
      isInsideBound(z, constants.WHOLE_CUBE_HALF_SIZE)
    ) {
      distance = getPointToPointDistance([x, y, z], rayOrigin);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIntersectedSide = [1, 0, 0];
      }
    }
    //left side
    t = (-constants.WHOLE_CUBE_HALF_SIZE - rayOrigin[0]) / x_coeff;
    x = -constants.WHOLE_CUBE_HALF_SIZE;
    y = t * y_coeff + rayOrigin[1];
    z = t * z_coeff + rayOrigin[2];
    if (
      isInsideBound(y, constants.WHOLE_CUBE_HALF_SIZE) &&
      isInsideBound(z, constants.WHOLE_CUBE_HALF_SIZE)
    ) {
      distance = getPointToPointDistance([x, y, z], rayOrigin);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIntersectedSide = [-1, 0, 0];
      }
    }
    //front side
    t = (constants.WHOLE_CUBE_HALF_SIZE - rayOrigin[2]) / z_coeff;
    x = t * x_coeff + rayOrigin[0];
    y = t * y_coeff + rayOrigin[1];
    z = constants.WHOLE_CUBE_HALF_SIZE;
    if (
      isInsideBound(x, constants.WHOLE_CUBE_HALF_SIZE) &&
      isInsideBound(y, constants.WHOLE_CUBE_HALF_SIZE)
    ) {
      distance = getPointToPointDistance([x, y, z], rayOrigin);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIntersectedSide = [0, 0, 1];
      }
    }
    //back side
    t = (-constants.WHOLE_CUBE_HALF_SIZE - rayOrigin[2]) / z_coeff;
    x = t * x_coeff + rayOrigin[0];
    y = t * y_coeff + rayOrigin[1];
    z = -constants.WHOLE_CUBE_HALF_SIZE;
    if (
      isInsideBound(x, constants.WHOLE_CUBE_HALF_SIZE) &&
      isInsideBound(y, constants.WHOLE_CUBE_HALF_SIZE)
    ) {
      distance = getPointToPointDistance([x, y, z], rayOrigin);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIntersectedSide = [0, 0, -1];
      }
    }
    // to find the 3D point on the world-space ray
    return closestIntersectedSide;
  };
}

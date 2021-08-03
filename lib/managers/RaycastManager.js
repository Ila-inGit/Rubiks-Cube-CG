function RaycastResult(hitCubeIndexes, normalisedRayDir) {
  this.hitCubeIndexes = hitCubeIndexes;
  this.normalisedRayDir = normalisedRayDir;
}
function RaycastManager() {
  this.firstRaycastResult;

  this.doRaycast = function (ev) {
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

    //console.log("left " + left + " top " + top);
    var x = ev.clientX - left;
    var y = ev.clientY - top;

    //Here we calculate the normalised device coordinates from the pixel coordinates of the canvas
    //console.log("ClientX " + x + " ClientY " + y);
    var normX = (2 * x) / gl.canvas.width - 1;
    var normY = 1 - (2 * y) / gl.canvas.height;
    //console.log("NormX " + normX + " NormY " + normY);

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
    //console.log("Point eye coords " + pointEyeCoords);

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
    //console.log("Ray direction " + rayDir);
    var normalisedRayDir = utils.normaliseVector(rayDir);
    //console.log("normalised ray dir " + normalisedRayDir);
    //The ray starts from the camera in world coordinates

    eye = [cx, cy, cz];
    center = [0, 0, 0];
    //console.log("eye: " + eye);
    //console.log("center: " + center);

    let collidedCubes = [];
    let collidedCubesDistances = [];
    //We iterate on all the objects in the scene to check for collisions
    for (x = 0; x < 3; x++) {
      for (y = 0; y < 3; y++) {
        for (z = 0; z < 3; z++) {
          spacing = 2.1;
          center = [
            x * spacing - spacing,
            y * spacing - spacing,
            z * spacing - spacing,
          ];
          if (this.doesIntersectCube(eye, normalisedRayDir, center, 1)) {
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
    if (collidedCubes.length == 0)
      return new RaycastResult(null, normalisedRayDir);
    else {
      let minDistance = 10000;
      for (i = 0; i < collidedCubes.length; i++) {
        if (collidedCubesDistances[i] < minDistance) {
          minDistance = collidedCubesDistances[i];
          cubeToRotateCoordinates = collidedCubes[i];
        }
      }
      return new RaycastResult(cubeToRotateCoordinates, normalisedRayDir);
    }
  };

  //This algorithm is taken from the book Real Time Rendering fourth edition
  this.doesIntersectCube = function (
    rayStartPoint,
    rayNormalisedDir,
    sphereCentre,
    sphereRadius
  ) {
    //Distance between sphere origin and origin of ray
    var l = [
      sphereCentre[0] - rayStartPoint[0],
      sphereCentre[1] - rayStartPoint[1],
      sphereCentre[2] - rayStartPoint[2],
    ];
    //console.log("distance: " + l);
    var l_squared = l[0] * l[0] + l[1] * l[1] + l[2] * l[2];
    //If this is true, the ray origin is inside the sphere so it collides with the sphere
    if (l_squared < sphereRadius * sphereRadius) {
      //console.log("ray origin inside sphere");
      return true;
    }
    //Projection of l onto the ray direction
    var s =
      l[0] * rayNormalisedDir[0] +
      l[1] * rayNormalisedDir[1] +
      l[2] * rayNormalisedDir[2];
    //The spere is behind the ray origin so no intersection
    if (s < 0) {
      //console.log("sphere behind ray origin");
      return false;
    }
    var projVec = [
      rayNormalisedDir[0] * s,
      rayNormalisedDir[1] * s,
      rayNormalisedDir[2] * s,
    ];

    var halfSideSquared = 1.1;
    var xDistanceSquared = Math.abs(projVec[0] - l[0]);

    var yDistanceSquared = Math.abs(projVec[1] - l[1]);
    var zDistanceSquared = Math.abs(projVec[2] - l[2]);
    if (xDistanceSquared > halfSideSquared) {
      //console.log("xDtstanceSquared" + xDistanceSquared);
      return false;
    }
    if (yDistanceSquared > halfSideSquared) {
      //console.log("yDtstanceSquared" + yDistanceSquared);
      return false;
    }
    if (zDistanceSquared > halfSideSquared) {
      //console.log("yDtstanceSquared" + zDistanceSquared);
      return false;
    }

    //Now we can say that the ray will hit the sphere
    //console.log("hit");
    return true;
  };

  this.getAxisAndDirectionToRotate = function (
    faceMainDirection,
    rotationMainDirection
  ) {
    console.log("ROTATION: " + rotationMainDirection);
    console.log("FACE: " + faceMainDirection);

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
          isClockwise = rotation_Y > 0;
        } else if (rotation_Z != 0) {
          axisToRotate = [0, 1, 0];
          isClockwise = rotation_Z < 0;
        }
      } else {
        if (rotation_Y != 0) {
          axisToRotate = [0, 0, 1];
          isClockwise = rotation_Y < 0;
        } else if (rotation_Z != 0) {
          axisToRotate = [0, 1, 0];
          isClockwise = rotation_Z > 0;
        }
      }
    } else if (face_Y != 0) {
      if (face_Y > 0) {
        if (rotation_X != 0) {
          axisToRotate = [0, 0, 1];
          isClockwise = rotation_X < 0;
        } else if (rotation_Z != 0) {
          axisToRotate = [1, 0, 0];
          isClockwise = rotation_Z > 0;
        }
      } else {
        if (rotation_X != 0) {
          axisToRotate = [0, 0, 1];
          isClockwise = rotation_X > 0;
        } else if (rotation_Z != 0) {
          axisToRotate = [1, 0, 0];
          isClockwise = rotation_Z < 0;
        }
      }
    } else if (face_Z != 0) {
      if (face_Z > 0) {
        if (rotation_X != 0) {
          axisToRotate = [0, 1, 1];
          isClockwise = rotation_X > 0;
        } else if (rotation_Y != 0) {
          axisToRotate = [1, 0, 0];
          isClockwise = rotation_Y < 0;
        }
      } else {
        if (rotation_X != 0) {
          axisToRotate = [0, 1, 0];
          isClockwise = rotation_X < 0;
        } else if (rotation_Y != 0) {
          axisToRotate = [1, 0, 0];
          isClockwise = rotation_Y > 0;
        }
      }
    }
    return [axisToRotate, isClockwise];
  };

  this.getMainDirection = function (inputVector) {
    var x = Math.abs(inputVector[0]);
    var y = Math.abs(inputVector[1]);
    var z = Math.abs(inputVector[2]);
    if (x > y && x > z) return [inputVector[0], 0, 0];
    if (y > x && y > z) return [0, inputVector[1], 0];
    if (z > x && z > y) return [0, 0, inputVector[2]];
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
  this.hasHit = function (raycastResult) {
    return raycastResult.hitCubeIndexes != null;
  };
}
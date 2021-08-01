var faceMainDirection;
var rotationMainDirection;
var startingPoint;
var endingPoint;
var eye;
var center;

function raycast(ev) {
  console.log("Hello!!!!");
  //These commented lines of code only work if the canvas is full screen
  /*console.log("ClientX "+ev.clientX+" ClientY "+ev.clientY);
    var normX = (2*ev.clientX)/ gl.canvas.width - 1;
    var normY = 1 - (2*ev.clientY) / gl.canvas.height;
    console.log("NormX "+normX+" NormY "+normY);*/

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

  console.log("left " + left + " top " + top);
  var x = ev.clientX - left;
  var y = ev.clientY - top;

  //Here we calculate the normalised device coordinates from the pixel coordinates of the canvas
  console.log("ClientX " + x + " ClientY " + y);
  var normX = (2 * x) / gl.canvas.width - 1;
  var normY = 1 - (2 * y) / gl.canvas.height;
  console.log("NormX " + normX + " NormY " + normY);

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
  console.log("Point eye coords " + pointEyeCoords);

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
  console.log("Ray direction " + rayDir);
  var normalisedRayDir = normaliseVector(rayDir);
  console.log("normalised ray dir " + normalisedRayDir);
  //The ray starts from the camera in world coordinates

  eye = [cx, cy, cz];
  center = [0, 0, 0];
  console.log("eye: " + eye);
  console.log("center: " + center);

  if (raySquareIntersection(eye, normalisedRayDir, center, 1)) return true;

  center = [3, 0, 0];
  if (raySquareIntersection(eye, normalisedRayDir, center, 1)) {
    isSecond = true;
    return true;
  }

  //We iterate on all the objects in the scene to check for collisions
  /*
    for(i = 0; i < objectsInScene.length; i++){

        var hit = raySphereIntersection(rayStartPoint, normalisedRayDir, objectsInScene[i][0], objectsInScene[i][1]);
        if(hit){
            console.log("hit sphere number "+i);
            colours[i] = [Math.random(), Math.random(), Math.random(), 1];
        }
    }
    */
}

function normaliseVector(vec) {
  var magnitude = Math.sqrt(
    vec[0] * vec[0] + vec[1] * vec[1] + vec[2] * vec[2]
  );
  console.log("Magnitude" + magnitude);
  var normVec = [vec[0] / magnitude, vec[1] / magnitude, vec[2] / magnitude];
  return normVec;
}

//This algorithm is taken from the book Real Time Rendering fourth edition
function raySquareIntersection(
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
  console.log("distance: " + l);
  var l_squared = l[0] * l[0] + l[1] * l[1] + l[2] * l[2];
  //If this is true, the ray origin is inside the sphere so it collides with the sphere
  if (l_squared < sphereRadius * sphereRadius) {
    console.log("ray origin inside sphere");
    return true;
  }
  //Projection of l onto the ray direction
  var s =
    l[0] * rayNormalisedDir[0] +
    l[1] * rayNormalisedDir[1] +
    l[2] * rayNormalisedDir[2];
  //The spere is behind the ray origin so no intersection
  if (s < 0) {
    console.log("sphere behind ray origin");
    return false;
  }
  var projVec = [
    rayNormalisedDir[0] * s,
    rayNormalisedDir[1] * s,
    rayNormalisedDir[2] * s,
  ];
  //extra
  faceMainDirection = getMainDirection(rayNormalisedDir);
  startingPoint = rayNormalisedDir;
  console.log(
    "face main direction!!!!!!!!!!!!!!!!!!!!!!!!!!!!!" + faceMainDirection
  );
  //extra

  var halfSideSquared = 1.1;
  var xDistanceSquared = Math.abs(projVec[0] - l[0]);

  var yDistanceSquared = Math.abs(projVec[1] - l[1]);
  var zDistanceSquared = Math.abs(projVec[2] - l[2]);
  if (xDistanceSquared > halfSideSquared) {
    console.log("xDtstanceSquared" + xDistanceSquared);
    return false;
  }
  if (yDistanceSquared > halfSideSquared) {
    console.log("yDtstanceSquared" + yDistanceSquared);
    return false;
  }
  if (zDistanceSquared > halfSideSquared) {
    console.log("yDtstanceSquared" + zDistanceSquared);
    return false;
  }
  /*
  //Squared distance from sphere centre and projection s with Pythagorean theorem
  var m_squared = l_squared - s * s;
  //If this is true the ray will miss the sphere
  if (m_squared > sphereRadius * sphereRadius) {
    console.log("m squared > r squared");
    return false;
  }*/

  //Now we can say that the ray will hit the sphere
  console.log("hit");
  return true;
}

function getRotationDir(ev) {
  console.log("Hello!!!!");
  //These commented lines of code only work if the canvas is full screen
  /*console.log("ClientX "+ev.clientX+" ClientY "+ev.clientY);
    var normX = (2*ev.clientX)/ gl.canvas.width - 1;
    var normY = 1 - (2*ev.clientY) / gl.canvas.height;
    console.log("NormX "+normX+" NormY "+normY);*/

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

  console.log("left " + left + " top " + top);
  var x = ev.clientX - left;
  var y = ev.clientY - top;

  //Here we calculate the normalised device coordinates from the pixel coordinates of the canvas
  console.log("ClientX " + x + " ClientY " + y);
  var normX = (2 * x) / gl.canvas.width - 1;
  var normY = 1 - (2 * y) / gl.canvas.height;
  console.log("NormX " + normX + " NormY " + normY);

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
  console.log("Point eye coords " + pointEyeCoords);

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
  console.log("Ray direction " + rayDir);
  var normalisedRayDir = normaliseVector(rayDir);
  console.log("normalised ray dir " + normalisedRayDir);
  //The ray starts from the camera in world coordinates

  eye = [cx, cy, cz];

  getRaySquareDistanceVector(eye, normalisedRayDir, center, 1);
  //We iterate on all the objects in the scene to check for collisions
  /*
    for(i = 0; i < objectsInScene.length; i++){

        var hit = raySphereIntersection(rayStartPoint, normalisedRayDir, objectsInScene[i][0], objectsInScene[i][1]);
        if(hit){
            console.log("hit sphere number "+i);
            colours[i] = [Math.random(), Math.random(), Math.random(), 1];
        }
    }
    */
}

function getRaySquareDistanceVector(
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
  var l_squared = l[0] * l[0] + l[1] * l[1] + l[2] * l[2];
  //Projection of l onto the ray direction
  var s =
    l[0] * rayNormalisedDir[0] +
    l[1] * rayNormalisedDir[1] +
    l[2] * rayNormalisedDir[2];
  //The spere is behind the ray origin so no intersection
  if (s < 0) {
    console.log("sphere behind ray origin");
    return false;
  }
  var projVec = [
    rayNormalisedDir[0] * s,
    rayNormalisedDir[1] * s,
    rayNormalisedDir[2] * s,
  ];
  //extra
  endingPoint = rayNormalisedDir;
  var mouseMovement = [
    endingPoint[0] - startingPoint[0],
    endingPoint[1] - startingPoint[1],
    endingPoint[2] - startingPoint[2],
  ];
  rotationMainDirection = getMainDirection(mouseMovement);
  console.log(
    "rotationMainDirection!!!!!!!!!!!!!!!!!!!!!!!!!!!!!" + rotationMainDirection
  );
  //extra

  var halfSideSquared = 1.1;
  var xDistanceSquared = projVec[0] - l[0];

  var yDistanceSquared = projVec[1] - l[1];
  var zDistanceSquared = projVec[2] - l[2];
  console.log("distances:");
  console.log("x:" + xDistanceSquared);
  console.log("y:" + yDistanceSquared);
  console.log("z:" + zDistanceSquared);
  /*
  if (xDistanceSquared > halfSideSquared) {
    console.log("xDtstanceSquared" + xDistanceSquared);
    return false;
  }
  if (yDistanceSquared > halfSideSquared) {
    console.log("yDtstanceSquared" + yDistanceSquared);
    return false;
  }
  if (zDistanceSquared > halfSideSquared) {
    console.log("yDtstanceSquared" + zDistanceSquared);
    return false;
  }*/
  /*
  //Squared distance from sphere centre and projection s with Pythagorean theorem
  var m_squared = l_squared - s * s;
  //If this is true the ray will miss the sphere
  if (m_squared > sphereRadius * sphereRadius) {
    console.log("m squared > r squared");
    return false;
  }*/
  return true;
}

function getMainDirection(inputVector) {
  console.log("input" + inputVector);
  //inputVector = normaliseVector(inputVector);
  var x = Math.abs(inputVector[0]);
  var y = Math.abs(inputVector[1]);
  var z = Math.abs(inputVector[2]);
  if (x > y && x > z) return [inputVector[0], 0, 0];
  if (y > x && y > z) return [0, inputVector[1], 0];
  if (z > x && z > y) return [0, 0, inputVector[2]];
  console.log("wrong");
}

function doRotation() {
  const rotationConstant = 90;
  console.log("ROTATION: " + rotationMainDirection);
  console.log("FACE: " + faceMainDirection);

  let face_X = faceMainDirection[0];
  let face_Y = faceMainDirection[1];
  let face_Z = faceMainDirection[2];
  let rotation_X = rotationMainDirection[0];
  let rotation_Y = rotationMainDirection[1];
  let rotation_Z = rotationMainDirection[2];
  if (face_X != 0) {
    if (face_X > 0) {
      if (rotation_Y != 0) {
        deltaRotationAngles[2] =
          rotation_Y > 0 ? -rotationConstant : rotationConstant;
      } else if (rotation_Z != 0) {
        deltaRotationAngles[1] =
          rotation_Z > 0 ? rotationConstant : -rotationConstant;
      }
    } else {
      if (rotation_Y != 0) {
        deltaRotationAngles[2] =
          rotation_Y > 0 ? rotationConstant : -rotationConstant;
      } else if (rotation_Z != 0) {
        deltaRotationAngles[1] =
          rotation_Z > 0 ? -rotationConstant : rotationConstant;
      }
    }
  } else if (face_Y != 0) {
    if (face_Y > 0) {
      if (rotation_X != 0) {
        deltaRotationAngles[2] =
          rotation_X > 0 ? rotationConstant : -rotationConstant;
      } else if (rotation_Z != 0) {
        deltaRotationAngles[0] =
          rotation_Z > 0 ? -rotationConstant : rotationConstant;
      }
    } else {
      if (rotation_X != 0) {
        deltaRotationAngles[2] =
          rotation_X > 0 ? -rotationConstant : rotationConstant;
      } else if (rotation_Z != 0) {
        deltaRotationAngles[0] =
          rotation_Z > 0 ? rotationConstant : -rotationConstant;
      }
    }
  } else if (face_Z != 0) {
    if (face_Z > 0) {
      if (rotation_X != 0) {
        deltaRotationAngles[1] =
          rotation_X > 0 ? -rotationConstant : rotationConstant;
      } else if (rotation_Y != 0) {
        deltaRotationAngles[0] =
          rotation_Y > 0 ? rotationConstant : -rotationConstant;
      }
    } else {
      if (rotation_X != 0) {
        deltaRotationAngles[1] =
          rotation_X > 0 ? rotationConstant : -rotationConstant;
      } else if (rotation_Y != 0) {
        deltaRotationAngles[0] =
          rotation_Y > 0 ? -rotationConstant : rotationConstant;
      }
    }
  }
}

var q = new Quaternion(1, 0, 0);
function getQuaternionMatrix(rvx, rvy, rvz) {
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
}

function isRotating() {
  return (
    deltaRotationAngles[0] != 0 ||
    deltaRotationAngles[1] != 0 ||
    deltaRotationAngles[2] != 0
  );
}

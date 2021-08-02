function linePlaneIntersection(ray, rayOrigin, normal, coord) {
  //get the value
  var d = dot(normal, coord);

  if (dot(normal, ray) == 0) {
    return false; // no intersection the ray is parallel to the plane
  }

  // computer the X value for the directed line ray intersection the plane
  var x = (d - dot(normal, rayOrigin)) / dot(normal, ray);

  //output contact point
  var ray_mul_x = mulVectorScalar(ray, x);

  return sumVector3D(rayOrigin, ray_mul_x); //the ray vector should be nomalized
}

// p1 p2 p3 point in the plane, r1 r2 ray point
function linePlaneIntersection2(p1, p2, p3, r1, r2) {
  // First compute the axes
  var V1 = p2 - p1;
  var V2 = p3 - p1;
  var V3 = crossProduct(V1, V2);

  // Project ray points R1 and R2 onto the axes of the plane. (This is equivalent to a rotation.)
  var vRotRay1 = [dot(V1, r1 - p1), dot(V2, r1 - p1), dot(V3, r1 - p1)];
  var vRotRay2 = [dot(V1, r2 - p1), dot(V2, r2 - p1), dot(V3, r2 - p1)];
  // Return now if ray will never intersect plane (they're parallel)
  if (vRotRay1[2] == vRotRay2[2]) return FALSE;

  // Find 2D plane coordinates (fX, fY) that the ray interesects with
  var fPercent = vRotRay1[2] / (vRotRay2[2] - vRotRay1[2]);
  vIntersect2d = vRotRay1 + (vRotRay1 - vRotRay2) * fPercent;
  fX = vIntersect2d[0];
  fY = vIntersect2d[1];

  // to find the 3D point on the world-space ray
  return r1 + (r1 - r2) * fPercent;
}

function findCubeIntersection(ray, rayOrigin) {
  var TopPlanesNormals = [
    [0.0, 1.0, 0.0],
    [1.0, 0.0, 0.0],
    [0.0, 0.0, 1.0],
  ];
  var BottomPlanesNormals = [
    [0.0, -1.0, 0.0],
    [-1.0, 0.0, 0.0],
    [0.0, 0.0, -1.0],
  ];
  var BottomPoint = [-1.5, -1.5, -1.5];
  var TopPoint = [1.5, 1.5, 1.5];

  // top point control
  for (i = 0; i < 3; i++) {
    var intersec = linePlaneIntersection(
      ray,
      rayOrigin,
      TopPlanesNormals[i],
      TopPoint
    );

    intersec = mulVectorScalar(intersec, 0.025);
    console.log(
      "manngggg: " + intersec[0] + " , " + intersec[1] + " , " + intersec[2]
    );

    if (Math.abs(intersec[0]) < 2) {
      if (Math.abs(intersec[1]) < 2) {
        console.log("plane => " + i);
        console.log(
          "pos prof: " + intersec[0] + " , " + intersec[1] + " , " + intersec[2]
        );
        return intersec;
      }
    }
  }

  return false;
}

function dot(v1, v2) {
  return v1[0] * v2[0] + v1[1] * v2[1] + v2[2] * v2[2];
}

function norm(vec) {
  var magnitude = Math.sqrt(
    vec[0] * vec[0] + vec[1] * vec[1] + vec[2] * vec[2]
  );
  var normVec = [vec[0] / magnitude, vec[1] / magnitude, vec[2] / magnitude];
  return normVec;
}
// 3D vectors only
function crossProduct(v1, v2) {
  return [
    v1[1] * v2[2] - v1[2] * v2[1],
    v1[2] * v2[0] - v1[0] * v2[2],
    v1[0] * v2[1] - v1[1] * v2[0],
  ];
}

function sumVector3D(v1, v2) {
  return [v1[0] + v2[0], v1[1] + v2[1], v1[2] + v2[2]];
}

function mulVectorScalar(v1, n) {
  return [v1[0] * n, v1[1] * n, v1[2] * n];
}

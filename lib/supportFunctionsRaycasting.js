function linePlaneIntersection(ray, rayOrigin, normal, coord) {
    //get the value
    var d = dot(normal, coord);
  
    if (dot(normal, ray) == 0) {
      return false; // no intersection the ray is parallel to the plane
    }
  
    // computer the X value for the directed line ray intersection the plane
    var x = (d - dot(normal, rayOrigin)) / dot(normal, ray);
  
    //output contact point
    return rayOrigin + norm(ray) * x; //the ray vector should be nomalized
  }
  
  // p1 p2 p3 point in the plane, r1 r2 ray point
  function linePlaneIntersection2(p1, p2, p3, r1, r2) {
    // First compute the axes
    var V1 = p2 - p1;
    var V2 = p3 - p1;
    var V3 = crossProduct(V1,V2);
  
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
  
  function dot(v1, v2) {
    return v1[0] * v2[0] + v1[1] * v2[1] + v2[2] * v2[2];
  }
  
  function norm(v1) {
    var length = Math.sqrt(v1[0] * v1[0] + v1[1] * v1[1] + v1[2] * v1[2]); //calculating length
    v1[0] = v1[0] / length; //assigning new value to x (dividing x by length of the vector)
    v1[1] = v1[1] / length; //assigning new value to y
    v1[2] = v1[2] / length;
    return v1;
  }
  // 3D vectors only
  function crossProduct(v1,v2) {
    return [
      v1[1] * v2[2] - v1[2] * v2[1],
      v1[2] * v2[0] - v1[0] *v2[2],
      v1[0] * v2[1] -v1[1] * v2[0]
    ]
  }

 /************************************/
 /***these are not used but may be an alternative */
 function screenToWorld(invViewProjection, screenWidth, screenHeight){
    // expects this[2] (z value) to be -1 if want position at zNear and +1 at zFar

    var x = 2*this[0]/screenWidth - 1.0;
    var y = 1.0 - (2*this[1]/screenHeight); // note: Y axis oriented top -> down in screen space
    var z = this[2];
    this.setXYZ(x,y,z);
    this.applyMat4(invViewProjection);
    var m = invViewProjection;
    var w = m[3] * x + m[7] * y + m[11] * z + m[15]; // required for perspective divide
    if (w !== 0){
        var invW = 1.0/w;
        this[0] *= invW;
        this[1] *= invW;
        this[2] *= invW;
    }

    return this;
}

function worldToScreen (viewProjectionMatrix, screenWidth, screenHeight){
    var m = viewProjectionMatrix;
    var w = m[3] * this[0] + m[7] * this[1] + m[11] * this[2] + m[15]; // required for perspective divide
    this.applyMat4(viewProjectionMatrix);
    if (w!==0){ // do perspective divide and NDC -> screen conversion
        var invW = 1.0/w;
        this[0] = (this[0]*invW + 1) / 2 * screenWidth;
        this[1] = (1-this[1]*invW) / 2 * screenHeight; // screen space Y goes from top to bottom
        this[2] *= invW;
    } 
    return this;
}
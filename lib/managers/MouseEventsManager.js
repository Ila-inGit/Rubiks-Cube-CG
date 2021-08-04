function MouseEventsManager() {
  this.isMovingCamera = false;
  (this.lastMouseX = -100), (this.lastMouseY = -100);

  this.doMouseDown = function (event) {
    console.clear();
    this.lastMouseX = event.pageX;
    this.lastMouseY = event.pageY;
    var raycastResult = raycastManager.doRaycast(event);
    raycastManager.firstRaycastResult = raycastResult;
    //extra
    //extra
    if (!raycastManager.hasHit(raycastManager.firstRaycastResult))
      this.isMovingCamera = true;
    else if (!isRotating) {
      let i = raycastManager.firstRaycastResult.hitCubeIndexes;
      rubiksCube.getCubeFromCoordinates(i).isSelected = true;
    }
  };

  this.doMouseUp = function (event) {
    this.lastMouseX = -100;
    this.lastMouseY = -100;
    this.isMovingCamera = false;

    var firstRaycastResult = raycastManager.firstRaycastResult;
    var secondRaycastResult = raycastManager.doRaycast(event);
    if (!isRotating && raycastManager.hasHit(firstRaycastResult)) {
      /*
      let faceMainDirection = raycastManager.getMainDirection(
        firstRaycastResult.normalisedRayDir
      );*/
      //extra
      let faceMainDirection = raycastManager.getIntersectedSide(
        [cx, cy, cz],
        firstRaycastResult.normalisedRayDir
      );
      console.log("faceMainDirection: " + faceMainDirection);
      //extra

      let startingPoint = firstRaycastResult.normalisedRayDir;
      let endingPoint = secondRaycastResult.normalisedRayDir;
      var mouseMovement = [
        endingPoint[0] - startingPoint[0],
        endingPoint[1] - startingPoint[1],
        endingPoint[2] - startingPoint[2],
      ];
      let rotationMainDirection = raycastManager.getMainDirection(
        mouseMovement,
        faceMainDirection
      );

      let axis_direction = raycastManager.getAxisAndDirectionToRotate(
        faceMainDirection,
        rotationMainDirection
      );
      let rotationAxis = axis_direction[0];
      let isClockwise = axis_direction[1];
      let cubeToRotateIndexes = firstRaycastResult.hitCubeIndexes;
      //let cubeToRotateCoordinates = firstRaycastResult.cubeToRotateCoordinates;
      console.log("rotationAxis: " + rotationAxis);
      console.log(
        "cubeToRotateIndexes:  " +
          "x: " +
          cubeToRotateIndexes[0] +
          "   y: " +
          cubeToRotateIndexes[1] +
          "   z: " +
          cubeToRotateIndexes[2]
      );
      console.log("isClockwise: " + isClockwise);
      rubiksCube.setRotation(cubeToRotateIndexes, rotationAxis, isClockwise);
      //deselect cube
      let i = firstRaycastResult.hitCubeIndexes;
      rubiksCube.getCubeFromCoordinates(i).isSelected = false;
    }
  };
  this.doMouseMove = function (event) {
    if (this.isMovingCamera) {
      var dx = event.pageX - this.lastMouseX;
      var dy = this.lastMouseY - event.pageY;
      this.lastMouseX = event.pageX;
      this.lastMouseY = event.pageY;

      if (dx != 0 || dy != 0) {
        angle = angle + 0.5 * dx;
        elevation = elevation + 0.5 * dy;
      }
    }
  };
  this.doMouseWheel = function (event) {
    var nLookRadius = lookRadius + event.wheelDelta / 200.0;
    if (nLookRadius > 2.0 && nLookRadius < 100.0) {
      lookRadius = nLookRadius;
    }
  };
}

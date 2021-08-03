function MouseEventsManager() {
  this.mouseState = false;
  (this.lastMouseX = -100), (this.lastMouseY = -100);

  this.doMouseDown = function (event) {
    console.clear();
    this.lastMouseX = event.pageX;
    this.lastMouseY = event.pageY;
    raycastResult = raycastManager.doRaycast(event);
    if (raycastResult.hitCubeIndexes != null) {
      console.clear();
      raycastManager.firstRaycastResult = raycastResult;
      isHit = true;
    } else this.mouseState = true;
  };

  this.doMouseUp = function (event) {
    this.lastMouseX = -100;
    this.lastMouseY = -100;
    this.mouseState = false;
    if (!isRotating && isHit) {
      let firstRaycastResult = raycastManager.firstRaycastResult;
      let secondRaycastResult = raycastManager.doRaycast(event);

      let faceMainDirection = raycastManager.getMainDirection(
        firstRaycastResult.normalisedRayDir
      );

      let startingPoint = firstRaycastResult.normalisedRayDir;
      let endingPoint = secondRaycastResult.normalisedRayDir;
      var mouseMovement = [
        endingPoint[0] - startingPoint[0],
        endingPoint[1] - startingPoint[1],
        endingPoint[2] - startingPoint[2],
      ];
      let rotationMainDirection =
        raycastManager.getMainDirection(mouseMovement);

      let axis_direction = raycastManager.getAxisAndDirectionToRotate(
        faceMainDirection,
        rotationMainDirection
      );
      let axisToRotate = axis_direction[0];
      let isClockwise = axis_direction[1];
      let cubeToRotateIndexes = firstRaycastResult.hitCubeIndexes;
      //let cubeToRotateCoordinates = firstRaycastResult.cubeToRotateCoordinates;
      console.log("axisToRotate: " + axisToRotate);
      console.log("cubeToRotateIndexes: " + cubeToRotateIndexes);
      console.log("isClockwise: " + isClockwise);
      rubiksCube.setRotation(cubeToRotateIndexes, axisToRotate, isClockwise);
    }
    isHit = false;
  };
  this.doMouseMove = function (event) {
    if (this.mouseState) {
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

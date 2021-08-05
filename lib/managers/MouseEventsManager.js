function MouseEventsManager() {
  this.isMovingCamera = false;
  (this.lastMouseX = -100), (this.lastMouseY = -100);

  this.doMouseDown = function (event) {
    console.clear();
    this.lastMouseX = event.pageX;
    this.lastMouseY = event.pageY;
    var raycastResult = raycastManager.doRaycast(event);
    raycastManager.firstRaycastResult = raycastResult;
    if (!raycastManager.hasHit(raycastResult)) this.isMovingCamera = true;
    else if (!rubiksCube.isRotating)
      rubiksCube.selectCube(raycastResult.hitCubeIndexes);
  };

  this.doMouseUp = function (event) {
    this.lastMouseX = -100;
    this.lastMouseY = -100;
    this.isMovingCamera = false;

    var firstRaycastResult = raycastManager.firstRaycastResult;
    var secondRaycastResult = raycastManager.doRaycast(event);

    var side = raycastManager.getIntersectedSide(
      [cx, cy, cz],
      firstRaycastResult.normalisedRayDir
    );
    console.log("side: " + side);
    var startingPoint = raycastManager.getRaycastPointOnSide(
      [cx, cy, cz],
      firstRaycastResult.normalisedRayDir,
      side
    );
    var endingPoint = raycastManager.getRaycastPointOnSide(
      [cx, cy, cz],
      secondRaycastResult.normalisedRayDir,
      side
    );
    console.log("ending point: " + endingPoint);
    var mouseMovement = [
      endingPoint[0] - startingPoint[0],
      endingPoint[1] - startingPoint[1],
      endingPoint[2] - startingPoint[2],
    ];
    console.log("mouse movement: " + mouseMovement);
    if (!generalUtils.arrayEquals(mouseMovement, constants.NO_MOUSE_MOVEMENT)) {
      if (!rubiksCube.isRotating && raycastManager.hasHit(firstRaycastResult)) {
        let rotationMainDirection = raycastManager.getMainDirection(
          mouseMovement,
          side
        );

        let axis_direction = raycastManager.getAxisAndDirectionToRotate(
          side,
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
      }
    }
    if (firstRaycastResult.hitCubeIndexes != null) {
      rubiksCube.deselectCube(firstRaycastResult.hitCubeIndexes);
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

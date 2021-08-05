function MouseEventsManager() {
  this.isMovingCamera = false;
  (this.lastMouseX = -100), (this.lastMouseY = -100);
  this.firstRay;
  this.secondRay;
  this.hitCubeIndexes;

  this.doMouseDown = function (event) {
    console.clear();
    this.lastMouseX = event.pageX;
    this.lastMouseY = event.pageY;
    this.firstRay = raycastManager.getNormalizedRayDirection(event);
    this.hitCubeIndexes = raycastManager.getHitCubeIndexes(this.firstRay);
    if (this.hitCubeIndexes != null)
      console.log(
        "hitCubeIndexes:  " +
          "x: " +
          this.hitCubeIndexes[0] +
          "   y: " +
          this.hitCubeIndexes[1] +
          "   z: " +
          this.hitCubeIndexes[2]
      );
    if (this.hitCubeIndexes == null) this.isMovingCamera = true;
    else if (!rubiksCube.isRotating) rubiksCube.selectCube(this.hitCubeIndexes);
  };

  this.doMouseUp = function (event) {
    this.lastMouseX = -100;
    this.lastMouseY = -100;
    this.isMovingCamera = false;
    if (this.hitCubeIndexes != null) {
      this.secondRay = raycastManager.getNormalizedRayDirection(event);

      var side = raycastManager.getIntersectedSide([cx, cy, cz], this.firstRay);
      console.log("side: " + side);
      var startingPoint = raycastManager.getRaycastPointOnSide(
        [cx, cy, cz],
        this.firstRay,
        side
      );
      console.log("starting point: " + startingPoint);
      var endingPoint = raycastManager.getRaycastPointOnSide(
        [cx, cy, cz],
        this.secondRay,
        side
      );
      console.log("ending point: " + endingPoint);
      var mouseMovement = [
        endingPoint[0] - startingPoint[0],
        endingPoint[1] - startingPoint[1],
        endingPoint[2] - startingPoint[2],
      ];
      console.log("mouse movement on side plane: " + mouseMovement);
      if (
        !generalUtils.arrayEquals(mouseMovement, constants.NO_MOUSE_MOVEMENT)
      ) {
        if (!rubiksCube.isRotating) {
          let rotationDirection = raycastManager.getMainDirection(
            mouseMovement,
            side
          );
          console.log("rotation direction: " + rotationDirection);
          let axis_direction = raycastManager.getAxisAndDirectionToRotate(
            side,
            rotationDirection
          );
          let rotationAxis = axis_direction[0];
          console.log("rotationAxis: " + rotationAxis);
          let isClockwise = axis_direction[1];
          console.log("isClockwise: " + isClockwise);
          rubiksCube.setRotation(
            this.hitCubeIndexes,
            rotationAxis,
            isClockwise
          );
        }
      }
      rubiksCube.deselectCube(this.hitCubeIndexes);
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

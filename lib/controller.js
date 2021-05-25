var facades = {
  front: Facade(color.white),
  right: Facade(color.blue),
  left: Facade(color.green),
  back: Facade(color.yellow),
  top: Facade(color.orange),
  bottom: Facade(color.red),
};

var rotations = {
  up: [facades.front, facades.top, facades.back, facades.bottom],
  down: [facades.front, facades.bottom, facades.back, facades.top],
  right: [facades.front, facades.right, facades.back, facades.left],
  left: [facades.front, facades.left, facades.back, facades.right],
};

function rotate(raycastHit, direction) {
  var facade = findFacade(raycastHit);
  var xy = findXY(raycastHit, facade);
  var rotatingFacades = findRotation(facade, direction);

  if (rotatingFacades == rotations.up || rotatingFacades == rotations.down) {
    for (y = 0; y < Facade.sideLength; y++) {
      temp = rotatingFacades[0].facelets[(xy.x, y)];
      rotatingFacades[0].facelets[(xy.x, y)] =
        rotatingFacades[1].facelets[(xy.x, y)];
      rotatingFacades[1].facelets[(xy.x, y)] =
        rotatingFacades[2].facelets[(xy.x, y)];
      rotatingFacades[2].facelets[(xy.x, y)] =
        rotatingFacades[3].facelets[(xy.x, y)];
      rotatingFacades[3].facelets[(xy.x, y)] = temp;
    }
  } else {
    for (x = 0; x < Facade.sideLength; x++) {
      temp = rotatingFacades[0].facelets[(x, xy.y)];
      rotatingFacades[0].facelets[(x, xy.y)] =
        rotatingFacades[1].facelets[(x, xy.y)];
      rotatingFacades[1].facelets[(x, xy.y)] =
        rotatingFacades[2].facelets[(x, xy.y)];
      rotatingFacades[2].facelets[(x, xy.y)] =
        rotatingFacades[3].facelets[(x, xy.y)];
      rotatingFacades[3].facelets[(x, xy.y)] = temp;
    }
  }
}

function findFacade(raycastHit) {
  if (raycastHit.x == Facade.sideLength) return facades.right;
  else if (raycastHit.x == 0) return facades.left;
  else if (raycastHit.y == Facade.sideLength) return facades.up;
  else if (raycastHit.y == 0) return facades.bottom;
  else if (raycastHit.z == Facade.sideLength) return facades.back;
  else if (raycastHit.z == 0) return facades.front;
}

function findXY(raycastHit, facade) {
  switch (facade) {
    case facades.front:
      return [raycastHit.x, raycastHit.y];
    case facades.back:
      return [Facade.sideLength - raycastHit.x, raycastHit.y];
    case facades.right:
      return [raycastHit.z, raycastHit.y];
    case facades.front:
      return [raycastHit.x, raycastHit.y];
    case facades.front:
      return [raycastHit.x, raycastHit.y];
    case facades.front:
      return [raycastHit.x, raycastHit.y];
  }
}

function findRotation(facade, direction) {
  switch (facade) {
    case facades.front:
      if (direction.x > 0) return rotations.right;
      else if (direction.x < 0) return rotations.left;
      else if (direction.y > 0) return rotations.up;
      else if (direction.y < 0) return rotations.down;
    case facades.back:
      return [raycastHit.x, raycastHit.y];
    case facades.right:
      return [raycastHit.x, raycastHit.y];
    case facades.front:
      return [raycastHit.x, raycastHit.y];
    case facades.front:
      return [raycastHit.x, raycastHit.y];
    case facades.front:
      return [raycastHit.x, raycastHit.y];
  }
}

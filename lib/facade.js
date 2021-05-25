class Facade {
  static faceletsSideCount = 3;
  static sideLength = 3;

  constructor(color) {
    for (x = 0; x < faceletsSideCount; x++) {
      for (y = 0; y < faceletsSideCount; y++) {
        facelets[(x, y)] = Facelet(color);
      }
    }
  }
}

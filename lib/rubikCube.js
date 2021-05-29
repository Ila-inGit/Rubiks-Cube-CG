class rubikCube {
  constructor() {
    this._cubes = new Array(3);
    let count = 0;

    for (let x = 0; x < 3; x++) {
      this.cubes[x] = new Array(3);
      for (let y = 0; y < 3; y++) {
        this.cubes[x][y] = new Array(3);
        for (let z = 0; z < 3; z++) {
          let coordinates = [x - 1, y - 1, z - 1];
          let color = [x / 3, y / 3, z / 3, 1.0];
          this.cubes[x][y][z] = new smallCube(count, coordinates, color);
          count++;
        }
      }
    }
  }

  get cubes() {
    return this._cubes;
  }
}

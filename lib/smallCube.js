class smallCube {
  constructor(id, coordinates, color) {
    this._id = id;
    this._coordinates = coordinates;
    this._color = color;
    this.stickers = [];

    //this.paintCube();
  }

  get id() {
    return this._id;
  }
  get coordinates() {
    return this._coordinates;
  }
  get color() {
    return this._color;
  }

  paintCube() {
    var x = this.coordinates[0];
    var y = this.coordinates[1];
    var z = this.coordinates[2];

    if (x == -1) {
      this.stickers.push(
        new Sticker(this, this.COLORS["red"], function () {
          this.cube.rotate();
          mat4.translate(viewMatrix, viewMatrix, [-state.stickerDepth, 0, 0]);
          mat4.rotateZ(viewMatrix, viewMatrix, degreesToRadians(90));
        })
      );
    } else if (x == 1) {
      this.stickers.push(
        new Sticker(this, this.COLORS["orange"], function () {
          this.cube.rotate();
          mat4.translate(viewMatrix, viewMatrix, [state.stickerDepth, 0, 0]);
          mat4.rotateZ(viewMatrix, viewMatrix, degreesToRadians(-90));
        })
      );
    }

    if (y == -1) {
      this.stickers.push(
        new Sticker(this, this.COLORS["yellow"], function () {
          this.cube.rotate();
          mat4.translate(viewMatrix, viewMatrix, [0, -state.stickerDepth, 0]);
          mat4.rotateX(viewMatrix, viewMatrix, degreesToRadians(-180));
        })
      );
    } else if (y == 1) {
      this.stickers.push(
        new Sticker(this, this.COLORS["white"], function () {
          this.cube.rotate();
          mat4.translate(viewMatrix, viewMatrix, [0, state.stickerDepth, 0]);
        })
      );
    }

    if (z == -1) {
      this.stickers.push(
        new Sticker(this, this.COLORS["blue"], function () {
          this.cube.rotate();
          mat4.translate(viewMatrix, viewMatrix, [0, 0, -state.stickerDepth]);
          mat4.rotateX(viewMatrix, viewMatrix, degreesToRadians(-90));
        })
      );
    } else if (z == 1) {
      this.stickers.push(
        new Sticker(this, this.COLORS["green"], function () {
          this.cube.rotate();
          mat4.translate(viewMatrix, viewMatrix, [0, 0, state.stickerDepth]);
          mat4.rotateX(viewMatrix, viewMatrix, degreesToRadians(90));
        })
      );
    }
  }
}

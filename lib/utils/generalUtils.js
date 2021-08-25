var generalUtils = {
  arrayEquals: function (a, b) {
    return (
      Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((val, index) => val === b[index])
    );
  },
  getRandomCube: function () {
    return [
      Math.floor(Math.random() * 3),
      Math.floor(Math.random() * 3),
      Math.floor(Math.random() * 3),
    ];
  },
  getRandomAxis: function () {
    var randomInt = Math.floor(Math.random() * 3);
    if (randomInt == 0) return [1, 0, 0];
    else if (randomInt == 1) return [0, 1, 0];
    else return [0, 0, 1];
  },
  getRandomBool: function () {
    if (Math.floor(Math.random() * 2)) return true;
    else return false;
  },
};

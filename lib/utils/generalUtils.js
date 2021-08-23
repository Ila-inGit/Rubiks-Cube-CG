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
      Math.floor(Math.random() * 2),
      Math.floor(Math.random() * 2),
      Math.floor(Math.random() * 2),
    ];
  },
  getRandomAxis: function () {
    return [
      Math.floor(Math.random() * 2),
      Math.floor(Math.random() * 2),
      Math.floor(Math.random() * 2),
    ];
  },
  getRandomBool: function () {
    if (Math.floor(Math.random() * 2)) return true;
    else return false;
  },
};

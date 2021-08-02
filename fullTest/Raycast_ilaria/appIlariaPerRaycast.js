// event handler
var leftMousePressed = false;

//coordinates of the pointer where the user starts to drag or where the user click
var starting_MouseX = -100,
  starting_MouseY = -100;
//coordinates of the pointer where the user finish to drag or where the user releases the mouse
var ending_MouseX = -100,
  ending_MouseY = -100;

// direction that the face of the cube has to perform after release the mouse(dragged)
var direction_Of_Movement = [];

//location of the point in the 3D space, return value of the uProject function
var obj_near = [0.0, 0.0, 0.0];
//location of the point in the 3D space, return value of the uProject function
var rayDir = [];
//final 3d coordinates of the point to be passed
var obj_pos = [];
var obj_pos_prof;

var lastMouseX = -100,
  lastMouseY = -100;

function mousedown(event) {
  //my code

  var top = 0.0,
    left = 0.0;
  canvas = gl.canvas;

  top += canvas.offsetTop;
  left += canvas.offsetLeft;

  // console.log("left " + left + " top " + top);
  starting_MouseX = event.clientX - left;
  starting_MouseY = event.clientY - top;

  // //Here we calculate the normalised device coordinates from the pixel coordinates of the canvas
  // console.log("ClientX " + starting_MouseX + " ClientY " + starting_MouseY);
  var normX = (2 * starting_MouseX) / gl.canvas.width - 1;
  // //need to invert the y because OpenGL renders with (0,0) on bottom, mouse reports with (0,0) on top
  var normY = 1 - (2 * starting_MouseY) / gl.canvas.height;
  // console.log("NormX " + normX + " NormY " + normY);

  // //USING unPROJECT FUNCTION TO GET COORDINATE OF THE NEAREST POINT

  GLU.unProject(normX, normY, -1.0, viewMatrix, projMatrix, obj_near);

  // +++++++++ controllo ++++++++++++ //
  // console.log(
  //   "near: " + obj_near[0] + " , " + obj_near[1] + " , " + obj_near[2]
  // );
  /// seconda prova con il codice della prof
  GLU.unProjectProf(normX, normY, -1.0, viewMatrix, projMatrix, rayDir);

  var rayDirNorm = norm(rayDir);
  // // +++++++++ controllo ++++++++++++ //
  // console.log(
  //   "rayDirNorm: " +
  //     rayDirNorm[0] +
  //     " , " +
  //     rayDirNorm[1] +
  //     " , " +
  //     rayDirNorm[2]
  // );
  //The ray starts from the camera in world coordinates
  var cx = 0,
    cy = 0,
    cz = 18.0;

  var rayStartPoint = [cx, cy, cz];

  //valori di prova per la funzione di intersezione con un piano dando una normale e un punto
  // var testNormal = [0.0, 0.0, -1.0];
  // var testPoint = [-1.5, -1.5, -1.5];

  // obj_pos = linePlaneIntersection(
  //   obj_near,
  //   rayStartPoint,
  //   testNormal,
  //   testPoint
  // );
  // console.log(
  //   "pos mia: " + obj_pos[0] + " , " + obj_pos[1] + " , " + obj_pos[2]
  // );
  // per codice della prof
  // obj_pos_prof = linePlaneIntersection(
  //   rayDirNorm,
  //   rayStartPoint,
  //   testNormal,
  //   testPoint
  // );

  obj_pos_prof = findCubeIntersection(rayDirNorm, rayStartPoint);

  console.log(obj_pos_prof);

  // se l'intersezione è dentro il cubo true

  // if (obj_pos[0] < cube_lenght) {
  //   if (obj_pos[1] < cube_lenght) {
  //     //true
  //   }
  // }

  state.ui.dragging = true;
  state.theta.x = event.pageX;
  state.theta.y = event.pageY;
  // controllo per ogni faccia che può essere intersecata dal raggio
}

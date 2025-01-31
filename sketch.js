const Canvas_length = 400
const tic_tac_size = 5
const icon_buffer = 15

const division_size = Math.floor(Canvas_length/tic_tac_size)

let moves_rendering = []
let X_to_play = true

function setup() {
  createCanvas(Canvas_length, Canvas_length);
};

function draw() {
  background(220);
  drawTicTacToe()
  //rendering played moves
  moves_rendering.forEach(element => element())
}

function mouseClicked(){
  is_in_canvas = (mouseX <= Canvas_length) && (mouseY <= Canvas_length)
  if(is_in_canvas){
    drawfunc = X_to_play ? drawX : drawO
    moves_rendering.push(drawfunc(mouseX,mouseY))
    X_to_play = !X_to_play
  }
}

function drawTicTacToe(weight = 3) {
  //stroke('magenta');
  strokeWeight(weight);
  let j = 1
  while(j<=tic_tac_size){
    let cord = j*division_size
    line(cord,0,cord,Canvas_length)
    line(0,cord,Canvas_length,cord)
    j++
  }
};

function drawX(x,y) {
  const startCord = (v) => Math.floor(v/division_size)*division_size + icon_buffer
  const endCord = (v) => (Math.floor(v/division_size) +1)*division_size - icon_buffer
  function X (){
    line(startCord(x),startCord(y),endCord(x),endCord(y))
    line(endCord(x),startCord(y),startCord(x),endCord(y))
  }
  return X
}

function drawO(x,y) {
  const cord = (v) => Math.floor(v/division_size)*division_size + (division_size/2)
  function O(){
    circle(cord(x),cord(y),division_size-icon_buffer)
  }
  return O
}

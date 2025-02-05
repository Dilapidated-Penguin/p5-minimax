const Canvas_length = 400
const tic_tac_size = 3
const icon_buffer = 15

//Board rendering
const division_size = Math.floor(Canvas_length/tic_tac_size)

let moves_rendering = []//related to minimax computation
let X_to_play = true
var board_array = []
//game logic

function setup() {
  createCanvas(Canvas_length, Canvas_length);

  let newGame = createButton("Start new game")
  newGame.position(Canvas_length,30)
  newGame.mousePressed(clearBoard)

  board_array = returnClearBoard(tic_tac_size)
};

function draw() {
  background(220);

  drawTicTacToe()
  //rendering played moves
  moves_rendering.forEach(element => element())
}
function mouseClicked(){

  const is_in_canvas = (mouseX <= Canvas_length) && (mouseY <= Canvas_length)

  const mouseToMatrix = (mouse_position)=> Math.floor(mouse_position / division_size)
  const attempted_move = [mouseToMatrix(mouseY),mouseToMatrix(mouseX)]
  if(is_in_canvas && isValidMove(attempted_move,board_array)){
    drawfunc = X_to_play ? drawX : drawO
    moves_rendering.push(drawfunc(mouseX,mouseY))

    //logic
    
    board_array = JSON.parse(JSON.stringify(makeMove(attempted_move,board_array,X_to_play)))
    console.log(board_array)
    X_to_play = !X_to_play

    current_gamestate = gameState(board_array)
    
    if(!current_gamestate.complete){

      const computer_move = returnBestMove(board_array,X_to_play)
      
      board_array = JSON.parse(JSON.stringify(makeMove(computer_move,board_array,X_to_play)))
      console.log(board_array)
      const post_comp_gamestate = gameState(board_array)
      if(post_comp_gamestate.complete){
        console.log("The computer move has completed the game")
        endstate(post_comp_gamestate)
      }else{
        X_to_play = !X_to_play
        //The computer move has not finished the game and it's back to the users turn of play
      }
      
    }else{
      console.log("the user move has completed the game")
      endstate(current_gamestate)
    }
    
  }
}
function endstate(state){
/*
ENDSTATE
if won: add line to show win to moves_rendering + display text about who won
if tied: Show that 
*/
  let drawText
  if(state.won){
    //Add the line
    drawText = ()=>{
      text('The winner is ' + state.winner,0,Math.floor(Canvas_length/2))
    }
  }else{
    
    drawText = ()=>{
      text("The game is tied",0,Math.floor(Canvas_length/2))
    }
  }
  moves_rendering.push(drawText)
}
function clearBoard(){
  moves_rendering = []
  X_to_play = true
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

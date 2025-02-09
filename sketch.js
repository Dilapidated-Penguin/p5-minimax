const Canvas_length = 400
const tic_tac_size = 3
const icon_buffer = 15

const TEXTSIZE = 30
const STROKEWEIGHT = 15
//Board rendering
const division_size = Math.floor(Canvas_length/tic_tac_size)
const buffer = Math.floor(division_size/2)

let moves_rendering = []
//game logic
let X_to_play = true
var board_array = []


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

  const is_valid_move = isValidMove(attempted_move,board_array)
  console.log(is_valid_move)
  if(is_in_canvas && is_valid_move){
    let drawfunc = X_to_play ? drawX : drawO
    moves_rendering.push(drawfunc(mouseX,mouseY))

    //logic
    
    board_array = JSON.parse(JSON.stringify(makeMove(attempted_move,board_array,X_to_play)))

    X_to_play = !X_to_play

    current_gamestate = gameState(board_array)
    
    if(!current_gamestate.complete){

      const computer_move = returnBestMove(board_array,X_to_play)
      
      board_array = JSON.parse(JSON.stringify(makeMove(computer_move,board_array,X_to_play)))
      let compdrawfunc = X_to_play ? drawX : drawO
      const comp_position = (v)=>(v*division_size) + icon_buffer
      moves_rendering.push(compdrawfunc(comp_position(computer_move[1]),comp_position(computer_move[0])))

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
//win_indicator(line_flag)(index) --> function to add to move_rendering
function win_indicator(line_flag){
  const diag_buffer = Math.floor(buffer/Math.sqrt(2))
  const end_cord = Canvas_length-diag_buffer

  switch(line_flag){
    case 'R':
      return function(index){
        return ()=>{
          strokeWeight(STROKEWEIGHT);

          const y_cord = (index*division_size) + buffer
          const x_start = buffer
          const x_end = Canvas_length - x_start
          line(x_start,y_cord,x_end,y_cord)              
        }
      }
    case 'C':
      return function(index){
        return ()=>{
          strokeWeight(STROKEWEIGHT);

          const x_cord = (index*division_size) + buffer
          const y_start = buffer
          const y_end = Canvas_length - buffer
          line(x_cord,y_start,x_cord,y_end)              
        }
      }
    case 'ud':
      return function(index){
        return ()=>{
          strokeWeight(STROKEWEIGHT);
          line(diag_buffer,end_cord,end_cord,diag_buffer)
        }
      }
    case 'ld':
      return function(index){
        return ()=>{
          strokeWeight(STROKEWEIGHT);
          line(diag_buffer,diag_buffer,end_cord,end_cord)
        }
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
  const text_location = Math.floor(Canvas_length/2)
  if(state.won){
    //Add the win text + Add the line denoting the win
    drawText = ()=>{
      textSize(TEXTSIZE);
      textStyle(BOLD);
      text('The winner is ' + state.winner,0,text_location)
    }
    moves_rendering.push(win_indicator(state.win_line.flag)(state.win_line.index))
  }else{
    drawText = ()=>{
      textSize(TEXTSIZE);
      textStyle(BOLD);
      text("The game is tied",0,text_location)
    }
  }
  moves_rendering.push(drawText)
}
function clearBoard(){
  moves_rendering = []
  board_array = returnClearBoard(tic_tac_size)
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
  const cordO = (v) => Math.floor(v/division_size)*division_size + (division_size/2)
  function O(){
    circle(cordO(x),cordO(y),division_size-icon_buffer)
  }
  return O
}

const Canvas_length = 400
const tic_tac_size = 3
const icon_buffer = 15

const STROKEWEIGHT = 15
//Board rendering
const division_size = Math.floor(Canvas_length/tic_tac_size)
const buffer = Math.floor(division_size/2)

let moves_rendering = []
//game logic
let X_to_play = true
var board_array = []
let user_to_play

//loading animation
let loading_animation = false
let k=0,m=0

//Contains all the messages
let pseudo_console = []
function addToPseudo(message){
  pseudo_console.push(message)
  
  if(pseudo_console.length >= 10){
    pseudo_console.shift()
  }
}

//
const worker = new Worker('worker.js');

function setup() {
  createCanvas(Canvas_length + 450, Canvas_length);

  let newGame = createButton("Start new game")
  newGame.position(Canvas_length,30)
  newGame.mousePressed(clearBoard)
  user_to_play = true
  board_array = returnClearBoard(tic_tac_size)
};

function draw() {
  background(220);

  drawTicTacToe()
  //rendering the moves played
  moves_rendering.forEach(element => element())

  //render the console:
  for(let i = 0; i<pseudo_console.length;i++){
    let y = 100 + i*19
    text(pseudo_console[i],Canvas_length+15,y)
  }

  //loading animation: Loading animation by black
  if(loading_animation){
    //fill(0);
    const x_cooridinate = Canvas_length +160
    const y_coordinate = 40
    ellipse(x_cooridinate +100*sin(radians(k)),y_coordinate,20*cos(radians(m)),20*cos(radians(m)));
    ellipse(x_cooridinate +100*sin(radians(k)+PI/3),y_coordinate,20*cos(radians(m)+PI/3),20*cos(radians(m)+PI/3));
    ellipse(x_cooridinate +100*sin(radians(k)+PI/6),y_coordinate,20*cos(radians(m)+PI/6),20*cos(radians(m)+PI/6));
    if(k<180){
       k+=2;
      if(90<k){
        if(m<180) m+=4;
      else m = 0;
      }
    }
    else {
      k=0;
      m=0;
    }
  }
}
function mouseClicked(){

  const is_in_canvas = (mouseX <= Canvas_length) && (mouseY <= Canvas_length)

  const mouseToMatrix = (mouse_position)=> Math.floor(mouse_position / division_size)
  const attempted_move = [mouseToMatrix(mouseY),mouseToMatrix(mouseX)]

  if(is_in_canvas && user_to_play){
    const is_valid_move = isValidMove(attempted_move,board_array)

    if(is_valid_move){
      let drawfunc = X_to_play ? drawX : drawO
      moves_rendering.push(drawfunc(mouseX,mouseY))
  
      board_array = makeMove(attempted_move,board_array,X_to_play)
      loading_animation = true

      X_to_play = !X_to_play
      user_to_play = false

      const current_gamestate = gameState(board_array)

      if(!current_gamestate.complete){
        //Retrieves the best move in a seperate thread
        worker.postMessage([board_array, X_to_play]);

        //Loading

      }else{
        endstate(current_gamestate)
      }
    }
  }
}

worker.onmessage = function(event) {
  [computer_move,data] = event.data

  board_array = makeMove(computer_move,board_array,X_to_play)
  //Add the information to the pseudo console
  addToPseudo(`Move found in ${data.elapsed}ms`)
  addToPseudo(`the orientation agnostic cache of minimax outputs was accessed ${data.cache_accessed} times`)
  addToPseudo(`${data.outputs_cached} new minimax answers were cached`)


  let compdrawfunc = X_to_play ? drawX : drawO
  const comp_position = (v)=>(v*division_size) + icon_buffer

  moves_rendering.push(compdrawfunc(comp_position(computer_move[1]),comp_position(computer_move[0])))
  
  const post_comp_gamestate = gameState(board_array)
  if(post_comp_gamestate.complete){
    endstate(post_comp_gamestate)
  }else{
    X_to_play = !X_to_play
    user_to_play = true
    //The computer move has not finished the game and it's back to the users turn of play
  }

  
  loading_animation = false
};
//############################################
function win_indicator(line_flag){
  //win_indicator(line_flag)(index) --> function to add to move_rendering
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
    case 'dd':
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
  textStyle(BOLD)
  if(state.won){
    //Add the win text + Add the line denoting the win
    addToPseudo(`${state.winner} has won the game`)
    moves_rendering.push(win_indicator(state.win_line.flag)(state.win_line.index))
  }else{
    addToPseudo(`The game has ended in a tied`)
  }

  user_to_play = false
  loading_animation = false
}

function clearBoard(){
  moves_rendering = []
  pseudo_console = []
  board_array = returnClearBoard(tic_tac_size)
  X_to_play = true
  user_to_play = true
  
}

function drawTicTacToe(weight = 3) {
  //stroke('magenta');
  strokeWeight(weight);
  let j = 1
  while(j<tic_tac_size){
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

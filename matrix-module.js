/*
The tic tac toe board will be represented by a matrix.
Empty spaces will be denoted with a 0, X's with a 1 and O's with -1
This is so that we may review whether the game is won or lost by averaging the columns/rows/diagonals
*/

function average(array){
    let sum = array.reduce((acc,current_value)=>{
        return acc + current_value
    })
    return sum / array.length
}
function returnClearBoard(board_dim = 3){
/*
returns..
[0,0,0]
[0,0,0]
[0,0,0]
*/
    board =  new Array(board_dim).fill('').map(e => Array(board_dim).fill(0))
    return board
}
function isValidMove(move,board){
    const valid_moves =  return_move_list(board)
    const row = valid_moves[move[0]]

    return row.reduce((acc,current)=>{
        return (row[move[1]] === current) ? true : acc
    },false)
}

function gameState(board){
/*
gamestate function returns:
{
    complete: boolean, 
    won: boolean, [has the game been won]
    winner: string, [null if invalid]
    **win_line: [start,end]/null
}
*/
    //horizontal checks + vertical checks
    let res = {}
    for(let i=0; i< board.length; i++){
        let current_row = board[i]
        const current_col = board.map((el)=> el[i])

        const row_avg = average(current_row)
        const col_avg = average(current_col)

        if((Math.abs(row_avg)===1) || (Math.abs(col_avg)===1)){
            res.complete = true
            res.won = true
            res.winner = ((row_avg===1) || (col_avg==1)) ? "X" : "O"

            return res
        }
    }

    //Diagonal checks
    const down_diagonal = board.map((el,i)=>el[i])
    const up_diagonal = board.map((el,i)=> el[(board.length - i)-1])

    const down_diag_avg = average(down_diagonal)
    const up_diag_avg = average(up_diagonal)

    if((Math.abs(down_diag_avg)===1) || (Math.abs(up_diag_avg)===1)){
        res.complete = true
        res.won = true
        res.winner = ((down_diag_avg===1) || (up_diag_avg===1)) ? "X" : "O"
        return res
    }

    //check for if the game is tied
    game_tied = true
    board.forEach(element => {
        if(Math.min(...element) === 0){
            game_tied = false
        }
    });
    if(game_tied){
        res.complete = true
        res.won = false
        res.winner = null
        return res
    }else{
        //the game is therefore still in play
        res.complete = false
        res.won = null
        res.winner = null
        return res
    }


};

function return_move_list(board){
/*
possible moves are stored within the move_list array
Each row is represented by a property corresponding to the index of that row
The property contains an array of the column indeces that were empty(valid moves)
{
    0: [0,2]
    1: []
    2: [1]
}
*/

    move_list = {}
    board.forEach((element,row_index) => {
        row_list = []
        element.forEach((val,col_index) => {
            if(val === 0){
                row_list.push(col_index)
            }
        });
        move_list[row_index] = row_list
    });

    return move_list
}

function returnBestMove(board,X_to_play,depth = 20){
    const move_list = return_move_list(board)
    let best_move
    let best_move_eval = X_to_play ? -Infinity : Infinity
    let minimaxer = X_to_play ? Math.max : Math.min

    for(const row in move_list){
        for(const col of move_list[row]){
            const possible_move = [Number(row),col]

            const made_move_board = makeMove(possible_move,board,X_to_play)

            const prev_best_move = best_move_eval
            best_move_eval = minimaxer(best_move_eval,minimax(made_move_board,depth-1,!X_to_play))
            if(prev_best_move != best_move_eval){
                best_move = possible_move
            }
        }
    }
    return best_move
}

function minimax(board,depth,X_to_play){
    let eval = (state)=>{
        if(state.complete && state.won){
            return (state.winner === "X") ? 1 : -1
        }else{
            return 0
        }
    }
/*
O is taken to be the minimising agent(win = -1)
X is taken to be maximising agent(win = 1)

tie/in play is evaulated to be 0

*/

    const evaluation = gameState(board)
    const current_eval = eval(evaluation)
    if(evaluation.complete || (depth === 0)){
        return current_eval
    }

    const move_list = return_move_list(board)

    if(X_to_play){
        let maxEval = -Infinity
        for(const row in move_list){
            for(const col of move_list[row]){
                const move_to_make = [Number(row),col]

                const made_move_board = makeMove(move_to_make,board,true)
                maxEval = Math.max(maxEval,minimax(made_move_board,depth-1,false))
            }
        }
        return maxEval
    }else{
        let minEval = Infinity
        for(const row in move_list){
            for(const col of move_list[row]){
                const move_to_make = [Number(row),col]

                const made_move_board = makeMove(move_to_make,board,false)
                minEval = Math.min(minEval,minimax(made_move_board,depth-1,true))
            }
        }
    }
};

function makeMove(move,board,X_to_play){
/*
Returns the board after the move is made.
*/
    const icon = X_to_play ? 1 : -1
    
    board[move[0]][move[1]] = icon

    return board
}


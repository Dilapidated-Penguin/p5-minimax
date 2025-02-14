/*
The tic tac toe board will be represented by a matrix.
Empty spaces will be denoted with a 0, X's with a 1 and O's with -1
This is so that we may review whether the game is won or lost by averaging the columns/rows/diagonals
*/
var minimax_cache = new Map()

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
            res.win_line = {
                flag: (Math.abs(row_avg)===1) ? "R" : "C",
                index: i
            }
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
        res.win_line = {
            flag: (Math.abs(down_diag_avg)===1) ? "dd" : "ud",
            index: null
        }
        return res
    }

    //check for if the game is tied
    let game_tied = true
    board.forEach(row => {
        row = row.map(v=>Math.abs(v))
        if(Math.min(...row) === 0){
            game_tied = false
        }
    });

    if(game_tied){
        res.complete = true
        res.won = false
        res.winner = null
        res.win_line = null
        return res
    }else{
        //the game is therefore still in play
        res.complete = false
        res.won = null
        res.winner = null
        res.win_line = null
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

function returnBestMove(board,X_to_play){
    
    const move_list = return_move_list(board)
    let depth = (board.length**2)
    
    let best_move
    let best_move_eval = X_to_play ? -Infinity : Infinity
    let minimaxer = X_to_play ? Math.max : Math.min

    for(const row in move_list){
        for(const col of move_list[row]){
            const possible_move = [Number(row),col]

            const made_move_board = makeMove(possible_move,board,X_to_play)

            const prev_best_move = best_move_eval
            
            const eval = minimax(made_move_board,depth,!X_to_play)
            
            best_move_eval = minimaxer(best_move_eval,eval)
            if(prev_best_move != best_move_eval){
                best_move = possible_move

            }
        }
    }
    return best_move
}
function deterministicOrientation(board){
/*
in order to make our memoization of the minimax algorithms orientation agnostic
we need a conventional orientation: In this case it'll be the lexicographically smallest rotation
    
the function returns
a string representation of the standard orientations
*/
    const lexi_min = (...strings)=>{
        return strings.reduce((min,curr)=>{
            return (curr < min) ? curr : min
        })
    }

    const board_90 = rotateBoard(board)
    const board_180 = rotateBoard(board_90)
    const board_270 = rotateBoard(board_180)

    //get the strings
    const board_string = JSON.stringify(board)
    const board_90_string = JSON.stringify(board_90)  
    const board_180_string = JSON.stringify(board_180) 
    const board_270_string = JSON.stringify(board_270)
    
    return lexi_min(board_string,board_90_string,board_180_string,board_270_string)
}



function minimax(board,depth,X_to_play,alpha = -Infinity,beta = Infinity){
    const input = determinisiticStringify({
        board: deterministicOrientation(board),
        X_to_play: X_to_play
    })
    
    if(minimax_cache.has(input)){
        return minimax_cache.get(input)
    }

    board = newRef(board)
    let eval = (state)=>{
        if(state.complete && state.won){
            const evaluation = (state.winner === "X") ? 1 : -1

            minimax_cache.set(input,evaluation)
            return evaluation
        }else{
            minimax_cache.set(input,0)
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
        minimax_cache.set(input,current_eval)
        return current_eval
    }

    const move_list = return_move_list(board)

    if(X_to_play){
        let maxEval = -Infinity
        for(const row in move_list){
            for(const col of move_list[row]){
                const move_to_make = [Number(row),col]

                const made_move_board = makeMove(move_to_make,board,true)
                const eval = minimax(made_move_board,depth-1,false)
                maxEval = Math.max(maxEval,eval)
                alpha = Math.max(alpha,maxEval)
                if(beta<=alpha){
                    break;
                }
            }
            if(beta<=alpha){
                break;
            }
        }
        minimax_cache.set(input,maxEval)
        return maxEval
    }else{
        let minEval = Infinity
        for(const row in move_list){
            for(const col of move_list[row]){
                const move_to_make = [Number(row),col]

                const made_move_board = makeMove(move_to_make,board,false,alpha,beta)
                const eval = minimax(made_move_board,depth-1,true)
                minEval = Math.min(minEval,eval)
                beta = Math.min(beta,minEval)
                if(beta <= alpha){
                    break;
                }
            }
            if(beta<=alpha){
                break;
            }
        }
        minimax_cache.set(input,minEval)
        return minEval
    }
};

function determinisiticStringify(input){
/*
to compare identical input objects of different reference, a determinisitic stringify is necessary
in order to deal with the 2D array the function 
*/
    return JSON.stringify(inputSort(input))
}

function makeMove(move,board,X_to_play){
/*
Returns the board after the move is made.
*/
    working_board = newRef(board)
    const icon = X_to_play ? 1 : -1

    working_board[move[0]][move[1]] = icon
    
    return working_board
}
function newRef(board){
    return JSON.parse(JSON.stringify(board))
}
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
    return new Array(board_dim).fill('').map(e => Array(board_dim).fill(0))
}

function rotateBoard(board){
    //Step 1: Transpose (O(N^2))
    const rotated = newRef(board)
    //console.log(rotated)
    const dim = rotated.length
    
    for(let i = 0; i < dim; i++){
        for(let j = i+1; j < dim; j++){
            //[board[i][j], board[j][i]] = [board[j][i], board[i][j]
            const buffer = rotated[i][j]
            rotated[i][j] = rotated[j][i]
            rotated[j][i] = buffer
        }
    }
    
    //Step 2: Reverse the rows(O(N))
    //console.log(rotated)
    rotated.forEach((row) => row.reverse());
    //console.log(rotated)
    return rotated
}

function inputSort(unsorted_item){
    if(Array.isArray(unsorted_item)){
        return unsorted_item.map(inputSort)
    }else{
        if((unsorted_item !== null) && (typeof unsorted_item === 'object')){
            const keys = Object.keys(unsorted_item)
            return keys
                .sort()
                .reduce((obj,key)=>{
                    obj[key] = inputSort(unsorted_item[key])
                    return obj
                },{})
        }
        //
        return unsorted_item
    }
}

function isValidMove(move,board){
    const valid_moves =  return_move_list(board)
    const row = valid_moves[move[0]]
    
    return row.reduce((acc,current)=>{
        return (move[1] === current) ? true : acc
    },false)
    
}
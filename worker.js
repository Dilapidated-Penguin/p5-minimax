

if( 'undefined' === typeof window){
    importScripts("helper-functions.js")
    importScripts("matrix-module.js")
} 
self.onmessage = function(event) {//event.data
    [board,X_to_play] = event.data

    const start_time  = Date.now()
    const [computer_move,data] = returnBestMove(board,X_to_play)
    const end_time = Date.now()

    data.elapsed = end_time-start_time
    self.postMessage([computer_move,data]);
};
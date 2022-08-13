
var board
function invalidatePosInteger(value){
    return value<=0 || value=='';
}

function createCell(){


    var cell = document.createElement('span')
    var text = document.createTextNode("⏹️")
    cell.appendChild(text)
    cell.setAttribute('class','cell')
    return cell;
}

function createBoard(){
    var row,col;
    var bombs;

    var dif;
    switch (document.getElementById("diff").value) {
        case "0":
            row = 10;
            col = 10;
            bombs = 10;
            dif = 0;
            break;

        case "1":
            row = 16;
            col = 16;
            dif = 1;
            bombs = 40;
            break;

        case "2":
            row = 30;
            col = 16;
            dif = 2;
            bombs = 99;
            break;

        default:
            alert();
            return
    }

    board = []
    var [i,j] = [0,0]
    var done = false
    while (bombs>0){
        board[i * col + j] = createCell()


        
        if (Math.random()<(bombs/(row*col))){
            board[i * col + j].bomb = 1
            bombs--;
        }
        else
        board[i * col + j].bomb = 0
        
    
        j++;

        if (j%col==0){
            j=0;
            i++;
        }
        if (i%row==0){
            i=0;
            done = true
        }

        console.log(i,j)
        // console.log(bombs,i,j)

    }  
    while (!done){

    board[i * col + j] = createCell()
    board[i * col + j].bomb = 0

    j++;

    if (j%col==0){
        j=0;
        i++;
    }
    if (i%row==0){
        i=0;
        done = true
    }

    }


    var Board = document.getElementById("board")
    Board.innerHTML = ''
    for (var index = 0;index<board.length;index++){
        Board.appendChild(board[index])
        if ((index+1)%col==0){
            Board.appendChild(document.createElement('br'))
        }
    }

}

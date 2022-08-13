var board = [];
var rows,cols

var flagged = []
var bombIndex = []

var currentClickType = 1


var boardWidth = 0
var cellSize = 30

var dead = false;
var victory=false;

var sounds = {
                'click':new Audio(),
                'win':new Audio(),
                'mine':new Audio(),              
              }


function loadResources(){
  click = new Audio('./res/audio/click.wav');
  mine = new Audio('./res/audio/mine.wav')
  win = new Audio('./res/audio/win.wav')
  sounds = {click,win,mine}
}

function invalidatePosInteger(value) {
  return value <= 0 || value == "";
}

function changeClick(type){
  currentClickType = type;
  

}

function createCell() {
  return {'text':"-",'revealed':false,'bomb':false,'flagged':false}
}

function createBoard() {
  dead = false
  victory = false
  var row, col;
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
      row = 16;
      col = 30;
      dif = 2;
      bombs = 99;
      break;

    default:
      alert();
      return;
  }

  board = [];
  flagged = []
  bombIndex = []
  boardWidth = col * cellSize + col * 2+col * 2;

 

  var index = 0;

  while(bombs>0)
  {
    if (board[index] == undefined)    board[index] = createCell()

    if (bombs>0 && !board[index].bomb && Math.random()< (bombs/(row*col))){
        bombIndex.push(index)
        board[index].bomb = true
        bombs--;        
    }
    // board[index].text = index
    index++;
    index = index%(row*col)
  }
  while (index<row*col)
{
  if (board[index] === undefined)
  board[index] = createCell()
  // board[index].text = index

  index++;

}
  [rows,cols] = [row,col]
  
  bombIndex.sort()
  genBoard()
}


function flagBoard(r,c){

  var ind = r * cols + c;

  if (board[ind].flagged) {
    board[ind].text = '-'
    board[ind].flagged = false
    flagged.splice( flagged.indexOf(ind),1)

  }
  else if (!board[ind].revealed){ 
    board[ind].text = '🚩'
    flagged.push(ind)
    board[ind].flagged = true
  }

}

function indexToRC(index){
    return [Math.floor(index / cols), index % cols] 
}



function handleClick(index)
{ 

  if (dead){
    
    alert("You have hit a bomb!\nGame Over")
      createBoard()
      return 
  }
  if (!dead && !victory){
    if (currentClickType == 1)
      dead = revealBoard(...indexToRC(index))
    
    else{

      flagBoard(...indexToRC(index))
      var won = false
      flagged.sort()
      if (flagged.length == bombIndex.length){
        won = true
        for (let i = 0;i<flagged.length;i++){
          won &= flagged[i] == bombIndex[i]         
        }
      }
      if (won){
        alert("You won")
        victory = true;
        sounds.win.currentTime = 0;
        sounds.win.play();
      }
    }
    genBoard()
  }
  if (dead)
  {
    sounds.mine.currentTime = 0;
    sounds.mine.play();
    for (let index of bombIndex){
      board[index].text = '💥'
    }
    genBoard()
  }
  else{
    sounds.click.currentTime = 0;
    sounds.click.play();
  }
    
}

function genBoard() {
    var Board = document.getElementById("board");
    Board.innerHTML = "";
    for (var index = 0; index < board.length; index++) {
      var span = document.createElement('span')
      span.setAttribute('onclick',`handleClick(${index})`)
      span.setAttribute('class',`cell`)
      span.style.width = `${cellSize}px`
      span.style.height = `${cellSize}px`
      span.innerHTML = board[index].text
      Board.appendChild(span);
      // if ((index + 1) % cols == 0) {
      //     Board.appendChild(document.createElement("br"));
      // }
    }
    Board.style.width=`${boardWidth}px`

}



function revealBoard(r,c){

  var ind = r * cols + c

  var count = 0 ;

  if (board[ind].revealed || board[ind].flagged) return;

  if (board[ind].bomb){
      board[ind].text = '💥';
      
      return true;
  }

  for (var X = c - 1;X < c + 2; X++)
  {
    for (var Y = r - 1;Y < r + 2; Y++)
    {
      if (X>=0 && X < cols && Y >= 0 && Y < rows){
        if (board[Y * cols + X].bomb)
          count++;
      }
    }
  }
  
  board[ind].text = count
  board[ind].revealed = true;

  if (count == 0){
    for (var X = c - 1;X < c + 2; X++)
  {
    for (var Y = r - 1;Y < r + 2; Y++)
    {
      if (X>=0 && X < cols && Y >= 0 && Y < rows){
          revealBoard(Y,X)
        }
    }
  }
  }
}
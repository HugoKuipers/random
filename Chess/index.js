'use strict';
var board = document.getElementById('board');

function createBoard() {
  b = [
    [
      new Rook('black',0,0),
      new Knight('black',0,1),
      new Bishop('black',0,2),
      new Queen('black',0,3),
      new King('black',0,4),
      new Bishop('black',0,5),
      new Knight('black',0,6),
      new Rook('black',0,7),
    ],
    [
      new Pawn('black',1,0),
      new Pawn('black',1,1),
      new Pawn('black',1,2),
      new Pawn('black',1,3),
      new Pawn('black',1,4),
      new Pawn('black',1,5),
      new Pawn('black',1,6),
      new Pawn('black',1,7),
    ],
    [null,null,null,null,null,null,null,null,],
    [null,null,null,null,null,null,null,null,],
    [null,null,null,null,null,null,null,null,],
    [null,null,null,null,null,null,null,null,],
    [
      new Pawn('white',6,0),
      new Pawn('white',6,1),
      new Pawn('white',6,2),
      new Pawn('white',6,3),
      new Pawn('white',6,4),
      new Pawn('white',6,5),
      new Pawn('white',6,6),
      new Pawn('white',6,7),
    ],
    [
      new Rook('white',7,0),
      new Knight('white',7,1),
      new Bishop('white',7,2),
      new Queen('white',7,3),
      new King('white',7,4),
      new Bishop('white',7,5),
      new Knight('white',7,6),
      new Rook('white',7,7),
    ],
  ]
  let nextCol = 'white';
  for(var i = 0; i < 8; i++) {
    wpawns.push(b[6][i]);
    bpawns.push(b[1][i]);
    var tr = document.createElement('tr');
    tr.className = 'b-row row-'+i;
    for(var j = 0; j < 8; j++) {
      var td = document.createElement('td');
      td.className = 'b-col col-'+j+' '+nextCol;
      tr.appendChild(td);
      nextCol = nextCol == 'white' ? 'black' : 'white';
    }
    nextCol = nextCol == 'white' ? 'black' : 'white';
    board.appendChild(tr);
  }
}

function resetBoard() {
  board.innerHTML = '';
  b = [];
  activePiece = null;
  createBoard();
}

function displayBoard() {
  for(var i = 0; i < 8; i++) {
    for(var j = 0; j < 8; j++) {
      while(board.children[i].children[j].classList.length > 3) {
        board.children[i].children[j].classList.remove(board.children[i].children[j].classList[board.children[i].children[j].classList.length-1]);
      }
      if(b[i][j] != null) {
        board.children[i].children[j].classList.add(b[i][j].color+b[i][j].img);
      }
    }
  }
}

function resetColors() {
  let act = document.getElementsByClassName('active');
  let pos = document.getElementsByClassName('possible');
  for(let i = act.length-1; i >= 0; i--) {
    act[i].classList.remove('active');
  }
  for(let i = pos.length-1; i >= 0; i--) {
    pos[i].classList.remove('possible');
  }
  activePiece = null;
}

board.onclick = function(e) {
  if(e.target.classList.contains('possible')) {
    let r = e.target.parentElement.classList[1].substr(4,1);
    let c = e.target.classList[1].substr(4,1);
    activePiece.move([r,c])
    displayBoard();
    resetColors();
  } else if(e.target.classList[0] == 'b-col' && e.target.classList[3].substr(0,5) == movePlayer) {
    resetColors();
    let r = e.target.parentElement.classList[1].substr(4,1);
    let c = e.target.classList[1].substr(4,1);
    b[r][c].getMoves();
    b[r][c].showMoves();
    activePiece = b[r][c];
  }
}

resetBoard();
displayBoard();

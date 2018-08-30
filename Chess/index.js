'use strict';

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
  wking = b[7][4];
  bking = b[0][4];
  for(var i = 0; i < 8; i++) {
    wpawns.push(b[6][i]);
    bpawns.push(b[1][i]);
    wpieces.push(b[6][i]);
    bpieces.push(b[1][i]);
    wpieces.push(b[7][i]);
    bpieces.push(b[0][i]);
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
  wpawns = [];
  bpawns = [];
  wtaken = [];
  btaken = [];
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
    pos[i].classList.remove('extra');
    pos[i].classList.remove('extra-e');
    pos[i].classList.remove('extra-Q');
    pos[i].classList.remove('extra-R');
    pos[i].classList.remove('extra-K');
    pos[i].classList.remove('extra-B');
    pos[i].classList.remove('extra-c');
    pos[i].classList.remove('extra-C');
    pos[i].classList.remove('possible');
  }
  activePiece = null;
}

function moveIn(m, list) {
  for(let l of list) {
    if(m[0] == l[0] && m[1] == l[1] && (m.length < 3 || l.length < 3 || m[2] == l[2])) return true;
  }
  return false;
}

function restore(re) {
  console.log(re);
  for(let p of re) {
    console.log(p);
    if(p.ex !== null) {
      if(p.ex == 'd') p.piece.dubble = true;
      if(p.ex == 'c') p.piece.castle = true;
    }
    b[p.row][p.col] = p.piece;
  }
}

function checkState(opp,king) {
  danger = [];
  for(var p of opp) {
    danger = danger.concat(p.getMoves(true));
  }
  if(moveIn([king.row,king.col],danger)) {
    check = true;
    mate = checkMate(opp,king);
  } else {
    check = false;
  }
}

function quickCheck(opp,king) {
  console.log(opp);
  for(var p of opp) {
    console.log(p);
    if(moveIn([king.row,king.col],p.getMoves(true))) {
      return false;
    }
  }
  return true;
}

function checkMate(opp,king) {
  console.log("gotta check mate");
  let pcs = king.color == 'white' ? wpieces : bpieces;
  for(var piece of pcs) {
    piece.getMoves();
    for(var move of piece.valid) {
      let reVal = piece.move(move);
      console.log(reVal);
      if(quickCheck(opp,king)) {
        console.log();
        mate = false;
        return false;
      }
      restore(reVal);
      console.log(b);
    }
  }
  console.log('checkmate Mate!');
  mate = true;
  return true;
}

function nextPlayer() {
  if(movePlayer == 'black') {
    movePlayer = 'white';
    checkState(bpieces,wking);
    turn.innerHTML = 'White';
    turn.className = 'white-text';
  } else {
    movePlayer = 'black';
    checkState(wpieces,bking);
    turn.innerHTML = 'Black';
    turn.className = 'Black-text';
  }
}

board.onclick = function(e) {
  if(e.target.classList.contains('possible')) {
    let r = e.target.parentElement.classList[1].substr(4,1);
    let c = e.target.classList[1].substr(4,1);
    if(e.target.classList.contains('extra-move')) {
      if(e.target.classList.contains('extra-Q')) {
        //
      } else {
        let ex = e.target.classList[e.target.classList.length-1].substr(6,1);
        activePiece.move([parseInt(r),parseInt(c),ex]);
      }
    } else {
      activePiece.move([parseInt(r),parseInt(c)]);
    }
    nextPlayer();
    displayBoard();
    resetColors();
  } else if(e.target.classList[0] == 'b-col') {
    resetColors();
    if(e.target.classList.length > 3 && e.target.classList[3].substr(0,5) == movePlayer) {
      let r = e.target.parentElement.classList[1].substr(4,1);
      let c = e.target.classList[1].substr(4,1);
      b[r][c].getMoves();
      b[r][c].showMoves();
      activePiece = b[r][c];
    }
  }
}

resetBoard();
displayBoard();

let a = [[6,6],[5,5]]
console.log(a.indexOf([5,5]));

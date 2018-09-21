'use strict';

function createBoard() {
  b = [
    [
      new Rook('black', 0, 0),
      new Knight('black', 0, 1),
      new Bishop('black', 0, 2),
      new Queen('black', 0, 3),
      new King('black', 0, 4),
      new Bishop('black', 0, 5),
      new Knight('black', 0, 6),
      new Rook('black', 0, 7)
    ],
    [
      new Pawn('black', 1, 0),
      new Pawn('black', 1, 1),
      new Pawn('black', 1, 2),
      new Pawn('black', 1, 3),
      new Pawn('black', 1, 4),
      new Pawn('black', 1, 5),
      new Pawn('black', 1, 6),
      new Pawn('black', 1, 7)
    ],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [
      new Pawn('white', 6, 0),
      new Pawn('white', 6, 1),
      new Pawn('white', 6, 2),
      new Pawn('white', 6, 3),
      new Pawn('white', 6, 4),
      new Pawn('white', 6, 5),
      new Pawn('white', 6, 6),
      new Pawn('white', 6, 7)
    ],
    [
      new Rook('white', 7, 0),
      new Knight('white', 7, 1),
      new Bishop('white', 7, 2),
      new Queen('white', 7, 3),
      new King('white', 7, 4),
      new Bishop('white', 7, 5),
      new Knight('white', 7, 6),
      new Rook('white', 7, 7)
    ]
  ];
  let nextCol = 'white';
  wking = b[7][4];
  bking = b[0][4];
  for (var i = 0; i < 8; i++) {
    wpawns.push(b[6][i]);
    bpawns.push(b[1][i]);
    wpieces.push(b[6][i]);
    bpieces.push(b[1][i]);
    wpieces.push(b[7][i]);
    bpieces.push(b[0][i]);
    var tr = document.createElement('tr');
    tr.className = 'b-row row-' + i;
    for (var j = 0; j < 8; j++) {
      var td = document.createElement('td');
      td.className = 'b-col col-' + j + ' ' + nextCol;
      tr.appendChild(td);
      nextCol = nextCol == 'white' ? 'black' : 'white';
    }
    nextCol = nextCol == 'white' ? 'black' : 'white';
    board.appendChild(tr);
  }
}

function resetBoard() {
  board.innerHTML = '';
  movePlayer = 'white';
  pastBoards = [];
  wpieces = [];
  bpieces = [];
  danger = [];
  wking = [];
  bking = [];
  check = false;
  mate = false;
  b = [];
  wpawns = [];
  bpawns = [];
  wtaken = [];
  btaken = [];
  activePiece = null;
  createBoard();
}

function displayBoard() {
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      let squareClasses = board.children[i].children[j].classList;
      while (squareClasses.length > 3) squareClasses.remove(squareClasses[squareClasses.length - 1]);

      if (b[i][j] != null) squareClasses.add(b[i][j].color + b[i][j].img);
    }
  }
}

function resetColors(keep) {
  let active = document.getElementsByClassName('active');
  let possible = document.getElementsByClassName('possible');
  let previous = document.getElementsByClassName('previous');

  for (let i = active.length - 1; i >= 0; i--) active[i].classList.remove('active');

  for (let i = possible.length - 1; i >= 0; i--) {
    possible[i].classList.remove('extra');
    possible[i].classList.remove('extra-e');
    possible[i].classList.remove('extra-Q');
    possible[i].classList.remove('extra-R');
    possible[i].classList.remove('extra-K');
    possible[i].classList.remove('extra-B');
    possible[i].classList.remove('extra-c');
    possible[i].classList.remove('extra-C');
    possible[i].classList.remove('possible');
  }

  activePiece = null;
  promo.className = 'inv';
  newW.className = 'inv';
  if (keep) return;

  for (let i = previous.length - 1; i >= 0; i--) active[i].classList.remove('previous');
}

function colorLast(moveResult) {
  board.children[moveResult[0].row].children[moveResult[0].col].classList.add('previous');
  board.children[moveResult[1].row].children[moveResult[1].col].classList.add('previous');
}

function moveIn(m, list) {
  // TODO :: m[2]?
  for (let l of list) if (m[0] == l[0] && m[1] == l[1] && (m.length < 3 || l.length < 3 || m[2] == l[2])) return true;

  return false;
}

function prevBoard() {
  for (var pb of pastBoards) if (b == pb[0] && pb[1] == 2) return true;

  return false;
}

function addBoard() {
  for (var pb of pastBoards) if (b == pb[0]) return pb[1]++;

  pastBoards.push([b, 1]);
}

function debug() {
  console.log('board:');
  console.log(b);
  console.log('white pieces:');
  console.log(wpieces);
  console.log('white taken:');
  console.log(wtaken);
  console.log('black pieces:');
  console.log(bpieces);
  console.log('black taken:');
  console.log(btaken);
}

function stopMai() {
  wplayer = 'human';
  bplayer = 'human';
}

function restore(re) {
  for (let p of re) {
    let pieces;
    let taken;

    if (p.piece !== null) {
      const black = p.piece.color === 'black';

      taken = black ? btaken : wtaken;
      pieces = black ? bpieces : wpieces;

      if (p.promotion) {
        pieces.splice(pieces.indexOf(p.piece));
      } else if (taken.indexOf(p.piece) !== -1) {
        taken.splice(taken.indexOf(p.piece));
        pieces.push(p.piece);
      }

      p.piece.row = p.row;
      p.piece.col = p.col;
    }

    if (p.ex !== null) {
      if (p.ex == 'd') p.piece.double = true;
      if (p.ex == 'c') p.piece.castle = true;
    }

    b[p.row][p.col] = p.piece;
  }
}

function checkState(opp, king) {
  danger = [];

  for (var p of opp) danger = danger.concat(p.getMoves(true));

  if (moveIn([king.row, king.col], danger)) if (checkMate(opp, king)) return gameOver(opp[0].color);
}

function quickCheck(opp, king) {
  for (var p of opp) if (moveIn([king.row, king.col], p.getMoves(true))) return false;

  return true;
}

function checkMate(opp, king) {
  let pcs = king.color === 'white' ? wpieces : bpieces;

  for (var piece of pcs) {
    piece.getMoves();
    for (var move of piece.valid) {
      let reVal = piece.move(move);
      if (quickCheck(opp, king)) {
        restore(reVal);
        return false;
      }
      restore(reVal);
    }
  }

  return true;
}

function gameOver(winner) {
  alert('Checkmate, ' + winner + ' wins!');
  return true;
}

function nextPlayer() {
  const black = movePlayer === 'black';

  movePlayer = black ? 'white' : 'black';
  turn.innerHTML = black ? 'White' : 'Black';
  turn.className = black ? 'white-text' : 'Black-text';

  const checkMateBool = black ? checkState(bpieces, wking) : checkState(wpieces, bking);
  if (checkMateBool) return;

  if ((wplayer === 'human' && black) || (bplayer === 'human' && !black)) return;

  setTimeout(() => {
    let previous = black ? wplayer.move() : bplayer.move();
    nextPlayer();
    displayBoard();
    resetColors();
    colorLast(previous);
  }, 1);
}

board.onclick = function(e) {
  let squareClasses = e.target.classList;
  let c = squareClasses[1].substr(4, 1);
  let r = e.target.parentElement.classList[1].substr(4, 1);

  if (squareClasses.contains('possible') && squareClasses.contains('extra-Q')) {
    promo.className = movePlayer;
    proField.innerHTML = r + c;
  } else if (squareClasses.contains('possible')) {
    let previous;

    if (squareClasses.contains('extra-move')) {
      let ex = squareClasses[squareClasses.length - 1].substr(6, 1);
      previous = activePiece.move([parseInt(r), parseInt(c), ex]);
    } else {
      previous = activePiece.move([parseInt(r), parseInt(c)]);
    }
    nextPlayer();
    displayBoard();
    resetColors();
    colorLast(previous);
  } else if (squareClasses[0] == 'b-col') {
    resetColors(true);
    if (squareClasses.length > 3 && squareClasses[3].substr(0, 5) === movePlayer) {
      b[r][c].getMoves();
      b[r][c].showMoves();
      activePiece = b[r][c];
    }
  }
};

promo.onclick = function(e) {
  if (!e.target.classList.contains('promotion-choice')) return;

  promo.className = movePlayer;
  let r = proField.innerHTML.substr(0, 1);
  let c = proField.innerHTML.substr(1, 1);
  let promotion = e.target.id.substr(0, 1);
  let previous = activePiece.move([parseInt(r), parseInt(c), promotion]);
  nextPlayer();
  displayBoard();
  resetColors();
  colorLast(previous);
};

newBut.onclick = function() {
  newW.classList.toggle('inv');
};

startNew.onclick = function() {
  let startForMai = false;

  if (newW.children[1].children[0].value == 'Human') {
    wplayer = 'human';
  } else {
    let lvl = newW.children[1].children[1].value;
    wplayer = new Mai(lvl, 'white');
    startForMai = true;
  }

  if (newW.children[2].children[0].value == 'Human') {
    bplayer = 'human';
  } else {
    let lvl = newW.children[2].children[1].value;
    bplayer = new Mai(lvl, 'black');
  }

  resetBoard();
  displayBoard();
  resetColors();

  if (!startForMai) return;

  movePlayer = 'black';
  nextPlayer();
};

startNewAuto.onclick = () => {
  wplayer = new Mai(3, 'white');
  bplayer = new Mai(2, 'black');

  resetBoard();
  displayBoard();
  resetColors();

  movePlayer = 'black';
  nextPlayer();
};

resetBoard();
displayBoard();

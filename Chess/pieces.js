'use strict';
var turn = document.getElementById('turn');
var board = document.getElementById('board');
var promo = document.getElementById('promo');
var proField = document.getElementById('promotion-field');
var newBut = document.getElementById('new-but');
var startNew = document.getElementById('start-new');
var newW = document.getElementById('new');
var activePiece = null;
var movePlayer = 'white';
var b = [];
var pastBoards = [];
var wpawns = [];
var bpawns = [];
var wpieces = [];
var bpieces = [];
var wtaken = [];
var btaken = [];
var danger = [];
var wking = [];
var bking = [];
var wplayer = 'human';
var bplayer = 'human';
var check = false;
var mate = false;

class Pos {
  constructor(row, col, piece) {
    this.row = row;
    this.col = col;
    this.piece = piece;
    this.ex = null; // TODO :: ex?
    this.promotion = false;
  }
}

class Piece {
  constructor(color, row, col) {
    this.color = color;
    this.row = row;
    this.col = col;
    this.valid = [];
    this.promotion = false;
  }
  showMoves() {
    board.children[this.row].children[this.col].classList.add('active');
    for (var m of this.valid) {
      board.children[m[0]].children[m[1]].classList.add('possible');
      if (m[2]) {
        board.children[m[0]].children[m[1]].classList.add('extra-move');
        board.children[m[0]].children[m[1]].classList.add('extra-' + m[2]);
      }
    }
  }
  move(m) {
    let reVal = [];

    const row = m[0];
    const col = m[1];
    const black = this.color === 'black';

    let taken = black ? wtaken : btaken;
    let pieces = black ? wpieces : bpieces;
    let repawns = black ? bpawns : wpawns;

    if (b[row][col] !== null) {
      pieces.splice(pieces.indexOf(b[row][col]), 1);
      taken.push(b[row][col]);
    }

    reVal.push(new Pos(row, col, b[row][col]));
    reVal.push(new Pos(this.row, this.col, b[this.row][this.col]));

    b[row][col] = b[this.row][this.col];
    b[this.row][this.col] = null;

    this.row = row;
    this.col = col;

    for (var p of repawns) p.enPass = null;

    return reVal;
  }
  pushValid(pass, mov) {
    if (pass) return this.valid.push(mov);

    let reVal = this.move(mov);

    const black = this.color === 'black';
    let opp = black ? wpieces : bpieces;
    let king = black ? bking : wking;

    if (quickCheck(opp, king)) this.valid.push(mov);

    restore(reVal);
  }
}

class Pawn extends Piece {
  constructor(color, row, col) {
    super(color, row, col);
    this.img = 'pawn';
    this.enPass = null;
    this.double = true;
    this.value = 10;
  }

  pushMultipleValids(check, row, col) {
    const promotion = this.color === 'black' ? 6 : 1;

    if (this.row !== promotion) return this.pushValid(check, [row, col]);

    this.pushValid(check, [row, col, 'Q']);
    this.pushValid(check, [row, col, 'R']);
    this.pushValid(check, [row, col, 'B']);
    this.pushValid(check, [row, col, 'K']);
  }

  getMoves(check) {
    this.valid = [];
    const dir = this.color === 'black' ? 1 : -1;
    const newRow = this.row + dir;

    if (this.enPass !== null) this.pushValid(check, this.enPass);

    if (this.col > 0 && b[newRow][this.col - 1] !== null && b[newRow][this.col - 1].color !== this.color)
      this.pushMultipleValids(check, newRow, this.col - 1);

    if (this.col < 7 && b[newRow][this.col + 1] !== null && b[newRow][this.col + 1].color !== this.color)
      this.pushMultipleValids(check, newRow, this.col + 1);

    // TODO :: why !check here?
    if (b[newRow][this.col] === null && !check) {
      this.pushMultipleValids(check, newRow, this.col);

      const doubleSet = this.row + 2 * dir;
      if (this.double && b[doubleSet][this.col] === null) {
        this.pushValid(check, [doubleSet, this.col]);
        for (var i = this.col - 1; i < this.col + 2; i += 2) {
          if (i > 0 && i < 7 && b[doubleSet][i] != null && b[doubleSet][i].img == 'pawn' && b[doubleSet][i].color != this.color) {
            b[doubleSet][i].enPass = [newRow, this.col, 'e'];
          }
        }
      }
    }

    if (check) return this.valid;
  }
  move(m) {
    let reVal = super.move(m);
    // if (m[2]) {
    //   stopMai()
    //   debug()
    // }

    if (this.double) reVal[1].ex = 'd';
    this.double = false;

    if (!m[2]) return reVal;

    let row = m[0];
    const col = m[1];
    const black = this.color === 'black';

    let taken = black ? btaken : wtaken;
    let pieces = black ? bpieces : wpieces;

    if (m[2] === 'e') {
      row = black ? row - 1 : row + 1;

      reVal.push(new Pos(row, col, b[row][col]));
      pieces.splice(pieces.indexOf(b[row][col]), 1);
      taken.push(b[row][col]);
      b[row][col] = null;
    } else {
      pieces.splice(pieces.indexOf(b[row][col]), 1);
      taken.push(b[row][col]);

      if (m[2] == 'Q') b[row][col] = new Queen(this.color, row, col);
      else if (m[2] == 'R') b[row][col] = new Rook(this.color, row, col);
      else if (m[2] == 'K') b[row][col] = new Knight(this.color, row, col);
      else if (m[2] == 'B') b[row][col] = new Bishop(this.color, row, col);

      b[row][col].promotion = true;
      pieces.push(b[row][col]);

      let rv = new Pos(row, col, b[row][col]);
      rv.promotion = true;
      reVal.unshift(rv);
    }
    return reVal;
  }
}

class Knight extends Piece {
  constructor(color, row, col) {
    super(color, row, col);
    this.img = 'knight';
    this.value = 30;
  }
  getMoves(check) {
    this.valid = [];
    for (var i = -2; i < 3; i++) {
      let l = this.col + i;
      if (l > -1 && l < 8 && i !== 0) {
        for (var j = -1; j < 2; j += 2) {
          let k = this.row + (3 - Math.abs(i)) * j;
          if (k > -1 && k < 8 && (b[k][l] === null || b[k][l].color !== this.color || check)) this.pushValid(check, [k, l]);
        }
      }
    }
    if (check) return this.valid;
  }
}

class Bishop extends Piece {
  constructor(color, row, col) {
    super(color, row, col);
    this.img = 'bishop';
    this.value = 35;
  }
  getMoves(check) {
    this.valid = [];
    for (var i = -1; i < 2; i += 2) {
      for (var j = -1; j < 2; j += 2) {
        for (var m = 1; m < 8; m++) {
          let k = this.row + m * i;
          let l = this.col + m * j;
          if (k < 0 || k > 7 || l < 0 || l > 7) break;
          if (b[k][l] === null) {
            this.pushValid(check, [k, l]);
          } else {
            if (b[k][l].color !== this.color || check) this.pushValid(check, [k, l]);
            break;
          }
        }
      }
    }
    if (check) return this.valid;
  }
}

class Rook extends Piece {
  constructor(color, row, col) {
    super(color, row, col);
    this.img = 'rook';
    this.castle = true;
    this.value = 50;
  }
  getMoves(check) {
    this.valid = [];
    for (var j = -1; j < 2; j += 2) {
      for (var m = 1; m < 8; m++) {
        let k = this.row + m * j;
        let l = this.col;
        if (k < 0 || k > 7) break;
        if (b[k][l] == null) {
          this.pushValid(check, [k, l]);
        } else {
          if (b[k][l].color != this.color || check) this.pushValid(check, [k, l]);
          break;
        }
      }
    }
    for (var j = -1; j < 2; j += 2) {
      for (var m = 1; m < 8; m++) {
        let k = this.row;
        let l = this.col + m * j;
        if (l < 0 || l > 7) break;
        if (b[k][l] == null) {
          this.pushValid(check, [k, l]);
        } else {
          if (b[k][l].color != this.color || check) this.pushValid(check, [k, l]);
          break;
        }
      }
    }
    if (check) return this.valid;
  }
  move(m) {
    let reVal = super.move(m);
    if (this.castle) reVal[1].ex = 'c';
    this.castle = false;
    return reVal;
  }
}

class Queen extends Piece {
  constructor(color, row, col) {
    super(color, row, col);
    this.img = 'queen';
    this.value = 90;
  }
  getMoves(check) {
    this.valid = [];
    for (var i = -1; i < 2; i++) {
      for (var j = -1; j < 2; j++) {
        for (var m = 1; m < 8; m++) {
          if (i === 0 && j === 0) break;
          let k = this.row + m * i;
          let l = this.col + m * j;
          if (k < 0 || k > 7 || l < 0 || l > 7) break;
          if (b[k][l] == null) {
            this.pushValid(check, [k, l]);
          } else {
            if (b[k][l].color != this.color || check) this.pushValid(check, [k, l]);
            break;
          }
        }
      }
    }
    if (check) return this.valid;
  }
}

class King extends Piece {
  constructor(color, row, col) {
    super(color, row, col);
    this.img = 'king';
    this.castle = true;
    this.value = 999;
  }
  getMoves(check) {
    this.valid = [];
    for (var i = -1; i < 2; i++) {
      for (var j = -1; j < 2; j++) {
        if (!(i === 0 && j === 0)) {
          let k = this.row + i;
          let l = this.col + j;
          if (!(k < 0 || k > 7 || l < 0 || l > 7) && (b[k][l] == null || b[k][l].color != this.color || check) && (!moveIn([k, l], danger) || check))
            this.pushValid(check, [k, l]);
        }
      }
    }
    if (this.castle && !check) {
      if (
        b[this.row][0] !== null &&
        b[this.row][0].img == 'rook' &&
        b[this.row][0].castle &&
        b[this.row][3] === null &&
        b[this.row][2] === null &&
        b[this.row][1] === null &&
        !moveIn([this.row, 4], danger) &&
        !moveIn([this.row, 3], danger) &&
        !moveIn([this.row, 2], danger)
      )
        this.pushValid(check, [this.row, 2, 'C']);

      if (
        b[this.row][7] !== null &&
        b[this.row][7].img == 'rook' &&
        b[this.row][7].castle &&
        b[this.row][5] === null &&
        b[this.row][6] === null &&
        !moveIn([this.row, 4], danger) &&
        !moveIn([this.row, 5], danger) &&
        !moveIn([this.row, 6], danger)
      )
        this.pushValid(check, [this.row, 6, 'c']);
    }
    if (check) return this.valid;
  }
  move(m) {
    let reVal = super.move(m);
    if (this.castle) reVal[1].ex = 'c';
    this.castle = false;
    if (m[2] == 'C') {
      reVal.push(new Pos(this.row, 0, b[this.row][0]));
      reVal.push(new Pos(this.row, 3, b[this.row][3]));
      b[this.row][3] = b[this.row][0];
      b[this.row][0] = null;
      b[this.row][3].row = this.row;
      b[this.row][3].col = 3;
    } else if (m[2] == 'c') {
      reVal.push(new Pos(this.row, 7, b[this.row][7]));
      reVal.push(new Pos(this.row, 5, b[this.row][5]));
      b[this.row][5] = b[this.row][7];
      b[this.row][7] = null;
      b[this.row][5].row = this.row;
      b[this.row][5].col = 5;
    }
    return reVal;
  }
}

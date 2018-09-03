'use strict';
var turn = document.getElementById('turn');
var board = document.getElementById('board');
var promo = document.getElementById('promo');
var proField = document.getElementById('pro-field');
var activePiece = null;
var movePlayer = 'white';
var b = [];
var wpawns = [];
var bpawns = [];
var wpieces = [];
var bpieces = [];
var wtaken = [];
var btaken = [];
var danger = [];
var wking = [];
var bking = [];
var check = false;
var mate = false;

class Pos {
  constructor(row,col,piece) {
    this.row = row;
    this.col = col;
    this.piece = piece;
    this.ex = null;
    this.pro = false;
  }
}

class Piece {
  constructor(color,row,col) {
    this.color = color;
    this.row = row;
    this.col = col;
    this.valid = [];
    this.pro = false;
  }
  showMoves() {
    board.children[this.row].children[this.col].classList.add('active');
    for(var m of this.valid) {
      board.children[m[0]].children[m[1]].classList.add('possible');
      if(m[2]) {
        board.children[m[0]].children[m[1]].classList.add('extra-move');
        board.children[m[0]].children[m[1]].classList.add('extra-'+m[2]);
      }
    }
  }
  move(m) {
    let reVal = [];
    let repawns;
    let taken;
    let pieces;
    if(this.color == 'white') {
      repawns = wpawns;
      taken = btaken;
      pieces = bpieces;
    } else {
      repawns = bpawns;
      taken = wtaken;
      pieces = wpieces;
    }
    if(b[m[0]][m[1]] !== null) {
      pieces.splice(pieces.indexOf(b[m[0]][m[1]]),1);
      taken.push(b[m[0]][m[1]]);
    }
    reVal.push(new Pos(m[0],m[1],b[m[0]][m[1]]));
    reVal.push(new Pos(this.row,this.col,b[this.row][this.col]));
    b[m[0]][m[1]] = b[this.row][this.col];
    b[this.row][this.col] = null;
    this.row = m[0];
    this.col = m[1];
    for(var p of repawns) {
      p.enPass = null;
    }
    return reVal;
  }
  pushValid(pass,mov) {
    if(!pass) {
      let reVal = this.move(mov);
      let opp;
      let king;
      if(this.color == 'white') {
        opp = bpieces;
        king = wking;
      } else {
        opp = wpieces;
        king = bking;
      }
      if(quickCheck(opp,king)) {
        this.valid.push(mov)
      }
      restore(reVal);
    } else {
      this.valid.push(mov);
    }
  }
}

class Pawn extends Piece {
  constructor(color,row,col) {
    super(color,row,col);
    this.img = 'pawn';
    this.enPass = null;
    this.dubble = true;
  }
  getMoves(check) {
    this.valid = [];
    let dir = this.color=='black' ? 1 : -1;
    let pro = this.color=='black' ? 6 : 1;
    if(this.enPass !== null) this.pushValid(check,this.enPass);
    if(this.col > 0) {
      if(b[this.row+dir][this.col-1] !== null && b[this.row+dir][this.col-1].color != this.color) {
        if(this.row == pro) {
          this.pushValid(check,[this.row+dir,this.col-1,'Q']);
          this.pushValid(check,[this.row+dir,this.col-1,'R']);
          this.pushValid(check,[this.row+dir,this.col-1,'B']);
          this.pushValid(check,[this.row+dir,this.col-1,'K']);
        } else {
          this.pushValid(check,[this.row+dir,this.col-1]);
        }
      }
    }
    if(this.col < 7) {
      if(b[this.row+dir][this.col+1] !== null && b[this.row+dir][this.col+1].color != this.color) {
        if(this.row == pro) {
          this.pushValid(check,[this.row+dir,this.col+1,'Q']);
          this.pushValid(check,[this.row+dir,this.col+1,'R']);
          this.pushValid(check,[this.row+dir,this.col+1,'B']);
          this.pushValid(check,[this.row+dir,this.col+1,'K']);
        } else {
          this.pushValid(check,[this.row+dir,this.col+1]);
        }
      }
    }
    if(b[this.row+dir][this.col] == null && !check) {
      if(this.row == pro) {
        this.pushValid(check,[this.row+dir,this.col,'Q']);
        this.pushValid(check,[this.row+dir,this.col,'R']);
        this.pushValid(check,[this.row+dir,this.col,'B']);
        this.pushValid(check,[this.row+dir,this.col,'K']);
      } else {
        this.pushValid(check,[this.row+dir,this.col]);
      }
      if(this.dubble && b[this.row+(2*dir)][this.col] == null) {
        this.pushValid(check,[this.row+(2*dir),this.col]);
        for(var i = this.col-1; i < this.col+2; i+=2) {
          if(i>0 && i<7 && b[this.row+(2*dir)][i] != null && b[this.row+(2*dir)][i].img == 'pawn' && b[this.row+(2*dir)][i].color != this.color) {
            b[this.row+(2*dir)][i].enPass = [this.row+dir,this.col,'e'];
          }
        }
      }
    }
    if(check) return this.valid;
  }
  move(m) {
    let reVal = super.move(m);
    if(this.dubble) reVal[1].ex = 'd';
    this.dubble = false;
    if(m[2] == 'e') {
      if(this.color == 'white') {
        reVal.push(new Pos(m[0]+1,m[1],b[m[0]+1][m[1]]));
        bpieces.splice(bpieces.indexOf(b[m[0]+1][m[1]]),1);
        btaken.push(b[m[0]+1][m[1]])
        b[m[0]+1][m[1]] = null;
      } else {
        reVal.push(new Pos(m[0]-1,m[1],b[m[0]-1][m[1]]));
        wpieces.splice(wpieces.indexOf(b[m[0]-1][m[1]]),1);
        wtaken.push(b[m[0]-1][m[1]])
        b[m[0]-1][m[1]] = null;
      }
    } else if(m[2]) {
      let taken;
      let pieces;
      if(this.color == 'white') {
        taken = wtaken;
        pieces = wpieces;
      } else {
        taken = btaken;
        pieces = bpieces;
      }
      pieces.splice(pieces.indexOf(b[m[0]][m[1]]),1);
      taken.push(b[m[0]][m[1]]);
      if(m[2] == 'Q') {
        b[m[0]][m[1]] = new Queen(this.color,m[0],m[1]);
      } else if(m[2] == 'R') {
        b[m[0]][m[1]] = new Rook(this.color,m[0],m[1]);
      } else if(m[2] == 'K') {
        b[m[0]][m[1]] = new Knight(this.color,m[0],m[1]);
      } else if(m[2] == 'B') {
        b[m[0]][m[1]] = new Bishop(this.color,m[0],m[1]);
      }
      b[m[0]][m[1]].pro = true;
      pieces.push(b[m[0]][m[1]]);
      let rv = new Pos(m[0],m[1],b[m[0]][m[1]]);
      rv.pro = true;
      reVal.unshift(rv);
    }
    return reVal;
  }
}

class Knight extends Piece {
  constructor(color,row,col) {
    super(color,row,col);
    this.img = 'knight';
  }
  getMoves(check) {
    this.valid = [];
    for(var i = -2; i < 3; i++) {
      let l = this.col+i
      if(l > -1 && l < 8 && i !== 0) {
        for(var j = -1; j < 2; j+=2) {
          let k = this.row+(3-Math.abs(i))*j;
          if(k > -1 && k < 8) {
            if(b[k][l] == null || b[k][l].color != this.color || check) {
              this.pushValid(check,[k,l]);
            }
          }
        }
      }
    }
    if(check) return this.valid;
  }
}

class Bishop extends Piece {
  constructor(color,row,col) {
    super(color,row,col);
    this.img = 'bishop';
  }
  getMoves(check) {
    this.valid = [];
    for(var i = -1; i < 2; i+=2) {
      for(var j = -1; j < 2; j+=2) {
        for(var m = 1; m < 8; m++) {
          let k = this.row+(m*i);
          let l = this.col+(m*j);
          if(k < 0 || k > 7 || l < 0 || l > 7) break;
          if(b[k][l] == null) {
            this.pushValid(check,[k,l]);
          } else {
            if(b[k][l].color != this.color || check) {
              this.pushValid(check,[k,l]);
            }
            break;
          }
        }
      }
    }
    if(check) return this.valid;
  }
}

class Rook extends Piece {
  constructor(color,row,col) {
    super(color,row,col);
    this.img = 'rook';
    this.castle = true;
  }
  getMoves(check) {
    this.valid = [];
    for(var j = -1; j < 2; j+=2) {
      for(var m = 1; m < 8; m++) {
        let k = this.row+(m*j);
        let l = this.col
        if(k < 0 || k > 7) break;
        if(b[k][l] == null) {
          this.pushValid(check,[k,l]);
        } else {
          if(b[k][l].color != this.color || check) {
            this.pushValid(check,[k,l]);
          }
          break;
        }
      }
    }
    for(var j = -1; j < 2; j+=2) {
      for(var m = 1; m < 8; m++) {
        let k = this.row
        let l = this.col+(m*j);
        if(l < 0 || l > 7) break;
        if(b[k][l] == null) {
          this.pushValid(check,[k,l]);
        } else {
          if(b[k][l].color != this.color || check) {
            this.pushValid(check,[k,l]);
          }
          break;
        }
      }
    }
    if(check) return this.valid;
  }
  move(m) {
    let reVal = super.move(m)
    if(this.castle) reVal[1].ex = 'c';
    this.castle = false;
    return reVal;
  }
}

class Queen extends Piece {
  constructor(color,row,col) {
    super(color,row,col);
    this.img = 'queen';
  }
  getMoves(check) {
    this.valid = [];
    for(var i = -1; i < 2; i++) {
      for(var j = -1; j < 2; j++) {
        for(var m = 1; m < 8; m++) {
          if(i === 0 && j === 0) break;
          let k = this.row+(m*i);
          let l = this.col+(m*j);
          if(k < 0 || k > 7 || l < 0 || l > 7) break;
          if(b[k][l] == null) {
            this.pushValid(check,[k,l]);
          } else {
            if(b[k][l].color != this.color || check) {
              this.pushValid(check,[k,l]);
            }
            break;
          }
        }
      }
    }
    if(check) return this.valid;
  }
}

class King extends Piece {
  constructor(color,row,col) {
    super(color,row,col);
    this.img = 'king';
    this.castle = true;
  }
  getMoves(check) {
    this.valid = [];
    for(var i = -1; i < 2; i++) {
      for(var j = -1; j < 2; j++) {
        if(!(i === 0 && j === 0)) {
          let k = this.row+i;
          let l = this.col+j;
          if(!(k < 0 || k > 7 || l < 0 || l > 7) && (b[k][l] == null || b[k][l].color != this.color || check) && (!moveIn([k,l],danger) || check)) {
            this.pushValid(check,[k,l]);
          }
        }
      }
    }
    if(this.castle && !check) {
      if(b[this.row][0] !== null && b[this.row][0].img == 'rook' && b[this.row][0].castle && b[this.row][3] === null && b[this.row][2] === null && b[this.row][1] === null && !moveIn([this.row,4],danger) && !moveIn([this.row,3],danger) && !moveIn([this.row,2],danger)) {
        this.pushValid(check,[this.row,2,'C']);
      }
      if(b[this.row][0] !== null && b[this.row][7].img == 'rook' && b[this.row][7].castle && b[this.row][5] === null && b[this.row][6] === null && !moveIn([this.row,4],danger) && !moveIn([this.row,5],danger) && !moveIn([this.row,6],danger)) {
        this.pushValid(check,[this.row,6,'c']);
      }
    }
    if(check) return this.valid;
  }
  move(m) {
    let reVal = super.move(m);
    if(this.castle) reVal[1].ex = 'c';
    this.castle = false;
    if(m[2] == 'C') {
      reVal.push(new Pos(m[this.row],0,b[this.row][0]));
      reVal.push(new Pos(m[this.row],3,b[this.row][3]));
      b[this.row][3] = b[this.row][0];
      b[this.row][0] = null;
    } else if (m[2] == 'c') {
      reVal.push(new Pos(m[this.row],7,b[this.row][7]));
      reVal.push(new Pos(m[this.row],5,b[this.row][5]));
      b[this.row][5] = b[this.row][7];
      b[this.row][7] = null;
    }
    return reVal;
  }
}

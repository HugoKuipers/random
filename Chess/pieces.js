'use strict';
var activePiece = null;
var movePlayer = 'white';
var b = [];
var wpawns = [];
var bpawns = [];
var wtaken = [];
var btaken = [];

class Piece {
  constructor(color,row,col) {
    this.color = color;
    this.row = row;
    this.col = col;
    this.valid = [];
  }
  showMoves() {
    board.children[this.row].children[this.col].classList.add('active');
    for(var m of this.valid) {
      board.children[m[0]].children[m[1]].classList.add('possible');
    }
  }
  move(m) {
    let repawns;
    let taken;
    if(this.color == 'white') {
      repawns = wpawns;
      taken = btaken;
    } else {
      repawns = bpawns;
      taken = wtaken;
    }
    if(b[m[0]][m[1]] !== null) {
      taken.push(b[m[0]][m[1]]);
    }
    console.log(m);
    b[m[0]][m[1]] = b[this.row][this.col];
    b[this.row][this.col] = null;
    for(var p of repawns) {
      p.enPass = false;
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
  getMoves() {
    this.valid = [];
    let dir = this.color=='black' ? 1 : -1;
    let pro = this.color=='black' ? 6 : 1;
    if(this.enPass !== null) this.valid.push(this.enPass);
    if(this.col > 0) {
      if(b[this.row+dir][this.col-1] !== null && b[this.row+dir][this.col-1].color != this.color) {
        if(this.row == pro) {
          this.valid.push([this.row+dir,this.col-1,'Q']);
          this.valid.push([this.row+dir,this.col-1,'R']);
          this.valid.push([this.row+dir,this.col-1,'B']);
          this.valid.push([this.row+dir,this.col-1,'K']);
        } else {
          this.valid.push([this.row+dir,this.col-1]);
        }
      }
    }
    if(this.col < 7) {
      if(b[this.row+dir][this.col+1] !== null && b[this.row+dir][this.col+1].color != this.color) {
        if(this.row == pro) {
          this.valid.push([this.row+dir,this.col+1,'Q']);
          this.valid.push([this.row+dir,this.col+1,'R']);
          this.valid.push([this.row+dir,this.col+1,'B']);
          this.valid.push([this.row+dir,this.col+1,'K']);
        } else {
          this.valid.push([this.row+dir,this.col+1]);
        }
      }
    }
    if(b[this.row+dir][this.col] == null) {
      if(this.row == pro) {
        this.valid.push([this.row+dir,this.col,'Q']);
        this.valid.push([this.row+dir,this.col,'R']);
        this.valid.push([this.row+dir,this.col,'B']);
        this.valid.push([this.row+dir,this.col,'K']);
      } else {
        this.valid.push([this.row+dir,this.col]);
      }
      if(this.dubble && b[this.row+(2*dir)][this.col] == null) {
        this.valid.push([this.row+(2*dir),this.col]);
        for(var i = this.col-1; i < this.col+2; i+=2) {
          if(i>0 && i<7 && b[this.row+(2*dir)][i] != null && b[this.row+(2*dir)][i].img == 'pawn' && b[this.row+(2*dir)][i].color != this.color) {
            b[this.row+(2*dir)][i].enPass = [this.row+dir,this.col,'e'];
          }
        }
      }
    }
  }
  move(m) {
    super.move(m)
    if(this.dubble) this.dubble = false;
    if(m[2] == 'e') {
      if(this.color == 'white') {
        wtaken.push(b[m[0]][m[1]-1])
        b[m[0]][m[1]-1] = null;
      }
    }
  }
}

class Knight extends Piece {
  constructor(color,row,col) {
    super(color,row,col);
    this.img = 'knight';
  }
  // getMoves() {}
}

class Bishop extends Piece {
  constructor(color,row,col) {
    super(color,row,col);
    this.img = 'bishop';
  }
  // getMoves() {}
}

class Rook extends Piece {
  constructor(color,row,col) {
    super(color,row,col);
    this.img = 'rook';
  }
  // getMoves() {}
}

class Queen extends Piece {
  constructor(color,row,col) {
    super(color,row,col);
    this.img = 'queen';
  }
  // getMoves() {}
}

class King extends Piece {
  constructor(color,row,col) {
    super(color,row,col);
    this.img = 'king';
  }
  // getMoves() {}
}

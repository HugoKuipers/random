class Piece {
  constructor(color,row,col) {
    this.color = color;
    this.row = row;
    this.col = col;
    this.valid = [];
  }
  showMoves() {

  }
  move() {
    //
  }
}

class Pawn extends Piece {
  constructor(color,row,col) {
    super(color,row,col);
    this.enPass = [];
    this.dubble = true;
  }
  getMoves() {
    
  }
  move() {
    super()
    if(this.dubble) this.dubble = false;
  }
}

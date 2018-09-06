'use strict';

class Mai {
  constructor(depth,color) {
    this.depth = depth;
    this.color = color;
  }
  eva() {
    //check mate TODO
    bScore = 0;
    wScore = 0;
    for(var p in wpieces) {
      wScore += p.value;
      if(p.row > 2 && p.row < 5 && p.col > 2 && p.col < 5) {
        wScore+=2;
      } else if(p.row > 1 && p.row < 6 && p.col > 1 && p.col < 6) {
        wScore++;
      }
    }
    for(var p in bpieces) {
      bScore += p.value;
      if(p.row > 2 && p.row < 5 && p.col > 2 && p.col < 5) {
        bScore+=2;
      } else if(p.row > 1 && p.row < 6 && p.col > 1 && p.col < 6) {
        bScore++;
      }
    }
    if(this.color == 'white') {
      return wScore-bScore;
    } else {
      return bScore-wScore;
    }
  }
  miniMax(turn,depth,alpha,beta) {

  }
}

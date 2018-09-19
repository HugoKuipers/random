'use strict';

class Mai {
  constructor(depth, color) {
    this.depth = depth;
    this.color = color;
  }
  upState(turn) {
    let king;
    let opp;
    let cMate;
    if (turn == 'white') {
      king = wking;
      opp = bpieces;
    } else {
      king = bking;
      opp = wpieces;
    }
    danger = [];
    for (var p of opp) {
      danger = danger.concat(p.getMoves(true));
    }
    if (moveIn([king.row, king.col], danger)) {
      cMate = checkMate(opp, king);
      check = true;
    } else {
      check = false;
    }
    if (cMate) {
      if (this.color == turn) {
        return -9999;
      } else {
        return 9999;
      }
    }
    return 1;
  }
  eva(turn) {
    let king;
    let opp;
    if (turn == 'white') {
      king = wking;
      opp = bpieces;
    } else {
      king = bking;
      opp = wpieces;
    }
    if (checkMate(opp, king)) {
      if (turn == this.color) {
        return -9999;
      } else {
        return 9999;
      }
    }
    let bScore = 0;
    let wScore = 0;
    for (var i = 0; i < 2; i++) {
      let pieces = wpieces;
      let score = 0;
      if (i == 1) {
        pieces = bpieces;
      }
      for (var p of pieces) {
        score += p.value;
        if (p.img !== 'king') {
          if (p.row > 2 && p.row < 5 && p.col > 2 && p.col < 5) {
            score += 0.8;
          } else if (p.row > 1 && p.row < 6 && p.col > 1 && p.col < 6) {
            score += 0.4;
          }
        } else {
          if (p.row < 2 || p.row > 5) score += 0.4;
          if (p.col < 2 || p.col > 5) score += 0.4;
        }
      }
      if (i == 1) {
        bScore = score;
      } else {
        wScore = score;
      }
    }
    if (this.color == 'white') {
      return wScore - bScore;
    } else {
      return bScore - wScore;
    }
  }
  miniMax(turn, depth, alpha, beta) {
    let upState = this.upState(turn);
    if (upState !== 1) return [upState];
    if (depth === 0) {
      let score = this.eva(turn);
      return [score];
    } else {
      let king;
      let me;
      let opp;
      let nColor;
      let bestResult;
      let myTurn;
      if (turn == 'white') {
        king = wking;
        me = wpieces;
        nColor = 'black';
        opp = bpieces;
      } else {
        king = bking;
        me = bpieces;
        nColor = 'white';
        opp = wpieces;
      }
      if (this.color == turn) {
        bestResult = [-99999];
        myTurn = true;
      } else {
        bestResult = [99999];
        myTurn = false;
      }
      for (var p of me) {
        p.getMoves();
        for (var move of p.valid) {
          let reVal = p.move(move);
          let result = this.miniMax(nColor, depth - 1, alpha, beta);
          if (myTurn) {
            if (result[0] > bestResult[0]) {
              bestResult = result;
              bestResult[1] = p;
              bestResult[2] = move;
            }
            alpha = Math.max(alpha, [bestResult[0]]);
            if (alpha >= beta) {
              restore(reVal);
              return bestResult;
            }
          } else {
            if (result[0] < bestResult[0]) {
              bestResult = result;
              bestResult[1] = p;
              bestResult[2] = move;
            }
            beta = Math.min(beta, [bestResult[0]]);
            if (alpha >= beta) {
              restore(reVal);
              return bestResult;
            }
          }
          restore(reVal);
        }
      }
      return bestResult;
    }
  }
  move() {
    let result = this.miniMax(this.color, this.depth, -9999, 9999);
    console.log(result);
    return result[1].move(result[2]);
  }
}

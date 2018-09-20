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
      console.log('upstate');
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
    console.log('we in eva');
    let king;
    let opp;
    if (turn == 'white') {
      king = wking;
      opp = bpieces;
    } else {
      king = bking;
      opp = wpieces;
    }
    
    console.log('before');

    let temp_danger = [];
    for (var p of opp) temp_danger = temp_danger.concat(p.getMoves(true));

    if (moveIn([king.row, king.col], temp_danger)) if (checkMate(opp, king)) {
      if (turn == this.color) {
        return -99999;
      } else {
        return 99999;
      }
    }
    console.log('after');
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
            score += 8;
          } else if (p.row > 1 && p.row < 6 && p.col > 1 && p.col < 6) {
            score += 4;
          }
        } else {
          if (p.row < 2 || p.row > 5) score += 4;
          if (p.col < 2 || p.col > 5) score += 4;
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
    // console.log(depth);
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
        bestResult = [-999999];
        myTurn = true;
      } else {
        bestResult = [999999];
        myTurn = false;
      }
      for (var p of me) {
        p.getMoves();
        for (var move of p.valid) {
          let reVal = p.move(move);
          displayBoard();
          console.log(depth);
          let result = this.miniMax(nColor, depth - 1, alpha, beta);
          // console.log(depth);
          if (myTurn) {
            if (depth == 2) {
              // console.log(depth, 'blablbalbalblabkjalblaba');
            }
            if (result[0] > bestResult[0]) {
              // console.log(result, bestResult);
              bestResult = result;
              bestResult[1] = p;
              bestResult[2] = move;
              // console.log(bestResult, depth);
            }
            // if(result[0] > bestResult[0] || (result[0] === bestResult[0] && Math.random() > 0.3)) {
            //   bestResult = result;
            //   bestResult[1] = p;
            //   bestResult[2] = move;
            //   // console.log(bestResult);
            // }
            alpha = Math.max(alpha, [bestResult[0]]);
            if (alpha >= beta) {
              restore(reVal);
              return bestResult;
            }
          } else {
            if (result[0] < bestResult[0]) {
              // console.log(result, bestResult);
              bestResult = result;
              bestResult[1] = p;
              bestResult[2] = move;
              // console.log(bestResult, depth);
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
    // console.log(result);
    return result[1].move(result[2]);
  }
}

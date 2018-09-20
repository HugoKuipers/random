'use strict';

class Mai {
  constructor(depth, color) {
    this.depth = depth;
    this.color = color;
  }
  upState(turn) {
    const black = turn === 'black';
    let king = black ? bking : wking;
    let opp = black ? wpieces : bpieces;

    danger = [];
    for (var p of opp) danger = danger.concat(p.getMoves(true));

    if (moveIn([king.row, king.col], danger)) {
      check = true;
      if (checkMate(opp, king)) return this.color === turn ? -9999 : 9999;
    } else {
      check = false;
    }

    return 1;
  }
  eva(turn) {
    // console.log('we in eva');
    const black = turn === 'black';
    let king = black ? bking : wking;
    let opp = black ? wpieces : bpieces;

    // console.log('before');

    let temp_danger = [];
    for (var p of opp) temp_danger = temp_danger.concat(p.getMoves(true));

    if (moveIn([king.row, king.col], temp_danger)) if (checkMate(opp, king)) return this.color === turn ? -9999 : 9999;

    // console.log('after');
    let bScore = 0;
    let wScore = 0;
    for (var i = 0; i < 2; i++) {
      const pieces = i === 0 ? wpieces : bpieces;

      let score = 0;
      for (var p of pieces) {
        score += p.value;
        if (p.img !== 'king') {
          if (p.row > 2 && p.row < 5 && p.col > 2 && p.col < 5) score += 8;
          else if (p.row > 1 && p.row < 6 && p.col > 1 && p.col < 6) score += 4;
        } else {
          if (p.row < 2 || p.row > 5) score += 4;
          if (p.col < 2 || p.col > 5) score += 4;
        }
      }
      i === 1 ? (bScore = score) : (wScore = score);
    }

    return this.color === 'white' ? wScore - bScore : bScore - wScore;
  }
  miniMax(turn, depth, alpha, beta) {
    // console.log(depth);
    let upState = this.upState(turn);
    if (upState !== 1) return [upState];

    if (depth === 0) return [this.eva(turn)];

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
        // console.log(depth);
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
      return bestResult;
    }
  }
  move() {
    let result = this.miniMax(this.color, this.depth, -9999, 9999);
    // console.log(result);
    return result[1].move(result[2]);
  }
}

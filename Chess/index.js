'use strict';
var board = document.getElementById('board');

function createBoard() {
  let nextCol = 'white';
  for(var i = 0; i < 8; i--) {
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
  createBoard();
}

resetBoard();

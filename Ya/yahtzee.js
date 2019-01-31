'use strict'

const dSides = document.getElementsByName('dice-sides')[0]
const scoreType = document.getElementsByName('score-type')[0]
const start = document.getElementById('start-btn')
const dScore = document.getElementById('score-row')
const diceDiv = document.getElementById('dice')
const optNum = document.getElementsByClassName('opt-num')

function play() {
  let sides = parseInt(dSides.value)
  let type = scoreType.value
  if(sides < 1 || isNaN(sides)) return

  let dice = rollDice(sides)

  let multi = 1
  if(type == 'Relative') multi = ((sides-1)/5)**2
  let score = calcScore(dice,multi)

  updateDisplay(dice,score)
}

function rollDice(sides) {
  let dice = {}
  for(let i = 0; i < 5; i++) {
    let n = Math.ceil(Math.random()*sides)
    if(dice[n]) {
      dice[n]++
    } else {
      dice[n] = 1
    }
  }
  return dice
}

function calcScore(dice,multi) {
  let score = []
  let scoreEx = {}
  let strait = []
  let kindF = false
  let fullH = [false,false]
  let chance = 0
  for(var i = 0; i < 13; i++) {
    score.push(0)
  }

  for(let d in dice) {
    let a = dice[d]
    chance += d * a
    strait.push(parseInt(d))

    if(d < 7) {
      score[d-1] = d * a
    } else {
      scoreEx[d] = d * a
    }

    if(a == 2) {
      fullH[0] = true
    } else if(a == 3) {
      fullH[1] = true
    } else if(a == 4) {
      kindF = true
    } else if(a == 5) {
      score[12] = 50 * multi
      kindF = true
    }
  }

  strait.sort()
  let bestS = 0
  let nowS = 0
  for(let m = 0; m < strait.length-1; m++) {
    if(strait[m]+1 == strait[m+1]) {
      nowS++
      if(bestS < nowS) bestS = nowS
    } else {
      nowS = 0
    }
  }
  if(bestS > 2) {
    score[8] = 30 * multi
    if(bestS > 3) {
      score[9] = 40 * multi
    }
  }

  score[11] = chance
  if(fullH[1]) {
    if(fullH[0]) {
      score[10] = 25 * multi
    }
    score[6] = chance
  } else if(kindF) {
    score[7] = chance
    score[6] = chance
  }

  return [score,scoreEx]
}

function updateDisplay(dice, score) {
  let dHtml = ''
  let sHtml = ''

  for(let d in dice) {
    for(let i = 0; i < dice[d]; i++) {
      dHtml += '<div>' + d + '</div>'
    }
  }

  let countEx = 0
  for(let i in score[0]) {
    let s = score[0][i]
    if(s == 0 && i < 6 && Object.keys(score[1]).length > countEx) {
      optNum[i].innerHTML = Object.keys(score[1])[countEx] + "'s"
      sHtml += '<td>' + score[1][Object.keys(score[1])[countEx]] + '</td>'
      countEx++
    } else {
      sHtml += '<td>' + s + '</td>'
    }
  }

  dScore.innerHTML = sHtml
  diceDiv.innerHTML = dHtml
}

start.onclick = () => play()

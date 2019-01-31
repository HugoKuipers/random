"use strict";

const dSides = document.getElementsByName("dice-sides")[0];
const scoreType = document.getElementsByName("score-type")[0];
const start = document.getElementById("start-btn");
const dScore = document.getElementById("score-row");
const tScore = document.getElementById("score-type-row");
const diceDiv = document.getElementById("dice");
const optNum = document.getElementsByClassName("opt-num");

function play() {
  let sides = parseInt(dSides.value);
  let type = scoreType.value;
  if (sides < 1 || isNaN(sides)) return;

  let [dice, chance] = rollDice(sides);

  let multi = 1;
  if (type == "Relative") multi = ((sides - 1) / 5) ** 2;
  let score = calcScore(dice, chance, multi);

  updateDisplay(score);
}

function rollDice(sides) {
  // Could create the dice in the html alrdy here, looks a bit more random that way
  let dHtml = "";
  let dice = {};
  let chance = 0;
  for (let i = 0; i < 5; i++) {
    let n = Math.ceil(Math.random() * sides);
    dHtml += `<div>${n}</div>`;
    chance += n;
    // An alternative
    dice[n] = dice[n] ? dice[n] + 1 : 1;
  }
  diceDiv.innerHTML = dHtml;
  return [dice, chance];
}

function calcScore(dice, chance, multi) {
  let score = Object.assign({}, dice);

  const signs = ['\\', '|', '/', '-']

  for (let i = 0; i < 5 - Object.keys(dice).length; i++) score[signs[i]] = '-'
  
  score["3 of a kind"] = 0;
  score["4 of a kind"] = 0;
  score["Small strait"] = 0;
  score["Large strait"] = 0;
  score["Full House"] = 0;
  score["Yahtzee"] = 0;
  score["Chance"] = chance;

  let strait = [];
  let fullH = [false, false];

  for (let die in dice) {
    let amount = dice[die];
    score[die] = die * amount;
    strait.push(parseInt(die));

    if (amount === 2) {
      if (fullH[1]) {
        score["Full House"] = 25 * multi;
        continue;
      }

      fullH[0] = true;
    } else if (amount >= 3) {
      score["3 of a kind"] = chance;

      if (fullH[0]) {
        score["Full House"] = 25 * multi;
        continue;
      }

      fullH[1] = true;
    }

    if (amount >= 4) score["4 of a kind"] = chance;

    if (amount === 5) score["Yahtzee"] = 50 * multi;
  }

  if (strait.length < 4) return score;

  let dicePips = Object.keys(dice)
  let maxStrait = 0
  let straitCount = 0
  
  for (let index = 0; index < dicePips.length - 1; index++) {
    if (parseInt(dicePips[index]) + 1 === parseInt(dicePips[index + 1])) straitCount++
    else straitCount = 0
    if (straitCount > maxStrait) maxStrait = straitCount
  }

  if (maxStrait >= 3) score["Small strait"] = 30
  if (maxStrait >= 4) score["Large strait"] = 40
  
  return score;
}

function updateDisplay(score) {
  let tHtml = "";
  let sHtml = "";

  for (const scoreType in score) {
    tHtml += `<th>${scoreType}</th>`;
    sHtml += `<td>${score[scoreType]}</td>`;
  }

  tScore.innerHTML = tHtml;
  dScore.innerHTML = sHtml;
}

start.onclick = play;

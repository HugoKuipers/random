<template>
  <div id="game">
      <div id="options">
        <button id="start-btn" class="center btn" @click="play">Roll them dice! ({{ round }})</button>
        <table id="score" class="center">
          <thead>
            <tr id="score-type-row">
              <th v-for="(value,key) in score">{{ key }}</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr id="score-row">
              <td v-for="(value,key) in score" @click="pickScore(key,value)" :class="{ locked: key in lockedScore, clickable: (!(key in lockedScore)) }">{{ value }}</td>
              <td>{{ totalScore() }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div id="dice">
        <div v-for="(die,index) in dice" @click="pickDie(index)" :class="{locked: saveDice[index], clickable: round < 4}">{{ die }}</div>
      </div>
    </div>
</template>

<script>
export default {
  name: "HelloYahtzee",

  data() {
    return {
      score: {},
      lockedScore: {},
      dice: [],
      saveDice: {},
      round: 1,
    }
  },

  methods: {
    play: function() {
      if(this.round == 4) return;
      let dice = this.rollDice();
      this.calcScore(dice);
      this.round++;
    },

    rollDice: function() {
      let dice = {};
      this.dice = [];
      this.score.Chance = 0;
      for(let i = 1; i <= 6; i++) {
        dice[i] = dice[i] ? dice[i] : 0;
      }
      for(let i = 0; i < 5; i++) {
        let n;
        if(this.saveDice[i]) {
          n = this.saveDice[i];
        } else {
          n = Math.ceil(Math.random() * 6);
          this.$set(this.saveDice, i, 0);
        }
        this.dice.push(n);
        this.score.Chance += n;
        dice[n]++;
      }
      return dice;
    },

    calcScore: function(dice) {
      this.score = Object.assign({"3 of a kind": 0,"4 of a kind": 0,"Small strait": 0,"Large strait": 0,"Full House": 0,"Yahtzee": 0,"Chance": this.score.Chance}, this.lockedScore)

      let strait = [];
      let fullH = [false, false];

      for(let die in dice) {
        let amount = dice[die];
        if(!(die in this.lockedScore)) this.score[die] = die * amount;
        amount !== 0 ? strait.push(parseInt(die)) : '';

        if(amount === 2) {
          if(fullH[1]) {
            if(!("Full House" in this.lockedScore)) this.score["Full House"] = 25;
            continue;
          }
          fullH[0] = true;
        } else if(amount >= 3) {
          if(!("3 of a kind" in this.lockedScore)) this.score["3 of a kind"] = this.score.Chance;
          if(fullH[0]) {
            if(!("Full House" in this.lockedScore)) this.score["Full House"] = 25;
            continue;
          }
          fullH[1] = true;
        }

        if(amount >= 4 && !("4 of a kind" in this.lockedScore)) this.score["4 of a kind"] = this.score.Chance;

        if(amount === 5 && !("Yahtzee" in this.lockedScore)) this.score["Yahtzee"] = 50;
      }

      if(strait.length < 4) return;

      let maxStrait = 0
      let straitCount = 0
      for(let index = 0; index < strait.length - 1; index++) {
        if(parseInt(strait[index]) + 1 === parseInt(strait[index + 1])) {
          straitCount++;
        } else {
          straitCount = 0;
        }
        if(straitCount > maxStrait) maxStrait = straitCount
      }

      if(maxStrait >= 3 && !("Small strait" in this.lockedScore)) this.score["Small strait"] = 30
      if(maxStrait >= 4 && !("Large strait" in this.lockedScore)) this.score["Large strait"] = 40
    },

    pickScore: function(key,value) {
      if(key in this.lockedScore) return;
      
      this.lockedScore[key] = value;
      this.round = 1;
      this.dice = [];
      this.score = {};
      this.saveDice = {};
    },

    pickDie: function(index) {
      if(this.round == 4) return;

      const value = this.saveDice[index] ? 0 : this.dice[index]
      this.$set(this.saveDice, index, value);
    },

    totalScore: function () {
      let sum = 0;
      for(let p in this.lockedScore) sum += this.lockedScore[p];
      return sum;
    }
  }
};
</script>

<style>
html {
  background-image: url("./../assets/southpark.gif");
  background-repeat: no-repeat;
  background-size: cover;
  width: 100%;
  height: 100%;
}
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
p {
  font-size: 20px;
}

#game {
  border: 2px solid red;
  border-radius: 25px;
  background-color: rgb(233, 179, 83);
  top: 10px;
  margin: auto;
  height: 600px;
  width: 1000px;
  position: relative;
  text-align: center;
}

#dice {
  border-top: 2px solid red;
  top: 50%;
  width: 100%;
  position: absolute;
  text-align: center;
}

#dice div {
  margin: 90px 40px;
  width: 100px;
  height: 100px;
  position: relative;
  border: 2px red solid;
  border-radius: 8px;
  text-align: center;
  font-size: 90px;
  display: inline-block;
  color: rgb(0, 33, 91);
}

#score, #score th, #score td {
  margin: auto;
  margin-top: 40px;
  border: 1px solid black;
  border-collapse: collapse;
  padding: 6px;
}

#score {
  width: 75%;
}

.center {
  text-align: center;
}

.inv {
  display: none;
}

.btn {
  margin: auto;
  margin-top: 50px;
  position: relative;
  border: 1px solid rgb(222, 93, 1);
  font-size: 60px;
  border-radius: 6px;
  cursor: pointer;
  background-color: rgb(228, 199, 153);
}

.locked {
  background-color: rgb(208, 146, 35);
  font-weight: bold;
  cursor: ;
}

.clickable {
  cursor: pointer;
}
</style>

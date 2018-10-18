package main

import (
  "fmt"
  "math/rand"
  "time"
)


func randomDice(n int, seed *rand.Rand) []int {
  var dice []int
  for i := 0; i < n; i++ {
    d := seed.Intn(6) + 1
    dice = append(dice,d)
  }
  return dice
}


func main() {
  s1 := rand.NewSource(time.Now().UnixNano())
  r1 := rand.New(s1)
  count := 0
  for {
    count++
    dice := randomDice(5,r1)
    done := true
    for _,d := range dice {
      if d != dice[0] {
        done = false
        break
      }
    }
    if done {
      fmt.Printf("You got all %d's after %d tries!", dice[0], count)
      break
    }
  }
}

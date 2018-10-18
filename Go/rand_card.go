package main

import (
  "fmt"
  "math/rand"
  "time"
)

func main() {
  s1 := rand.NewSource(time.Now().UnixNano())
  r1 := rand.New(s1)
  suits := []string{"harten","schoppen","klaveren","ruiten"}
  cards := []string{"2","3","4","5","6","7","8","9","10","Boer","Vrouw","Heer","Aas"}
  suit := suits[r1.Intn(4)]
  card := cards[r1.Intn(13)]
  fmt.Printf("Je kaart is de %s van %s!", card, suit)
}

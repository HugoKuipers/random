<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/southpark.gif" />
    <HelloWorld msg="Welcome to Your Yahtzee App" />
  </div>
</template>

<script>
import HelloYahtzee from "./components/HelloYahtzee.vue";

export default {
  name: "app",
  components: {
    HelloYahtzee
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

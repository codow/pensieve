<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<style>
html,
body,
#app {
  margin: 0;
  padding: 0;
  height: 100%;
}
</style>

<script>

export default {
  name: 'app',
  computed: {
    appStyle () {
      return {
        height: this.$store.state.Canvas.screen.height + 'px'
      }
    }
  }
}
</script>

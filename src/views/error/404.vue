<template>
  <div class="not-find-404">
    <img src="@/assets/images/404.jpg"
         alt="">
    <router-link to="/"
                 tag="span"
                 class="text">返回首页</router-link>
  </div>
</template>

<script>
export default {
  name: 'NotFind'
}
</script>

<style lang="scss" scoped>
.not-find-404 {
  width: 100%;
  height: 100%;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .text {
    height: 32px;
    line-height: 32px;
    width: 100px;
    font-size: 16px;
    color: #728fdd;
    border: 1px solid #728fdd;
    border-radius: 32px;
    cursor: pointer;
    &:hover {
      background-color: #eef2f7;
      color: #5576de;
      transition: all 0.5s;
    }
  }
}
</style>

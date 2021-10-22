<template>
  <link ref="link" type="text/css" :href="href">
</template>

<script>
export default {
  name: 'fr-link',
  props: {
    href: String
  },
  mounted () {
    this.initLink()
  },
  destroyed () {
    this.destroyLink()
  },
  methods: {
    getLinkEl () {
      const { link } = this.$refs
      return link
    },
    initLink () {
      const link = this.getLinkEl()
      // 将link 插入head
      const head = window.document.head
      head.append(link)
    },
    destroyLink (){
      this.getLinkEl().remove()
    }
  }
}
</script>

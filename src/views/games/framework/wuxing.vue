<template>
  <div class="padding__small">
    <ul>
      <li>
        <div>五行颜色</div>
        <p v-for="item in wuxing"
           :key="item"
           style="line-height: 24px; height: 24px;">
          <span>{{wuxingNames[item]}}({{ wuxing[item] }})</span>
          <span style="display: inline-block; width: 24px; height: 24px;"
                :style="{backgroundColor: wuxingColors[item]}"></span>
        </p>
      </li>
    </ul>
  </div>
</template>

<script>

const WuxingEnum = {
  Metal: 'Metal',
  Wood: 'Wood',
  Water: 'Water',
  Fire: 'Fire',
  Soil: 'Soil'
}

const WuxingNameEnum = {
  [WuxingEnum.Metal]: '金',
  [WuxingEnum.Wood]: '木',
  [WuxingEnum.Water]: '水',
  [WuxingEnum.Fire]: '火',
  [WuxingEnum.Soil]: '土',
}

const WuxingColorEnum = {
  [WuxingEnum.Metal]: '#feffe6',
  [WuxingEnum.Wood]: '#a0d911',
  [WuxingEnum.Water]: '#002766',
  [WuxingEnum.Fire]: '#fa541c',
  [WuxingEnum.Soil]: '#614700',
}

export default {
  name: 'GamesFrWuxing',
  data () {
    return {
      wuxing: WuxingEnum,
      wuxingNames: WuxingNameEnum,
      wuxingColors: WuxingColorEnum
    }
  }
}
</script>
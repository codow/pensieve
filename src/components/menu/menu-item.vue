<template>
  <el-sub-menu v-if="item.children && item.children.length"
               :index="item.id"
               class="sp-multiple-menu__item sp-menu__item">
    <template #title>
      <slot :item="item"
            name="title">
        <i class="sp-font__larger"
           :class="[item[props.iconClass], item[props.iconClass] && item[props.iconClass].indexOf('el-')=='-1'?'sp-icon__img':'']"></i>
        <span class="sp-menu-content"
              :class="{
                'sp-menu-content__with-badge': item[props.messageNumber] > 0
              }"
              :title="item.label">{{item.label}}</span>
        <el-badge v-if="item[props.messageNumber] > 0"
                  :value="item[props.messageNumber]"
                  :max="99"
                  class="sp-menu-content__badge">
        </el-badge>
      </slot>
    </template>
    <template #default>
      <slot>
        <fr-menu-item v-for="subItem in item.children"
                      :key="subItem.id"
                      :item="subItem"
                      :props="props"></fr-menu-item>
      </slot>
    </template>
  </el-sub-menu>
  <el-menu-item v-else
                :index="item.id"
                class="sp-multiple-menu__item sp-menu__item">
    <slot name="title"
          :item="item">
      <i class="sp-font__larger"
         :class="[item[props.iconClass], item[props.iconClass] && item[props.iconClass].indexOf('el-')=='-1'?'sp-icon__img':'']"></i>
      <span class="sp-menu-content"
            :class="{
              'sp-menu-content__with-badge': item[props.messageNumber] > 0
            }"
            :title="item.label">{{item.label}}</span>
      <el-badge v-if="item[props.messageNumber] > 0"
                :value="item[props.messageNumber]"
                :max="99"
                class="sp-menu-content__badge">
      </el-badge>
    </slot>
  </el-menu-item>
</template>

<script>
export default {
  name: 'FrMenuItem',
  props: {
    item: Object,
    props: Object
  }
}
</script>

<template functional>
  <el-submenu v-if="props.item.children && props.item.children.length"
              :index="props.item.id"
              class="sp-multiple-menu__item sp-menu__item">
    <template #title>
      <slot :item="item"
            name="title">
        <i class="sp-font__larger"
           :class="[props.item[props.props.iconClass], props.item[props.props.iconClass] && props.item[props.props.iconClass].indexOf('el-')=='-1'?'sp-icon__img':'']"></i>
        <span slot="title"
              class="sp-menu-content"
              :class="{
                'sp-menu-content__with-badge': props.item[props.props.messageNumber] > 0
              }"
              :title="props.item.label">{{props.item.label}}</span>
        <el-badge slot="title"
                  v-if="props.item[props.props.messageNumber] > 0"
                  :value="props.item[props.props.messageNumber]"
                  :max="99"
                  class="sp-menu-content__badge">
        </el-badge>
      </slot>
    </template>
    <template #default>
      <slot>
        <fr-menu-item v-for="subItem in props.item.children"
                      :key="subItem.id"
                      :item="subItem"
                      v-bind="props"></fr-menu-item>
      </slot>
    </template>
  </el-submenu>
  <el-menu-item v-else
                :index="props.item.id"
                class="sp-multiple-menu__item sp-menu__item">
    <slot name="title"
          :item="item">
      <i class="sp-font__larger"
         :class="[props.item[props.props.iconClass], props.item[props.props.iconClass] && props.item[props.props.iconClass].indexOf('el-')=='-1'?'sp-icon__img':'']"></i>
      <span slot="title"
            class="sp-menu-content"
            :class="{
              'sp-menu-content__with-badge': props.item[props.props.messageNumber] > 0
            }"
            :title="props.item.label">{{props.item.label}}</span>
      <el-badge slot="title"
                v-if="props.item[props.props.messageNumber] > 0"
                :value="props.item[props.props.messageNumber]"
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

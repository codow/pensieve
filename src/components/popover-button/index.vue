<template>
  <el-popover v-model="visible"
    :title="title"
    :placement="placement"
    :width="popoverWidth"
    :trigger="trigger"
    :class="popoverClass"
    :style="popoverStyle"
    :popper-class="finalPopperClass"
    :offset="offset"
    :open-delay="openDelay"
    :close-delay="closeDelay"
    :tabindex="tabindex"
    :disabled="disabled"
    :transition="transition"
    :visible-arrow="visibleArrow"
    :popper-options="popperOptions"
    :content="content"
    v-on="$listeners">
    <!-- 菜单组 -->
    <template v-for="item in list">
      <el-divider v-if="item.divide"
        :key="item[config.value]"
        :content-position="item.divide.position"
        class="button-popover-divider"><i v-if="item.divide.icon"
          class="button-popover-divider-icon"
          :class="item.divide.icon"></i><span v-if="item.divide.label"
          class="button-popover-divider-label">{{item.divide.label}}</span></el-divider>
      <fr-popover-button v-if="item[config.children] && item[config.children].length"
        :key="item[config.value]"
        :data="item.children"
        :popover-width="popoverWidth"
        :size="size"
        :disabled="item[config.disabled]"
        trigger="hover"
        placement="right-start"
        button-class="button-popover-item"
        @show="handlePopoverShow(item)">
        {{item[config.label]}}
      </fr-popover-button>
      <el-button v-else
        :key="item[config.value]"
        :size="size"
        class="button-popover-item"
        :disabled="item[config.disabled]"
        @click="handleItemClick(item)">{{item[config.label]}}</el-button>
    </template>
    <el-button slot="reference"
      :disabled="disabled"
      :size="size"
      :type="type"
      :icon="icon"
      :plain="plain"
      :round="round"
      :circle="circle"
      :loading="loading"
      :autofocus="autofocus"
      :nativeType="nativeType"
      :class="buttonClass"
      :style="buttonStyle">
      <slot></slot>
    </el-button>
  </el-popover>
</template>

<script>
import BaseMixin from './mixins/base';

import { isArray, isFunction, isNotEmpty } from '../../utils/packages/validator';

export default {
  name: 'FrPopoverButton',
  mixins: [BaseMixin],
  props: {
    // 异步加载下级数据
    lazy: Boolean,
    data: Array,
    dataSource: [String, Object],
    dataBindingMethod: Function
  },
  data() {
    return {
      list: [],
      visible: false
    };
  },
  watch: {
    data() {
      this.dataBinding();
    }
  },
  created() {
    this.dataBinding();
  },
  methods: {
    dataBinding() {
      if (isNotEmpty(this.data)) {
        this.handleDataBindingCallback(this.data);
      } else if (isFunction(this.dataBindingMethod)) {
        this.dataBindingMethod(this.handleDataBindingCallback);
      }
    },

    handleDataBindingCallback(data) {
      if (!isArray(data)) {
        data = [];
      }
      // 处理为list数据
      this.list = data;
    },

    handlePopoverShow(item) {
      this.setItemActive(item, true);
    },

    handlePopoverHide(item) {
      this.setItemActive(item, false);
    },

    handleItemClick(item) {
      this.setItemActive(item, true);
      if (item.command) {
        this.submitCommand(item.command);
        this.close();
      }
    },

    setItemActive(item, flag) {
      this.$set(item, 'active', flag);
      // 取消同级的激活
    },

    submitCommand(command) {
      this.$emit('command', command);
    },

    close() {
      this.visible = false;
    }
  }
}
</script>

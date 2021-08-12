<template>
  <div>
    <div>{{name}}</div>
    <div>
      <slot :name="slotName">
        <template v-if="children && children.length > 0">
          <deep-nested-slot-component v-for="(item, index) of children"
                                      :key="index"
                                      v-bind="item">
            <template v-if="item.slotName"
                      #[item.slotName]>
              <slot :name="item.slotName"></slot>
            </template>
          </deep-nested-slot-component>
        </template>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'deep-nested-slot-component',
  props: ['name', 'slotName', 'children']
}
</script>
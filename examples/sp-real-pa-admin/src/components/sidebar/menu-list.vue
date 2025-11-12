<template>
  <template v-for="item of list">
    <template v-if="!item.children || item.children?.length === 0">
      <el-menu-item :key="item.path" :index="item.path">
        <template #title>{{ item.title }}</template>
      </el-menu-item>
    </template>
    <template v-else-if="item.children && item.children?.length !== 0">
      <el-sub-menu :key="item.path" :index="item.path">
        <template #title>
          <span>{{ item.title }}</span>
        </template>
        <menu-list :list="item.children" />
      </el-sub-menu>
    </template>
  </template>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Imenu } from '@/project'

export default defineComponent({
  name: 'MenuList',
  props: {
    list: {
      type: Array as PropType<Imenu[]>,
      required: true,
    },
  },
  setup() {},
})
</script>
<style lang="scss" scoped>
.menu-icon {
  vertical-align: baseline;
  margin-right: 10px;
}
</style>

<!-- 拷贝其他代码进行快捷修改 -->
<template>
  <ul class="base-tabs">
    <li v-for="item of tabLists" :key="item.value" class="tab" @click="tabClick(item)">
      <div :class="currentTab === item.value ? 'active' : ''">{{ item.label }}</div>
    </li>
  </ul>
</template>
<script lang="ts">
import { defineComponent, toRefs, PropType, computed } from 'vue'

export default defineComponent({
  name: 'BaseTabs',
  props: {
    tabList: {
      type: Array as PropType<{ label: string; value: string }[]>,
      default: () => [],
    },
    defaultTab: {
      type: String,
      default: '',
    },
  },
  emits: ['tabClick'],
  setup(props, { emit }) {
    const { tabList, defaultTab } = toRefs(props)

    const currentTab = computed(() => defaultTab.value)

    const tabClick = (tab: { label: string; value: string }) => {
      emit('tabClick', tab.value)
    }

    return {
      tabClick,
      currentTab,
      tabLists: tabList,
    }
  },
})
</script>
<style lang="scss" scoped>
.base-tabs {
  box-sizing: border-box;
  border-radius: 4px;
  padding: 2px;
  width: 523.5px;
  .tab {
    display: inline-block;
    height: 36px;
    line-height: 32px;
    min-width: 62px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    font-size: 14px;
    color: #999999;
    text-align: center;
    background-color: #f5f5f5;
    cursor: pointer;
    margin-bottom: 10px;
    &:not(:last-of-type) {
      position: relative;
      &::after {
        content: '';
        position: absolute;
        width: 1px;
        height: 16px;
        right: 0;
        transform: translateY(-50%);
        top: 50%;
        background-color: #ebebeb;
      }
    }

    div {
      height: 32px;
      margin-top: 2px;
      &.active {
        background: #ffffff;
        box-shadow: 0 0 8px 0 #d8d8d8;
        border-radius: 4px;
      }
    }
  }
}
</style>

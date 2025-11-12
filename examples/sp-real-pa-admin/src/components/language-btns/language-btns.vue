<template>
  <div class="language-btns">
    <span
      v-for="item of languageList"
      :key="item.value"
      :class="['lan', currentLang?.value === item.value ? 'active' : '']"
      @click="handleClick(item)"
      >{{ item.label }}</span
    >
  </div>
</template>
<script lang="ts">
import { defineComponent, onBeforeMount, ref } from 'vue'
import { getLanguageConfig } from '@/api/authority/authority'
import { DEFAULT_LANGUAGE_CONFIG, LANGUAGE_SERVER_MAP } from '@/constants/language'
import store from '@/store'

export default defineComponent({
  name: 'LanguageBtns',
  emits: ['btnClick'],
  setup(_props, { emit }) {
    const languageList = ref()
    const currentLang = ref()

    onBeforeMount(() => {
      getLanguageConfig({ types: ['lang'] }).then((res) => {
        const result = res?.result?.lang || DEFAULT_LANGUAGE_CONFIG

        const list = result.map((item: string[]) => {
          return {
            label: item[1][0],
            value: LANGUAGE_SERVER_MAP[item[0]]
          }
        })

        const cacheLanguage = store.state.language
        if (cacheLanguage) {
          currentLang.value = list.find((item: Record<string, any>) => item.value === cacheLanguage)
        } else {
          currentLang.value = list[0]
        }

        languageList.value = list
        store.commit('setLanguageList', result)
      })
    })

    const handleClick = (lan: { label: string; value: string }) => {
      currentLang.value = lan

      emit('btnClick', lan.value)
    }

    return {
      languageList,
      currentLang,
      handleClick
    }
  }
})
</script>
<style lang="scss" scoped>
.language-btns {
  height: 36px;
  background: #f5f5f5;
  border-radius: 4px;
  padding: 2px;
  float: right;
  margin-top: -20px;
  .lan {
    display: inline-block;
    width: 36px;
    height: 32px;
    line-height: 32px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    font-size: 14px;
    color: #999999;
    cursor: pointer;
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
    &.active {
      background: #ffffff;
      box-shadow: 0 0 8px 0 #d8d8d8;
      border-radius: 4px;
      // padding: 2px;
    }
  }
}
</style>

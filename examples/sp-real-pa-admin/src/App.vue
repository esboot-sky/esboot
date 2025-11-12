<template>
  <el-config-provider :locale="locale">
    <router-view />
  </el-config-provider>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import zhHk from 'element-plus/es/locale/lang/zh-tw'

export default defineComponent({
  name: 'App',
  setup() {
    const store = useStore()
    const locale = computed(() => {
      if (store.state.language === 'hk') {
        return zhHk
      }
      return zhCn
    })
    return {
      locale,
    }
  },
})
</script>

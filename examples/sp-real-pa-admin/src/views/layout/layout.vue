<template>
  <div class="layout-container">
    <v-header v-if="!isByQiankun" />
    <div class="sidebar-main">
      <v-sidebar v-if="!isByQiankun" :multi-module-list="multiModuleList" />
      <div class="main">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import VHeader from '@/components/header/header.vue'
import VSidebar from '@/components/sidebar/sidebar.vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'Layout',
  components: {
    VHeader,
    VSidebar,
  },
  setup() {
    const store = useStore()
    const multiModuleList = computed(() => store.state.multiModuleList)
    const router = useRouter()
    const isByQiankun = computed(() => store.state.isByQiankun)

    if (!store.state.hadDynamicRoute) {
      store.dispatch('initMultiModuleList', { router, shouldPush: true })
    }

    return {
      multiModuleList,
      isByQiankun,
    }
  },
})
</script>

<style lang="scss" scoped>
.layout-container {
  .sidebar-main {
    display: flex;
    .main {
      flex: 1;
      height: calc(100vh - 70px);
      overflow-y: auto;
      overflow-x: hidden;
    }
  }
}
</style>

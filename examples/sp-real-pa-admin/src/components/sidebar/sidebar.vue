<template>
  <div class="sidebar-new">
    <div class="left">
      <ul>
        <li
          v-for="theModule of multiModuleListAll"
          :key="theModule.code"
          :class="currentModule?.code === theModule?.code ? 'active' : ''"
          @click="clickModule(theModule)"
        >
          <SvgIcon :path="getCurrentMenuIconName(theModule)" />
          <div class="title">{{ theModule.name }}</div>
        </li>
      </ul>
    </div>

    <div class="right">
      <el-scrollbar height="calc(100vh - 64px)">
        <div class="module-name">{{ currentModule.name }}</div>
        <el-menu
          active-text-color="#0e67ff"
          text-color="#868890"
          class="el-menu-vertical-demo"
          :default-active="currentRoutePath"
          :collapse-transition="false"
          router
        >
          <MenuList :list="menu" />
        </el-menu>
      </el-scrollbar>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, PropType, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { getMenuIconName } from '@/utils/icon'
import { getAssetPath } from '@/utils/asset-path'
import MenuList from './menu-list.vue'
import { getDefaultModulePath } from '@/utils/common'

export default defineComponent({
  name: 'SidebarNew',
  props: {
    multiModuleList: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
  },
  components: { MenuList },
  setup(props) {
    const store = useStore()
    const router = useRouter()

    const currentModule = computed(() => store.state.currentModule)
    const menu = computed(() => store.state.menu)
    const isShowAll = ref(false)
    const route = useRoute()
    const currentRoutePath = computed(() => route.path)

    const getCurrentMenuIconName = (module: Record<string, any>) => {
      const moduleName = getMenuIconName(module, currentModule.value)
      return getAssetPath(`public-images/${moduleName}.svg`)
    }

    const clickModule = (theModule: { [key: string]: any }) => {
      store.dispatch('getMenuBtnList', { moduleCode: theModule?.code, _router: router })
    }

    const multiModuleListAll = computed(() => {
      return [...props.multiModuleList]
    })

    return {
      currentModule,
      clickModule,
      currentRoutePath,
      menu,
      multiModuleListAll,
      getCurrentMenuIconName,
      isShowAll,
      getAssetPath,
    }
  },
})
</script>
<style lang="scss" scoped>
.sidebar-new {
  display: flex;
  .left {
    width: 80px;
    background-color: #e9eaee;
    ul {
      padding: 0;
      li {
        color: #868890;
        text-align: center;
        margin-bottom: 28px;
        cursor: pointer;
        &.active {
          color: #0e67ff;
        }
        .title {
          font-size: 14px;
          font-family: PingFangSC, PingFangSC-Regular;
        }
      }
    }
  }
  .right {
    width: 200px;
    position: relative;
    .module-name {
      height: 40px;
      line-height: 40px;
      background: #e5e6ea;
      font-size: 16px;
      font-family: PingFangHK, PingFangHK-Medium;
      font-weight: 500;
      color: #212121;
      padding-left: 20px;
    }
    .transition-box {
      position: absolute;
      top: 0;
      z-index: 10;
      height: 100%;
      min-width: 680px;
      padding: 20px;
      padding-right: 0px;
      background-color: #f5f6f8;
      .the-module {
        display: inline-block;
        vertical-align: top;
        margin-right: 50px;
        .icon-name {
          display: flex;
          align-items: center;
          font-size: 16px;
          font-family: PingFangHK, PingFangHK-Medium;
          font-weight: 500;
          color: #212121;
          .name {
            margin-left: 9px;
          }
        }
        .menu-name {
          font-size: 14px;
          font-family: PingFangSC, PingFangSC-Regular;
          color: #212121;
          padding-left: 28px;
          height: 32px;
          line-height: 32px;
        }
        .menu-item {
          font-size: 14px;
          font-family: PingFangSC, PingFangSC-Regular;
          color: #8c8e96;
          padding-left: 28px;
          width: 150px;
          height: 32px;
          line-height: 32px;
          cursor: pointer;
          &:hover {
            color: #0e67ff;
            background-color: #e9eaef;
          }
        }
      }
    }
  }
}
</style>

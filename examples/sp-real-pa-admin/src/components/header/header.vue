<template>
  <div class="header">
    <div class="header-left">
      <div class="logo">
        <img :src="getAssetPath('public-images/logo.svg')" />
      </div>
    </div>
    <div class="header-right">
      <el-popover placement="bottom" :width="300" trigger="click">
        <template #reference>
          <div class="user-avator">
            <!-- 用户头像 -->
            <img src="@/assets/images/avator.png" />
            <div class="name-role">
              <div class="name">{{ user?.nickname }}</div>
              <div class="role">{{ user?.roleName }}</div>
            </div>
          </div>
        </template>
        <div class="dropdown-box">
          <div class="brief-info">
            <img src="@/assets/images/avator.png" class="avator" />
            <div class="brief">
              <div>
                <div class="name">{{ user?.nickname }}</div>
                <div class="role">{{ user?.roleName }}</div>
              </div>
              <span class="modify-password" @click="showChangePwdDialog = true">{{
                $t('modifyPassword')
              }}</span>
            </div>
          </div>
          <div class="line"></div>
          <div v-if="isByQiankun" class="module-list">
            <ul>
              <li v-for="item of filteredModules" :key="item.id" @click="switchModule(item)">
                <span>{{ item.name }}</span>
              </li>
            </ul>
          </div>
          <div class="logout-box">
            <el-button type="primary" @click="toLogout">{{ $t('logOff') }}</el-button>
          </div>
        </div>
      </el-popover>
    </div>
    <div class="line"></div>
    <el-dialog
      v-model="showChangePwdDialog"
      :title="$t('modifyPassword')"
      :close-on-click-modal="false"
      width="800px"
      center
      @close="closeChangePwdDialog"
    >
      <el-form
        ref="changePassRef"
        :model="changePassForm"
        :rules="resetPassRule"
        label-width="100px"
        class="update-password-form"
      >
        <el-form-item :label="`${$t('user_name')}：`">
          <span>{{ user?.nickname }}</span>
        </el-form-item>
        <el-form-item :label="`${$t('user_role_name')}：`">
          <span>{{ user?.roleName }}</span>
        </el-form-item>
        <el-form-item :label="`${$t('enter_password')}：`" prop="password">
          <el-input
            v-model="changePassForm.password"
            type="password"
            :placeholder="$t('check_password')"
          ></el-input>
        </el-form-item>
        <el-form-item :label="`${$t('confirm_password')}：`" prop="confirmPassword">
          <el-input
            v-model="changePassForm.confirmPassword"
            type="password"
            :placeholder="$t('check_password')"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showChangePwdDialog = false">{{ $t('cancel') }}</el-button>

          <el-button type="primary" :loading="changePwdBtnLoading" @click="confirmChangePass">{{
            $t('determine')
          }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { generateRoute } from '@/utils/authority'
import { systemLoginInfo, changePassword } from '@/api/authority/authority'
import { getAssetPath } from '@/utils/asset-path'
import { passwordEncrypt } from '@/utils/common'

export default defineComponent({
  name: 'VHeader',
  setup() {
    // 侧边栏折叠/展开切换事件
    const store = useStore()
    const isCollapse = computed(() => store.state.isCollapse)
    const toggleCollapse = () => {
      store.commit('setIsCollapse', !isCollapse.value)
    }

    // 下拉框逻辑
    const router = useRouter()
    const { t } = useI18n({ useScope: 'global' })
    const toLogout = () => {
      store.dispatch('logout')
      window.location.reload()
    }

    // 切换语言
    const { locale } = useI18n()
    const toggleTranslation = () => {
      const lang = store.state.language || 'cn'
      let nextLang = ''
      if (lang === 'cn') {
        nextLang = 'hk'
      } else if (lang === 'hk') {
        nextLang = 'cn'
      }
      locale.value = nextLang
      store.commit('setLanguage', nextLang)
    }

    /* 用户信息 和 模块 -start */
    const user = ref()
    const modules = ref()
    const currentModule = computed(() => store.state.currentModule)
    systemLoginInfo({}, true).then((res) => {
      user.value = res.result.user
      modules.value = res.result.modules || []
    })

    const removePreRoute = () => {
      const routeNames = generateRoute(store.state.menu).map((route) => route.name)
      const willRemoveRoutes = router.getRoutes().filter((route) => routeNames.includes(route.name))
      willRemoveRoutes?.forEach((route) => router.removeRoute(route.name || ''))
    }
    // 模块切换
    const switchModule = (theModule: { code: string }) => {
      const moduleCode = theModule.code
      // 切换模块前，删除之前的路由
      removePreRoute()
      // 切换模块前，动态路由设置为没有
      store.commit('setHadDynamicRoute', false)
      store.commit('setCurrentModule', theModule)
      store.commit('setMenu', [])
      store.commit('setPermissions', [])
      const { origin } = window.location
      window.location.href = `${origin}/${moduleCode}/#/dashboard?theModuleStr=${JSON.stringify(
        theModule
      )}`
    }
    const filteredModules = computed(() =>
      modules.value?.filter((item: { code: string }) => item.code !== currentModule.value.code)
    )

    /* 用户信息 和 模块 -end */

    const isByQiankun = computed(() => store.state.isByQiankun)

    const showChangePwdDialog = ref(false)
    const changePwdBtnLoading = ref(false)

    const changePassRef = ref()
    const changePassForm = ref({
      password: '',
      confirmPassword: '',
    })

    const validatorPassWrod = (rule: object, value: string, callback: any) => {
      const isExtent = /^.{8,16}$/.exec(value)
      const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9a-zA-Z]{8,16}$/
      if (!reg.test(value)) {
        return callback(new Error(t('check_password')))
      }
      if (!isExtent) {
        return callback(new Error(t('check_password')))
      }

      const { password, confirmPassword } = changePassForm.value
      const isExist = password && confirmPassword
      const isUnlikeness = password !== confirmPassword

      if (isExist && isUnlikeness) {
        return callback(new Error(t('inconsistent_passwords')))
      }

      return callback()
    }

    const resetPassRule = ref({
      password: [{ required: true, validator: validatorPassWrod, trigger: 'blur' }],
      confirmPassword: [{ required: true, validator: validatorPassWrod, trigger: 'blur' }],
    })

    const confirmChangePass = () => {
      changePassRef.value.validate((validate: boolean) => {
        if (!validate) {
          return false
        }
        changePwdBtnLoading.value = true

        // console.log('changePassForm.value', changePassForm.value)
        const pramas = JSON.parse(JSON.stringify(changePassForm.value))
        const newPramas = {
          password: passwordEncrypt(pramas.password),
          confirmPassword: passwordEncrypt(pramas.confirmPassword),
        }
        // console.log('newPramas', newPramas)
        changePassword(newPramas)
          .then((res) => {
            if (res.code === 0) {
              ElMessage.success(t('change_password_success'))
              store.dispatch('logout')
              router.push(`/login`)
            }
          })
          .finally(() => {
            changePwdBtnLoading.value = false
          })
      })
    }

    const closeChangePwdDialog = () => {
      changePassRef.value.resetFields()
    }

    return {
      getAssetPath,
      isCollapse,
      toggleCollapse,
      toLogout,
      toggleTranslation,
      user,
      switchModule,
      filteredModules,
      isByQiankun,
      showChangePwdDialog,
      changePwdBtnLoading,
      changePassRef,
      changePassForm,
      resetPassRule,
      confirmChangePass,
      closeChangePwdDialog,
    }
  },
})
</script>

<style lang="scss" scoped>
.header {
  width: 100%;
  height: 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  box-shadow: 0px 2px 20px 0px rgba(102, 102, 102, 0.2);
  .line {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 1px;
  }
  .header-left {
    .logo {
      display: flex;
      align-items: center;
      img {
        width: 140px;
        margin-left: 20px;
        margin-right: 40px;
      }
      h1 {
        font-size: 24px;
        font-family: PingFangHK, PingFangHK-Medium;
        font-weight: 500;
        color: #000000;
      }
    }
    .collapse-btn {
      padding: 0 20px;
      cursor: pointer;
    }
    h1 {
      font-size: 22px;
    }
  }
  .header-right {
    display: flex;
    align-items: center;
    padding-right: 114px;
    .user-info {
      .item {
        font-size: 15px;
        margin-right: 10px;
      }
    }
    .translation {
      cursor: pointer;
    }
    .user-avator {
      display: flex;
      cursor: pointer;
      color: #212121;
      img {
        display: block;
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }
      .name-role {
        margin-left: 10px;
        padding-top: 2px;
        font-size: 16px;
        color: #212121;
        .name {
          margin-bottom: 5px;
        }
        .role {
          font-size: 14px;
          color: #999999;
        }
      }
    }
  }
}
.dropdown-box {
  .brief-info {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    .avator {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      margin-right: 12px;
    }
    .brief {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .name {
        font-size: 16px;
        font-family: PingFangHK, PingFangHK-Regular;
        color: #212121;
      }
      .role {
        font-size: 14px;
        font-family: PingFangHK, PingFangHK-Regular;
        color: #999999;
      }
      .modify-password {
        font-size: 14px;
        font-family: PingFangSC, PingFangSC-Regular;
        color: #0e67ff;
        cursor: pointer;
      }
    }
  }
  .line {
    height: 1px;
    border: 1px dashed #f4f4f4;
    margin-bottom: 15px;
  }
  .module-list {
    margin: 0 -12px;
    ul {
      padding: 0;
      li {
        font-size: 16px;
        font-family: PingFangHK, PingFangHK-Regular;
        color: #212121;
        height: 44px;
        line-height: 44px;
        cursor: pointer;
        span {
          padding: 0 12px;
        }
        &:hover {
          color: #0e67ff;
          background-color: #e9eaef;
        }
      }
    }
  }
  .logout-box {
    text-align: center;
  }
}
</style>

<template>
  <div class="login-container">
    <div class="logo">
      <img :src="getAssetPath('public-images/logo.svg')" />
    </div>
    <div class="welcome-login">
      <section class="welcome">
        <h4 class="title1">{{ $t('hello') }}</h4>
        <!-- <h2 class="title2">{{ $t('welcome_to_the_system') }}</h2> -->
        <img src="@/assets/images/welcome.svg" class="welcome-login-img" />
      </section>
      <section class="login">
        <div class="login-wrap">
          <h2 class="title">{{ $t('login') }}</h2>
          <el-form ref="loginFormRef" :model="loginForm" :rules="rules" class="login-form">
            <el-form-item prop="username">
              <el-input
                v-model="loginForm.username"
                :placeholder="$t('please_enter_account')"
                class="login-input"
                @keydown.enter="toLogin"
              >
                <template #prepend>
                  <SvgIcon :size="22" :path="IconLoginAccount" />
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="loginForm.password"
                type="password"
                :placeholder="$t('please_enter_password')"
                class="login-input"
                @keydown.enter="toLogin"
              >
                <template #prepend>
                  <SvgIcon :size="22" :path="IconLoginPass" />
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="code">
              <el-input
                v-model="loginForm.code"
                maxlength="6"
                :placeholder="$t('verification_code')"
                class="identifying-input login-input"
                @keydown.enter="toLogin"
              >
                <template #prepend>
                  <SvgIcon :size="22" :path="IconLoginCode" />
                </template>
              </el-input>
              <div class="img-code">
                <img :src="codeUrl" :alt="$t('verification_code')" />
                <el-icon :size="20" class="icon-fresh" @click="getIdentifyingCode">
                  <i-refresh />
                </el-icon>
              </div>
            </el-form-item>
            <el-button type="primary" class="login-btn" @click="toLogin">{{
              $t('login')
            }}</el-button>
          </el-form>
          <div class="language-btns-box">
            <language-btns @btn-click="selecteLang" />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { passwordEncrypt } from '@/utils/common'
import { getAssetPath } from '@/utils/asset-path'
import { getIdentifyingCode as getIdentifyingCodeApi } from '@/api/authority/authority'
import IconLoginAccount from '@/assets/images/login-account.svg'
import IconLoginPass from '@/assets/images/login-pass.svg'
import IconLoginCode from '@/assets/images/login-code.svg'
import LanguageBtns from '@/components/language-btns/language-btns.vue'

export default defineComponent({
  components: {
    LanguageBtns,
  },
  setup() {
    const router = useRouter()
    const { t, locale } = useI18n()

    /* 验证码-start */
    const codeUrl = ref()
    const getIdentifyingCode = () => {
      getIdentifyingCodeApi({ sid: sessionStorage.getItem('codeSid') || '' }).then((res) => {
        codeUrl.value = `data:image/jpeg;base64,${res.result.image}`
        sessionStorage.setItem('codeSid', res.result.sid)
      })
    }
    getIdentifyingCode()
    /* 验证码-end */
    /* 登录-start */
    const store = useStore()
    const loginForm = reactive({
      username: '',
      password: '',
      code: '',
    })
    const rules = {
      username: [{ required: true, message: t('please_enter_account', 2), trigger: 'blur' }],
      password: [{ required: true, message: t('please_enter_password'), trigger: 'blur' }],
      code: [{ required: true, message: t('please_enter_verification_code', 1), trigger: 'blur' }],
    }

    const loginFormRef = ref()
    const toLogin = () => {
      loginFormRef.value?.validate((valid: boolean) => {
        if (valid) {
          // 此处登录api请求
          const data = {
            ...loginForm,
            imgCode: loginForm.code,
            sid: sessionStorage.getItem('codeSid'),
            password: passwordEncrypt(loginForm.password),
          }
          // const name = t('project_module_name')
          // const moduleCode = 'quotation'
          // store.commit('setCurrentModule', { name, code: moduleCode })
          store
            .dispatch('login', data)
            .then(async () => {
              const redirect = router.currentRoute.value.query.redirect as string
              console.log(redirect, '<0-- redirect')
              await store.dispatch('initMultiModuleList', { router, shouldPush: !redirect })
              if (redirect) {
                router.push(redirect)
              } else {
                router.push('/')
              }
            })
            .catch(() => {
              // 登录失败重刷验证码
              getIdentifyingCode()
            })
        }
        console.log('error submit!!')
        return false
      })
    }

    const selecteLang = (lan: { label: string; value: string }) => {
      locale.value = lan.value
      store.commit('setLanguage', lan)
    }

    return {
      selecteLang,
      getAssetPath,
      loginForm,
      rules,
      loginFormRef,
      toLogin,
      getIdentifyingCode,
      codeUrl,
      IconLoginAccount,
      IconLoginPass,
      IconLoginCode,
    }
  },
})
</script>
<style lang="scss" scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

  &::before,
  &::after {
    display: inline-block;
    content: '';
    height: 100%;
  }

  &::before {
    width: 30%;
    background-color: #ecf7ff;
  }

  &::after {
    width: 70%;
    background-color: #e1f2ff;
  }

  .logo {
    position: absolute;
    top: 30px;
    left: 30px;
    z-index: 1000;

    img {
      width: 300px;
    }
  }
}

.welcome-login {
  position: absolute;
  z-index: 1;
  display: flex;
  width: 960px;
  height: 580px;
  background-color: #fdfdfd;
  border-radius: 30px;
  box-shadow: 0px 0px 80px 0px rgba(44, 49, 52, 0.2);
  .welcome,
  .login {
    height: 100%;
    box-sizing: border-box;
  }
}

.welcome {
  width: 400px;
  box-shadow: 0px 0px 80px 0px rgba(162, 190, 210, 0.3);
  background-color: #ffffff;
  border-radius: 30px;
  padding: 101px 0 86px 50px;

  .title1,
  .title2 {
    margin: 0;
    color: #333;
    font-weight: 500;
  }
  .title1 {
    font-size: 24px;
    line-height: 33px;
  }
  .title2 {
    margin: 10px 0 55px;
    font-size: 38px;
    line-height: 53px;
    word-break: break-word;
  }

  .welcome-login-img {
    width: 300px;
    height: 242px;
  }
}

.login {
  width: 560px;
  padding: 40px 100px 83px;
  .login-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;

    .title {
      margin: 0;
      color: #212121;
      font-size: 30px;
      font-weight: 500;
    }

    .language-btns-box {
      align-self: flex-end;
      text-align: center;
    }
  }
}

.login-form {
  margin: 60px 0 22px;
  width: 100%;

  :deep(.el-form-item) {
    margin-bottom: 40px;
    border-bottom: 1px solid #ebebeb;
  }

  :deep(.el-form-item .el-input) {
    width: 100%;
  }

  :deep(.el-form-item__content) {
    margin-bottom: 18px;
  }

  :deep(.el-input-group__prepend) {
    padding: 0;
    width: 40px !important;
    border: none;
    background: inherit;
    box-shadow: none;
  }

  :deep(.el-input__wrapper) {
    box-shadow: none !important;
  }

  :deep(.is-focus) {
    box-shadow: none;
  }

  :deep(.el-input__inner) {
    border: none;
    font-size: 18px;
  }

  :deep(.el-form-item__error) {
    font-size: 14px;
  }

  .img-code {
    display: flex;
    align-items: center;
    position: absolute;
    right: 0;
    .icon-fresh {
      margin-left: 11px;
      margin-right: 11px;
      cursor: pointer;
    }
  }
  .login-btn {
    width: 100%;
    height: 50px;
    border-radius: 7px;
    margin-bottom: 24px;
    font-size: 18px;
  }
}

@media screen and (max-width: 1366px) {
  .welcome-login {
    width: 800px;
    height: 520px;

    .welcome {
      width: 300px;

      .title2 {
        margin: 10px 0;
      }
    }

    .welcome-login-img {
      width: 200px;
    }
  }

  .login {
    width: 500px;
    padding: 40px 100px 83px;
  }

  .login-form {
    margin: 40px 0 20px !important;
    :deep(.el-form-item) {
      margin-bottom: 15px !important;
    }
  }

  .logo {
    img {
      width: 230px !important;
    }
  }
}

@media screen and (max-width: 1024px) {
  .welcome-login {
    width: 700px;
    height: 480px;

    .welcome {
      width: 300px;
    }

    .welcome-login-img {
      width: 150px;
    }
  }

  .login {
    width: 400px;
    padding: 40px 50px 83px;
  }

  .login-form {
    margin: 20px 0 20px !important;

    :deep(.el-form-item) {
      margin-bottom: 15px !important;
    }
  }

  .logo {
    top: 20px;
    left: 20px;

    img {
      width: 230px !important;
    }
  }
}

@media screen and (max-width: 800px) {
  .welcome-login {
    width: 600px;
    height: 440px;

    .welcome-login-img {
      height: 150px;
    }
  }

  .login {
    width: 360px;
    padding: 40px 20px 83px;
  }

  .login-form {
    margin: 20px 0;
    :deep(.el-form-item) {
      margin-bottom: 15px !important;
    }
  }

  .logo {
    top: 15px;
    left: 15px;

    img {
      width: 250px !important;
    }
  }
}
</style>

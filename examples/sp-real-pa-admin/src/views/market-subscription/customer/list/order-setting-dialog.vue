<template>
  <el-dialog
    v-model="dialogTableVisible"
    :close-on-click-modal="false"
    :title="$t('renew_set')"
    center
    width="350px"
    class="renewal-set-dialog"
  >
    <el-form>
      <el-form-item :label="$t('fullName') + ':'">
        <span>{{ currentForm.username }}</span>
      </el-form-item>
      <el-form-item :label="$t('package') + ':'">
        <span>{{ packageItem.packageName }}</span>
      </el-form-item>
      <el-form-item>
        <template #label>
          <span>{{
            packageItem.autoRenew ? $t('enable_automatic_renewal') : $t('disable_automatic_renewal')
          }}</span>
        </template>
        <el-switch v-model="packageItem.autoRenew" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div>
        <el-button @click="dialogClean">{{ $t('cancel') }}</el-button>
        <el-button type="primary" @click="dialogSure">{{ $t('determine') }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { reactive, ref, toRefs, defineComponent } from 'vue'

// 自动取其
import { autoRenewReq } from '@/api/quotation/order'

export default defineComponent({
  name: 'OrderSettingDialog',
  props: {
    sure: Function,
    cancel: {
      type: Function,
      default: () => {},
    },
  },
  setup(props: Record<string, any>) {
    const dialogTableVisible = ref(false)
    const state: { currentForm: Record<string, any>; packageItem: Record<string, any> } = reactive({
      currentForm: {},
      packageItem: {},
    })

    function open(current: Record<string, any>, item: Record<string, any>) {
      dialogTableVisible.value = true
      state.currentForm = current
      state.packageItem = item
    }

    function close() {
      state.currentForm = {}
      dialogTableVisible.value = false
    }

    // 弹窗取消
    function dialogClean() {
      props.cancel(state.currentForm)
      close()
    }

    // 弹窗确认
    function dialogSure() {
      const param: Record<string, any> = {}
      param.packageId = state.packageItem.packageId
      param.autoRenew = state.packageItem.autoRenew
      param.customerId = state.currentForm.id

      autoRenewReq(param).then(() => {
        props.sure(state.currentForm)
      })

      dialogClean()
    }

    return {
      dialogTableVisible,
      open,
      close,
      dialogSure,
      dialogClean,
      ...toRefs(state),
    }
  },
})
</script>

<style lang="scss" scoped>
.renewal-set-dialog {
  :deep(.el-dialog__body) {
    display: flex;
    justify-content: center;
  }
}
</style>

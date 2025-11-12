<template>
  <el-dialog
    v-model="dialogTableVisible"
    :close-on-click-modal="false"
    :title="titleText"
    width="800px"
    center
    @close="resetAll"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="formRules"
      label-width="auto"
      :disabled="formDisabled"
      :inline="false"
      :label-position="labelPosition"
    >
      <el-form-item :label="`${$t('defaultSet', '选择默认套餐')}：`" prop="packageId">
        <el-select
          v-model="form.packageId"
          :placeholder="$t('please_select')"
          :disabled="isLocalFormDisable"
        >
          <el-option
            v-for="item in seletQuotes"
            :key="item?.id"
            :label="item?.name"
            :value="item?.id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <div class="label-form">
        <el-row>
          <el-col :span="24" class="label-col"
            ><el-form-item :label="`${$t('contained_product', '包含产品')}：`" prop="productIds"
              ><span>{{ newSelectItem.products }}</span></el-form-item
            ></el-col
          >
          <el-col :span="10" class="label-col"
            ><el-form-item :label="`${$t('apply_terminal', '适用终端')}：`" prop="terminalStr"
              ><span>{{ newSelectItem.terminalStr }}</span></el-form-item
            ></el-col
          >
          <el-col :span="10" class="label-col"
            ><el-form-item :label="`${$t('usable_region', '可用地区')}：`" prop="regionSelectStr"
              ><span>{{ newSelectItem.regionSelectStr }}</span></el-form-item
            ></el-col
          >
        </el-row>
      </div>
      <el-form-item :label="`${$t('identity', '用户身份')}：`" prop="identity">
        <el-radio-group v-model="form.identity" :disabled="isLocalFormDisable">
          <el-radio label="visitor">{{ $t('visitor', '游客') }}</el-radio>
          <el-radio label="customer">{{ $t('register', '注册用户') }}</el-radio>
          <el-radio label="transaction">{{ $t('transaction', '开户用户') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="`${$t('state')}：`" prop="enable">
        <el-radio-group v-model="form.enable" :disabled="isLocalFormDisable">
          <el-radio :label="true">{{ $t('enabled') }}</el-radio>
          <el-radio :label="false">{{ $t('disable') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <div v-if="type == 'Auditing' || formDisabled" class="audit-form">
        <el-form-item :label="`${$t('audit_status', '审核状态')}：`" prop="isPass">
          <el-radio-group v-model="form.isPass" :disabled="type !== DialogType.Auditing">
            <el-radio :label="true">{{ $t('pass', '通过') }}</el-radio>
            <el-radio :label="false">{{ $t('noPass', '不通过') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="`${$t('reason', '审核原因')}：`" prop="reason">
          <el-input v-model="form.reason" />
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <div v-if="!formDisabled">
        <el-button @click="resetAll">{{ $t('cancel') }}</el-button>
        <el-button type="primary" :loading="loading" @click="editConfirm">{{
          $t('determine')
        }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts">
import { reactive, ref, toRefs, computed, defineComponent, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { selectQuoList, quoSave, quoUpdate, quoReview } from '@/api/quotation/settingQuo'
import CheckLang, { getLangIcon } from '@/components/check-lang/check-lang'

enum DialogType {
  Add = 'Add', // 添加
  Edit = 'Edit', // 编辑
  Detail = 'Detail', // 详情
  Auditing = 'Auditing', // 审核
}

export default defineComponent({
  name: 'EditOrderDialog',
  components: {
    CheckLang,
    Plus,
  },
  props: {
    sure: Function,
  },
  emits: ['getData'],
  setup(_: Record<string, any>, { emit }: Record<string, any>) {
    const { t } = useI18n()
    const labelPosition = ref('left')
    const addText = t('add_setting_title', '设置默认套餐')
    const editText = t('edit_setting_title', '修改默认套餐')
    const detailText = t('detail_setting_title', '默认套餐详情')
    const auditingText = t('audit_setting_title', '审核默认套餐')
    const seletQuotes = ref()
    const dialogTableVisible = ref(false)
    const state = reactive({
      type: DialogType.Add,
      formDisabled: false,
      isLocalFormDisable: false,
    })
    const titleText = computed(() => {
      const obj = {
        [DialogType.Add]: addText,
        [DialogType.Edit]: editText,
        [DialogType.Detail]: detailText,
        [DialogType.Auditing]: auditingText,
      }
      return obj[state.type]
    })
    const formRef = ref()
    const form: Record<string, any> = reactive({
      id: '',
      enable: '',
      identity: '',
      packageId: '',
      isPass: '',
      reason: '',
    })
    const newSelectItem = reactive({
      terminalStr: '',
      products: '',
      regionSelectStr: '',
    })
    const formRules = {
      packageId: {
        required: true,
        trigger: 'change',
        message: t('', '请选择默认套餐'),
      },
      identity: {
        required: true,
        trigger: 'change',
        message: t('', '请选择用户身份'),
      },
      isPass: {
        required: true,
        trigger: 'change',
        message: t('', '请选择审核状态'),
      },
    }

    function open(v?: Record<string, any>, operateStatus?: number | boolean) {
      state.formDisabled = false
      state.isLocalFormDisable = false

      if (v) {
        // t:	1=审核 ; 2=修改 ; 3=查看详情
        if (operateStatus === 1) {
          state.isLocalFormDisable = true
          state.type = DialogType.Auditing
        } else if (operateStatus === 2) {
          state.type = DialogType.Edit
        } else {
          if (v.status == 10) {
            form.isPass = true
          } else {
            form.isPass = false
          }
          state.formDisabled = true
          state.type = DialogType.Detail
        }
        console.log(v, 'sffd')
        form.id = v.id
        form.identity = v.identity
        form.packageId = v.packageId
        form.packageName = v.packageName
        form.enable = v.enable
        form.reason = v.reason
        newSelectItem.terminalStr = v.terminalStr
        newSelectItem.regionSelectStr = v.regionSelectStr
        newSelectItem.products = v.products.map((item: any) => item.name).join(',')
      } else {
        state.type = DialogType.Add
      }
      dialogTableVisible.value = true
    }
    function resetAll() {
      newSelectItem.products = ''
      newSelectItem.terminalStr = ''
      newSelectItem.regionSelectStr = ''
      formRef.value.resetFields()
      Object.keys(form).forEach((key) => (form[key] = ''))
      dialogTableVisible.value = false
    }
    // 弹窗取消
    function dialogClean() {
      ElMessageBox.confirm(t('setTip', '套餐设置成功，是否继续设置套餐？'), {
        confirmButtonText: t('yes', '是'),
        cancelButtonText: t('no', '否'),
        type: 'warning',
      })
        .then(() => {
          newSelectItem.products = ''
          newSelectItem.terminalStr = ''
          newSelectItem.regionSelectStr = ''
          Object.keys(form).forEach((key) => (form[key] = ''))
        })
        .catch(() => {
          dialogTableVisible.value = false
        })
    }

    // 弹窗确认
    function editConfirm() {
      formRef.value.validate((validate: boolean) => {
        if (!validate) {
          return
        }
        dialogSure()
      })
    }

    const loading = ref(false)

    // 请求接口
    function dialogSure() {
      form.type = 1
      if (state.type === DialogType.Add) {
        loading.value = true
        quoSave({
          ...form,
        })
          .then(() => {
            loading.value = false
            // dialogClean()
            dialogTableVisible.value = false
            emit('getData')
          })
          .catch((err) => {
            loading.value = false
            console.log(err)
          })
      } else if (state.type === DialogType.Edit) {
        loading.value = true
        quoUpdate({
          ...form,
        })
          .then(() => {
            loading.value = false
            resetAll()
            emit('getData')
          })
          .catch((err) => {
            loading.value = false
            console.log(err)
          })
      } else if (state.type === DialogType.Auditing) {
        const params = reactive({
          id: form.id,
          isPass: form.isPass,
          reason: form.reason,
        })
        loading.value = true
        quoReview(params)
          .then(() => {
            loading.value = false
            resetAll()
            emit('getData')
          })
          .catch((err) => {
            loading.value = false
            console.log(err)
          })
      }
    }
    watch(
      () => form.packageId,
      (packageId: string) => {
        // console.log(packageId, '监听')
        if (packageId) {
          let newItem = seletQuotes.value.filter((item: any) => item.id == packageId)[0]
          newSelectItem.products = newItem.products.map((item: any) => item?.name).join(',')
          newSelectItem.terminalStr = newItem.terminalStr
          newSelectItem.regionSelectStr = newItem.regionSelectStr
        }
      }
    )
    onMounted(() => {
      //获取选择套餐 enableStatus: '1',
      selectQuoList({
        status: '10',
        defaultAuthorize: true,
        enable: true,
        pageSize: 10000,
      }).then((res) => {
        seletQuotes.value = res.result.records
      })
    })

    return {
      dialogTableVisible,
      open,
      close,
      editConfirm,
      dialogClean,
      titleText,
      DialogType,
      ...toRefs(state),
      form,
      formRules,
      formRef,
      loading,
      Plus,
      labelPosition,
      seletQuotes,
      newSelectItem,
      resetAll,
    }
  },
})
</script>

<style lang="scss" scoped>
.edit-streaming-quote-box {
  display: flex;

  .edit-streaming-quote-box-item {
    display: flex;
    flex-direction: column;
    width: 50%;
  }

  .item-box-right {
    padding: 70px 0 0;
  }

  :deep(.el-form-item--default) {
    margin: 20px 0;
    font-weight: 600;
  }

  :deep(.el-checkbox-group) {
    display: flex;
  }

  :deep(.el-textarea) {
    width: 230px;
  }

  img {
    width: 20px;
    height: 20px;
  }
}

.avatar-uploader {
  :deep(.el-upload-dragger),
  .avatar {
    width: 150px;
    height: 150px;
  }
  .el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
    position: relative;
    bottom: 15px;
    right: 15px;
  }
}

.bg {
  background: #f2f2f5;
}

.lang-image-box {
  :deep(.el-form-item__label) {
    position: relative;
    display: flex;
  }
  .lang-image {
    position: absolute;
    right: 20px;
  }
}
.valid-pic {
  position: absolute;
  bottom: -23px;
  left: 10px;
  font-size: 12px;
  color: #ff0000;
}
.label-form {
  background-color: #e9eaee;
  padding: 5px;
}
.audit-form {
  background-color: #e9eaee;
  padding: 5px;
  margin-bottom: 10px;
}
</style>

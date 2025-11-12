<template>
  <el-dialog
    v-model="dialogTableVisible"
    :close-on-click-modal="false"
    :title="titleText"
    width="800px"
    center
    @close="dialogClean"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="formRules"
      label-width="auto"
      :disabled="formDisabled"
    >
      <el-input v-model="form.id" type="hidden" />
      <!-- <check-lang v-model="lang" /> -->
      <el-form-item :label="`${$t('', '规则名称')}：`" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item :label="`${$t('', '赠送套餐')}：`" prop="packageId">
        <el-select
          v-model="form.packageId"
          :placeholder="$t('please_select')"
          :disabled="isLocalFormDisable"
        >
          <el-option
            v-for="item in quoPackages"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="`${$t('package_cycle', '套餐周期')}：`" prop="cycle">
        <span>{{ cycleText }}</span>
      </el-form-item>
      <el-form-item :label="`${$t('用户所在地区')}：`" prop="regionSelect">
        <el-radio-group v-model="form.regionSelect" :disabled="isLocalFormDisable">
          <el-row>
            <el-col :span="12"
              ><el-radio :label="1">{{ $t('region_mainland') }}</el-radio></el-col
            >
            <!-- <el-col :span="12"
              ><el-radio :label="2">{{ $t('region_HongKong') }}</el-radio></el-col
            >
            <el-col :span="12"
              ><el-radio :label="3">{{ $t('region_global') }}</el-radio></el-col
            > -->
            <el-col :span="12"
              ><el-radio :label="4">{{ $t('region_other') }}</el-radio></el-col
            >
          </el-row>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="`${$t('', '赠送触发点')}：`" prop="condition">
        <el-radio-group v-model="form.condition" :disabled="isLocalFormDisable">
          <el-row>
            <el-col :span="24"
              ><el-radio label="uc_register">{{ $t('注册中台账号') }}</el-radio></el-col
            >
            <el-col :span="24"
              ><el-radio label="bind_trade">{{ $t('绑定交易账号') }}</el-radio></el-col
            >
            <el-col :span="24">
              <el-radio label="login_trade"
                >{{ $t('登录交易账号') }}
                <span class="remark-label">{{
                  $t(`(注：上次赠送未到期之前不会触发重复赠送)`)
                }}</span></el-radio
              >
            </el-col>
          </el-row>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="`${$t('赠送时长')}：`" prop="number">
        <el-radio-group v-model="num" @change="changeSelect">
          <el-radio :label="0">不限</el-radio>
          <el-radio :label="1">自定义</el-radio>
        </el-radio-group>
        <el-input v-if="num != 0" v-model.number="form.number" class="input-num" />
      </el-form-item>
      <div class="input-tip">
        <span class="remark-label">{{
          $t('', '提示：赠送时长设置用户触发赠送时一次送多久，如果是永久赠送，选择不限即可')
        }}</span>
      </div>
      <el-form-item :label="`${$t('赠送期限')}：`" prop="triggerLimit" style="margin-top: 18px">
        <el-radio-group v-model="triggerLimit" @change="changeSelect1">
          <el-radio :label="0">不限</el-radio>
          <el-radio :label="1">自定义</el-radio>
        </el-radio-group>
        <el-tooltip
          class="box-item"
          effect="dark"
          content="赠送期限需大于赠送时长"
          placement="top-start"
        >
          <el-input v-if="triggerLimit != 0" v-model.number="form.triggerLimit" class="input-num" />
        </el-tooltip>

        <div>
          <span class="remark-label">{{
            $t(
              '',
              '提示：赠送期限是指从用户初次触发赠送开始，累计送多长时间举例：用户开户后前6个月每个月登录一次交易账号就赠送，可设置赠送时长1，赠送期限6月'
            )
          }}</span>
        </div>
      </el-form-item>
      <el-form-item :label="`${$t('state')}：`" prop="enable">
        <el-radio-group v-model="form.enable" :disabled="isLocalFormDisable">
          <el-radio :label="true">{{ $t('enabled') }}</el-radio>
          <el-radio :label="false">{{ $t('disable') }}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <div v-if="!formDisabled">
        <el-button @click="dialogClean">{{ $t('cancel') }}</el-button>
        <el-button type="primary" :loading="loading" @click="editConfirm">{{
          $t('determine')
        }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts">
import { reactive, ref, toRefs, computed, onBeforeMount, defineComponent, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Plus } from '@element-plus/icons-vue'
import CheckLang, { getLangIcon } from '@/components/check-lang/check-lang'
import { selectQuoList } from '@/api/quotation/settingQuo'
import { saveList, updateList } from '@/api/quotation/freeQuo'
import { quoList } from '@/api/quotation'

enum DialogType {
  Add = 'Add', // 添加
  Edit = 'Edit', // 编辑
}

export default defineComponent({
  name: 'EditOrderDialog',
  components: {
    CheckLang,
    Plus,
  },
  props: {
    sure: Function,
    cancel: {
      type: Function,
      default: () => {},
    },
  },
  emits: ['getData'],
  setup(_: Record<string, any>, { emit }: Record<string, any>) {
    const { t } = useI18n()
    const addText = t('', '新增赠送规则')
    const editText = t('', '编辑赠送规则')
    const dialogTableVisible = ref(false)
    const num = ref(1)
    const triggerLimit = ref(1)
    const state = reactive({
      type: DialogType.Add,
      formDisabled: false,
      isLocalFormDisable: false,
    })
    const formRef = ref()
    const quoPackages = ref([])
    const form: Record<string, any> = reactive({
      id: '',
      type: 1,
      condition: '',
      enable: true,
      number: '',
      packageId: '',
      regionSelect: '',
      triggerLimit: '',
      name: '',
      cycle: '',
    })
    const cycleText = computed(() => {
      const cycleMap: Record<number, string> = {
        1: t('day'),
        2: t('month'),
        3: t('week'),
      }
      return cycleMap[form.cycle]
    })
    const lang = ref('zh-CN')
    const langIndex = computed(() => {
      const index = form.i18ns.findIndex((item: Record<string, any>) => item.lang === lang.value)
      return index
    })
    const checkLangImage = computed(() => getLangIcon(lang.value))
    const checkTriggerLimit = (rule: any, value: any, callback: any) => {
      console.log('val++++triggerLimit', value, triggerLimit.value)
      if (triggerLimit.value === 0) {
        callback()
        return
      }
      if (!Number.isInteger(value)) {
        callback(new Error('请输入整数'))
      } else {
        if (value < form.number) {
          callback(new Error('赠送期限必须大于等于赠送时长'))
        } else {
          callback()
        }
      }
    }
    const formRules = {
      condition: {
        required: true,
        trigger: 'change',
        message: t('此项必填'),
      },
      number: [
        { required: true, message: '必填' },
        { type: 'number', message: '只能填数字' },
      ],
      packageId: {
        required: true,
        trigger: 'change',
        message: t('此项必填'),
      },
      regionSelect: {
        required: true,
        trigger: 'change',
        message: t('此项必填'),
      },
      triggerLimit: [
        { required: true, message: '必填' },
        { validator: checkTriggerLimit, trigger: 'blur' },
      ],
      name: {
        required: true,
        trigger: 'change',
        message: t('此项必填'),
      },
    }
    function changeSelect(val: any) {
      if (val == 0) {
        formRef.value.clearValidate()
        // formRef.value.resetFields()
        form.number = 0
        form.triggerLimit = 0
        triggerLimit.value = 0
      } else {
        form.number = ''
      }
    }
    function changeSelect1(val: any) {
      if (val == 0) {
        formRef.value.clearValidate()
        // formRef.value.resetFields()
        form.triggerLimit = 0
      } else {
        form.triggerLimit = ''
      }
    }
    function open(v?: Record<string, any>, operateStatus?: number | boolean) {
      state.formDisabled = false
      state.isLocalFormDisable = false

      if (v) {
        if (operateStatus === 2) {
          state.type = DialogType.Edit
          form.id = v.id
          form.condition = v.condition
          form.conditionName = v.conditionName
          form.cycle = v.cycle
          form.enable = v.enable
          form.name = v.name
          form.number = v.number
          form.packageId = v.packageId
          form.packageName = v.packageName
          form.region = v.region
          form.regionSelect = v.regionSelect
          form.regionSelectStr = v.regionSelectStr
          form.regionType = v.regionType
          form.triggerLimit = v.triggerLimit
          num.value = v.number > 0 ? 1 : 0
          triggerLimit.value = v.triggerLimit > 0 ? 1 : 0
        } else {
          state.type = DialogType.Add
        }
      }
      dialogTableVisible.value = true
    }
    const titleText = computed(() => {
      const obj = {
        [DialogType.Add]: addText,
        [DialogType.Edit]: editText,
      }
      return obj[state.type]
    })

    // 弹窗取消
    function dialogClean() {
      formRef.value.resetFields()
      Object.keys(form).forEach((key) => {
        if (key === 'enable') {
          form[key] = true
        } else {
          form[key] = ''
        }
      })
      num.value = 1
      triggerLimit.value = 1

      dialogTableVisible.value = false
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
        const keys = Object.keys(form)
        const prm: any = {}
        keys.forEach((key) => {
          if (key !== 'id') {
            prm[key] = form[key]
          }
        })
        saveList(prm)
          .then(() => {
            dialogClean()
            emit('getData')
          })
          .catch((err) => {
            console.log(err)
          })
          .finally(() => {
            loading.value = false
          })
      } else if (state.type === DialogType.Edit) {
        loading.value = true
        updateList({
          ...form,
        })
          .then(() => {
            dialogClean()
            emit('getData')
          })
          .catch((err) => {
            console.log(err)
          })
          .finally(() => {
            loading.value = false
          })
      }
    }
    const products: Record<string, any> = ref([])
    /**
     * 获取行情套餐
     */
    function selectPackage() {
      //获取选择套餐
      selectQuoList({
        enable: true,
        status: '10',
        defaultAuthorize: 'false',
        pageSize: 10000,
      }).then((res) => {
        quoPackages.value = res.result.records.map((v: any) => ({
          label: v.name,
          value: v.id,
          count: v.count,
        }))
      })
    }
    watch(
      () => form.packageId,
      (packageId: string) => {
        // console.log(packageId, '监听')
        if (packageId) {
          let newItem = quoPackages.value.filter((item: any) => item.value == packageId)[0]
          form.cycle = newItem.count
        }
      }
    )
    onBeforeMount(() => {
      selectPackage()
    })
    return {
      lang,
      checkLangImage,
      langIndex,
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
      quoPackages,
      num,
      triggerLimit,
      changeSelect,
      changeSelect1,
      cycleText,
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
.input-num {
  margin-left: 10px;
}

.remark-label {
  font-size: 10px;
  color: gray;
}

.input-tip {
  margin-left: 120px;
}
</style>

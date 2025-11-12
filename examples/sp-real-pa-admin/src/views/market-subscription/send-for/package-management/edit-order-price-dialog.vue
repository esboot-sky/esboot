<template>
  <el-dialog
    v-model="dialogTableVisible"
    :close-on-click-modal="false"
    :title="titleText"
    width="1200px"
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
      <check-lang v-model="lang" />

      <div class="edit-click-quote-box">
        <div class="edit-click-quote-box-item">
          <el-form-item :label="`${$t('clicks')}：`" prop="count">
            <el-input-number
              v-model="form.count"
              :precision="0"
              :min="1"
              :placeholder="$t('please_enter_clicks_number')"
              :disabled="isLocalFormDisable"
            />
          </el-form-item>
          <el-form-item prop="i18ns" class="lang-image-box">
            <template #label>
              <div>
                <span>{{ $t('package_name') }}：</span>
                <div class="lang-image">
                  <img :src="checkLangImage" alt="" />
                </div>
              </div>
            </template>
            <el-input
              v-model="form.i18ns[langIndex].name"
              maxlength="250"
              :placeholder="$t('package_name')"
              :disabled="isLocalFormDisable"
            />
          </el-form-item>
          <el-form-item class="lang-image-box">
            <template #label>
              <div>
                <span>{{ $t('package_introductions') }}：</span>
                <div class="lang-image">
                  <img :src="checkLangImage" alt="" />
                </div>
              </div>
            </template>
            <el-input
              v-model="form.i18ns[langIndex].remark"
              :placeholder="$t('character_length_hint')"
              maxlength="30"
              show-word-limit
              type="textarea"
              :disabled="isLocalFormDisable"
            />
          </el-form-item>
          <el-form-item :label="`${$t('contained_product')}：`" prop="productIds">
            <el-select
              v-model="form.productIds"
              multiple
              class="m-2"
              :placeholder="$t('please_select')"
              :disabled="isLocalFormDisable"
            >
              <el-option
                v-for="item in products"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="`${$t('apply_terminal')}：`" prop="terminal">
            <el-checkbox-group v-model="form.terminal" :disabled="isLocalFormDisable">
              <el-checkbox :label="1" name="type">{{ $t('mobile_terminal') }}</el-checkbox>
              <el-checkbox :label="2" name="type">{{ $t('pc_software') }}</el-checkbox>
              <!-- <el-checkbox :label="3" name="type">{{ $t('WEB_software') }}</el-checkbox> -->
            </el-checkbox-group>
          </el-form-item>
          <el-form-item :label="`${$t('state')}：`" prop="enable">
            <el-radio-group v-model="form.enable" :disabled="isLocalFormDisable">
              <el-radio :label="true">{{ $t('enabled') }}</el-radio>
              <el-radio :label="false">{{ $t('disable') }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="`${$t('usable_region')}：`" prop="regionSelect">
            <el-radio-group v-model="form.regionSelect" :disabled="isLocalFormDisable">
              <el-radio label="1">{{ $t('region_mainland') }}</el-radio>
              <!-- <el-radio label="2">{{ $t('region_HongKong') }}</el-radio>
              <el-radio label="3">{{ $t('region_global') }}</el-radio> -->
              <el-radio label="4">{{ $t('region_other') }}</el-radio>
            </el-radio-group>
          </el-form-item>

          <div v-if="[DialogType.Auditing, DialogType.Detail].includes(type)" class="bg">
            <el-form-item :label="`${$t('audit_status')}：`" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio :label="10">{{ $t('audit_approve') }}</el-radio>
                <el-radio :label="-10">{{ $t('audit_reject') }}</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item :label="`${$t('audit_reason')}：`" prop="reason">
              <el-input v-model="form.reason" :placeholder="$t('please_enter')" />
            </el-form-item>
          </div>
        </div>

        <div class="edit-click-quote-box-item item-box-right">
          <el-form-item :label="`${$t('currency')}：`" prop="currency">
            <el-radio-group v-model="form.currency" :disabled="isLocalFormDisable">
              <el-radio label="CNY">{{ $t('RMB') }}</el-radio>
              <el-radio label="HKD">{{ $t('HKD') }}</el-radio>
              <el-radio label="USD">{{ $t('USD') }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="`${$t('price')}(${form.currency})：`" prop="price">
            <el-input
              v-model="form.price"
              :placeholder="$t('please_input_unit_price')"
              :disabled="isLocalFormDisable"
            />
          </el-form-item>
          <el-form-item
            :label="`${$t('preferential_price')}(${form.currency})：`"
            prop="specialPrice"
          >
            <el-input
              v-model="form.specialPrice"
              :placeholder="$t('please_enter_preferential_price')"
              :disabled="isLocalFormDisable"
            />
          </el-form-item>
          <el-form-item :label="`${$t('grace_period')}：`" prop="specialDate">
            <el-date-picker
              v-model="form.specialDate"
              type="daterange"
              range-separator="To"
              :start-placeholder="$t('start_date')"
              :end-placeholder="$t('end_date')"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              :disabled="isLocalFormDisable"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item :label="`${$t('effective_time')}：`" prop="enableDate">
            <el-date-picker
              v-model="form.enableDate"
              type="daterange"
              range-separator="To"
              :start-placeholder="$t('start_date')"
              :end-placeholder="$t('end_date')"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              :disabled="isLocalFormDisable"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item :label="`${$t('default_author')}：`" prop="defaultAuthorize">
            <el-switch v-model="form.defaultAuthorize" :disabled="isLocalFormDisable"></el-switch>
          </el-form-item>
        </div>
      </div>
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
import { computed, onBeforeMount, reactive, ref, toRefs, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import { quoSave, quoUpdate, quoReview, productList } from '@/api/quotation/quotation'
import { perfectI18nArray, fillI18ns } from '@/utils'
import CheckLang, { getLangIcon } from '@/components/check-lang/check-lang'

const DialogType = {
  Add: 'Add', // 添加
  Edit: 'Edit', // 编辑
  Detail: 'Detail', // 详情
  Auditing: 'Auditing', // 审核
}

export default defineComponent({
  name: 'EditOrderPriceDialog',
  components: {
    CheckLang,
  },
  props: {
    sure: Function,
    cancel: {
      type: Function,
      default: () => {},
    },
  },
  emits: ['getData'],
  setup(props: Record<string, any>, { emit }: Record<string, any>) {
    const { t } = useI18n()
    const store = useStore()

    const addText = t('add_click_quote_package')
    const editText = t('edit_click_quote_package')
    const detailText = t('view_click_quote_package')
    const auditingText = t('audit_click_quote_package')

    const dialogTableVisible = ref(false)
    const state = reactive({
      type: DialogType.Add,
      formDisabled: false,
      isLocalFormDisable: false,
    })

    const formRef = ref()
    const form: Record<string, any> = reactive({
      id: '',
      count: '',
      name: '',
      currency: 'CNY',
      remark: '',
      price: '',
      i18ns: perfectI18nArray(),
      productIds: [],
      specialPrice: '',
      terminal: [],
      enable: false,
      regionSelect: '',
      defaultAuthorize: false,
      specialDate: [],
      enableDate: [],
      specialEnd: '',
      specialStart: '',
      enableStart: '',
      enableEnd: '',
      status: '',
      reason: '',
      type: 2,
    })

    const lang = ref('zh-CN')
    const langIndex = computed(() => {
      const index = form.i18ns.findIndex((item: Record<string, any>) => item.lang === lang.value)
      return index
    })
    const checkLangImage = computed(() => getLangIcon(lang.value))

    const formRules = {
      count: {
        required: true,
        trigger: 'blur',
        message: '请输入点击数量',
      },
      i18ns: {
        required: true,
        trigger: 'blur',
        validator: (rule: object, value: any[], callback: any) => {
          const { name } = value[langIndex.value]
          if (!name) {
            return callback(new Error(t('please_enter_package_name')))
          }
          return callback()
        },
      },
      currency: {
        required: true,
        trigger: 'change',
        message: t('please_select_currency'),
      },
      productIds: {
        required: true,
        trigger: 'change',
        message: t('please_select_associated_product'),
      },
      terminal: {
        required: true,
        trigger: 'change',
        message: t('please_select_terminal'),
      },
      enable: {
        required: true,
        trigger: 'change',
        message: t('please_select_state'),
      },
      regionSelect: {
        required: true,
        trigger: 'change',
        message: t('please_select_available_region'),
      },
      price: {
        required: true,
        trigger: 'blur',
        message: t('please_input_unit_price'),
      },
      enableDate: {
        required: true,
        trigger: 'change',
        message: t('please_select_effective_time'),
      },
      status: {
        required: true,
        trigger: 'change',
        message: t('please_select_audit_status'),
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
          state.formDisabled = true
          state.type = DialogType.Detail
        }
        form.id = v.id
        form.count = v.count
        form.name = v.name
        form.i18ns = perfectI18nArray(v.i18n)
        form.currency = v.currency
        form.remark = v.remark
        form.price = v.price
        form.productIds = v.products.map((item: any) => item.type)
        form.specialPrice = v.specialPrice
        if (v.terminal) {
          form.terminal = JSON.parse(v.terminal)
        }
        if ([10, -10].includes(v.status)) {
          form.status = v.status
        }
        form.specialDate = [v.specialStart, v.specialEnd]
        form.enable = v.enable
        form.enableDate = [v.enableStart, v.enableEnd]
        form.regionSelect = `${v.regionSelect}`
        form.defaultAuthorize = v.defaultAuthorize
      } else {
        state.type = DialogType.Add
      }
      dialogTableVisible.value = true
    }

    const titleText = computed(() => {
      const obj = {
        [DialogType.Add]: addText,
        [DialogType.Edit]: editText,
        [DialogType.Detail]: detailText,
        [DialogType.Auditing]: auditingText,
      }
      return obj[state.type]
    })

    // 弹窗取消
    function dialogClean() {
      formRef.value.resetFields()

      Object.keys(form).forEach((key) => (form[key] = ''))
      form.currency = 'CNY'
      form.defaultAuthorize = false
      form.specialDate = []
      form.enableDate = []
      form.productIds = []
      form.terminal = []
      form.count = 1
      form.i18ns = perfectI18nArray()

      dialogTableVisible.value = false
    }

    // 弹窗确认
    function editConfirm() {
      formRef.value.validate((validate: boolean) => {
        if (!validate) {
          return
        }

        let error = ''

        const { i18ns } = form
        i18ns.forEach((item: Record<string, any>) => {
          const { name, lang: currentLang } = item
          if (!name) {
            const langArr = store.state.languageList.find(
              (langItem: any[]) => langItem[0] === currentLang
            )
            error = `${t('please_enter')}${langArr[1]}的${t('package_name')}`
          }
        })

        if (error) {
          ElMessage.error(error)
          return
        }

        dialogSure()
      })
    }

    const loading = ref(false)

    // 请求接口
    function dialogSure() {
      form.type = 2
      if (form.specialDate) {
        form.specialStart = form.specialDate[0]
        form.specialEnd = form.specialDate[1]
      }
      if (form.enableDate) {
        form.enableStart = form.enableDate[0]
        form.enableEnd = form.enableDate[1]
      }

      if (state.type === DialogType.Add) {
        loading.value = true
        quoSave({
          ...form,
          i18ns: fillI18ns(form.i18ns),
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
      } else if (state.type === DialogType.Edit) {
        loading.value = true
        quoUpdate({
          ...form,
          i18ns: fillI18ns(form.i18ns),
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
      } else if (state.type === DialogType.Auditing) {
        loading.value = true
        const params = reactive({
          id: form.id,
          isPass: form.status === 10,
          reason: form.reason,
        })
        quoReview(params)
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
    function selectProducts() {
      productList().then((res: any) => {
        products.value = res.result
      })
    }

    onBeforeMount(() => {
      selectProducts()
    })

    return {
      lang,
      langIndex,
      dialogTableVisible,
      open,
      editConfirm,
      dialogClean,
      titleText,
      DialogType,
      products,
      checkLangImage,
      ...toRefs(state),
      form,
      formRules,
      formRef,
      loading,
    }
  },
})
</script>

<style lang="scss" scoped>
.edit-click-quote-box {
  display: flex;

  .edit-click-quote-box-item {
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

  :deep(.el-input-number) {
    width: 199px;

    .el-input {
      width: initial !important;
    }
  }

  img {
    width: 20px;
    height: 20px;
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
</style>

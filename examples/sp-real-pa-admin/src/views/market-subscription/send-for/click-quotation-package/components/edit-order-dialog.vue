<template>
  <!-- 新增点击报价套餐 -->
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
      <el-input v-model="form.id" type="hidden" />
      <check-lang v-model="lang" />

      <div class="edit-streaming-quote-box">
        <div class="edit-streaming-quote-box-item">
          <el-form-item :label="`${$t('default_author')}：`" prop="defaultAuthorize">
            <el-radio-group v-model="form.defaultAuthorize" :disabled="isLocalFormDisable">
              <el-radio :label="true">{{ $t('yes', '是') }}</el-radio>
              <el-radio :label="false">{{ $t('no', '否') }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="form.defaultAuthorize == false"
            class="lang-image-box"
            :prop="'i18ns[' + langIndex + '].path'"
            :rules="{
              required: true,
              message: $t('please_upload_package_image'),
              trigger: 'change',
            }"
          >
            <template #label>
              <div>
                <span>{{ $t('package_image') }}：</span>
                <div class="lang-image">
                  <img :src="checkLangImage" alt="" />
                </div>
              </div>
            </template>
            <el-upload
              class="avatar-uploader"
              drag
              action=""
              :auto-upload="false"
              :show-file-list="false"
              :on-change="handleAvatarSuccess"
            >
              <img
                v-if="form.i18ns[langIndex].path"
                :src="form.i18ns[langIndex].path"
                class="avatar"
              />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
            <div v-if="form.i18ns[langIndex].path" class="valid-pic">
              {{ $t('image_size') }}
            </div>
          </el-form-item>
          <el-form-item
            class="lang-image-box"
            :prop="'i18ns[' + langIndex + '].name'"
            :rules="{
              required: true,
              message: $t('please_enter_package_name'),
              trigger: 'blur',
            }"
          >
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
              :placeholder="$t('please_enter_package_name')"
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
          <el-form-item :label="`${$t('clicks')}：`" prop="count">
            <el-input
              v-model="form.count"
              :disabled="isLocalFormDisable"
              type="number"
              :placeholder="$t('please_enter_clicks_number')"
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

            <el-form-item :label="`${$t('audit_reason')}：`">
              <el-input v-model="form.reason" :placeholder="$t('please_enter')" />
            </el-form-item>
          </div>
        </div>

        <div
          v-if="form.defaultAuthorize === false"
          class="edit-streaming-quote-box-item item-box-right"
        >
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
              type="number"
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
              type="number"
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
import { reactive, ref, toRefs, computed, onBeforeMount, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { Plus } from '@element-plus/icons-vue'

import {
  quoClick,
  quoUpdateClick,
  quoReview,
  // productList,
} from '@/api/quotation/quotation'
import { productList } from '@/api/quotation/quoSeparate'
import { perfectI18nArray, fillByI18ns } from '@/utils'
import { useImageUploader } from '@/utils/image-upload'
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
    cancel: {
      type: Function,
      default: () => {},
    },
  },
  emits: ['getData'],
  setup(_: Record<string, any>, { emit }: Record<string, any>) {
    const { t } = useI18n()

    const dialogTableVisible = ref(false)
    const state = reactive({
      type: DialogType.Add,
      formDisabled: false,
      isLocalFormDisable: false,
    })
    const defaultAuthorize = [
      {
        label: t('yes'),
        value: 'true',
      },
      {
        label: t('no'),
        value: 'false',
      },
    ]
    const formRef = ref()
    const form: Record<string, any> = reactive({
      id: '',
      // count: 2,
      count: '',
      name: '',
      currency: 'CNY',
      remark: '',
      price: '',
      i18ns: perfectI18nArray(),
      productIds: [],
      clicks: '', //点击次数字段待确认
      specialPrice: '',
      terminal: [],
      enable: true,
      regionSelect: '',
      defaultAuthorize: true,
      specialDate: [],
      enableDate: [],
      specialEnd: '',
      specialStart: '',
      enableStart: '',
      enableEnd: '',
      status: '',
      reason: '',
      type: 1,
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
        trigger: 'change',
        message: t('please_enter_clicks_number'),
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
      clicks: {
        required: true,
        trigger: 'change',
        message: t('please_enter_clicks_number'),
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
        form.productIds = v.products.map((item: any) => item.id)
        form.specialPrice = v.specialPrice
        form.reason = v.reason
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
        console.log('form>>>>', form)
      } else {
        state.type = DialogType.Add
      }

      dialogTableVisible.value = true
    }

    // 弹窗取消
    function dialogClean() {
      formRef.value.resetFields()
      Object.keys(form).forEach((key) => (form[key] = ''))
      form.count = 2
      form.currency = 'CNY'
      form.defaultAuthorize = true
      form.specialDate = []
      form.enableDate = []
      form.productIds = []
      form.terminal = []
      form.i18ns = perfectI18nArray([])

      dialogTableVisible.value = false
    }

    const addText = t('add_click_quote_package')
    const editText = t('edit_click_quote_package')
    const detailText = t('view_click_quote_package')
    const auditingText = t('audit_click_quote_package')

    const titleText = computed(() => {
      const obj = {
        [DialogType.Add]: addText,
        [DialogType.Edit]: editText,
        [DialogType.Detail]: detailText,
        [DialogType.Auditing]: auditingText,
      }
      return obj[state.type]
    })

    // 弹窗确认
    function editConfirm() {
      formRef.value.validate((validate: boolean) => {
        if (!validate) {
          return
        }

        fillByI18ns(form.i18ns).then((res) => {
          if (res) {
            form.i18ns = res
          }
          const prompt = titleText.value
          dialogSure(prompt)
        })
      })
    }

    const loading = ref(false)

    // 请求接口
    function dialogSure(prompt: string) {
      form.type = 1
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
        quoClick({
          ...form,
          i18ns: form.i18ns,
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
        quoUpdateClick({
          ...form,
          i18ns: form.i18ns,
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
        const params = reactive({
          id: form.id,
          isPass: form.status === 10,
          reason: form.reason,
        })
        loading.value = true
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
      productList().then((res: any) => (products.value = res.result))
    }

    // 图片上传
    const { uploadImage } = useImageUploader()
    async function handleAvatarSuccess(file: any) {
      const imageUrl = await uploadImage(file)
      if (imageUrl) {
        form.i18ns[langIndex.value].path = imageUrl
      }
    }

    onBeforeMount(() => {
      selectProducts()
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
      products,
      ...toRefs(state),
      form,
      formRules,
      formRef,
      loading,
      handleAvatarSuccess,
      Plus,
      defaultAuthorize,
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
</style>

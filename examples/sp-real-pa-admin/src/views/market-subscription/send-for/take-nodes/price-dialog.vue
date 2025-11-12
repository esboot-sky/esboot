<template>
  <el-dialog
    v-model="dialogTableVisible"
    :close-on-click-modal="false"
    :title="$t('order_click_quote')"
    width="800px"
    center
    @close="dialogClean"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="formRules"
      label-width="auto"
      class="order-click-quote-form"
    >
      <el-form-item prop="cusNo" class="keyword-form-item">
        <el-autocomplete
          v-model="cusNo"
          :fetch-suggestions="querySearchAsync"
          :placeholder="$t('please_enter_account_keyword')"
          @select="handleSelect"
          @change="enableChange"
        />
      </el-form-item>
      <el-form-item :label="`${$t('trading_account')}：`" prop="tradeAccount">
        <el-select v-model="form.tradeAccount" class="m-2" :placeholder="$t('trading_account')">
          <el-option
            v-for="item in userInfo.trades"
            :key="item.tradeAccount"
            :label="item.tradeAccount"
            :value="item.tradeAccount"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="`${$t('middleground_account')}：`">
        <div class="content">{{ userInfo.cusNo }}</div>
      </el-form-item>
      <el-form-item :label="`${$t('fullName')}：`">
        <div class="content">{{ userInfo.username }}</div>
      </el-form-item>
      <el-form-item :label="`${$t('mobile_number')}：`">
        <div class="content">{{ userInfo.mobile }}</div>
      </el-form-item>
      <el-form-item :label="`${$t('nickname')}：`">
        <div class="content">{{ userInfo.nickname }}</div>
      </el-form-item>
      <div class="independent-box">
        <el-form-item :label="`${$t('package_selection')}：`" prop="packageId">
          <el-select
            v-model="form.packageId"
            class="m-2"
            :placeholder="$t('package_selection')"
            @change="selectTaoCan"
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
      </div>

      <div v-show="form.packageId">
        <div class="item-box meal">
          <div class="meal-item">{{ $t('package_product') }}: {{ packageInfo.name }}</div>
          <div class="meal-item">
            {{ $t('usable_range') }}:
            {{ packageInfo.regionType == 1 ? $t('mainland') : $t('global') }}
          </div>
          <div class="meal-item">{{ $t('remote_ierminator') }}:{{ packageInfo.terminalStr }}</div>
          <div class="meal-item">{{ $t('clicks') }}:{{ packageInfo.count }}</div>
          <div class="meal-item">{{ $t('package_price') }}:{{ packageInfo.price }}</div>
          <div class="meal-item">{{ $t('preferential_price') }}:{{ packageInfo.specialPrice }}</div>
          <div class="meal-item">
            {{ $t('effective_date') }}:{{ packageInfo.enableStart }}~{{ packageInfo.enableEnd }}
          </div>
          <div class="meal-item">
            {{ $t('during_preferential') }}:{{ packageInfo.specialStart }}~{{
              packageInfo.specialEnd
            }}
          </div>
        </div>
      </div>

      <el-form-item :label="`${$t('order_quantity')}：`" prop="number">
        <el-input-number
          v-model="form.number"
          :precision="0"
          :placeholder="$t('please_enter_order_quantity')"
          @change="enableChange"
        />
      </el-form-item>
      <el-form-item :label="`${$t('payment_amount')}：`" prop="amount">
        <el-input
          v-model="form.amount"
          :placeholder="$t('please_enter_payment_amount')"
          :disabled="form.isGive"
          @blur="getTip"
        />
      </el-form-item>
      <el-form-item :label="`${$t('money_need_pay')}：`">
        <div class="content">
          {{ (defaultData.amount || 0).toFixed(2) }}
        </div>
      </el-form-item>
      <el-form-item>
        <el-checkbox
          v-model="form.isGive"
          :label="$t('presented')"
          size="large"
          @change="changeAmount"
        ></el-checkbox>
      </el-form-item>
    </el-form>

    <template #footer>
      <div>
        <el-button @click="dialogClean">{{ $t('cancel') }}</el-button>
        <el-button type="primary" :loading="loading" @click="editConfirm">{{
          $t('determine')
        }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { onBeforeMount, reactive, ref, toRefs, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  save,
  quoList,
  searchCondition,
  getPackageInfo,
  verifyOrder,
} from '@/api/quotation/quotation'
import { ElMessage } from 'element-plus'

// eslint-disable-next-line no-unused-vars
let timeOut

export default defineComponent({
  name: 'PriceDialog',
  props: {
    sure: Function,
    cancel: {
      type: Function,
      default: () => {},
    },
  },
  setup(props: Record<string, any>, { emit }) {
    const { t } = useI18n()

    const dialogTableVisible = ref(false)
    /** 获取客户信息 start */
    const cusNo = ref('')
    const userInfo: Record<string, any> = ref({
      trades: [],
    })
    /** 获取客户信息 end */

    const state: { currentForm: Record<string, any>; packageInfo: Record<string, any> } = reactive({
      currentForm: {},
      name: '',
      value1: '',
      input: '',
      checked1: false,
      checked2: false,
      packageInfo: {},
    })

    const defaultData = ref({
      amount: 0,
      disableStart: false,
      enableEnd: '',
      enableStart: '',
    })

    /** 获取套餐详情 end */
    const form: Record<string, any> = reactive({
      autoRenew: true,
      enableStart: '',
      customerId: 0,
      isGive: true,
      number: 1,
      amount: '',
      packageId: '',
      tradeAccount: '',
    })

    const formRef = ref()
    const formRules = {
      cusNo: {
        required: true,
        trigger: 'change',
        validator: (rule: object, value: any[], callback: any) => {
          if (!cusNo.value) {
            return callback(new Error(t('please_enter_account_keyword')))
          }
          return callback()
        },
      },
      tradeAccount: {
        required: true,
        trigger: 'change',
        message: `${t('please_select')}${t('trading_account')}`,
      },
      packageId: {
        required: true,
        trigger: 'change',
        message: `${t('please_select')}${t('package')}`,
      },
      number: {
        required: true,
        trigger: 'blur',
        message: t('please_enter_order_quantity'),
      },
      amount: {
        required: true,
        trigger: 'blur',
        message: t('please_enter_payment_amount'),
      },
    }

    function enableChange() {
      if (!cusNo.value || !form.packageId) {
        userInfo.value.cusNo = ''
        userInfo.value.mobile = ''
        userInfo.value.nickname = ''
        return
      }
      verifyOrder({ ...form, num: form.number })
        .then((res) => {
          if (res.result.trades?.length === 1) {
            form.tradeAccount = res.result.trades[0].tradeAccount
          }

          defaultData.value.amount = res.result.amount
          defaultData.value.enableEnd = res.result.enableEnd

          form.amount = res.result.amount
          form.enableStart = res.result.enableStart
        })
        .catch((err) => {
          console.log(err)
        })
    }

    /** 获取套餐详情 start */
    function selectTaoCan(v: any) {
      getPackageInfo({ id: v }).then((res: any) => {
        state.packageInfo = res.result
        enableChange()
      })
    }
    function open() {
      dialogTableVisible.value = true
    }

    function close() {
      state.currentForm = {}
      dialogTableVisible.value = false
    }

    // 弹窗取消
    function dialogClean() {
      cusNo.value = ''
      userInfo.value.cusNo = ''
      userInfo.value.mobile = ''
      userInfo.value.nickname = ''
      defaultData.value.amount = 0
      defaultData.value.enableEnd = ''
      formRef.value.resetFields()
      props.cancel(state.currentForm)
      close()
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

    // 请求接口
    const loading = ref(false)
    function dialogSure() {
      form.enableStart = state.packageInfo.enableStart || ''
      delete form.amount
      loading.value = true
      save({ ...form, num: form.number })
        .then(() => {
          emit('callback')
          dialogClean()
        })
        .finally(() => {
          loading.value = false
        })
    }

    const quoPackages: Record<string, any> = ref([])

    const formData = reactive({
      value: '',
    })

    const options = reactive([
      {
        value: 'Option1',
        label: 'Option1',
      },
      {
        value: 'Option2',
        label: 'Option2',
      },
    ])

    const querySearchAsync = (queryString: any, cd: any) => {
      // 搜索回调函数
      timeOut = setTimeout(() => {
        searchCondition({ cusNo: queryString }).then((res: any) => {
          cd(
            (res.result || []).map((v: any) => ({
              ...v,
              value: v.cusNo,
            }))
          )
        })
      }, 500)
    }

    const handleSelect = (item: any) => {
      form.tradeAccount = ''
      formRef.value.resetFields()

      const { trades = [] } = item
      if (!trades.length) {
        ElMessage.error(t('notradeAccount'))
      } else if (trades.length === 1) {
        form.tradeAccount = item.trades[0].tradeAccount
      }
      userInfo.value = item
      form.customerId = item.id
    }

    /**
     *获取行情套餐
     */
    function selectPackage() {
      quoList({
        type: 2,
        enableStatus: 1,
        status: 10,
      }).then((res: any) => {
        quoPackages.value = res.result.records.map((v: any) => ({ label: v.name, value: v.id }))
      })
    }

    onBeforeMount(() => {
      selectPackage()
    })

    function getTip() {
      if (!state.packageInfo.price) {
        return
      }
      if (+form.amount > state.packageInfo.price * form.number) {
        ElMessage({
          message: t('payExceed'),
          type: 'warning',
        })
      }
    }

    function changeAmount() {
      if (form.isGive) {
        form.amount = 0
      }
    }

    return {
      dialogTableVisible,
      formData,
      options,
      cusNo,
      userInfo,
      quoPackages,
      open,
      close,
      editConfirm,
      changeAmount,
      dialogClean,
      getTip,
      querySearchAsync,
      handleSelect,
      selectTaoCan,
      defaultData,
      enableChange,
      ...toRefs(state),
      form,
      formRef,
      formRules,
      loading,
    }
  },
})
</script>

<style lang="scss" scoped>
.order-click-quote-form {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding-left: 20px;

  .el-form-item {
    align-items: center;
    width: 50%;
    margin: 20px 0;
  }

  .el-form-item__label-wrap {
    font-weight: 600;
  }

  .el-input-number {
    width: 230px;
  }

  .independent-box {
    width: 100%;
  }

  .keyword-form-item {
    :deep(.el-form-item__label-wrap) {
      margin-left: 10px !important;
    }

    :deep(.el-input) {
      width: 290px;
    }
  }
}

.item-box {
  display: flex;
  margin: 20px 0;
  line-height: 30px;

  input {
    width: 200px;
  }

  .title {
    margin-right: 20px;
    width: 120px;
    text-align: right;
    font-weight: 600;
  }

  .content {
    flex: 1;
  }
}

.meal {
  background: #f2f2f2;
  padding: 20px;
  flex-wrap: wrap;

  .meal-item {
    width: 33%;
  }
}
</style>

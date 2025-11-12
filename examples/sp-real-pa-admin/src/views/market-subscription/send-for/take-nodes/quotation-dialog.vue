<template>
  <el-dialog
    v-model="dialogTableVisible"
    :close-on-click-modal="false"
    :title="$t('order_stream_quotes')"
    width="800px"
    center
    @close="dialogClean"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="formRules"
      label-width="auto"
      class="order-stream-quotes-form"
    >
      <div class="independent-box">
        <el-form-item prop="cusNo">
          <el-autocomplete
            v-model="cusNo"
            :fetch-suggestions="querySearchAsync"
            :popper-append-to-body="false"
            :placeholder="$t('please_enter_account_keyword')"
            @select="handleSelect"
            @change="enableChange"
          />
        </el-form-item>
      </div>
      <el-form-item :label="`${$t('middleground_account')}：`">
        <div class="content">{{ userInfo.cusNo }}</div>
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
      <el-form-item :label="`${$t('mobile_number')}：`">
        <div class="content">{{ userInfo.mobile }}</div>
      </el-form-item>
      <el-form-item :label="`${$t('fullName')}：`">
        <div class="content">{{ userInfo.username }}</div>
      </el-form-item>
      <el-form-item :label="`${$t('nickname')}：`">
        <div class="content">{{ userInfo.nickname }}</div>
      </el-form-item>
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

      <div v-if="form.packageId">
        <div class="item-box meal">
          <div class="meal-item">{{ $t('package_product') }}: {{ packageInfo.name }}</div>
          <div class="meal-item">
            {{ $t('usable_range') }}:
            {{ packageInfo.regionSelectStr }}
          </div>
          <div class="meal-item">{{ $t('remote_ierminator') }}: {{ packageInfo.terminalStr }}</div>
          <div class="meal-item">
            {{ $t('package_cycle') }}:
            {{
              packageInfo.count == 1 ? $t('day') : packageInfo.count == 2 ? $t('month') : $t('week')
            }}
          </div>
          <div class="meal-item">{{ $t('package_price') }}: {{ packageInfo.price }}</div>
          <div class="meal-item">
            {{ $t('preferential_price') }}: {{ packageInfo.specialPrice }}
          </div>
          <div class="meal-item">
            {{ $t('effective_date') }}: {{ packageInfo.enableStart }}~{{ packageInfo.enableEnd }}
          </div>
          <div class="meal-item">
            {{ $t('during_preferential') }}: {{ packageInfo.specialStart }}~{{
              packageInfo.specialEnd
            }}
          </div>
        </div>
      </div>

      <el-form-item :label="`${$t('order_quantity')}：`" prop="number">
        <el-input-number
          v-model="form.number"
          :min="1"
          :precision="0"
          :placeholder="$t('please_enter_order_quantity')"
          :disabled="!cusNo || !form.packageId"
          @change="enableChange('order')"
        />
      </el-form-item>
      <el-form-item :label="`${$t('expected_effective_time')}：`" prop="enableStart">
        <el-date-picker
          v-model="form.enableStart"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          :disabled-date="disabledDate"
          :disabled="form.disableStart"
          type="date"
          :placeholder="$t('expected_effective_time')"
          @change="enableChange"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item :label="`${$t('money_need_pay')}：`">
        <div class="content">
          {{ (defaultData.amount || 0).toFixed(2) }}
        </div>
      </el-form-item>
      <el-form-item :label="`${$t('expiration_time')}：`">
        <div class="content">{{ defaultData.enableEnd }}</div>
      </el-form-item>
      <el-form-item :label="`${$t('payment_amount')}：`" prop="amount">
        <el-input
          v-model="form.amount"
          :placeholder="$t('please_enter_payment_amount')"
          :disabled="form.isGive"
          type=""
          @input="getTip"
        />
      </el-form-item>
      <div class="independent-box">
        <el-form-item>
          <el-checkbox
            v-model="form.isGive"
            :label="$t('presented')"
            size="large"
            @change="changeAmount"
          ></el-checkbox>
          <el-checkbox
            v-model="form.autoRenew"
            :label="$t('auto_renewal')"
            size="large"
          ></el-checkbox>
        </el-form-item>
      </div>
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
import { reactive, ref, toRefs, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  save,
  quoList,
  searchCondition,
  getPackageInfo,
  verifyOrder,
} from '@/api/quotation/quotation'
import { availableRegions } from '@/utils/const'

export default defineComponent({
  name: 'QuotationDialog',
  props: {
    sure: Function,
    cancel: {
      type: Function,
      default: () => {},
    },
  },
  setup(props: Record<string, any>, { emit }: Record<string, any>) {
    const { t } = useI18n()
    const loading = ref(false)
    const dialogTableVisible = ref(false)
    const cusNo = ref('')
    const userInfo: Record<string, any> = ref({
      trades: [],
    })
    const state: {
      packageInfo: Record<string, any>
      currentForm: Record<string, any>
    } = reactive({
      currentForm: {},
      name: '',
      value1: '',
      input: '',
      checked1: false,
      checked2: false,
      packageInfo: {},
    })

    const form: Record<string, any> = reactive({
      autoRenew: true,
      customerId: 0,
      enableStart: '',
      isGive: false,
      number: 1,
      packageId: '',
      amount: '',
      tradeAccount: '',
      defaultAuthorize: true,
      disableStart: false,
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
      enableStart: {
        required: true,
        trigger: 'change',
        message: `${t('please_select')}${t('expected_effective_time')}`,
      },
      amount: {
        required: true,
        trigger: 'blur',
        message: t('please_enter_payment_amount'),
      },
    }

    const disabledDate = (time: Date) => {
      return time.getTime() < Date.now() - 24 * 3600 * 1000
    }

    function open(val: any) {
      dialogTableVisible.value = true
      if (val) state.currentForm = JSON.parse(JSON.stringify(val))
    }

    function close() {
      state.currentForm = {}
      dialogTableVisible.value = false
    }

    const defaultData = ref({
      amount: 0,
      disableStart: false,
      enableEnd: '',
      enableStart: '',
    })

    function enableChange(type = '') {
      if (!cusNo.value || !form.packageId) {
        if (type === 'order') return
        userInfo.value.cusNo = ''
        userInfo.value.mobile = ''
        userInfo.value.nickname = ''
        return
      }
      verifyOrder({ ...form, num: form.number })
        .then((res) => {
          form.amount = res.result.amount
          form.enableStart = res.result.enableStart
          form.disableStart = res.result.disableStart

          defaultData.value.amount = res.result.amount
          defaultData.value.enableEnd = res.result.enableEnd
        })
        .catch((err) => {
          console.log(err)
        })
    }

    // 获取套餐详情
    function selectTaoCan(v: number | string) {
      getPackageInfo({ id: v }).then((res: Record<string, any>) => {
        const { result } = res
        console.log('result: ', result)

        result.regionTypeText = availableRegions(result.regionType, t)
        state.packageInfo = result
        enableChange()
      })
    }

    // 弹窗取消
    function dialogClean() {
      cusNo.value = ''
      userInfo.value.cusNo = ''
      userInfo.value.mobile = ''
      userInfo.value.nickname = ''
      form.isGive = false
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
        ElMessageBox.confirm(t('isConfirm_toke_node'), {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          dialogSure()
        })
      })
    }

    // 请求接口
    function dialogSure() {
      loading.value = true
      save({ ...form, num: form.number })
        .then((res) => {
          dialogClean()
          emit('callback')
        })
        .catch((err) => {
          console.log('err::::', err)
        })
        .finally(() => {
          loading.value = false
        })
    }

    // 获取行情套餐
    const quoPackages: Record<string, any> = ref([])
    function selectPackage() {
      quoList({ type: 1, enableStatus: 1, status: 10 }).then((res) => {
        const arr: any = [], list =res.result.records
        list.forEach((item: any) => {
          if(!item.defaultAuthorize) {
            arr.push({
              label: item.name,
              value: item.id,
            })
          }
        })
        quoPackages.value = arr
      })
    }
    selectPackage()
    const formData = reactive({
      value: '',
    })

    const querySearchAsync = async (queryString: string, callback: any) => {
      try {
        const res = await searchCondition({ cusNo: queryString })
        const options = (res.result || []).map((v: Record<string, any>) => ({
          ...v,
          value: v.cusNo,
        }))
        callback(options)
      } catch (error) {
        console.error('查询失败:', error)
      }
    }

    // 获取交易账号
    const handleSelect = (item: Record<string, any>) => {
      const { trades = [] } = item
      if (!trades.length) {
        ElMessage.error(t('notradeAccount'))
        return
      }
      const { tradeAccount } = trades[0]
      form.tradeAccount = tradeAccount
      userInfo.value = item
      form.customerId = item.id
    }

    function LimitedAmountFormat(e: any) {
      let val = e
      val = val.replace(/[^\d.]/g, '') //清除"数字"和"."以外的字符
      val = val.replace(/\.{2,}/g, '.') //只保留第一个. 清除多余的
      val = val.replace(/^0+\./g, '0.')
      val = val.match(/^0+[1-9]+/) ? (val = val.replace(/^0+/g, '')) : val
      val = val.match(/^\d*(\.?\d{0,2})/g)[0] || ''
      return val
    }

    function getTip(e: any) {
      form.amount = LimitedAmountFormat(e)
      if (!state.packageInfo.price) {
        return
      }
      console.log(defaultData.value.amount)
      if (+form.amount > defaultData.value.amount * form.number) {
        ElMessage({
          message: t('payExceed'),
          type: 'warning',
        })
      }
    }

    let oldAmount = 0
    function changeAmount() {
      if (form.isGive) {
        oldAmount = form.amount
        form.amount = 0
        return
      }

      form.amount = oldAmount
    }

    function transformAmount(e) {
      console.log(e)
      if (/^d+$/.test(e)) {
        console.log(e, '<___e')
      }
    }

    return {
      disabledDate,
      dialogTableVisible,
      formData,
      quoPackages,
      transformAmount,
      open,
      close,
      editConfirm,
      dialogClean,
      getTip,
      changeAmount,
      querySearchAsync,
      handleSelect,
      selectTaoCan,
      cusNo,
      userInfo,
      defaultData,
      ...toRefs(state),
      enableChange,
      form,
      formRef,
      formRules,
      loading,
    }
  },
})
</script>

<style lang="scss" scoped>
.order-stream-quotes-form {
  display: flex;
  flex-wrap: wrap;

  :deep(.el-form-item) {
    width: 50%;
    margin: 20px 0;
  }

  :deep(.el-form-item__label) {
    font-weight: 600;
  }

  .independent-box:first-child {
    :deep(.el-form-item__label-wrap) {
      margin-left: 40px !important;
    }
  }

  .independent-box {
    width: 100%;

    :deep(.el-input) {
      width: 290px;
    }

    :deep(.el-form-item) {
      margin: 10px 0;
    }
  }

  .el-input-number {
    width: 230px;
  }
}
.item-box {
  display: flex;
  margin: 20px 0;
  line-height: 30px;

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

<template>
  <el-dialog
    v-model="dialogTableVisible"
    :close-on-click-modal="false"
    :title="$t('audit_order')"
    center
    width="775px"
  >
    <el-form ref="formRef" :model="form" :rules="formRules" label-width="auto">
      <el-input v-model="form.id" type="hidden" />
      <div class="box">
        <div class="item-box">
          <div class="title">{{ $t('middleground_account_five') }}:</div>
          <div class="content">
            <el-input v-model="form.cusNo" disabled />
          </div>
        </div>
      </div>
      <div class="box">
        <div class="item-box">
          <div class="title">
            {{ $t('price') }}( HKD
            {{
              form.type == 1
                ? form.count == 1
                  ? `/${$t('day')}`
                  : form.count == 2
                  ? `/${$t('month')}`
                  : `/${$t('week')}`
                : ''
            }}):
          </div>
          <div class="content">
            <el-input v-model="form.price" disabled />
          </div>
        </div>
        <div class="item-box">
          <div class="title">
            {{ $t('preferential_price') }}( HKD
            {{
              form.type == 1
                ? form.count == 1
                  ? `/${$t('day')}`
                  : form.count == 2
                  ? `/${$t('month')}`
                  : `/${$t('week')}`
                : ''
            }}):
          </div>
          <div class="content">
            <el-input v-model="form.specialPrice" disabled />
          </div>
        </div>
      </div>
      <div class="box">
        <div class="item-box">
          <div class="title">{{ $t('trading_account') }}:</div>
          <div class="content">
            <el-input v-model="form.tradeAccount" disabled />
          </div>
        </div>
      </div>
      <div class="box">
        <div class="item-box">
          <div class="title">{{ $t('fullName') }}:</div>
          <div class="content">
            <el-input
              v-model="form.username"
              size="small"
              :placeholder="$t('please_enter_name')"
              disabled
            />
          </div>
        </div>
        <!-- <div class="item-box">
          <div class="title">{{ $t('package_cycle') }}:</div>
          <div class="content">
            <el-radio-group v-model="form.count" disabled>
              <el-radio :label="2">{{ $t('natural_month') }}</el-radio>
              <el-radio :label="3">{{ $t('week') }}</el-radio>
            </el-radio-group>
          </div>
        </div> -->
      </div>
      <div class="box">
        <div class="item-box">
          <div v-if="form.type == 2" class="title">{{ $t('clicks') }}:</div>
          <div v-if="form.type == 2" class="content">
            <el-input v-model="form.count" disabled />
          </div>
        </div>
      </div>
      <div class="box">
        <div class="item-box" style="width: 80%">
          <div class="title">{{ $t('grace_period') }}:</div>
          <div class="content">
            <el-date-picker
              v-model="form.specialDate"
              type="daterange"
              range-separator="To"
              :start-placeholder="$t('start_date')"
              :end-placeholder="$t('end_date')"
              size="small"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              disabled
            >
            </el-date-picker>
          </div>
        </div>
      </div>
      <div class="box">
        <div class="item-box">
          <div class="title">{{ $t('package_name') }}:</div>
          <div class="content">
            <el-input v-model="form.name" disabled />
          </div>
        </div>
        <div class="item-box">
          <div class="title">{{ $t('quantity_ordered') }}:</div>
          <div class="content">
            <el-input v-model="form.num" disabled />
          </div>
        </div>
      </div>
      <div class="box">
        <div class="item-box">
          <div class="title">{{ $t('apply_terminal') }}:</div>
          <div class="content">
            <el-checkbox-group v-model="form.terminal" disabled>
              <el-checkbox :label="1" name="type">{{ $t('mobile_terminal') }}</el-checkbox>
              <el-checkbox :label="2" name="type">{{ $t('pc_software') }}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
        <div class="item-box">
          <div class="title">{{ $t('effective_time') }}：</div>
          <div class="content">
            <el-input v-model="form.enableStart" disabled />
          </div>
        </div>
      </div>
      <div class="box">
        <div class="item-box">
          <div class="title">{{ $t('state') }}:</div>
          <div class="content">
            <el-radio-group v-model="form.enable" disabled>
              <el-radio :label="true">{{ $t('enabled') }}</el-radio>
              <el-radio :label="false">{{ $t('disable') }}</el-radio>
            </el-radio-group>
          </div>
        </div>
        <div class="item-box">
          <div class="title">{{ $t('expiration_time') }}：</div>
          <div class="content">
            <el-input v-model="form.enableEnd" disabled />
          </div>
        </div>
      </div>
      <div class="box">
        <div class="item-box">
          <div class="title">{{ $t('usable_region') }}:</div>
          <div class="content">
            <el-radio-group v-model="form.regionSelect" disabled>
              <el-radio :label="1">{{ $t('region_mainland') }}</el-radio>
              <!-- <el-radio :label="2">{{ $t('region_HongKong') }}</el-radio>
              <el-radio :label="3">{{ $t('region_global') }}</el-radio> -->
              <el-radio :label="4">{{ $t('region_other') }}</el-radio>
            </el-radio-group>
          </div>
        </div>
        <div class="item-box">
          <div class="title">{{ $t('payment_amount') }}：</div>
          <div class="content">
            <el-input v-model="form.amount" disabled />
          </div>
        </div>
      </div>

      <div class="box">
        <div class="item-box">
          <div class="title">{{ $t('presented') }}:</div>
          <div class="content">
            <el-switch v-model="form.isGive" disabled />
          </div>
        </div>
      </div>
      <div class="box">
        <div class="item-box">
          <div class="title"><span style="color: red">*</span>{{ $t('audit_status') }}:</div>
          <div class="content">
            <el-form-item prop="isPass">
              <el-radio-group v-model="form.isPass">
                <el-radio :label="true">{{ $t('audit_approve') }}</el-radio>
                <el-radio :label="false">{{ $t('audit_reject') }} </el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
        </div>
      </div>
      <div class="box">
        <div class="item-box">
          <div class="title">{{ $t('audit_reason') }}：</div>
          <div class="content">
            <el-input v-model="form.remark" />
          </div>
        </div>
      </div>
    </el-form>
    <template #footer>
      <div>
        <el-button @click="dialogClean">{{ $t('cancel') }}</el-button>
        <el-button type="primary" :loading="isBtnLoading" @click="editConfirm">{{
          $t('determine')
        }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts">
import { reactive, ref, toRefs, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { orderReview } from '@/api/quotation/order'

export default defineComponent({
  name: 'ExamineAndVeriFy',
  props: {
    sure: Function,
    cancel: {
      type: Function,
      default: () => {},
    },
  },
  emits: ['callback'],
  setup(props: Record<string, any>, { emit }: Record<string, any>) {
    const { t } = useI18n()

    const dialogTableVisible = ref(false)
    const state = reactive({
      currentForm: {},
      isBtnLoading: false,
    })

    const form: Record<string, any> = reactive({
      id: '',
      cusNo: '',
      price: '',
      specialPrice: '',
      tradeAccount: '',
      specialDate: [],
      specialEnd: '',
      specialStart: '',
      username: '',
      count: '',
      name: '',
      num: '',
      terminal: [],
      enableStart: '',
      enableEnd: '',
      enable: false,
      amount: '',
      createTime: '',
      regionSelect: 0,
      isGive: false,
      status: 0,
      autoRenew: false,
      remark: '',
      type: '',
      subType: 0,
    })

    const formRef = ref()
    const formRules = {
      isPass: {
        required: true,
        trigger: 'change',
        message: t('please_select_audit_status'),
      },
    }

    function open(v: Record<string, any>) {
      console.log('打开当前数据', v)
      dialogTableVisible.value = true
      form.id = v.id
      form.cusNo = v.customer.cusNo
      form.price = v.qsPackage.price || ''
      form.specialPrice = v.qsPackage.specialPrice || ''
      form.tradeAccount = v.tradeAccount
      form.specialEnd = v.qsPackage.specialEnd || ''
      form.specialStart = v.qsPackage.specialStart || ''
      form.specialDate = [v.qsPackage.specialStart || '', v.qsPackage.specialEnd || '']
      form.username = v.customer.username
      form.count = v.qsPackage.count
      form.name = v.qsPackage.name
      form.num = v.num
      if (v.qsPackage.terminal) {
        form.terminal = JSON.parse(v.qsPackage.terminal)
      }
      form.tbcAmount = v.tbcAmount
      form.enableStart = v.enableStart
      form.enableEnd = v.enableEnd
      form.enable = v.qsPackage.enable
      form.amount = v.amount
      form.regionSelect = v.qsPackage.regionSelect
      form.isGive = v.isGive
      form.status = v.status
      form.remark = v.remark
      form.type = v.type
      form.autoRenew = v.autoRenew
      form.subType = v.subType
      form.createTime = v.createTime
    }

    function close() {
      dialogTableVisible.value = false
    }

    // 弹窗取消
    function dialogClean() {
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
    function dialogSure() {
      state.isBtnLoading = true

      const params = reactive({
        id: form.id,
        isPass: form.isPass,
        reason: form.remark,
      })

      orderReview(params)
        .then(() => {
          dialogClean()
          emit('callback')
        })
        .finally(() => {
          state.isBtnLoading = false
        })
    }

    return {
      dialogTableVisible,
      open,
      close,
      editConfirm,
      dialogClean,
      ...toRefs(state),
      form,
      formRef,
      formRules,
    }
  },
})
</script>

<style lang="scss" scoped>
.box {
  display: flex;

  .item-box {
    width: 50%;
  }
}

.item-box {
  display: flex;
  margin: 20px 0;
  line-height: 30px;

  :deep(.el-input) {
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
}

.meal-item {
  width: 33%;
}
</style>

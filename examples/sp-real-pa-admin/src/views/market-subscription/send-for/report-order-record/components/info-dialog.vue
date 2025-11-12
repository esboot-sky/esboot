<template>
  <el-dialog
    v-model="dialogTableVisible"
    :close-on-click-modal="false"
    :title="$t('details')"
    width="1200px"
  >
    <div class="box">
      <div class="item-box">
        <div class="title">{{ $t('middleground_account_four') }}:</div>
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
      <div class="item-box">
        <div class="title">{{ $t('grace_period') }}:</div>
        <div class="content">
          <el-date-picker
            v-model="form.specialDate"
            type="daterange"
            range-separator="To"
            :start-placeholder="$t('start_date')"
            :end-placeholder="$t('end_date')"
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
        <div class="title">{{ $t('fullName') }}:</div>
        <div class="content">
          <el-input v-model="form.username" :placeholder="$t('please_enter_name')" disabled />
        </div>
      </div>
      <div class="item-box">
        <div v-if="form.type == 1" class="title">{{ $t('package_cycle') }}:</div>
        <div v-if="form.type == 1" class="content">
          <el-radio-group v-model="form.count" disabled>
            <el-radio :label="2">{{ $t('natural_month') }}</el-radio>
            <el-radio :label="3">{{ $t('week') }}</el-radio>
          </el-radio-group>
        </div>
        <div v-if="form.type == 2" class="title">{{ $t('clicks') }}:</div>
        <div v-if="form.type == 2" class="content">
          <el-input v-model="form.count" disabled />
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
        <div class="title">{{ $t('expiration_time') }}：</div>
        <div class="content">
          <el-input v-model="form.enableEnd" :placeholder="$t('please_enter')" disabled />
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
        <div class="title">{{ $t('payment_amount') }}：</div>
        <div class="content">
          <el-input v-model="form.amount" disabled />
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
        <div class="title">{{ $t('take_effect_status') }}：</div>
        <div class="content">
          {{ form.statusStr }}
        </div>
      </div>
    </div>
    <div class="box">
      <div class="item-box">
        <div class="title">{{ $t('presented') }}:</div>
        <div class="content">
          <el-switch v-model="form.isGive" disabled></el-switch>
        </div>
        <!-- <div class="title">{{ $t('auto_renewal') }}:</div>
        <div class="content">
          <el-switch v-model="form.autoRenew" disabled></el-switch>
        </div> -->
      </div>
      <div class="item-box">
        <div class="title">{{ $t('effective_time') }}</div>
        <div class="content">
          <el-input v-model="form.enableStart" disabled />
        </div>
      </div>
    </div>
    <div class="box">
      <div class="item-box">
        <div class="title">{{ $t('subscriber') }}：</div>
        <div class="content">
          <span v-if="form.subType == 0">{{ $t('system') }}</span>
          <span v-if="form.subType == 1">{{ $t('user') }}</span>
          <span v-if="form.subType == 2">{{ $t('admin') }}</span>
        </div>
      </div>
      <div class="item-box">
        <div class="title">{{ $t('replenishment_time') }}</div>
        <div class="content">
          {{ form.createTime }}
        </div>
      </div>
    </div>
    <div class="box">
      <div class="item-box">
        <div class="title">{{ $t('audit_status') }}:</div>
        <div class="content">
          <el-radio-group v-model="form.status" disabled>
            <el-radio :label="10">{{ $t('audit_approve') }}</el-radio>
            <el-radio :label="-10">{{ $t('audit_reject') }}</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="item-box">
        <div class="title">{{ $t('auditor') }}：</div>
        <div class="content">
          {{ form.reviewUserName }}
        </div>
      </div>
    </div>
    <div class="box">
      <div class="item-box">
        <div class="title">{{ $t('audit_reason') }}：</div>
        <div class="content">
          {{ form.remark }}
        </div>
      </div>
      <div class="item-box">
        <div class="title">{{ $t('audit_time') }}：</div>
        <div class="content">
          {{ form.reviewTime }}
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script lang="ts">
import { reactive, ref, toRefs, defineComponent } from 'vue'

export default defineComponent({
  name: 'ExamineAndVeriFy',
  props: {
    sure: Function,
    cancel: {
      type: Function,
      default: () => {},
    },
  },
  setup(props: Record<string, any>) {
    const dialogTableVisible = ref(false)
    const state = reactive({
      currentForm: {},
      name: '',
      value1: '',
      input: '',
      checked1: false,
      checked2: false,
    })

    const form: Record<string, any> = reactive({
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
      regionSelect: 0,
      enableStatus: '',
      isGive: false,
      autoRenew: false,
      createTime: '',
      status: 0,
      reviewUser: '',
      remark: '',
      reviewTime: '',
      type: '',
      subType: 0,
      statusStr: '',
      reviewUserName: '',
    })
    function open(v: Record<string, any>) {
      dialogTableVisible.value = true

      console.log(v, '<___v')

      form.cusNo = v?.customer?.cusNo
      form.price = v.qsPackage.price
      form.specialPrice = v.qsPackage.specialPrice
      form.tradeAccount = v.tradeAccount
      form.specialDate = [v.qsPackage.specialStart, v.qsPackage.specialEnd]
      form.specialEnd = v.qsPackage.specialEnd
      form.specialStart = v.qsPackage.specialStart
      form.username = v?.customer?.username
      form.count = v.qsPackage.count
      form.name = v.qsPackage.name
      form.num = v.num
      if (v.qsPackage.terminal) {
        form.terminal = JSON.parse(v.qsPackage.terminal)
      }
      form.enableStart = v.enableStart
      form.enableEnd = v.enableEnd
      form.enable = v.qsPackage.enable
      form.amount = v.amount
      form.regionSelect = v.qsPackage.regionSelect
      form.isGive = v.isGive
      form.autoRenew = v.autoRenew
      form.createTime = v.createTime
      form.status = v.status
      form.reviewUserName = v.reviewUserName
      form.remark = v.remark
      form.reviewTime = v.reviewTime
      form.type = v.type
      form.subType = v.subType
      form.statusStr = v.statusStr
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
      props.sure(state.currentForm)
      dialogClean()
    }

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

    return {
      dialogTableVisible,
      formData,
      options,
      open,
      close,
      dialogSure,
      dialogClean,
      ...toRefs(state),
      form,
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

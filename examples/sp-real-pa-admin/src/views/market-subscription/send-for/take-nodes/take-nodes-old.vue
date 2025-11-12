<template>
  <div class="page-container">
    <div class="tool">
      <el-button v-permission="'order:save:quo'" type="primary" @click="openAddOrder">{{
        $t('new_order_streaming_quote')
      }}</el-button>
      <el-button v-permission="'order:save:click'" type="primary" @click="openAddOrderPrice">{{
        $t('new_order_click_quotation')
      }}</el-button>
      <el-button v-permission="'order:import'" type="info" @click="openImportDialog">{{
        $t('bulk_import')
      }}</el-button>
      <el-button v-permission="'order:export:list'" type="info" @click="exportFunc">{{
        $t('export')
      }}</el-button>
    </div>
    <el-tabs type="border-card" @tab-click="changeType">
      <el-tab-pane :label="$t('streaming_quote')">
        <div>
          <base-filter
            :config="filterConfig"
            @on-search="searchHandle"
            @on-reset="resetHandle"
          ></base-filter>
          <base-table :config="tableConfig" :pagination="pagination" :is-table-loading="isLoading">
            <template #count>
              <el-table-column align="center" :label="$t('package_cycle')" width="100px">
                <template #default="scope">
                  <div>
                    <span v-if="scope.row.qsPackage?.count == 1">{{ $t('day') }}</span>
                    <span v-if="scope.row.qsPackage?.count == 2">{{ $t('natural_month') }}</span>
                    <span v-if="scope.row.qsPackage?.count == 3">{{ $t('week') }}</span>
                  </div>
                </template>
              </el-table-column>
            </template>

            <template #price>
              <el-table-column align="center" :label="$t('amount')" width="100px">
                <template #default="scope">
                  <div>
                    <span>{{ scope.row.amount }} {{ scope.row.currency }}</span>
                  </div>
                </template>
              </el-table-column>
            </template>

            <template #status>
              <el-table-column align="center" :label="$t('audit_status')" width="100px">
                <template #default="scope">
                  <div>
                    <span v-if="scope.row.status == -10">{{ $t('audit_reject') }}</span>
                    <span v-if="scope.row.status == 0">{{ $t('check_pending') }}</span>
                    <span v-if="scope.row.status == 10">{{ $t('audit_approve') }}</span>
                  </div>
                </template>
              </el-table-column>
            </template>

            <template #subType>
              <el-table-column align="center" :label="$t('subscriber')" width="100px">
                <template #default="scope">
                  <div>
                    <span v-if="scope.row.subType == 0">{{ $t('system') }}</span>
                    <span v-if="scope.row.subType == 1">{{ $t('user') }}</span>
                    <span v-if="scope.row.subType == 2">{{ $t('admin') }}</span>
                  </div>
                </template>
              </el-table-column>
            </template>

            <template #isGive>
              <el-table-column align="center" :label="$t('is_presented')" width="100px">
                <template #default="scope">
                  <div>
                    {{ scope.row.isGive ? $t('yes') : $t('no') }}
                  </div>
                </template>
              </el-table-column>
            </template>

            <template #handler>
              <el-table-column align="center" :label="$t('operate')" width="100px">
                <template #default="scope">
                  <div>
                    <span
                      v-permission="'order:review'"
                      class="text-primary mr10"
                      :class="{ disColor: [10, -10].includes(scope.row.status) }"
                      @click="openExamineAndVeriFyDialog(scope.row)"
                      >{{ $t('audit') }}</span
                    >
                    <span
                      v-permission="'order:detail'"
                      class="text-primary mr10"
                      @click="toInfo(scope.row)"
                      >{{ $t('details') }}</span
                    >
                  </div>
                </template>
              </el-table-column>
            </template>
          </base-table>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="$t('click_quotation')">
        <base-filter
          :config="filterPriceConfig"
          @on-search="searchPriceHandle"
          @on-reset="resetPriceHandle"
        ></base-filter>
        <base-table :config="tablePriceConfig" :pagination="paginationPrice">
          <template #price>
            <el-table-column align="center" :label="$t('amount')" width="100px">
              <template #default="scope">
                <div>
                  <span>{{ scope.row.amount }} {{ scope.row.currency }}</span>
                </div>
              </template>
            </el-table-column>
          </template>

          <template #status>
            <el-table-column align="center" :label="$t('audit_status')" width="100px">
              <template #default="scope">
                <div>
                  <span v-if="scope.row.status == -10">{{ $t('audit_reject') }}</span>
                  <span v-if="scope.row.status == 0">{{ $t('check_pending') }}</span>
                  <span v-if="scope.row.status == 10">{{ $t('audit_approve') }}</span>
                </div>
              </template>
            </el-table-column>
          </template>

          <template #subType>
            <el-table-column align="center" :label="$t('subscriber')" width="100px">
              <template #default="scope">
                <div>
                  <span v-if="scope.row.subType == 0">{{ $t('system') }}</span>
                  <span v-if="scope.row.subType == 1">{{ $t('user') }}</span>
                  <span v-if="scope.row.subType == 2">{{ $t('admin') }}</span>
                </div>
              </template>
            </el-table-column>
          </template>

          <template #isGive>
            <el-table-column align="center" :label="$t('is_presented')" width="100px">
              <template #default="scope">
                <div>
                  {{ scope.row.isGive ? $t('yes') : $t('no') }}
                </div>
              </template>
            </el-table-column>
          </template>

          <template #handler>
            <el-table-column align="center" :label="$t('operate')" width="100px">
              <template #default="scope">
                <div>
                  <span
                    v-permission="'order:review'"
                    class="text-primary mr10"
                    :class="{ disColor: [10, -10].includes(scope.row.status) }"
                    @click="openExamineAndVeriFyDialog(scope.row)"
                    >{{ $t('audit') }}</span
                  >
                  <span
                    v-permission="'order:detail'"
                    class="text-primary mr10"
                    @click="toInfo(scope.row)"
                    >{{ $t('details') }}</span
                  >
                </div>
              </template>
            </el-table-column>
          </template>
        </base-table>
      </el-tab-pane>
    </el-tabs>
    <quotationDialog ref="quotationRef" @callback="getData" />
    <priceDialog ref="priceDialogRef" @callback="getPriceData" />
    <importDialog ref="importDialogRef" @callback="handleRefreshData" />
    <examine-and-veriFy ref="examineAndVeriFyRef" @callback="handleRefreshData" />
    <info-dialog ref="infoRef" />
  </div>
</template>

<script setup lang="ts">
import { reactive, onBeforeMount, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import baseTable from '@/components/base-table/base-table'
import baseFilter from '@/components/base-filter/base-filter'
import quotationDialog from './quotation-dialog.vue'
import priceDialog from './price-dialog.vue'
import importDialog from './import-dialog.vue'
import ExamineAndVeriFy from './examine-and-verify.vue'
import InfoDialog from './info-dialog.vue'

// 订购记录
import { orderListReq, orderListExpor, orderDetail } from '@/api/quotation/order'

// 套餐列表
import { quoList } from '@/api/quotation/quotation'
import { BASE_URL } from '@/api/quotation'
import { formToParams } from '@/utils'

//* ***********************************公共数据 方法
const quotationRef = ref()
const priceDialogRef = ref()
const importDialogRef = ref()
const examineAndVeriFyRef = ref()
const infoRef = ref()
const isLoading = ref<boolean>(false)

const { t } = useI18n()

// 订单类型
let type = 1

function openAddOrder() {
  console.log(quotationRef, 'quotationRef.value ==> quotationRef.value')
  quotationRef.value.open()
}

function openAddOrderPrice() {
  priceDialogRef.value.open()
}

function openImportDialog() {
  importDialogRef.value.open()
}

function openExamineAndVeriFyDialog(v: Record<string, any>) {
  if ([10, -10].includes(v.status)) {
    return
  }
  orderDetail({ id: v.id }).then((res: Record<string, any>) => {
    examineAndVeriFyRef.value.open(res.result)
  })
}

function toInfo(v: Record<string, any>) {
  orderDetail({ id: v.id }).then((res: Record<string, any>) => {
    infoRef.value.open(res.result)
  })
}

/** 模板数据 */

// 行情套餐
const quoPackages = ref([])

// 订购人
const subTypeSelect = [
  {
    label: t('system'),
    value: '0',
  },
  {
    label: t('customer'),
    value: '1',
  },
  {
    label: t('admin'),
    value: '2',
  },
]

// 生效状态
const enableStatusSelect = [
  {
    label: t('executed'),
    value: '1',
  },
  {
    label: t('vacatio_legis'),
    value: '2',
  },
  {
    label: t('expired'),
    value: '5',
  },
  {
    label: t('invalid'),
    value: '3',
  },
  {
    label: t('empty'),
    value: '4',
  },
]

// 审核状态
const statusSelect = [
  {
    label: t('reject'),
    value: '-10',
  },
  {
    label: t('check_pending'),
    value: '0',
  },
  {
    label: t('audit_approve'),
    value: '10',
  },
]

// 是否赠送
const isGiveSelect = [
  {
    label: t('yes'),
    value: 'true',
  },
  {
    label: t('no'),
    value: 'false',
  },
]
// *****************************************串流行情

/** 串流行情 */
const tableConfig = reactive({
  tableProps: {
    data: [],
  },
  customColumns: [
    { label: t('order_number'), prop: 'id', width: '160px' },
    { label: t('middleground_account'), prop: 'customer.cusNo', width: '120px' },
    { label: t('transaction_account'), prop: 'tradeAccount' },
    { label: t('fullName'), prop: 'customer.username' },
    { label: t('nickname'), prop: 'customer.nickname', width: '120px' },
    { label: t('package'), prop: 'qsPackage.name', width: '140px' },
    { slot: 'count' },
    { label: t('order_quantity'), prop: 'num' },
    { slot: 'price' },
    { label: t('expect_take_effect'), prop: 'enableStart', width: '120px' },
    { label: t('maturity_day'), prop: 'enableEnd', width: '120px' },
    { label: t('replenishment_time'), prop: 'createTime', width: '200px' },
    { slot: 'status' },
    { label: t('auditor'), prop: 'reviewUserName' },
    { label: t('take_effect_status'), prop: 'statusStr' },
    { slot: 'subType' },
    { slot: 'isGive' },
    { slot: 'handler' },
  ],
})

const pagination: Record<string, any> = reactive({
  paginationProps: {
    currentPage: 1,
    pageSize: 20,
    total: 0,
  },
  paginationEvent: {
    onSizeChange: (v: number | string) => {
      pagination.paginationProps.pageSize = v
      getData()
    },
    onCurrentChange: (v: number | string) => {
      pagination.paginationProps.currentPage = v
      getData()
    },
  },
})

/** 串流行情表单数据 */
const filterConfig = reactive({
  formProps: {
    model: {},
  },
  // eslint-disable-next-line no-use-before-define
  formItems: [
    {
      prop: 'customerAccount',
      label: t('user_keyword'),
      innerEl: { elType: 'input', props: { placeholder: t('please_enter_account_name_nickName') } },
    },
    {
      prop: 'packageId',
      label: t('market_package'),
      innerEl: {
        elType: 'select',
        options: quoPackages,
      },
    },
    {
      prop: 'subType',
      label: t('subscriber'),
      innerEl: {
        elType: 'select',
        options: subTypeSelect,
      },
    },
    {
      prop: 'status',
      label: t('audit_status'),
      innerEl: {
        elType: 'select',
        options: statusSelect,
      },
    },
    {
      prop: 'enableStatus',
      label: t('take_effect_status'),
      innerEl: {
        elType: 'select',
        options: enableStatusSelect,
      },
    },
    {
      prop: 'isGive',
      label: t('is_presented'),
      innerEl: {
        elType: 'select',
        options: isGiveSelect,
      },
    },
    {
      prop: 'createDate',
      label: t('replenishment_time'),
      innerEl: { elType: 'datePicke', props: { type: 'daterange', valueFormat: 'YYYY-MM-DD' } },
    },
    {
      prop: 'beginDate',
      label: t('starting_time'),
      innerEl: { elType: 'datePicke', props: { type: 'daterange', valueFormat: 'YYYY-MM-DD' } },
    },
    {
      prop: 'expireDate',
      label: t('expiration_time'),
      innerEl: { elType: 'datePicke', props: { type: 'daterange', valueFormat: 'YYYY-MM-DD' } },
    },
  ],
})

/**
 *获取行情套餐
 */
function selectPackage() {
  quoList({ type, status: 10 }).then((res) => {
    quoPackages.value = res.result.records.map((v: any) => ({ label: v.name, value: v.id }))
  })
}

function getData() {
  isLoading.value = true
  type = 1
  const page: Record<string, any> = { type }
  page.pageNum = pagination.paginationProps.currentPage
  page.pageSize = pagination.paginationProps.pageSize

  const data = filterConfig.formProps.model
  console.log(data, '<data')
  orderListReq(formToParams({ ...page, ...data }))
    .then((res) => {
      tableConfig.tableProps.data = res.result.records
      pagination.paginationProps.currentPage = res.result.current
      pagination.paginationProps.pageSize = res.result.size
      pagination.paginationProps.total = res.result.total
      isLoading.value = false
    })
    .catch((err) => {
      console.log(err)
      isLoading.value = false
    })
}

function searchHandle() {
  type = 1
  getData()
}

function resetHandle() {
  getData()
}

// **********************************点击报价
/** 点击报价 */
const tablePriceConfig = reactive({
  tableProps: {
    data: [],
    height: '400',
  },
  customColumns: [
    { label: t('order_number'), prop: 'id' },
    { label: t('middleground_account'), prop: 'customer.cusNo' },
    { label: t('transaction_account'), prop: 'tradeAccount' },
    { label: t('fullName'), prop: 'customer.username' },
    { label: t('nickname'), prop: 'customer.nickname' },
    { label: t('package'), prop: 'qsPackage.name' },
    { label: t('clicks'), prop: 'qsPackage.count' },
    { label: t('order_quantity'), prop: 'num' },
    { slot: 'price' },
    { label: t('replenishment_time'), prop: 'createTime' },
    { slot: 'status' },
    { label: t('auditor'), prop: 'reviewUserName' },
    { label: t('take_effect_status'), prop: 'statusStr' },
    { slot: 'subType' },
    { slot: 'isGive' },
    { slot: 'handler' },
  ],
})

const paginationPrice: Record<string, any> = reactive({
  paginationProps: {
    currentPage: 1,
    pageSize: 20,
    total: 0,
  },
  paginationEvent: {
    onSizeChange: (v: number | string) => {
      paginationPrice.paginationProps.currentPage = v
      getData()
    },
    onCurrentChange: (v: number | string) => {
      paginationPrice.paginationProps.currentPage = v
      getData()
    },
  },
})

/** 点击报价表单数据 */
const filterPriceConfig = reactive({
  formProps: {
    model: {
      createDate: [],
    },
  },
  // eslint-disable-next-line no-use-before-define
  formItems: [
    {
      prop: 'customerAccount',
      label: t('user_keyword'),
      innerEl: { elType: 'input', props: { placeholder: t('please_enter_account_name_nickName') } },
    },
    {
      prop: 'packageId',
      label: t('clickId_market_package'),
      innerEl: {
        elType: 'select',
        options: quoPackages,
      },
    },
    {
      prop: 'subType',
      label: t('subscriber'),
      innerEl: {
        elType: 'select',
        options: subTypeSelect,
      },
    },
    {
      prop: 'status',
      label: t('audit_status'),
      innerEl: {
        elType: 'select',
        options: statusSelect,
      },
    },
    {
      prop: 'isGive',
      label: t('is_presented'),
      innerEl: {
        elType: 'select',
        options: isGiveSelect,
      },
    },
    {
      prop: 'createDate',
      label: t('replenishment_time'),
      innerEl: { elType: 'datePicke', props: { type: 'daterange', valueFormat: 'YYYY-MM-DD' } },
    },
  ],
})

function getPriceData() {
  isLoading.value = true
  type = 2
  const page: Record<string, any> = { type: 2 }
  page.pageNum = paginationPrice.paginationProps.currentPage
  page.pageSize = paginationPrice.paginationProps.pageSize
  const data = filterPriceConfig.formProps.model
  orderListReq({ ...page, ...data })
    .then((res) => {
      tablePriceConfig.tableProps.data = res.result.records
      paginationPrice.paginationProps.currentPage = res.result.current
      paginationPrice.paginationProps.pageSize = res.result.size
      paginationPrice.paginationProps.total = res.result.total
      isLoading.value = false
    })
    .catch((err) => {
      console.log(err)
      isLoading.value = false
    })
}

function searchPriceHandle() {
  type = 2
  getPriceData()
}

function resetPriceHandle() {
  filterPriceConfig.formProps.model.createDate = []
  getPriceData()
}

function changeType(tab: any) {
  if (Number(tab.index) === 0) {
    type = 1
    getData()
  } else {
    type = 2
    getPriceData()
  }
  selectPackage()
}

/** 导出接口 */
function exportFunc() {
  if (type === 1) {
    orderListExpor(
      { ...filterConfig.formProps.model, type },
      `${t('order_history_streaming_quote')}.xls`
    )
  } else {
    orderListExpor(
      { ...filterPriceConfig.formProps.model, type },
      `${t('order_history_click_quotation')}.xls`
    )
  }
}

function handleRefreshData() {
  if (type === 1) {
    return getData()
  }
  return getPriceData()
}

onBeforeMount(() => {
  getData()
})

onMounted(() => {
  selectPackage()
})
</script>

<style lang="scss" scoped>
.tool {
  margin-bottom: 12px;
}
</style>

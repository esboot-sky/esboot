<template>
  <!-- 订购管理-点击报价订购记录 -->
  <div class="page-container">
    <div class="tool operate-buttons">
      <el-button v-permission="'order:save:click'" type="primary" @click="openAddOrder">{{
        $t('new_order_click_quotation')
      }}</el-button>
      <el-button v-permission="'order:import:click'" type="info" @click="openImportDialog">{{
        $t('bulk_import')
      }}</el-button>
      <el-button
        v-permission="'order:export:list:click'"
        type="info"
        :loading="isExportLoading"
        @click="exportFunc"
        >{{ $t('export') }}</el-button
      >
      <el-button
        v-permission="'order:batch:review:click'"
        type="info"
        :loading="isExportLoading"
        @click="reviewBatch"
        >{{ $t('batch_review') }}</el-button
      >
    </div>
    <el-tabs v-model="activeName" type="card" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane :label="$t('allNotes')" name="first"></el-tab-pane>
      <el-tab-pane :label="$t('buyNotes')" name="second"></el-tab-pane>
      <el-tab-pane :label="$t('freeNotes')" name="third"></el-tab-pane>
    </el-tabs>
    <base-filter
      :config="activeName !== 'first' ? newFilterConfig : filterConfig"
      :tab-active="activeName"
      @on-search="searchHandle"
      @on-reset="resetHandle"
    ></base-filter>

    <base-table :config="tableConfig" :pagination="pagination" :is-table-loading="isLoading">
      <template #price>
        <!-- sortable="custom" -->
        <el-table-column align="center" :label="$t('amount')" width="100px" prop="amount">
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
              <span v-if="scope.row.subType == 1">{{ $t('customer') }}</span>
              <span v-if="scope.row.subType == 2">{{ $t('admin') }}</span>
            </div>
          </template>
        </el-table-column>
      </template>

      <template #isGive>
        <el-table-column align="center" :label="$t('is_presented')" width="100px">
          <template #default="scope">
            <div>
              {{ scope.row.isGive == true ? $t('yes') : scope.row.isGive == false ? $t('no') : '' }}
              <!-- {{ scope.row.isGive ? $t('yes') : $t('no') }} -->
            </div>
          </template>
        </el-table-column>
      </template>

      <template #handler>
        <el-table-column align="center" :label="$t('operate')" width="100px" fixed="right">
          <template #default="scope">
            <div v-if="scope.row.cusNo" class="detailBtn">
              <span
                v-permission="'order:review:click'"
                class="text-primary mr10"
                :class="{ disColor: [10, -10].includes(scope.row.status) }"
                @click="openExamineAndVeriFyDialog(scope.row)"
                >{{ $t('audit') }}</span
              >
              <span
                v-permission="'order:detail:click'"
                class="text-primary mr10"
                @click="toInfo(scope.row)"
                >{{ $t('details') }}</span
              >
            </div>
          </template>
        </el-table-column>
      </template>
    </base-table>

    <quotationDialog ref="quotationRef" @callback="getData" />
    <importDialog ref="importDialogRef" @callback="getData" />
    <examine-and-veriFy ref="examineAndVeriFyRef" @callback="getData" />
    <reviewBatchDialog ref="reviewDialogRef" :selected-data="reviewSelection" @callback="getData" />
    <info-dialog ref="infoRef" />
  </div>
</template>

<script setup lang="ts">
import { reactive, onBeforeMount, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { formToParams } from '@/utils'
import { ElMessage } from 'element-plus'
import { exportData } from '@/utils/export-utils'
import InfoDialog from './components/info-dialog.vue'
import { quoListClick } from '@/api/quotation/quotation'
import importDialog from './components/import-dialog.vue'
import baseTable from '@/components/base-table/base-table'
import baseFilter from '@/components/base-filter/base-filter'
import quotationDialog from './components/quotation-dialog.vue'
import ExamineAndVeriFy from './components/examine-and-verify.vue'
import reviewBatchDialog from './components/review-batch-dialog.vue'
import { orderListReqClick, orderDetail } from '@/api/quotation/order'
const infoRef = ref()
const quotationRef = ref()
const importDialogRef = ref()
const examineAndVeriFyRef = ref()
const isLoading = ref<boolean>(false)

const ordering = ref({
  asc: true,
  column: '',
})
const { t } = useI18n()
const activeName = ref('first')

function openAddOrder() {
  quotationRef.value.open()
}

function openImportDialog() {
  importDialogRef.value.open()
}

function openExamineAndVeriFyDialog(v: Record<string, any>) {
  if ([10, -10].includes(v.status)) {
    return
  }
  orderDetail({ id: v.id, isPass: true }).then((res: Record<string, any>) => {
    examineAndVeriFyRef.value.open(res.result)
  })
}

function toInfo(v: Record<string, any>) {
  orderDetail({ id: v.id }).then((res: Record<string, any>) => {
    infoRef.value.open(res.result)
  })
}
//父组件调用子组件的方法
const handleClick = (tab: any) => {
  activeName.value = tab.props.name
  getData()
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

const tableConfig = reactive({
  tableProps: {
    data: [],
    height: '480',
  },
  tableEvent: {
    onSortChange: (column: Record<string, any>) => {
      ordering.value.column = ''
      pagination.paginationProps.currentPage = 1

      const { order, prop } = column
      if (order && prop) {
        const propArr: string[] = prop.split('.')
        const attribute = propArr.length === 1 ? propArr[0] : propArr[1]

        ordering.value = {
          asc: order === 'ascending',
          column: attribute,
        }
      }
      return getData()
    },
    onSelectionChange: (val: any) => {
      reviewSelection.value = val
    },
  },
  customColumns: [
    { type: 'selection', align: 'center' },
    { label: t('order_number'), prop: 'id', width: '160' },
    {
      label: t('middleground_account'),
      prop: 'cusNo',
      width: '120',
    },
    {
      label: t('transaction_account'),
      prop: 'tradeAccount',
      width: '120',
    },
    { label: t('fullName'), prop: 'username' },
    { label: t('nickname'), prop: 'nickname', width: '120' },
    { label: t('package'), prop: 'packageName', width: '140' },
    { label: t('clicks'), prop: 'count', width: '140' },
    { label: t('order_quantity'), prop: 'num', width: '100' },
    { slot: 'price' },
    {
      label: t('replenishment_time'),
      prop: 'createTime',
      width: '200',
    },
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
const commonFormItems = [
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
    prop: 'enableStatus',
    label: t('take_effect_status'),
    innerEl: {
      elType: 'select',
      options: enableStatusSelect,
    },
  },
  {
    prop: 'createDate',
    label: t('replenishment_time'),
    innerEl: { elType: 'datePicke', props: { type: 'daterange', valueFormat: 'YYYY-MM-DD' } },
  },
  // {
  //   prop: 'beginDate',
  //   label: t('starting_time'),
  //   innerEl: { elType: 'datePicke', props: { type: 'daterange', valueFormat: 'YYYY-MM-DD' } },
  // },
  // {
  //   prop: 'expireDate',
  //   label: t('expiration_time'),
  //   innerEl: { elType: 'datePicke', props: { type: 'daterange', valueFormat: 'YYYY-MM-DD' } },
  // },
]

const newFilterConfig = reactive({
  formProps: {
    model: {},
  },
  formItems: [...commonFormItems],
})

const filterConfig = reactive({
  formProps: {
    model: {},
  },
  formItems: [
    ...commonFormItems,
    {
      prop: 'isGive',
      label: t('is_presented'),
      innerEl: {
        elType: 'select',
        options: isGiveSelect,
      },
    },
  ],
})

// 批量审核
const reviewDialogRef = ref()
const reviewSelection = ref([])
function reviewBatch() {
  if (reviewSelection.value.length === 0) {
    ElMessage.warning(t('selectItem'))
    return
  }
  const reviewList = reviewSelection.value.some(
    (val: any) => val.status === 10 || val.status === -10
  )
  if (reviewList) {
    ElMessage.warning(t('please_select_the_order_to_be_audited'))
    return
  }
  reviewDialogRef.value.open()
}

// 获取行情套餐
function selectPackage() {
  quoListClick({ type: 2, status: 10 }).then((res) => {
    quoPackages.value = res.result.records.map((v: any) => ({
      label: v.name,
      value: v.id,
    }))
  })
}

function getData() {
  isLoading.value = true
  const page: Record<string, any> = { type: 2 }
  page.pageNum = pagination.paginationProps.currentPage
  page.pageSize = pagination.paginationProps.pageSize

  if (ordering.value.column) {
    Object.assign(page, {
      orders: [ordering.value],
    })
  }

  const params = Object.assign({}, page, filterConfig.formProps.model)
  if (activeName.value == 'second') {
    params.isGive = 'false'
  } else if (activeName.value == 'third') {
    params.isGive = 'true'
  } else {
    params.isGive = filterConfig.formProps.model.isGive
  }
  orderListReqClick(formToParams(params))
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

/** 导出接口 */
const isExportLoading = ref(false)
const exportFunc = async () => {
  isExportLoading.value = true

  const params = { ...filterConfig.formProps.model, type: 2 }
  if (ordering.value.column) {
    Object.assign(params, {
      orders: [ordering.value],
    })
  }
  await exportData(params, `${t('order_history_click_quotation')}.xls`)
  isExportLoading.value = false
}

function searchHandle() {
  getData()
}

function resetHandle() {
  getData()
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
::v-deep tbody tr:first-child .el-table_1_column_18 .cell {
  display: none !important;
}
</style>

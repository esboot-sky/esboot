<template>
  <!-- 统计报表-点击报价套餐统计 -->
  <el-card>
    <div class="operate-buttons">
      <el-button
        v-permission="'statistics:export:click:product'"
        :loading="exportLoading"
        type="primary"
        size="small"
        @click="exportFunc"
        >{{ $t('export') }}</el-button
      >
    </div>
    <base-filter :config="filterConfig" @on-search="getData" @on-reset="getData" />
    <div class="table">
      <base-table :config="tableConfig" :pagination="pagination" :is-table-loading="isLoading">
        <template #transactionAccount>
          <el-table-column :label="$t('transaction_account')">
            <template #default="scope">
              <p v-for="account in scope.row.tradeAccounts" :key="account">{{ account }}</p>
            </template>
          </el-table-column>
        </template>
      </base-table>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { reactive, onBeforeMount, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { clickProduct, exportClickProduct, quoList, quoListClick } from '@/api/quotation'

import baseFilter from '@/components/base-filter/base-filter'
import baseTable from '@/components/dz-table/dz-table'

const { t } = useI18n()
const isLoading = ref(false)
const packageList = ref([])
const ordering = ref({
  asc: true,
  column: '',
})

const getPackageList = () => {
  quoListClick({ type: 2 }).then((res) => {
    packageList.value = res.result.records.map((v: any) => ({ label: v.name, value: v.id }))
  })
}

// 表单配置
const formItems = [
  {
    prop: 'customerAccount',
    label: t('user_search_keyword'),
    innerEl: { elType: 'input', props: { placeholder: t('please_enter_user_search_keyword') } },
  },
  {
    prop: 'packageId',
    label: t('clickId_market_package'),
    innerEl: {
      elType: 'select',
      options: packageList,
    },
  },
  {
    prop: 'regionSelect',
    label: t('apply_region'),
    innerEl: {
      elType: 'select',
      options: [
        { label: t('region_mainland'), value: 1 },
        // { label: t('region_HongKong'), value: 2 },
        // { label: t('region_global'), value: 3 },
        { label: t('region_other'), value: 4 },
      ],
    },
  },
  {
    prop: 'terminal',
    label: t('apply_terminal'),
    innerEl: {
      elType: 'select',
      options: [
        { label: t('mobile_terminal'), value: 1 },
        { label: t('pc_software'), value: 2 },
        // { label: t('WEB_software'), value: 3 },
      ],
    },
  },
]

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

const tableConfig = reactive({
  tableProps: {
    data: [],
    height: '580',
  },
  tableEvent: {
    onSortChange: (column: Record<string, any>) => {
      const { order, prop } = column
      ordering.value.column = ''
      pagination.paginationProps.currentPage = 1

      if (order) {
        ordering.value = {
          asc: order === 'ascending',
          column: prop,
        }
      }
      return getData()
    },
  },
  customColumns: [
    { label: t('middleground_account'), prop: 'cusNo' },
    { slot: 'transactionAccount' },
    { label: t('fullName'), prop: 'username' },
    { label: t('nickname'), prop: 'nickname' },
    { label: t('package_name'), prop: 'packageName' },
    { label: t('apply_region'), prop: 'regionSelectStr' },
    { label: t('apply_terminal'), prop: 'terminalStr' },
    { label: t('buy_number'), prop: 'purchaseTotal', sortable: 'custom' },
    { label: t('purchased_used'), prop: 'purchaseClickCount', sortable: 'custom' },
    { label: t('remaining_purchases'), prop: 'purchaseSurplusCount', sortable: 'custom' },
    { label: t('presented_number'), prop: 'giveTotal', sortable: 'custom' },
    { label: t('gift_used'), prop: 'giveClickCount', sortable: 'custom' },
    { label: t('give_away_remaining'), prop: 'giveSurplusCount', sortable: 'custom' },
    { label: t('recent_updates'), prop: 'updateTime' },
  ],
})

/** 表单数据 */
const filterConfig = reactive({
  formProps: {
    model: {
      customerAccount: '',
      packageId: '',
      regionSelect: '',
      terminal: '',
    },
  },
  // eslint-disable-next-line no-use-before-define
  formItems,
})

const exportLoading = ref(false)

/** 导出接口 */
function exportFunc() {
  exportLoading.value = true

  const params = { ...filterConfig.formProps.model }
  if (ordering.value.column) {
    Object.assign(params, {
      orders: [ordering.value],
    })
  }

  exportClickProduct(params, `${t('click_quote_statistics')}.xls`).then(() => {
    exportLoading.value = false
  })
}

/**
 * 获取表格数据
 * @param data 传入数据
 */
function getData() {
  isLoading.value = true
  const page: Record<string, any> = {}
  page.pageNum = pagination.paginationProps.currentPage
  page.pageSize = pagination.paginationProps.pageSize

  if (ordering.value.column) {
    Object.assign(page, {
      orders: [ordering.value],
    })
  }

  clickProduct({ ...page, ...filterConfig.formProps.model })
    .then((res: Record<string, any>) => {
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

onMounted(() => {
  getData()
  getPackageList()
})
</script>

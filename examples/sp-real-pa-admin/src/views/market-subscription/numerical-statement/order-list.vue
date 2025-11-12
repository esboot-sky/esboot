<template>
  <!-- 统计报表-套餐订购报表 -->
  <el-card>
    <div class="operate-buttons">
      <el-button
        v-permission="'statistics:export:package'"
        :loading="exportLoading"
        type="primary"
        size="small"
        @click="exportFunc"
        >{{ $t('export') }}</el-button
      >
    </div>

    <base-filter :config="filterConfig" @on-search="getData" @on-reset="resetHandle" />
    <div class="table">
      <base-table :config="tableConfig" :pagination="pagination" :is-table-loading="isLoading">
        <template #isEnable>
          <el-table-column :label="$t('state')" width="100">
            <template #default="scope">
              <span>{{ statusText(scope.row.isEnable) }}</span>
            </template>
          </el-table-column>
        </template>
        <template #type_1>
          <el-table-column :label="$t('package_cycle')" width="100">
            <template #default="scope">
              <span>{{ countTextOne(scope.row.count, scope.row.type) }}</span>
            </template>
          </el-table-column>
        </template>
        <template #productSlot>
          <el-table-column :label="$t('related_products')" width="100">
            <template #default="scope">
              <div>
                <span v-for="product in scope.row.products" :key="product.name">{{
                  product.name
                }}</span>
              </div>
            </template>
          </el-table-column>
        </template>
        <template #type_2>
          <el-table-column :label="$t('clicks')" width="100">
            <template #default="scope">
              <span>{{ countTextTwo(scope.row.count, scope.row.type) }}</span>
            </template>
          </el-table-column>
        </template>
      </base-table>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { reactive, onBeforeMount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import baseFilter from '@/components/base-filter/base-filter'
import baseTable from '@/components/base-table/base-table'

import { packageOrder, orderListExport } from '@/api/quotation'

const { t } = useI18n()

const isLoading = ref(false)
const ordering = ref({
  asc: true,
  column: '',
})

// 表单配置
const formItems = [
  {
    prop: 'createDate',
    label: t('statistical_interval'),
    innerEl: { elType: 'datePicke', props: { type: 'daterange', valueFormat: 'YYYY-MM-DD' } },
  },
  {
    prop: 'packageId',
    innerEl: { elType: 'input', props: { placeholder: t('please_enter_package_name_id') } },
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
      props: {
        clearable: true,
      },
      options: [
        { label: t('mobile_terminal'), value: 1 },
        { label: t('pc_software'), value: 2 },
        // { label: t('WEB_software'), value: 3 },
      ],
    },
  },
  {
    prop: 'status',
    label: t('state'),
    innerEl: {
      elType: 'select',
      options: [
        {
          value: 1,
          label: t('enabled'),
        },
        {
          value: 2,
          label: t('disable'),
        },
        {
          value: 3,
          label: t('invalidation'),
        },
      ],
    },
  },
  {
    prop: 'currency',
    label: t('currency'),
    innerEl: {
      elType: 'select',
      options: [
        {
          value: 'CNY',
          label: t('RMB'),
        },
        {
          value: 'HKD',
          label: t('HKD'),
        },
        {
          value: 'USD',
          label: t('USD'),
        },
      ],
    },
  },
]

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
    { label: t('package_id'), prop: 'id' },
    { label: t('package_name'), prop: 'name' },
    { label: t('state'), prop: 'enableStatus' },
    { slot: 'productSlot' },
    { slot: 'type_1' },
    { slot: 'type_2' },
    { label: t('apply_region'), prop: 'regionSelectStr' },
    { label: t('apply_terminal'), prop: 'terminalStr' },
    { label: t('total_ordering_quantity'), prop: 'orderNum', sortable: 'custom' },
    { label: t('presented_total_number'), prop: 'giveNum', sortable: 'custom' },
    { label: t('currency'), prop: 'currency' },
    { label: t('presented_total_money'), prop: 'giveAmount', sortable: 'custom' },
    { label: t('total_amount_payable_package'), prop: 'tbcAmount', sortable: 'custom' },
    { label: t('total_amount_paid_package'), prop: 'amount', sortable: 'custom' },
  ],
})

/** 表单数据 */
const filterConfig = reactive({
  formProps: {
    model: {},
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

  orderListExport(params, `${t('package_order_report')}.xls`).then(() => {
    exportLoading.value = false
  })
}

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

  packageOrder({ ...page, ...filterConfig.formProps.model })
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

function resetHandle() {
  const page: Record<string, any> = {}
  page.pageNum = pagination.paginationProps.currentPage
  page.pageSize = pagination.paginationProps.pageSize
  const data: Record<string, any> = filterConfig.formProps.model
  delete data.createDate
  packageOrder({ ...page, ...data }).then((res) => {
    tableConfig.tableProps.data = res.result.records
    pagination.paginationProps.currentPage = res.result.current
    pagination.paginationProps.pageSize = res.result.size
    pagination.paginationProps.total = res.result.total
  })
}

onBeforeMount(() => {
  getData()
})

const statusText = (num: boolean) => {
  const text = [t('enabled'), t('disable')]
  return text[num ? 1 : 0]
}

const countTextOne = (count: number, type: number) => {
  // 套餐类型[1:行情套餐 ; 2:点击报价]
  if (type === 1) {
    const text = [t('day'), t('month'), t('week')]
    return text[count - 1]
  }
  return '-'
}

const countTextTwo = (count: number, type: number) => {
  if (type === 2) {
    return count
  }
  return '-'
}
</script>

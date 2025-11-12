<script setup lang="ts">
import { reactive, onBeforeMount, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import baseFilter from '@/components/base-filter/base-filter'
import baseTable from '@/components/base-table/base-table'
import orderSettingDialog from './order-setting-dialog.vue'

// 客户列表
import { customerList, exportCusList } from '@/api/quotation/customer'
// 套餐列表
import { quoList, quoListClick } from '@/api/quotation/quotation'

import { timeDiff } from '@/utils/common'

const { t } = useI18n()
const isLoading = ref<boolean>(false)
const ordering = ref({
  asc: true,
  column: '',
})

// 行情套餐
const setMealSelect = ref([])

const setclickIdSelect = ref([])

// 表单配置
const formItems = [
  {
    prop: 'createDate',
    label: t('registration_time'),
    innerEl: { elType: 'datePicke', props: { type: 'daterange', valueFormat: 'YYYY-MM-DD' } },
  },
  {
    prop: 'packageId',
    // label: t('market_package_text'),
    innerEl: {
      elType: 'select',
      options: setMealSelect,
      props: { placeholder: t('market_package_text') }
    },

  },
  // {
  //   prop: 'clickId',
  //   label: t('clickId_market_package'),
  //   innerEl: {
  //     elType: 'select',
  //     options: setclickIdSelect,
  //   },
  // },
  {
    prop: 'customerAccount',
    // label: t('user_account_keyword'),
    innerEl: { elType: 'input', props: {style: { width: '260px' }, placeholder: t('please_enter_middle_account_keyword') } },
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
      return getData(filterConfig.formProps.model)
    },
  },
  customColumns: [
    { label: t('middleground_account'), prop: 'cusNo', sortable: 'custom' },
    { slot: 'tradeAccount' },
    { label: t('fullName'), prop: 'username' },
    { label: t('nickname'), prop: 'nickname' },
    { label: t('mobile_number'), prop: 'mobile', sortable: 'custom' },
    { label: t('email'), prop: 'email' },
    // { label: t('live_address'), prop: '' }, // 对接字段
    { slot: 'meal' },
    { label: t('registration_time'), prop: 'createTime', sortable: 'custom' },
  ],
})

/** 表单数据 */
const filterConfig = reactive({
  formProps: {
    model: {
      createDate: [],
      packageId: '',
      clickId: '',
      customerAccount: '',
    },
  },
  // eslint-disable-next-line no-use-before-define
  formItems,
})

/** 导出接口 */
const isExportLoading = ref(false)
function exportFunc() {
  const { createDate = [] } = filterConfig.formProps.model
  if (!createDate || !createDate.length) {
    ElMessage.warning(t('export_message'))
    return
  }

  const [beginTime, endTime] = createDate
  if (timeDiff(beginTime, endTime)) {
    ElMessage.warning(t('export_month_message'))
    return
  }

  isExportLoading.value = true

  const params = { ...filterConfig.formProps.model }
  if (ordering.value.column) {
    Object.assign(params, {
      orders: [ordering.value],
    })
  }

  exportCusList(params).then(() => {
    isExportLoading.value = false
  })
}

/**
 * 获取表格数据
 * @param data 传入数据
 */
function getData(data?: Record<string, any>) {

  isLoading.value = true

  const page: Record<string, any> = {}
  page.pageNum = pagination.paginationProps.currentPage
  page.pageSize = pagination.paginationProps.pageSize

  if (ordering.value.column) {
    Object.assign(page, {
      orders: [ordering.value],
    })
  }
  const prm = {...page, ...data}
  const keys = Object.keys(prm)
  const params: any = {}
  keys.forEach(key => {
    if (prm[key]) {
      params[key] = prm[key]
    }
  });


  customerList(params)
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

/**
 *获取行情套餐
 */
function selectPackage() {
  quoList({ type: 1, status: 10, pageSize: 10000 }).then((res) => {
    setMealSelect.value = res.result.records.map((v: any) => ({ label: v.name, value: v.id }))
  })
}

/*
 * 获取点击报价行情套餐
 * */
function selectclickPackage() {
  quoListClick({ type: 2, status: 10, pageSize: 10000 }).then((res) => {
    setclickIdSelect.value = res.result.records.map((v: any) => ({ label: v.name, value: v.id }))
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
      getData(filterConfig.formProps.model)
    },
    onCurrentChange: (v: number | string) => {
      pagination.paginationProps.currentPage = v
      getData(filterConfig.formProps.model)
    },
  },
})

function searchHandle(d: Record<string, any>) {
  !d.createDate && delete d.createDate
  getData(d)
}

function resetHandle() {
  getData()
}

const dialogRef = ref()

function openOrderSetting(row: Record<string, any>, item: Record<string, any>) {
  console.log(row, item)
  dialogRef.value.open(JSON.parse(JSON.stringify(row)), JSON.parse(JSON.stringify(item)))
}

// 弹窗确认
function dialogSure() {
  getData(filterConfig.formProps.model)
}

onBeforeMount(() => {
  getData(filterConfig.formProps.model)
})

onMounted(() => {
  selectPackage()
  selectclickPackage()
})
</script>

<template>
  <el-card>
    <div class="operate-buttons">
      <el-button
        v-permission="'cus:export'"
        type="primary"
        size="small"
        :loading="isExportLoading"
        @click="exportFunc"
        >{{ $t('export') }}</el-button
      >
    </div>
    <base-filter :config="filterConfig" @on-search="searchHandle" @on-reset="resetHandle" />
    <div class="table">
      <base-table :config="tableConfig" :pagination="pagination" :is-table-loading="isLoading">
        <template #meal>
          <el-table-column :label="$t('market_package_text')" align="center">
            <template #default="scope">
              <div v-permission:disabled="'order:auto:renew'" style="color: blue; cursor: pointer">
                <span
                  v-for="(item, i) in scope.row.orders"
                  :key="i"
                  class="market-package"
                  @click="openOrderSetting(scope.row, item)"
                >
                  {{ item.packageName }}
                </span>
              </div>
            </template>
          </el-table-column>
        </template>

        <template #tradeAccount>
          <el-table-column :label="$t('trading_account')" align="center">
            <template #default="scope">
              <div>
                <p v-for="item in scope.row.trades" :key="item">{{ item.tradeAccount }}</p>
              </div>
            </template>
          </el-table-column>
        </template>
      </base-table>
    </div>

    <orderSettingDialog ref="dialogRef" :sure="dialogSure" />
  </el-card>
</template>

<style scoped>
.market-package {
  display: block;
}
</style>

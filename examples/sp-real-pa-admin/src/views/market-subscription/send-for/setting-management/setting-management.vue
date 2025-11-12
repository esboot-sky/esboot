<template>
  <!-- 套餐管理-默认套餐设置 -->
  <div class="page-container">
    <div class="tool operate-buttons">
      <el-button v-permission="'package:default:save'" type="primary" @click="openEditOrder()">{{
        $t('add_setting_title')
      }}</el-button>
    </div>

    <base-filter
      :config="filterConfig"
      @on-search="searchHandle"
      @on-reset="resetHandle"
    ></base-filter>
    <base-table :config="tableConfig" :pagination="pagination" :is-table-loading="isLoading">
      <template #packageName>
        <el-table-column
          align="center"
          :label="$t('package_name')"
          width="200px"
          prop="packageName"
          sortable="custom"
        >
          <template #default="scope">
            <span
              v-permission:disabled="'package:detail'"
              class="text-primary mr10"
              @click="openEditOrder(scope.row, 3)"
            >
              {{ scope.row.packageName }}
            </span>
          </template>
        </el-table-column>
      </template>

      <template #products>
        <el-table-column align="center" :label="$t('contained_product')" width="200px">
          <template #default="scope">
            <div>
              <span v-for="product in scope.row.products" :key="product?.id">{{
                product?.productName
              }}</span>
            </div>
          </template>
        </el-table-column>
      </template>
      <template #identity>
        <el-table-column align="center" :label="$t('identity', '用户身份')" width="100px">
          <template #default="scope">
            <div>
              <span> {{ getUserText(userCards, scope.row.identity) }}</span>
            </div>
          </template>
        </el-table-column>
      </template>

      <template #enable>
        <el-table-column align="center" :label="$t('state')" width="100px">
          <template #default="scope">
            <div>
              {{ getUserText(enableList, scope.row.enable) }}
            </div>
          </template>
        </el-table-column>
      </template>

      <template #status>
        <el-table-column align="center" :label="$t('audit_status')" width="160px">
          <template #default="scope">
            <div>
              <span v-if="scope.row.status == -10">{{ $t('audit_reject') }}</span>
              <span v-if="scope.row.status == 0">{{ $t('in_audit') }}</span>
              <span v-if="scope.row.status == 10">{{ $t('audit_approve') }}</span>
            </div>
          </template>
        </el-table-column>
      </template>

      <template #handler>
        <el-table-column align="center" :label="$t('operate')" width="200px" fixed="right">
          <template #default="scope">
            <div>
              <div>
                <el-button
                  v-permission="'package:default:update'"
                  type="text"
                  class="text-primary mr10"
                  :disabled="scope.row.status !== 0"
                  @click="openEditOrder(scope.row, 2)"
                >
                  <span class="mr10">{{ $t('modify') }}</span>
                </el-button>
                <el-button
                  v-permission="'package:default:delete'"
                  type="text"
                  class="text-primary mr10"
                  :disabled="scope.row.status === 10"
                  @click="deletePackage(scope.row.id)"
                >
                  <span class="mr10">{{ $t('delete') }}</span>
                </el-button>

                <!-- <el-popconfirm
                  key="disable"
                  :title="$t('sure_to_disable_package')"
                  hide-icon
                  :confirm-button-text="$t('determine')"
                  :cancel-button-text="$t('cancel')"
                  @confirm="enablePackage(!scope.row.enable, scope.row.id)"
                >
                  <template #reference>
                      <span v-if="scope.row.enable" v-permission="'package:default:enable'" class="text-primary mr10">{{
                        $t('disable')
                      }}</span>

                  </template>
                </el-popconfirm> -->
                <el-popconfirm
                  key="enable"
                  :title="$t('sure_to_enable_package')"
                  hide-icon
                  :confirm-button-text="$t('determine')"
                  :cancel-button-text="$t('cancel')"
                  @confirm="enablePackage(!scope.row.enable, scope.row.id)"
                >
                  <template #reference>
                    <span v-if="scope.row&&!scope.row.enable">
                       <span v-permission="'package:default:enable'" class="text-primary mr10">{{
                        $t('enabled')
                      }}</span>
                    </span>
                  </template>
                </el-popconfirm>
                <el-button
                  v-permission="'package:default:review'"
                  type="text"
                  class="text-primary mr10"
                  :disabled="scope.row.status !== 0"
                  @click="openEditOrder(scope.row, 1)"
                  >{{ $t('audit') }}</el-button
                >
              </div>
            </div>
          </template>
        </el-table-column>
      </template>
    </base-table>

    <editOrderDialog ref="editOrderRef" @getData="changeType" />
  </div>
</template>

<script setup lang="ts">
import { reactive, onBeforeMount, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import baseTable from '@/components/base-table/base-table'
import baseFilter from '@/components/base-filter/base-filter'
import editOrderDialog from './edit-order-dialog.vue'
import { quoList, deleteReq, enableReq, useCard, selectQuoList } from '@/api/quotation/settingQuo'
import { formToParams } from '@/utils'
import store from "@/store"

const editOrderRef = ref()
const userCards = ref()
const { t } = useI18n()
const isLoading = ref<boolean>(false)
const ordering = ref({
  asc: true,
  column: '',
})


function openEditOrder(v?: Record<string, any>, state?: number | boolean) {
  editOrderRef.value.open(v, state)
}

const quoPackages = ref([])

/** 模板数据 */

// 适用终端
const terminal = [
  {
    label: t('mobile_terminal'),
    value: '1',
  },
  {
    label: t('pc_software'),
    value: '2',
  },
  // { label: t('WEB_software'), value: '3' },
]

// 审核状态
const status = [
  {
    label: t('audit_reject', '审核驳回'),
    value: '-10',
  },
  {
    label: t('in_audit', '审核中'),
    value: '0',
  },
  {
    label: t('audit_approve', '审核通过'),
    value: '10',
  },
]

// 状态，启用，禁用
const enableList = [
  {
    label: t('enabled', '启用'),
    value: true,
  },
  {
    label: t('disable', '禁用'),
    value: false,
  },
]
//可用地区
const regionSelectList = [
  {
    label: t('region_mainland'),
    value: 1,
  },
  // {
  //   label: t('region_HongKong'),
  //   value: 2,
  // },
  // {
  //   label: t('region_global'),
  //   value: 3,
  // },
  {
    label: t('region_other'),
    value: 4,
  },
]
/** 串流行情 */
const tableConfig = reactive({
  tableProps: {
    data: [],
    height: '520',
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
    { label: t('package_id'), prop: 'packageId', minWidth: '160' },
    { slot: 'packageName' },
    { slot: 'products' },
    { label: t('apply_terminal'), prop: 'terminalStr', minWidth: '160' },
    { label: t('usable_region'), prop: 'regionSelectStr', minWidth: '200' },
    // { label: t('', '用户身份'), prop: 'identity', width: '200' },
    { slot: 'identity' },
    { label: t('creation_time'), prop: 'createTime', minWidth: '170', sortable: 'custom' },
    // { label: t('state', '状态'), prop: 'enable', width: '100' },
    { slot: 'enable' },
    { slot: 'status' },
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

/** 表单数据 */
const filterConfig = reactive({
  formProps: {
    model: {},
  },
  // eslint-disable-next-line no-use-before-define
  formItems: [
    {
      prop: 'packageId',
      label: t('package_name', '套餐名称'),
      innerEl: {
        elType: 'select',
        options: quoPackages,
      },
    },
    {
      prop: 'terminal',
      label: t('apply_terminal'),
      innerEl: {
        elType: 'select',
        options: terminal,
      },
    },
    {
      prop: 'regionSelect',
      label: t('area'),
      innerEl: {
        elType: 'select',
        options: regionSelectList,
      },
    },
    {
      prop: 'createDate',
      label: t('creation_time'),
      innerEl: { elType: 'datePicke', props: { type: 'daterange', valueFormat: 'YYYY-MM-DD' } },
    },
    {
      prop: 'enable',
      label: t('state'),
      innerEl: {
        elType: 'select',
        options: enableList,
      },
    },
    {
      prop: 'status',
      label: t('audit_status'),
      innerEl: {
        elType: 'select',
        options: status,
      },
    },
    {
      prop: 'identity',
      label: t('identity', '用户身份'),
      innerEl: {
        elType: 'select',
        options: userCards,
      },
    },
  ],
})
let type = 1

function getData() {
  isLoading.value = true
  // 分页
  const page: { [key: string]: string | number } = {
    type,
  }
  page.pageNum = pagination.paginationProps.currentPage
  page.pageSize = pagination.paginationProps.pageSize

  if (ordering.value.column) {
    Object.assign(page, {
      orders: [ordering.value],
    })
  } else {
    page.orders = [{ asc: false, column: 'createTime' }]
  }

  // 查询条件
  quoList(formToParams({ ...page, ...filterConfig.formProps.model }))
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
    .finally(() => {
      isLoading.value = false
    })
}
//查询
function searchHandle() {
  getData()
}
//重置
function resetHandle() {
  console.log('reset')
  getData()
}

// 删除套餐
function deletePackage(id: number) {
  ElMessageBox.confirm(t('sure_to_delete_package'), t('delete'), {
    confirmButtonText: t('determine'),
    cancelButtonText: t('cancel'),
    type: 'warning',
  }).then(() => {
    deleteReq({ id }).then(() => {
      ElMessage({
        type: 'success',
        message: t('delete_success'),
        onClose: () => {
          getData()
        },
        duration: 1000
      })

    })
  })
}

// 启用禁用
function enablePackage(enable: boolean, id: number): any {
  enableReq({ id, enable }).then(() => {
    getData()
  })
}

function changeType() {
  getData()
}
onBeforeMount(() => {
  getData()
})
onMounted(() => {
  useCard({ types: ['identity'] }).then((res) => {
    let arr = res.result.identity
    userCards.value = arr.map((item: any) => {
      const obj = {
        value: item[0],
        label: item[1],
      }
      return obj
    })
  })
  //获取选择套餐
  selectQuoList({ status: '10', defaultAuthorize: true, enable: true, pageSize: 10000 }).then(
    (res) => {
      quoPackages.value = res.result.records.map((v: any) => ({
        label: v.name,
        value: v.id,
      }))
    }
  )
})
function getUserText(arr: any, value: any) {
  if (!arr) return ''
  let list = arr.filter((item: any) => item.value == value)
  return (list[0] && list[0].label) || ''
}
</script>

<style lang="scss" scoped>
.tool {
  margin-bottom: 12px;
}
</style>

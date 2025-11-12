<template>
  <!-- 套餐管理-赠送规则设置 -->
  <div class="page-container">
    <div class="tool operate-buttons">
      <el-button v-permission="'package:save:quo'" type="primary" @click="openEditOrder()">{{
        $t('', '新增赠送规则')
      }}</el-button>
    </div>

    <base-filter
      :config="filterConfig"
      @on-search="searchHandle"
      @on-reset="resetHandle"
    ></base-filter>
    <base-table :config="tableConfig" :pagination="pagination" :is-table-loading="isLoading">
      <template #enable>
        <el-table-column align="center" :label="$t('state')" width="100px">
          <template #default="scope">
            <div>
              {{ getStatusText(scope.row.enableEnd, scope.row.enable) }}
            </div>
          </template>
        </el-table-column>
      </template>
      <template #cycle>
        <el-table-column align="center" :label="$t('cycle', '套餐周期')" width="100px">
          <template #default="scope">
            <div>
              <span> {{ getUserText(cycles, scope.row.cycle) }}</span>
            </div>
          </template>
        </el-table-column>
      </template>

      <template #status>
        <el-table-column align="center" :label="$t('audit_status')" width="200px">
          <template #default="scope">
            <div>
              <span v-if="scope.row.status == -10">{{ $t('audit_reject') }}</span>
              <span v-if="scope.row.status == 0">{{ $t('in_audit') }}</span>
              <span v-if="scope.row.status == 10">{{ $t('audit_approve') }}</span>
            </div>
          </template>
        </el-table-column>
      </template>

      <template #number>
        <el-table-column align="center" :label="$t('', '赠送时长')" width="100px">
          <template #default="scope">
            <div>
              <span>
                {{
                  scope.row.number === 0
                    ? '不限'
                    : `${scope.row.number}${getUserText(cycles, scope.row.cycle)}`
                }}</span
              >
            </div>
          </template>
        </el-table-column>
      </template>

      <template #triggerLimit>
        <el-table-column align="center" :label="$t('', '赠送期限')" width="100px">
          <template #default="scope">
            <div>
              <span> {{ scope.row.triggerLimit === 0 ? '不限' : scope.row.triggerLimit }}</span>
            </div>
          </template>
        </el-table-column>
      </template>

      <template #handler>
        <el-table-column align="center" :label="$t('operate')" width="260px" fixed="right">
          <template #default="scope">
            <div>
              <div>
                <el-button
                  v-permission="'package:update'"
                  type="text"
                  class="text-primary mr10"
                  :disabled="scope.row.enable !== false"
                  @click="openEditOrder(scope.row, 2)"
                >
                  <span class="mr10">{{ $t('modify') }}</span>
                </el-button>
                <el-button
                  v-if="!scope.row.enable"
                  v-permission="'package:delete'"
                  type="text"
                  class="text-primary mr10"
                  :disabled="scope.row.status === 10"
                  @click="deletePackage(scope.row.id)"
                >
                  <span class="mr10">{{ $t('delete') }}</span>
                </el-button>
                <el-popconfirm
                  v-permission="'package:enable'"
                  :title="$t('', '关闭后不影响已经赠送的用户，是否确认关闭')"
                  hide-icon
                  :confirm-button-text="$t('determine')"
                  :cancel-button-text="$t('cancel')"
                  @confirm="enablePackage(!scope.row.enable, scope.row.id)"
                >
                  <template #reference>
                    <span v-if="scope.row.enable" class="text-primary mr10">{{
                      $t('disable')
                    }}</span>
                  </template>
                </el-popconfirm>
                <el-popconfirm
                  v-permission="'package:enable'"
                  :title="$t('', '是否确认开启')"
                  hide-icon
                  :confirm-button-text="$t('determine')"
                  :cancel-button-text="$t('cancel')"
                  @confirm="enablePackage(!scope.row.enable, scope.row.id)"
                >
                  <template #reference>
                    <span v-if="!scope.row.enable" class="text-primary mr10">{{
                      $t('enabled')
                    }}</span>
                  </template>
                </el-popconfirm>
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
import { reactive, onBeforeMount, ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import baseTable from '@/components/base-table/base-table'
import baseFilter from '@/components/base-filter/base-filter'
import editOrderDialog from './edit-order-dialog.vue'
import { rulesList, deleteList, enableList } from '@/api/quotation/freeQuo'
import { selectQuoList } from '@/api/quotation/settingQuo'
import { formToParams } from '@/utils'
import { quoList } from '@/api/quotation'

const editOrderRef = ref()

const { t } = useI18n()
const isLoading = ref<boolean>(false)
const ordering = ref({
  asc: true,
  column: '',
})

function openEditOrder(v?: Record<string, any>, state?: number | boolean) {
  editOrderRef.value.open(v, state)
}

function getStatusText(enableEndTime: string, enable: boolean) {
  const localeDate = new Date(enableEndTime).toLocaleDateString()
  const enableEndDate = new Date(new Date(localeDate).getTime() + 24 * 60 * 60 * 1000 - 1)
  const currentDate = new Date()

  if (enableEndDate < currentDate) return t('invalidation')

  if (enable) return t('enabled')

  return t('disable')
}

const quoPackages = ref([])

/** 模板数据 */

// 状态，启用，禁用
const enables = [
  {
    label: t('enabled', '启用'),
    value: true,
  },
  {
    label: t('disable', '禁用'),
    value: false,
  },
]
// 套餐周期
const cycles = [
  {
    label: t('day'),
    value: 1,
  },
  {
    label: t('month'),
    value: 2,
  },
  {
    label: t('week'),
    value: 3,
  },
]
// 所属机构
const institutions = [
  {
    label: t('CN'),
    value: '2',
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
    // { label: t('theInstitution'), prop: 'region', width: '140' },
    { label: t('creation_time'), prop: 'createTime', width: '220', sortable: 'custom' },
    { label: t('规则名称'), prop: 'name', width: '160' },
    { label: t('套餐名称'), prop: 'packageName', width: '180' },
    { slot: 'cycle' },
    { label: t('usable_region'), prop: 'regionSelectStr', width: '220' },
    { label: t('赠送触发点'), prop: 'conditionName', width: '180' },
    { slot: 'number' },
    { slot: 'triggerLimit' },
    { slot: 'enable' },
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
    // {
    //   prop: 'region',
    //   label: t('所属机构'),
    //   innerEl: {
    //     elType: 'select',
    //     options: institutions,
    //   },
    // },
    {
      prop: 'createDate',
      label: t('creation_time'),
      innerEl: { elType: 'datePicke', props: { type: 'daterange', valueFormat: 'YYYY-MM-DD' } },
    },
    {
      prop: 'name',
      label: t('规则名称'),
      innerEl: { elType: 'input', props: { placeholder: t('请输入') } },
    },
    {
      prop: 'packageId',
      label: t('赠送套餐'),
      innerEl: {
        elType: 'select',
        options: quoPackages,
      },
    },
    {
      prop: 'regionSelect',
      label: t('用户所在地区'),
      innerEl: {
        elType: 'select',
        options: regionSelectList,
      },
    },

    {
      prop: 'enable',
      label: t('state'),
      innerEl: {
        elType: 'select',
        options: enables,
      },
    },
  ],
})
let type = 1

/**
 * 获取行情套餐
 */
function selectPackage() {
  //获取选择套餐
  selectQuoList({ enable: true, status: '10', defaultAuthorize: 'false', pageSize: 10000 }).then(
    (res) => {
      quoPackages.value = res.result.records.map((v: any) => ({
        label: v.name,
        value: v.id,
      }))
    }
  )
}

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
  }

  // 查询条件
  rulesList(formToParams({ ...page, ...filterConfig.formProps.model }))
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
  getData()
}

function resetHandle() {
  console.log('reset')
  getData()
}

// 删除套餐
function deletePackage(id: number) {
  ElMessageBox.confirm(t('删除后不影响已经赠送的用户，是否确认删除'), t('delete'), {
    confirmButtonText: t('determine'),
    cancelButtonText: t('cancel'),
    type: 'warning',
  }).then(() => {
    deleteList({ id }).then(() => {
      ElMessage({
        type: 'success',
        message: t('delete_success'),
      })
      getData()
    })
  })
}
function getUserText(arr: any, value: any) {
  let list = arr.filter((item: any) => item.value == value)
  return (list[0] && list[0].label) || ''
}

// 启用禁用
function enablePackage(enable: boolean, id: number): any {
  enableList({ id, enable }).then(() => {
    getData()
  })
}

function changeType() {
  getData()
  selectPackage()
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

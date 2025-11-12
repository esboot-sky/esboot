<template>
  <!-- 套餐管理-点击报价套餐 -->
  <div class="page-container">
    <div class="tool operate-buttons">
      <el-button v-permission="'package:save:click'" type="primary" @click="openEditOrder()">{{
        $t('add_click_quote_package')
      }}</el-button>
    </div>

    <base-filter
      :config="filterConfig"
      @on-search="searchHandle"
      @on-reset="resetHandle"
    ></base-filter>
    <base-table :config="tableConfig" :pagination="pagination" :is-table-loading="isLoading">
      <template #price>
        <el-table-column align="center" :label="$t('price')" width="200px" prop="price">
          <template #default="scope">
            <div>
              {{ scope.row.price }}({{ scope.row.currency }} /
              <span v-if="scope.row.count == 1">{{ $t('day') }}</span>
              <span v-if="scope.row.count == 2">{{ $t('month') }}</span>
              <span v-if="scope.row.count == 3">{{ $t('week') }}</span>
              )
            </div>
          </template>
        </el-table-column>
      </template>
      <template #packageName>
        <el-table-column align="center" :label="$t('package_name')" width="200px" prop="name">
          <template #default="scope">
            <span
              v-permission:disabled="'package:detail'"
              class="text-primary mr10"
              @click="openEditOrder(scope.row, 3)"
            >
              {{ scope.row.name }}
            </span>
          </template>
        </el-table-column>
      </template>

      <template #products>
        <el-table-column align="center" :label="$t('contained_product')" width="200px">
          <template #default="scope">
            <div v-if="scope.row.products.length > 0">
              <span v-for="val in scope.row.products" :key="val?.id">{{ val?.productName }}</span>
            </div>
          </template>
        </el-table-column>
      </template>

      <template #enableDate>
        <el-table-column align="center" :label="$t('expiration_date')" width="200px">
          <template #default="scope">
            <div>{{ scope.row.enableStart }} ~ {{ scope.row.enableEnd }}</div>
          </template>
        </el-table-column>
      </template>

      <template #defaultAuthorize>
        <el-table-column align="center" :label="$t('default_author')" width="200px">
          <template #default="scope">
            <div>
              <span v-if="scope.row.defaultAuthorize">{{ $t('yes') }}</span>
              <span v-if="!scope.row.defaultAuthorize">{{ $t('no') }}</span>
            </div>
          </template>
        </el-table-column>
      </template>

      <template #enableStatus>
        <el-table-column align="center" :label="$t('state')" width="200px">
          <template #default="scope">
            <div>
              <span>{{ scope.row.stateLocalText }}</span>
              <!-- <span v-if="scope.row.defaultAuthorize">{{ '--' }}</span>
              <span v-else-if="!scope.row.defaultAuthorize">{{ scope.row.stateLocalText }}</span> -->
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

      <template #handler>
        <el-table-column align="center" :label="$t('operate')" width="200px" fixed="right">
          <template #default="scope">
            <div>
              <div>
                <el-button
                  v-permission="'package:update:click'"
                  type="text"
                  class="text-primary mr10"
                  :disabled="scope.row.status !== 0"
                  @click="openEditOrder(scope.row, 2)"
                >
                  <span class="mr10">{{ $t('modify') }}</span>
                </el-button>

                <el-button
                  v-permission="'package:delete:click'"
                  type="text"
                  class="text-primary mr10"
                  :disabled="scope.row.status === 10"
                  @click="deletePackage(scope.row.id)"
                >
                  <span class="mr10">{{ $t('delete') }}</span>
                </el-button>

                <el-popconfirm
                  hide-icon
                  :title="$t('sure_to_disable_package')"
                  :confirm-button-text="$t('determine')"
                  :cancel-button-text="$t('cancel')"
                  @confirm="enablePackage(!scope.row.enable, scope.row.id)"
                >
                  <template #reference>
                    <div style="display: inline-block; position: relative">
                      <el-button
                        v-if="scope.row.enable"
                        v-permission="'package:enable:click'"
                        type="text"
                        class="text-primary mr10"
                        :disabled="scope.row.stateLocal === -1"
                      >
                        <span class="mr10">{{ $t('disable') }}</span>
                      </el-button>
                    </div>
                  </template>
                </el-popconfirm>

                <el-popconfirm
                  hide-icon
                  :title="$t('sure_to_enable_package')"
                  :confirm-button-text="$t('determine')"
                  :cancel-button-text="$t('cancel')"
                  @confirm="enablePackage(!scope.row.enable, scope.row.id)"
                >
                  <template #reference>
                    <div style="display: inline-block; position: relative">
                      <el-button
                        v-if="!scope.row.enable"
                        v-permission="'package:enable:click'"
                        type="text"
                        class="text-primary mr10"
                        :disabled="scope.row.stateLocal === -1"
                      >
                        <span class="mr10">{{ $t('enabled') }}</span>
                      </el-button>
                    </div>
                  </template>
                </el-popconfirm>

                <el-button
                  v-permission="'package:review:click'"
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

    <editOrderDialog ref="editOrderRef" @get-data="changeType" />
  </div>
</template>

<script setup lang="ts">
import { reactive, onBeforeMount, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'

import { formToParams } from '@/utils'
import { quoListClick, deleteReq, enableReq } from '@/api/quotation/quotation'

import baseTable from '@/components/base-table/base-table'
import baseFilter from '@/components/base-filter/base-filter'
import editOrderDialog from './components/edit-order-dialog.vue'

const { t } = useI18n()

const isLoading = ref<boolean>(false)
const quoPackages = ref([])
const editOrderRef = ref()
const ordering = ref({
  asc: false,
  column: 'createTime',
})

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

// 启用状态
const enableStatus = [
  {
    label: t('enabled'),
    value: '1',
  },
  {
    label: t('disable'),
    value: '2',
  },
  {
    label: t('invalidation'),
    value: '3',
  },
]

// 审核状态
const status = [
  {
    label: t('audit_reject'),
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

// 默认套餐
const defaultAuthorize = [
  {
    label: t('yes'),
    value: true,
  },
  {
    label: t('no'),
    value: false,
  },
]

//可用地区
const regionSelectList = [
  {
    label: t('region_mainland'),
    value: '1',
  },
  // {
  //   label: t('region_HongKong'),
  //   value: '2',
  // },
  // {
  //   label: t('region_global'),
  //   value: '3',
  // },
  {
    label: t('region_other'),
    value: '4',
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
    { label: t('package_id'), prop: 'id', width: '160' },
    { slot: 'packageName' },
    { slot: 'products' },
    { slot: 'price' },
    { label: t('clicks'), prop: 'count', width: '160' },
    { slot: 'defaultAuthorize' },
    { label: t('apply_terminal'), prop: 'terminalStr', width: '160' },
    { label: t('usable_region'), prop: 'regionSelectStr', width: '200' },
    { label: t('creation_time'), prop: 'createTime', width: '180' },
    { slot: 'enableDate' },
    { slot: 'enableStatus' },
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
      label: t('click_quote_package'),
      innerEl: {
        elType: 'select',
        options: quoPackages,
      },
    },
    {
      prop: 'defaultAuthorize',
      label: t('default_author'),
      innerEl: {
        elType: 'select',
        options: defaultAuthorize,
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
      innerEl: {
        elType: 'datePicke',
        props: { type: 'daterange', valueFormat: 'YYYY-MM-DD' },
      },
    },
    {
      prop: 'enableStatus',
      label: t('state'),
      innerEl: {
        elType: 'select',
        options: enableStatus,
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
  ],
})

let type = 2

/**
 * 获取行情套餐
 */
function selectPackage() {
  quoListClick({ type }).then((res) => {
    quoPackages.value = res.result.records.map((v: any) => ({
      label: v.name,
      value: v.id,
    }))
  })
}

function getData() {
  isLoading.value = true

  // 分页
  const page: { [key: string]: string | number } = {
    type,
  }

  page.pageNum = pagination.paginationProps.currentPage
  page.pageSize = pagination.paginationProps.pageSize

  // if (ordering.value.column) {
  //   Object.assign(page, {
  //     orders: [ordering.value],
  //   })
  // }
  Object.assign(page, {
    orders: [ordering.value],
  })

  // 查询条件
  quoListClick(formToParams({ ...page, ...filterConfig.formProps.model }))
    .then((res) => {
      const { records = [], current, size, total } = res?.result || {}

      const packageList = records.map((item: Record<string, any>) => {
        const { enable, enableEnd, defaultAuthorize } = item

        const localeDate = new Date(enableEnd).toLocaleDateString()
        const enableEndDate = new Date(new Date(localeDate).getTime() + 24 * 60 * 60 * 1000 - 1)
        const currentDate = new Date()

        if (!defaultAuthorize && enableEndDate < currentDate) {
          item.stateLocal = -1
          item.stateLocalText = t('invalidation')
        } else if (enable) {
          item.stateLocal = 1
          item.stateLocalText = t('enabled')
        } else {
          item.stateLocal = 0
          item.stateLocalText = t('disable')
        }

        return item
      })

      Object.assign(pagination.paginationProps, {
        currentPage: current,
        pageSize: size,
        total,
      })

      tableConfig.tableProps.data = packageList
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
  ElMessageBox.confirm(t('sure_to_delete_package'), t('delete'), {
    confirmButtonText: t('determine'),
    cancelButtonText: t('cancel'),
    type: 'warning',
  }).then(() => {
    deleteReq({ id }).then(() => {
      ElMessage({
        type: 'success',
        message: t('delete_success'),
      })
      getData()
    })
  })
}

// 启用禁用
function enablePackage(enable: boolean, id: number): any {
  enableReq({ id, enable }).then(() => {
    getData()
  })
}

function openEditOrder(v?: Record<string, any>, state?: number | boolean) {
  editOrderRef.value.open(v, state)
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

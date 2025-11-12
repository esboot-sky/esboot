<template>
  <div class="page-container">
    <div class="tool">
      <el-button v-permission="'package:save:quo'" type="primary" @click="openEditOrder()">{{
        $t('add_stream_market_package')
      }}</el-button>
      <el-button v-permission="'package:save:click'" type="primary" @click="openEditOrderPrice()">{{
        $t('add_click_quote_package')
      }}</el-button>
    </div>
    <el-tabs type="border-card" @tab-click="changeType">
      <el-tab-pane :label="$t('stream_market_package')">
        <div>
          <base-filter
            :config="filterConfig"
            @on-search="searchHandle"
            @on-reset="resetHandle"
          ></base-filter>
          <base-table :config="tableConfig" :pagination="pagination" :is-table-loading="isLoading">
            <template #price>
              <el-table-column align="center" :label="$t('price')" width="200px">
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
              <el-table-column align="center" :label="$t('package_name')" width="200px">
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
                  <div>
                    <span v-for="product in scope.row.products" :key="product?.id">{{
                      product?.productName
                    }}</span>
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
                    {{ getStatusText(scope.row.enableEnd, scope.row.enable) }}
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
              <el-table-column align="center" :label="$t('operate')" width="200px">
                <template #default="scope">
                  <div>
                    <div>
                      <el-button
                        v-permission="'package:update'"
                        type="text"
                        class="text-primary mr10"
                        :disabled="scope.row.status !== 0"
                        @click="openEditOrder(scope.row, 2)"
                      >
                        <span class="mr10">{{ $t('modify') }}</span>
                      </el-button>
                      <el-button
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
                        :title="$t('sure_to_disable_package')"
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
                        :title="$t('sure_to_enable_package')"
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
                      <el-button
                        v-permission="'package:review'"
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
        </div>
      </el-tab-pane>
      <el-tab-pane :label="$t('click_quote_package')">
        <base-filter
          :config="filterPriceConfig"
          @on-search="searchHandle"
          @on-reset="resetHandle"
        ></base-filter>
        <base-table
          :config="tablePriceConfig"
          :pagination="paginationPrice"
          :is-table-loading="isLoading"
        >
          <template #price>
            <el-table-column align="center" :label="$t('price')" width="200px">
              <template #default="scope">
                <div>{{ scope.row.price }}{{ scope.row.currency }}</div>
              </template>
            </el-table-column>
          </template>

          <template #products>
            <el-table-column align="center" :label="$t('contained_product')" width="200px">
              <template #default="scope">
                <div>
                  <span v-for="product in scope.row.products" :key="product.productName">
                    {{ product.productName }}
                  </span>
                </div>
              </template>
            </el-table-column>
          </template>

          <template #packageName>
            <el-table-column align="center" :label="$t('package_name')" width="200px">
              <template #default="scope">
                <span
                  v-permission:disabled="'package:detail'"
                  class="text-primary mr10"
                  @click="openEditOrderPrice(scope.row, 3)"
                >
                  {{ scope.row.name }}
                </span>
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
                  {{ getStatusText(scope.row.enableEnd, scope.row.enable) }}
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
            <el-table-column align="center" :label="$t('operate')" width="200px">
              <template #default="scope">
                <div>
                  <el-button
                    v-permission="'package:update'"
                    type="text"
                    class="text-primary mr10"
                    :disabled="scope.row.status !== 0"
                    @click="openEditOrderPrice(scope.row, 2)"
                  >
                    <span class="mr10">{{ $t('modify') }}</span>
                  </el-button>
                  <el-button
                    v-permission="'package:delete'"
                    type="text"
                    class="text-primary mr10"
                    :disabled="scope.row.status === 10"
                    @click="deletePackage(scope.row.id)"
                  >
                    <span class="mr10">{{ $t('delete') }}</span>
                  </el-button>

                  <el-popconfirm

                    :title="$t('sure_to_disable_package')"
                    :confirm-button-text="$t('determine')"
                    :cancel-button-text="$t('cancel')"
                    hide-icon
                    @confirm="enablePackage(!scope.row.enable, scope.row.id)"
                  >
                    <template #reference>
                      <span v-if="scope.row.enable" v-permission="'package:enable'" class="text-primary mr10">{{
                        $t('disable')
                      }}</span>
                    </template>
                  </el-popconfirm>
                  <el-popconfirm
                    :title="$t('sure_to_enable_package')"
                    hide-icon
                    :confirm-button-text="$t('determine')"
                    :cancel-button-text="$t('cancel')"
                    @confirm="enablePackage(!scope.row.enable, scope.row.id)"
                  >
                    <template #reference>
                      <span v-if="!scope.row.enable" v-permission="'package:enable'" class="text-primary mr10">{{
                        $t('enabled')
                      }}</span>
                    </template>
                  </el-popconfirm>
                  <el-button
                    v-permission="'package:review'"
                    type="text"
                    class="text-primary mr10"
                    :disabled="scope.row.status !== 0"
                    @click="openEditOrderPrice(scope.row, 1)"
                    >{{ $t('audit') }}</el-button
                  >
                </div>
              </template>
            </el-table-column>
          </template>
        </base-table>
      </el-tab-pane>
    </el-tabs>
    <editOrderDialog ref="editOrderRef" @getData="changeType(1)" />
    <editOrderPriceDialog ref="editOrderPriceRef" @getData="changeType(2)" />
  </div>
</template>

<script setup lang="ts">
import { reactive, onBeforeMount, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import baseTable from '@/components/base-table/base-table'
import baseFilter from '@/components/base-filter/base-filter'
import editOrderDialog from './edit-order-dialog.vue'
import editOrderPriceDialog from './edit-order-price-dialog.vue'
import { quoList, deleteReq, enableReq } from '@/api/quotation/quotation'

import { formToParams } from '@/utils'

const editOrderRef = ref()
const editOrderPriceRef = ref()

const { t } = useI18n()
const isLoading = ref<boolean>(false)

function openEditOrder(v?: Record<string, any>, state?: number | boolean) {
  editOrderRef.value.open(v, state)
}

function openEditOrderPrice(v?: Record<string, any>, state?: number | boolean) {
  editOrderPriceRef.value.open(v, state)
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

// 默认授权
const defaultAuthorize = [
  {
    label: t('yes'),
    value: 'true',
  },
  {
    label: t('no'),
    value: 'false',
  },
]

/** 点击报价 */
const tablePriceConfig = reactive({
  tableProps: {
    data: [],
    height: '400',
  },
  customColumns: [
    { label: t('package_id'), prop: 'id' },
    { slot: 'packageName' },
    { slot: 'products' },
    { slot: 'price' },
    { label: t('clicks'), prop: 'count' },
    { slot: 'defaultAuthorize' },
    { label: t('apply_terminal'), prop: 'terminalStr' },
    { label: t('usable_region'), prop: 'regionSelectStr' },
    { label: t('creation_time'), prop: 'createTime' },
    { slot: 'enableDate' },
    { slot: 'enableStatus' },
    { slot: 'status' },
    { slot: 'handler' },
  ],
})

const paginationPrice: Record<string, any> = reactive({
  paginationProps: {
    currentPage: 1,
    pageSize: 10,
    total: 100,
  },
  paginationEvent: {
    onSizeChange: (v: number | string) => {
      paginationPrice.paginationProps.pageSize = v
      getData()
    },
    onCurrentChange: (v: number | string) => {
      paginationPrice.paginationProps.currentPage = v
      getData()
    },
  },
})

/** 表单数据 */
const filterPriceConfig = reactive({
  formProps: {
    model: {
      registerTime: '',
      registerSource: '',
      status: '',
      account: '',
    },
  },
  // eslint-disable-next-line no-use-before-define
  formItems: [
    {
      prop: 'packageId',
      label: t('clickId_market_package'),
      innerEl: {
        elType: 'select',
        options: quoPackages,
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
    {
      prop: 'createDate',
      label: t('creation_time'),
      innerEl: { elType: 'datePicke', props: { type: 'daterange', valueFormat: 'YYYY-MM-DD' } },
    },
  ],
})

/** 串流行情 */
const tableConfig = reactive({
  tableProps: {
    data: [],
    height: '400',
  },
  customColumns: [
    { label: t('package_id'), prop: 'id' },
    { slot: 'packageName' },
    { slot: 'products' },
    { slot: 'price' },
    { slot: 'defaultAuthorize' },
    { label: t('apply_terminal'), prop: 'terminalStr' },
    { label: t('usable_region'), prop: 'regionSelectStr' },
    { label: t('creation_time'), prop: 'createTime' },
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
      label: t('market_package'),
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
    {
      prop: 'createDate',
      label: t('creation_time'),
      innerEl: { elType: 'datePicke', props: { type: 'daterange', valueFormat: 'YYYY-MM-DD' } },
    },
  ],
})
let type = 1

/**
 * 获取行情套餐
 */
function selectPackage() {
  quoList({ type }).then((res) => {
    quoPackages.value = res.result.records.map((v: any) => ({ label: v.name, value: v.id }))
  })
}

function getData() {
  isLoading.value = true
  // 分页
  const page: { [key: string]: string | number } = {
    type,
  }
  let data = {}
  if (type === 1) {
    page.pageNum = pagination.paginationProps.currentPage
    page.pageSize = pagination.paginationProps.pageSize
    data = filterConfig.formProps.model
  } else {
    page.pageNum = paginationPrice.paginationProps.currentPage
    page.pageSize = paginationPrice.paginationProps.pageSize
    data = filterPriceConfig.formProps.model
  }

  // 查询条件
  quoList(formToParams({ ...page, ...data }))
    .then((res) => {
      if (type === 1) {
        tableConfig.tableProps.data = res.result.records
        pagination.paginationProps.currentPage = res.result.current
        pagination.paginationProps.pageSize = res.result.size
        pagination.paginationProps.total = res.result.total
        isLoading.value = false
        return
      }
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

function changeType(tab: any) {
  type = tab === 1 || Number(tab.index) === 0 ? 1 : 2
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

<template>
  <!-- 套餐管理-串流行情套餐 -->
  <div class="page-container">
    <div class="tool operate-buttons">
      <el-button v-permission="'package:save:quo'" type="primary" @click="openEditOrder()">{{
        $t('add_stream_market_package')
      }}</el-button>
    </div>
    <base-filter
      :config="filterConfig"
      @on-search="searchHandle"
      @on-reset="resetHandle"
    ></base-filter>
    <base-table :config="tableConfig" :pagination="pagination" :is-table-loading="isLoading">
      <template #price>
        <el-table-column
          align="center"
          :label="$t('price')"
          width="200px"
          prop="price"
          sortable="custom"
        >
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
        <el-table-column
          align="center"
          :label="$t('package_name')"
          width="200px"
          prop="name"
          sortable="custom"
        >
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

      <template #terminal>
        <el-table-column
          :label="$t('apply_terminal')"
          prop="terminalStr"
          width="160"
        >
          <template #default="scope">
            <span v-if="scope.row.isNull">--</span>
            <span v-else>{{scope.row.terminalStr}}</span>
          </template>
        </el-table-column>
      </template>
      <template #regionSelect>
        <el-table-column
          :label="$t('usable_region')"
          prop="regionSelectStr"
          width="160"
        >
          <template #default="scope">
            <span v-if="scope.row.isNull">--</span>
            <span v-else>{{scope.row.regionSelectStr}}</span>
          </template>
        </el-table-column>
      </template>

      <template #products>
        <el-table-column align="center" :label="$t('contained_product')" width="200px">
          <template #default="scope">
            <div v-if="scope.row?.products && scope.row?.products.length">
              <span
                v-for="(product, index) in scope.row?.products"
                :key="product?.productName || index"
                >{{ product?.productName || '' }}</span
              >
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
              <!-- <span v-if="scope.row.defaultAuthorize">{{ '--' }}</span> -->
              <!-- <span v-else-if="!scope.row.defaultAuthorize">{{ scope.row.stateLocalText }}</span> -->
              <!-- {{ getStatusText(scope.row.enableEnd, scope.row.enable) }} -->
              {{ scope.row.stateLocalText }}
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
                  :title="$t('sure_to_disable_package')"
                  hide-icon
                  :confirm-button-text="$t('determine')"
                  :cancel-button-text="$t('cancel')"
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
import { quoList, deleteReq, enableReq } from '@/api/quotation/quotation'
import { formToParams } from '@/utils'
import { useRouter } from "vue-router"

const editOrderRef = ref()

const { t } = useI18n()
const isLoading = ref<boolean>(false)
const ordering = ref({
  asc: false,
  column: 'createTime',
})

 const router = useRouter();

    // 获取所有注册的路由
    const routes = router.getRoutes();
    console.log('++++++++routes++++++++++++', routes);


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
    value: 'true',
  },
  {
    label: t('no'),
    value: 'false',
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
    { slot: 'defaultAuthorize' },
    // { slot: 'terminal' },
    // { slot: 'regionSelect' },
    // { label: t('apply_terminal'), prop: 'terminalStr', width: '160' },
    // { label: t('usable_region'), prop: 'regionSelectStr', width: '200' },
    { label: t('creation_time'), prop: 'createTime', width: '180', sortable: 'custom' },
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
      // label: t('market_package'),
      innerEl: {
        elType: 'select',
        options: quoPackages,
        props: {
          placeholder: t('market_package'),
        },
      },
    },
    {
      prop: 'defaultAuthorize',
      // label: t('default_author'),
      innerEl: {
        elType: 'select',
        options: defaultAuthorize,
        props: {
          placeholder: t('default_author'),
        },
      },
    },
    // {
    //   prop: 'terminal',
    //   // label: t('apply_terminal'),
    //   innerEl: {
    //     elType: 'select',
    //     options: terminal,
    //     props: {
    //       placeholder: t('apply_terminal'),
    //     }
    //   },
    // },
    // {
    //   prop: 'regionSelect',
    //   // label: t('area'),
    //   innerEl: {
    //     elType: 'select',
    //     options: regionSelectList,
    //     props: {
    //       placeholder: t('area'),
    //     }
    //   },
    // },
    {
      prop: 'enableStatus',
      // label: t('state'),
      innerEl: {
        elType: 'select',
        options: enableStatus,
        props: {
          placeholder: t('state'),
        }
      },
    },
    {
      prop: 'status',
      // label: t('audit_status'),
      innerEl: {
        elType: 'select',
        options: status,
        props: {
          placeholder: t('audit_status'),
        }
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
  ],
})
let type = 1

/**
 * 获取行情套餐
 */
function selectPackage() {
  quoList({ type, pageNum: 1, pageSize: 100000 }).then((res) => {
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
  quoList(formToParams({ ...page, ...filterConfig.formProps.model }))
    .then((res) => {
      const { records = [], current, size, total } = res?.result || {}

      const packageList = records.map((item: Record<string, any>) => {
        const { enable, enableEnd, defaultAuthorize, products = [] } = item

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

        item.isNull = true
        if (products.length > 0) {
          let isNull = true
          products.forEach((product: any) => {
            if (product.type !== 3) {
              isNull = false
            }
          })
          item.isNull = isNull
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
//   quoList(formToParams({ ...page, ...filterConfig.formProps.model }))
//     .then((res) => {
//       tableConfig.tableProps.data = res.result.records;
//       pagination.paginationProps.currentPage = res.result.current;
//       pagination.paginationProps.pageSize = res.result.size;
//       pagination.paginationProps.total = res.result.total;
//       isLoading.value = false;
//     })
//     .catch((err) => {
//       console.log(err);
//       isLoading.value = false;
//     });
// }

function searchHandle() {
  getData()
}

function resetHandle() {
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

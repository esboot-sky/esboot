<template>
  <div class="page-container">
    <div class="operate-buttons">
      <el-button type="primary" @click="openNewRolesDialog" v-permission="'role:info:add'">{{
        $t('new')
      }}</el-button>
      <el-popconfirm
        :title="$t('sure_to_batch_deleted')"
        hide-icon
        :visible="visible"
        @confirm="batchDeleteConfirm"
        @cancel="visible = false"
      >
        <template #reference
          ><el-button type="info" v-permission="'role:info:deleteBatch'" @click="showDelete">{{
            $t('batch_deleted')
          }}</el-button></template
        >
      </el-popconfirm>
    </div>
    <baseFilter :config="filterConfig" @onSearch="searchHandle" @onReset="resetHandle"></baseFilter>
    <baseTable
      ref="tablePaginationRef"
      :config="tableConfig"
      :pagination="paginationConfig"
      :isTableLoading="isLoading"
    >
      <template v-slot:operate>
        <el-table-column :label="$t('operation')" align="center">
          <template #default="scope">
            <span
              @click="openEditRolesDialog"
              v-if="scope.row.id == 1"
              class="text-primary mr10"
              v-permission="'role:info:permission:list'"
              style="pointer-events: none; opacity: 0.5"
              >{{ $t('permissions') }}</span
            >
            <span
              @click="openModifyPermissionsDialog"
              v-permission="'role:info:permission:list'"
              v-else
              class="text-primary mr10"
              >{{ $t('permissions') }}</span
            >
            <span
              @click="openEditRolesDialog"
              v-if="scope.row.id == 1"
              class="text-primary mr10"
              v-permission="'role:info:modify'"
              style="pointer-events: none; opacity: 0.5"
              >{{ $t('modify') }}</span
            >
            <span
              @click="openEditRolesDialog"
              v-permission="'role:info:modify'"
              v-else
              class="text-primary mr10"
              >{{ $t('modify') }}</span
            >
            <el-popconfirm :title="$t('determine_deleted')" hide-icon @confirm="deleteRoleConfirm">
              <template #reference>
                <span
                  class="text-primary mr10"
                  v-if="scope.row.id == 1"
                  v-permission="'role:info:delete'"
                  style="pointer-events: none; opacity: 0.5"
                  >{{ $t('delete') }}</span
                >
                <span class="text-primary mr10" v-permission="'role:info:delete'" v-else>{{
                  $t('delete')
                }}</span>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </template>
    </baseTable>
    <!-- 新建/修改角色 -->
    <el-dialog
      v-model="isShowNewEditRoles"
      :close-on-click-modal="false"
      width="500px"
      :title="newEditRolesType === 'new' ? $t('new_role') : $t('modify_role')"
      center
      append-to-body
      @close="closeEditDialog"
    >
      <el-form
        ref="newEditRolesRef"
        :model="newEditRolesForm"
        :rules="newEditRolesRule"
        label-width="100px"
        style="width: 80%; margin: 0 auto"
      >
        <el-form-item :label="`${$t('superior_role')}：`" prop="parentId">
          <el-select v-model="newEditRolesForm.parentId" @change="onChangeRoleId">
            <el-option
              v-for="roleItem of superiorRoleList"
              :key="roleItem.value"
              :label="roleItem.label"
              :value="roleItem.value"
              :disabled="
                newEditRolesType !== 'new' && selectedRow.id && selectedRow.id === roleItem.value
              "
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="`${$t('role_name')}：`" prop="name">
          <el-input v-model="newEditRolesForm.name" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item
          :label="`${$t('permissions')}：`"
          prop="menuIds"
          v-if="newEditRolesType === 'new'"
        >
          <el-button @click="clickSettingPermission">{{ $t('click_settings') }}</el-button>
        </el-form-item>
        <el-form-item :label="`${$t('remarks')}：`" prop="remark">
          <el-input v-model="newEditRolesForm.remark" maxlength="100"></el-input>
        </el-form-item>
      </el-form>
      <el-dialog
        v-model="isShowNewEditRolesInner"
        :close-on-click-modal="false"
        :title="$t('permissions')"
        center
        append-to-body
        width="800px"
        @close="handleDialogClose"
      >
        <base-tabs :tabList="tabList" :defaultTab="currentTab" @tabClick="tabClickForModify" />
        <el-tree
          ref="permissionsTreeRef"
          node-key="id"
          :data="permissionsTree"
          :props="defaultTreeProps"
          @check="handleCheck"
          show-checkbox
        />
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="isShowNewEditRolesInner = false">{{ $t('cancel') }}</el-button>
            <el-button type="primary" @click="permissionsTreeConfirm">{{
              $t('determine')
            }}</el-button>
          </span>
        </template>
      </el-dialog>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="isShowNewEditRoles = false">{{ $t('cancel') }}</el-button>
          <el-button type="primary" :loading="loading" @click="toNewEditRoles">{{
            $t('determine')
          }}</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 修改权限 -->
    <el-dialog
      v-model="isShowModifyPermissions"
      :close-on-click-modal="false"
      :title="$t('modify_permissions')"
      @close="handleDialogClose"
      center
      append-to-body
      width="800px"
    >
      <base-tabs :tabList="tabList" :defaultTab="currentTab" @tabClick="tabClickForModify" />
      <el-tree
        ref="permissionsTreeRef"
        node-key="id"
        :data="permissionsTree"
        :props="defaultTreeProps"
        :default-checked-keys="defaultCheckedKeys"
        @check="handleCheck"
        show-checkbox
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="isShowModifyPermissions = false">{{ $t('cancel') }}</el-button>
          <el-button type="primary" @click="modifyPermissionsConfirm">{{
            $t('determine')
          }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { defineComponent, onBeforeMount, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import baseFilter from '@/components/base-filter/base-filter'
import baseTable from '@/components/base-table/base-table'
import baseTabs from '@/components/base-tabs/base-tabs.vue'
import _ from 'lodash'

import {
  getUserRoleList,
  getUserManagementRoleList,
  deleteRole,
  batchDeleteRole,
  newRolesApi,
  editRolesApi,
  modifyPermissions,
  getModulesByRole,
} from '@/api/subPro/subPro'
import { fetchRolePermissions } from '@/api-v2/uc/query'

export default defineComponent({
  name: 'account-role-management',
  components: {
    baseFilter,
    baseTable,
    baseTabs,
  },
  setup() {
    const { t } = useI18n()
    const tablePaginationRef = ref()
    const pageSize = ref(20)
    const currentPage = ref(1)
    const searchData = ref()
    const isLoading = ref<boolean>(false)
    const ordering = ref({
      asc: true,
      column: '',
    })

    /* 表格-start */
    // 选中行数
    let tableSelectionRows: any[] = []
    const tableSelectionChange = (selection: []) => {
      tableSelectionRows = selection
    }
    // 选中行
    const selectedRow = ref()
    const tableConfig = reactive({
      tableProps: {
        // data: <{ date: string; name: string; address: string }[]>[],
        data: [],
      },
      tableEvent: {
        onSelectionChange: tableSelectionChange,
        onRowClick: (row: object) => {
          selectedRow.value = row
        },
        onSortChange: (column: Record<string, any>) => {
          const { order, prop } = column
          ordering.value.column = ''
          currentPage.value = 1
          paginationConfig.value.paginationProps.currentPage = 1

          if (order) {
            ordering.value = {
              asc: order === 'ascending',
              column: prop,
            }
          }
          return toGetUserRoleList()
        },
      },
      customColumns: [
        { type: 'selection', align: 'center' },
        { label: t('create_time'), prop: 'createTime', sortable: 'custom' },
        { label: t('role_name'), prop: 'name', sortable: 'custom' },
        { label: t('superior_role'), prop: 'parentName', sortable: 'custom' },
        { label: t('remarks'), prop: 'remark' },
        { slot: 'operate' },
      ],
    })

    /* 表格-end */

    /* 分页-start */
    const paginationConfig = ref({
      paginationProps: { total: 0, 'page-size': 20, currentPage: 1 },
      paginationEvent: {
        onSizeChange: handleSizeChange,
        onCurrentChange: handleCurrentChange,
      },
    })
    function handleSizeChange(currentSize: number) {
      paginationConfig.value.paginationProps['page-size'] = currentSize
      tablePaginationRef.value?.toFirstPage()
      currentPage.value = 1
      pageSize.value = currentSize
      toGetUserRoleList()
    }
    function handleCurrentChange(theCurrentPage: number) {
      currentPage.value = theCurrentPage
      paginationConfig.value.paginationProps.currentPage = theCurrentPage
      toGetUserRoleList()
    }
    /* 分页-end */

    function toGetUserRoleList() {
      isLoading.value = true
      const params = {
        ...searchData.value,
        pageSize: pageSize.value,
        pageNum: currentPage.value,
      }

      if (ordering.value.column) {
        Object.assign(params, {
          orders: [ordering.value],
        })
      }

      getUserRoleList(params)
        .then((res: { [key: string]: any }) => {
          tableConfig.tableProps.data = res.result?.records
          paginationConfig.value.paginationProps.total = res.result?.total || 0
        })
        .finally(() => {
          isLoading.value = false
        })
    }

    /* 过滤表单-start */
    const filterConfig = ref({
      formProps: {
        model: {
          keyword: '',
          parentId: '',
        },
      },
      formItems: [
        {
          prop: 'keyword',
          label: t('role_name'),
          innerEl: {
            elType: 'input',
            props: { placeholder: t('please_enter_role_name') },
          },
        },
        {
          prop: 'parentId',
          label: t('superior_role'),
          innerEl: {
            elType: 'select',
            options: [],
            width: '200px',
          },
        },
      ],
    })

    const superiorRoleList = ref()
    const getRuleList = () => {
      getUserManagementRoleList({
        pageSize: 100000,
        showCurrent: true,
      }).then((res) => {
        const options = res.result?.records.map((record: { [key: string]: any }) => ({
          label: record.name,
          value: record.id,
        }))
        superiorRoleList.value = options
        filterConfig.value.formItems[1].innerEl.options = options
      })
    }

    const searchHandle = (data: { [name: string]: any }) => {
      currentPage.value = 1
      tablePaginationRef.value?.toFirstPage()
      // 携带自定义插槽数据并请求查询
      searchData.value = { ...data }
      toGetUserRoleList()
    }

    const resetHandle = (data: { [name: string]: any }) => {
      currentPage.value = 1
      tablePaginationRef.value?.toFirstPage()
      // 重置自定义插槽数据并请求查询
      searchData.value = { ...data }
      toGetUserRoleList()
    }
    /* 过滤表单-end */

    // 批量删除
    const toBatchDeleteRole = () => {
      if (tableSelectionRows?.length === 0) return ElMessage.error(t('select_batch_delete_data'))
      const ids = tableSelectionRows.map((item) => item.id)
      return batchDeleteRole({ ids })
        .then(() => {
          ElMessage.success(t('delete_success'))
          toGetUserRoleList()
        })
        .finally(() => {
          visible.value = false
        })
    }
    const batchDeleteConfirm = () => {
      toBatchDeleteRole()
      return true
    }

    // 模块列表
    const tabList = ref([])
    const currentTab = ref()
    const getModulesByRoles = async (parentRoleId: number | string, roleId?: number | string) => {
      const getRulesParams = {
        parentId: parentRoleId,
      }

      if (roleId) {
        Object.assign(getRulesParams, {
          id: roleId,
        })
      }

      getModulesByRole({
        id: parentRoleId,
      }).then((res: Record<string, any>) => {
        const result = res.result
        tabList.value = result.map((item: Record<string, any>) => ({
          label: item.name,
          value: item.code,
        }))

        const { value: codeVal } = tabList.value[0]
        currentTab.value = codeVal

        toGetRolePermissions(codeVal, getRulesParams)
      })
    }

    /* 新建/修改角色-start */
    const isShowNewEditRoles = ref(false)
    const isShowNewEditRolesInner = ref(false)
    const newEditRolesRef = ref()
    const newEditRolesForm = ref({
      parentId: '',
      name: '',
      remark: '',
    })
    const newEditRolesRule = {
      parentId: [{ required: true, message: t('please_select_superior_role'), trigger: 'change' }],
      name: [{ required: true, message: t('please_enter_role_name'), trigger: 'blur' }],
    }

    // 权限树
    const permissionsTreeRef = ref()
    const defaultTreeProps = {
      children: 'children',
      label: 'name',
      disabled: 'disabled',
    }

    // 选中的树节点
    const permissionsTree = ref()
    const defaultCheckedKeys = ref([])
    const modulesCheckedMenuId: Record<string, any> = ref({})
    const cacheModulesChecked: Record<string, any> = ref({})

    const handleCheck = (data: Record<string, any>, checked: Record<string, any>) => {
      const { halfCheckedKeys, checkedKeys } = checked

      modulesCheckedMenuId.value[currentTab.value] = [...halfCheckedKeys, ...checkedKeys]
      console.log('modulesCheckedMenuId -> ', modulesCheckedMenuId)
    }

    const filterMenuId = (menus = [], menuIds = []) => {
      menus.forEach((menu) => {
        const { id, children = [] } = menu

        if (children.length) {
          menuIds.push(id)
          filterMenuId(children, menuIds)
        }
      })

      return menuIds
    }

    const toGetRolePermissions = (moduleCode: string, params?: object) => {
      fetchRolePermissions(moduleCode, params).then((res: Record<string, any>) => {
        const { permissions = [], checkedList = [] } = res.result
        permissionsTree.value = permissions

        const menuIds: number[] = filterMenuId(permissions)
        const localChecked: [] = modulesCheckedMenuId.value[moduleCode]

        if (localChecked) {
          const newChecked = localChecked.filter((local) => {
            return !menuIds.includes(local)
          })
          defaultCheckedKeys.value = newChecked
          permissionsTreeRef.value.setCheckedKeys(newChecked, false)
          return
        }

        if (!checkedList.length) {
          defaultCheckedKeys.value = []
          permissionsTreeRef.value.setCheckedKeys([], false)
          return
        }

        const newChecked = checkedList.filter((local: number) => {
          return !menuIds.includes(local)
        })
        defaultCheckedKeys.value = newChecked
        permissionsTreeRef.value.setCheckedKeys(newChecked, false)

        modulesCheckedMenuId.value[moduleCode] = checkedList
      })
    }

    const permissionsTreeConfirm = () => {
      cacheModulesChecked.value = Object.assign({}, modulesCheckedMenuId.value)

      isShowNewEditRolesInner.value = false
    }

    const tabClickForModify = (tab: string) => {
      currentTab.value = tab

      if (isShowNewEditRoles.value) {
        // 新增
        const { parentId } = newEditRolesForm.value
        toGetRolePermissions(tab, { parentId })
        return
      }

      if (selectedRow.value) {
        const { id, parentId } = selectedRow.value
        toGetRolePermissions(tab, { id, parentId })
        return
      }
    }

    const clickSettingPermission = () => {
      const { parentId } = newEditRolesForm.value
      if (!parentId) {
        ElMessage.warning(t('select_upper_level_role_first'))
        return
      }

      const cacheChecked = cacheModulesChecked.value
      if (cacheChecked) {
        modulesCheckedMenuId.value = Object.assign({}, cacheChecked)
        cacheModulesChecked.value = {}
      }

      getModulesByRoles(parentId).then(() => {
        isShowNewEditRolesInner.value = true
      })
    }

    // 打开新建角色对话框
    const newEditRolesType = ref('new')

    const openNewRolesDialog = () => {
      // 获取所有角色
      getRuleList()

      newEditRolesType.value = 'new'
      isShowNewEditRoles.value = true
    }

    const getModulesCheckedMenuId = () => {
      const modulesCheckedMenus = modulesCheckedMenuId.value
      const modulesKeys = Object.keys(modulesCheckedMenus)

      if (modulesKeys.length) {
        const modulesChecked = modulesKeys.map((key) => {
          return { code: key, menuIds: modulesCheckedMenus[key] }
        })

        return modulesChecked
      }

      const cacheCheckedMenus = cacheModulesChecked.value
      return Object.keys(cacheCheckedMenus).map((key) => {
        return { code: key, menuIds: cacheCheckedMenus[key] }
      })
    }

    const loading = ref(false)

    const toNewEditRoles = () => {
      newEditRolesRef.value.validate((validate: boolean) => {
        if (!validate) {
          return
        }
        loading.value = true
        if (newEditRolesType.value === 'new') {
          const modules = getModulesCheckedMenuId()
          const params = {
            modules,
            ...newEditRolesForm.value,
          }

          newRolesApi(params)
            .then(() => {
              ElMessage.success(t('add_success'))
              isShowNewEditRoles.value = false

              getRuleList()
              toGetUserRoleList()
            })
            .finally(() => {
              loading.value = false
            })
          return
        }

        const { id } = selectedRow.value
        editRolesApi({ id, ...newEditRolesForm.value })
          .then(() => {
            ElMessage.success(t('modify_success'))
            isShowNewEditRoles.value = false

            getRuleList()
            toGetUserRoleList()
          })
          .finally(() => {
            loading.value = false
          })
      })
    }

    const openEditRolesDialog = () => {
      // 获取所有角色
      getRuleList()

      newEditRolesType.value = 'edit'

      setTimeout(() => {
        const { parentId, name, remark } = selectedRow.value
        newEditRolesForm.value.parentId = parentId
        newEditRolesForm.value.name = name
        newEditRolesForm.value.remark = remark
        isShowNewEditRoles.value = true
      }, 20)
    }
    /* 新建/修改角色-end */

    /* 操作列 */

    // 修改权限
    const isShowModifyPermissions = ref(false)

    const openModifyPermissionsDialog = () => {
      setTimeout(() => {
        const { id, parentId } = selectedRow.value
        getModulesByRoles(parentId, id).then(() => {
          isShowModifyPermissions.value = true
        })
      }, 20)
    }

    const modifyPermissionsConfirm = () => {
      const modules = getModulesCheckedMenuId()
      const { id } = selectedRow.value
      const params = {
        id,
        modules,
      }

      modifyPermissions(currentTab.value, params).then(() => {
        isShowModifyPermissions.value = false
        ElMessage.success(t('modify_permissions_success'))

        getRuleList()
        toGetUserRoleList()
      })
    }

    // 选择权限Dialog关闭时
    const handleDialogClose = () => {
      modulesCheckedMenuId.value = {}

      tabList.value = []
      currentTab.value = ''

      permissionsTree.value = []
      defaultCheckedKeys.value = []
      permissionsTreeRef.value.setCheckedKeys([], false)
    }

    const toDeleteRole = () => {
      const { id } = selectedRow.value
      deleteRole({ id }).then(() => {
        ElMessage.success(t('delete_success'))

        getRuleList()
        toGetUserRoleList()
      })
    }

    const deleteRoleConfirm = () => {
      toDeleteRole()
      return true
    }

    // 上级角色发生改变时
    const onChangeRoleId = () => {
      cacheModulesChecked.value = {}
      modulesCheckedMenuId.value = {}
    }

    // 新增/编辑 角色弹窗关闭时
    const closeEditDialog = () => {
      newEditRolesRef.value.resetFields()
      newEditRolesForm.value = {
        parentId: '',
        name: '',
        remark: '',
      }

      onChangeRoleId()
    }

    onBeforeMount(() => {
      getRuleList()
      toGetUserRoleList()
    })

    const visible = ref<boolean>(false)
    const showDelete = () => {
      if (!tableSelectionRows.length) {
        visible.value = false
        ElMessage.warning(t('selectDeleteItem'))
        return
      }
      visible.value = true
    }

    return {
      tableConfig,
      paginationConfig,
      filterConfig,
      searchHandle,
      resetHandle,
      superiorRoleList,
      batchDeleteConfirm,
      isShowModifyPermissions,
      tabList,
      openModifyPermissionsDialog,
      modifyPermissionsConfirm,
      handleDialogClose,
      deleteRoleConfirm,
      isShowNewEditRoles,
      newEditRolesRef,
      newEditRolesForm,
      newEditRolesRule,
      tabClickForModify,
      permissionsTreeRef,
      defaultTreeProps,
      permissionsTree,
      clickSettingPermission,
      permissionsTreeConfirm,
      newEditRolesType,
      openNewRolesDialog,
      openEditRolesDialog,
      isShowNewEditRolesInner,
      toNewEditRoles,
      loading,
      isLoading,
      currentTab,
      handleCheck,
      visible,
      showDelete,
      onChangeRoleId,
      defaultCheckedKeys,
      closeEditDialog,
      selectedRow,
    }
  },
})
</script>
<style lang="scss" scoped>
.mr10 {
  margin-right: 10px;
}

.base-filter {
  :deep(.el-select) {
    width: 200px;
  }
}
</style>

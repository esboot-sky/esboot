<template>
  <div class="page-container">
    <div class="operate-buttons">
      <el-button v-permission="'user:info:add'" type="primary" @click="toNewUser">{{
        $t('new')
      }}</el-button>
      <el-popconfirm
        :title="$t('sure_to_batch_deleted')"
        :visible="visible"
        hide-icon
        @confirm="batchDeleteConfirm"
        @cancel="visible = false"
      >
        <template #reference
          ><el-button
            v-permission="'user:info:deleteBatch'"
            type="info"
            @click="showDelete('visible')"
            >{{ $t('batch_deleted') }}</el-button
          ></template
        >
      </el-popconfirm>
      <el-popconfirm
        :title="$t('sure_to_batch_enable')"
        :visible="eBatchVisible"
        hide-icon
        @confirm="batchStartupConfirm"
        @cancel="eBatchVisible = false"
      >
        <template #reference
          ><el-button
            v-permission="'user:info:enableBatch'"
            type="info"
            @click="showDelete('eVisible')"
            >{{ $t('batch_enabled') }}</el-button
          ></template
        >
      </el-popconfirm>
      <el-popconfirm
        :title="$t('sure_to_batch_disable')"
        hide-icon
        :visible="dBatchVisible"
        @confirm="batchForbidConfirm"
        @cancel="dBatchVisible = false"
      >
        <template #reference
          ><el-button
            v-permission="'user:info:disableBatch'"
            type="info"
            @click="showDelete('dVisible')"
            >{{ $t('batch_disabled') }}</el-button
          ></template
        >
      </el-popconfirm>
      <el-button
        v-permission="'user:info:assignRolesBatch'"
        type="info"
        @click="openBatchAssignRolesDialog"
        >{{ $t('assigning_roles_in_batches') }}</el-button
      >
    </div>
    <div class="filter">
      <baseFilter
        :config="filterConfig"
        @onSearch="searchHandle"
        @onReset="resetHandle"
      ></baseFilter>
    </div>
    <baseTable
      ref="tablePaginationRef"
      :config="tableConfig"
      :pagination="paginationConfig"
      :is-table-loading="isLoading"
    >
      <template #phoneNumber>
        <el-table-column
          :label="$t('phone_number')"
          align="center"
          width="150"
          prop="mobile"
          sortable="custom"
        >
          <template #default="scope">
            <span>{{ scope.row.areaCode }} {{ scope.row.mobile }}</span>
          </template>
        </el-table-column>
      </template>
      <template #status>
        <el-table-column :label="$t('state')" align="center">
          <template #default="scope">
            {{ statusText(scope.row.status) }}
          </template>
        </el-table-column>
      </template>
      <template #operate>
        <el-table-column :label="$t('operation')" width="270" align="center" fixed="right">
          <template #default="scope">
            <span
              v-permission="'user:info:modify'"
              class="text-primary mr10"
              @click="toModifyUser(scope.row)"
              >{{ $t('modify') }}</span
            >
            <template v-if="scope.row.login_account !== 'admin'">
              <el-popconfirm
                :title="$t('determine_deleted')"
                hide-icon
                @confirm="userDeleteConfirm"
              >
                <template #reference>
                  <span v-permission="'user:info:delete'" class="text-primary mr10">{{
                    $t('delete')
                  }}</span>
                </template>
              </el-popconfirm>
              <template v-if="statusText(scope.row.status) === $t('disabled')">
                <el-popconfirm :title="$t('determine_enabled')" hide-icon @confirm="startupConfirm">
                  <template #reference>
                    <span v-permission="'user:info:enable'" class="text-primary mr10">{{
                      $t('enable')
                    }}</span>
                  </template>
                </el-popconfirm>
              </template>
              <template v-else-if="statusText(scope.row.status) === $t('enable')">
                <el-popconfirm :title="$t('determine_disabled')" hide-icon @confirm="forbidConfirm">
                  <template #reference>
                    <span v-permission="'user:info:disable'" class="text-primary mr10">{{
                      $t('disabled')
                    }}</span>
                  </template>
                </el-popconfirm>
              </template>
              <span
                v-permission="'user:info:roleAssign'"
                class="text-primary mr10"
                @click="openAssignRolesDialog"
                >{{ $t('assign_roles') }}</span
              >
            </template>

            <span
              v-permission="'user:info:resetPwd'"
              class="text-primary mr10"
              @click="openResetPassDialog"
              >{{ $t('reset_password') }}</span
            >
          </template>
        </el-table-column>
      </template>
    </baseTable>
    <!-- 新建/修改用户 -->
    <el-dialog
      v-model="isShowNewEditUser"
      :close-on-click-modal="false"
      :title="userNewEditType === 'new' ? $t('new_user') : $t('modify_user')"
      width="530px"
      center
      @close="onCloseEditDialog"
    >
      <el-form
        ref="newEditUserRef"
        :inline="true"
        :model="newEditUserForm"
        :rules="newEditUserRule"
        label-width="100px"
        style="width: 90%; margin: 0 auto"
      >
        <el-form-item :label="`${$t('user_name')}：`" prop="nickname">
          <el-input v-model="newEditUserForm.nickname" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item :label="`${$t('phone_number')}：`" prop="mobile">
          <el-input
            v-model="newEditUserForm.mobile"
            class="suffix-mobile-copy"
            style="width: 250px"
            maxlength="11"
          >
            <template #prepend>
              <el-select v-model="newEditUserForm.areaCode" @change="newEditUserForm.mobile = ''">
                <el-option
                  v-for="item in areaList"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                ></el-option>
              </el-select>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item :label="`${$t('email')}：`" prop="email">
          <el-input v-model="newEditUserForm.email" style="width: 250px" maxlength="40"></el-input>
        </el-form-item>
        <template v-if="newEditUserForm.login_account !== 'admin'">
          <el-form-item :label="`${$t('login_account')}：`" prop="username">
            <el-input
              v-model="newEditUserForm.username"
              style="width: 250px"
              maxlength="20"
            ></el-input>
            <el-button
              style="position: absolute; min-width: 70px; width: 70px; right: 0px"
              @click="checkUsername(newEditUserForm.username)"
              >{{ $t('check_use') }}</el-button
            >
          </el-form-item>
          <el-form-item
            v-if="userNewEditType === 'new'"
            :label="`${$t('login_password')}：`"
            prop="password"
          >
            <el-input
              v-model="newEditUserForm.password"
              type="password"
              :placeholder="$t('check_pwd')"
              style="width: 250px"
            ></el-input>
          </el-form-item>

          <el-form-item
            v-if="userNewEditType === 'new'"
            :label="`${$t('confirm_password')}：`"
            prop="confirmPassword"
          >
            <el-input
              v-model="newEditUserForm.confirmPassword"
              type="password"
              :placeholder="$t('check_pwd')"
              style="width: 250px"
            ></el-input>
          </el-form-item>
          <el-form-item :label="`${$t('current_department')}：`" prop="deptId">
            <el-select v-model="newEditUserForm.deptId" style="width: 250px">
              <el-option
                v-for="item of userDeptList"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="`${$t('current_role')}：`" prop="roleIds">
            <el-button @click="isShowNewEditUserRole = true">{{
              $t('click_select_role')
            }}</el-button>
          </el-form-item>
          <el-form-item :label="`${$t('state')}：`" prop="status">
            <el-radio v-model="newEditUserForm.status" :label="1" size="large">{{
              $t('enable')
            }}</el-radio>
            <el-radio v-model="newEditUserForm.status" :label="0" size="large">{{
              $t('disabled')
            }}</el-radio>
          </el-form-item>
        </template>
      </el-form>
      <el-dialog
        v-model="isShowNewEditUserRole"
        :close-on-click-modal="false"
        width="500px"
        :title="$t('current_role')"
        center
        append-to-body
      >
        <assign-roles :data="userAssignRoles" @roleChange="roleChangeHandle" />
        <template #footer>
          <span class="dialog-footer">
            <el-button type="primary" @click="onRole">{{ $t('determine') }}</el-button>
          </span>
        </template>
      </el-dialog>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="isShowNewEditUser = false">{{ $t('cancel') }}</el-button>
          <el-button type="primary" :loading="editLoading" @click="confirmNewEditUser">{{
            $t('determine')
          }}</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 重置密码 -->
    <el-dialog
      v-model="isShowResetPass"
      :title="$t('reset_password')"
      :close-on-click-modal="false"
      width="600px"
      center
    >
      <el-form
        ref="resetPassRef"
        :model="resetPassForm"
        :rules="resetPassRule"
        label-width="100px"
        style="width: 50%; margin: 0 auto"
      >
        <el-form-item :label="`${$t('user_name')}：`">
          <span>{{ selectedRow?.nickname }}</span>
        </el-form-item>
        <el-form-item :label="`${$t('login_account')}：`">
          <!-- <span>{{ selectedRow?.username }}</span> -->
          <el-input :model-value="selectedRow?.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item :label="`${$t('enter_password')}：`" prop="password">
          <el-input
            v-model="resetPassForm.password"
            type="password"
            :placeholder="$t('check_pass')"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item :label="`${$t('confirm_password')}：`" prop="confirmPassword">
          <el-input
            v-model="resetPassForm.confirmPassword"
            type="password"
            :placeholder="$t('check_pass')"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="isShowResetPass = false">{{ $t('cancel') }}</el-button>
          <el-button type="primary" :loading="passLoading" @click="confirmResetPass">{{
            $t('determine')
          }}</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 分配角色 -->
    <el-dialog
      v-model="isShowAssignRoles"
      :title="$t('assign_roles')"
      :close-on-click-modal="false"
      width="600px"
      center
    >
      <!-- :model="assignRolesForm" -->
      <el-form ref="assignRolesRef" label-width="100px" style="width: 50%; margin: 0 auto">
        <el-form-item :label="`${$t('user_name')}：`">
          <span>{{ selectedRow?.nickname }}</span>
        </el-form-item>
        <el-form-item :label="`${$t('login_account')}：`">
          <span>{{ selectedRow?.username }}</span>
        </el-form-item>
        <el-form-item label="">
          <el-button @click="toAssignRoles">{{ $t('current_role') }}</el-button>
        </el-form-item>
      </el-form>
      <el-dialog
        v-model="isShowAssignRolesInner"
        width="500px"
        :title="$t('current_role')"
        center
        append-to-body
      >
        <assign-roles :data="userAssignRoles" @roleChange="roleChangeHandle" />
        <template #footer>
          <span class="dialog-footer">
            <el-button type="primary" @click="isShowAssignRolesInner = false">{{
              $t('determine')
            }}</el-button>
          </span>
        </template>
      </el-dialog>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="isShowAssignRoles = false">{{ $t('cancel') }}</el-button>
          <el-button :loading="assignLoading" type="primary" @click="assignRolesConfirm">{{
            $t('determine')
          }}</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 批量分配角色 -->
    <el-dialog
      v-model="isShowBatchAssignRoles"
      :close-on-click-modal="false"
      width="500px"
      :title="$t('assigning_roles_in_batches')"
      center
      append-to-body
    >
      <assign-roles :data="userAssignRoles" @roleChange="roleChangeHandle" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="isShowBatchAssignRoles = false">{{ $t('cancel') }}</el-button>
          <el-button type="primary" :loading="roleLoading" @click="batchAssignRolesConfirm">{{
            $t('determine')
          }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import baseFilter from '@/components/base-filter/base-filter'
import baseTable from '@/components/base-table/base-table'
import assignRoles from '@/components/assign-roles/assign-roles.vue'
import {
  getUserManagementList,
  getUserManagementRoleList,
  userBatchDelete,
  userBatchStartup,
  userBatchForbid,
  getUserDeptList,
  newUserApi,
  modifyUserApi,
  userDelete,
  userStartup,
  userForbid,
  userResetPass,
  getUserAssignRoles,
  roleAssignConfirm,
  batchRolesAssignConfirm,
  checkUsernameApi,
} from '@/api/subPro/subPro'
import { passwordEncrypt } from '@/utils'
import { cloneDeep } from '@/utils/common'

export default defineComponent({
  name: 'AccountUserManagement',
  components: {
    baseFilter,
    baseTable,
    assignRoles,
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

    const areaList = ref([
      { value: '+86', label: '+86' },
      { value: '+852', label: '+852' },
      { value: '+853', label: '+853' },
    ])
    const { Harvest_Custom } = window.APP_CONFIG

    // onMounted(() => {
    //   getDictList({ types: ['areaCode'] }).then((res) => {
    //     if (res.code === 0) {
    //       areaList.value = res.result.areaCode
    //     }
    //   })
    // })

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
          return toGetUserManagementList()
        },
      },
      customColumns: [
        { type: 'selection', align: 'center' },
        { label: t('create_time'), prop: 'createTime', width: '160', sortable: 'custom' },
        { label: t('login_account'), prop: 'username', width: '120', sortable: 'custom' },
        { label: t('fullName'), prop: 'nickname', sortable: 'custom' },
        { slot: 'phoneNumber' },
        { label: t('current_role'), prop: 'roleName' },
        { label: t('current_department'), prop: 'deptName' },
        { label: t('email'), prop: 'email', width: '150' },
        { label: t('last_login_ip'), prop: 'lastLoginIp', width: '120' },
        { label: t('last_login_time'), prop: 'lastLoginTime', width: '160', sortable: 'custom' },
        { slot: 'status' },
        { slot: 'operate' },
      ],
    })
    const statusText = (num: number) => {
      const text = [t('disabled'), t('enable')]
      return text[num]
    }
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
      toGetUserManagementList()
    }
    function handleCurrentChange(theCurrentPage: number) {
      currentPage.value = theCurrentPage
      paginationConfig.value.paginationProps.currentPage = theCurrentPage
      toGetUserManagementList()
    }
    /* 分页-end */

    function toGetUserManagementList() {
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

      getUserManagementList(params)
        .then((res: { [key: string]: any }) => {
          tableConfig.tableProps.data = res.result?.records
          paginationConfig.value.paginationProps.total = res.result?.total || 0
        })
        .finally(() => {
          isLoading.value = false
        })
    }
    toGetUserManagementList()

    /* 过滤表单-start */
    const filterConfig = ref({
      formProps: {
        model: {
          keyword: '',
          roleId: '',
        },
      },
      formItems: [
        {
          prop: 'keyword',
          label: '',
          innerEl: {
            elType: 'input',
            props: {
              placeholder: Harvest_Custom ? t('keyword_placeholder_01') : t('keyword_placeholder'),
            },
          },
        },
        {
          prop: 'roleId',
          label: t('current_role'),
          innerEl: {
            elType: 'select',
            options: [{ value: '', label: t('all') }],
          },
          width: '200',
        },
      ],
    })
    const searchHandle = (data: { [name: string]: any }) => {
      currentPage.value = 1
      tablePaginationRef.value?.toFirstPage()
      // 携带自定义插槽数据并请求查询
      searchData.value = { ...data }
      toGetUserManagementList()
    }
    const resetHandle = (data: { [name: string]: any }) => {
      currentPage.value = 1
      tablePaginationRef.value?.toFirstPage()
      // 重置自定义插槽数据并请求查询
      searchData.value = { ...data }
      toGetUserManagementList()
    }
    // 获取角色列表
    getUserManagementRoleList({ pageSize: 100000 }).then((res) => {
      const options = res.result?.records.map((item: { [key: string]: any }) => ({
        value: item.id,
        label: item.name,
      }))
      const preOption = filterConfig.value.formItems[1].innerEl.options
      filterConfig.value.formItems[1].innerEl.options = preOption?.concat(options)
    })
    /* 过滤表单-end */

    const toBatchDelete = () => {
      if (tableSelectionRows?.length === 0) return ElMessage.error(t('select_batch_delete_data'))
      const ids = tableSelectionRows.map((item) => item.id)
      return userBatchDelete({ ids })
        .then(() => {
          ElMessage.success(t('delete_success'))
          toGetUserManagementList()
        })
        .finally(() => {
          visible.value = false
        })
    }
    const batchDeleteConfirm = () => {
      toBatchDelete()
      return true
    }
    const toBatchStartup = () => {
      if (tableSelectionRows?.length === 0) return ElMessage.error(t('select_batch_enable_data'))
      const ids = tableSelectionRows.map((item) => item.id)
      return userBatchStartup({ ids })
        .then(() => {
          ElMessage.success(t('enable_success'))
          toGetUserManagementList()
        })
        .finally(() => {
          eBatchVisible.value = false
        })
    }
    const batchStartupConfirm = () => {
      toBatchStartup()
      return true
    }
    const toBatchForbid = () => {
      if (tableSelectionRows?.length === 0) return ElMessage.error(t('select_batch_disable_data'))
      const ids = tableSelectionRows.map((item) => item.id)
      return userBatchForbid({ ids })
        .then(() => {
          ElMessage.success(t('disable_success'))
          toGetUserManagementList()
        })
        .finally(() => {
          dBatchVisible.value = false
        })
    }
    const batchForbidConfirm = () => {
      toBatchForbid()
      return true
    }

    // 添加/修改用户
    const isShowNewEditUser = ref(false)
    const isShowNewEditUserRole = ref(false)
    const userNewEditType = ref('new')
    const newEditUserRef = ref()
    const userAssignRoles = ref()
    const toGetUserAssignRoles = (params?: object) => {
      return getUserAssignRoles(params).then((res) => {
        userAssignRoles.value = res.result
      })
    }

    const defaultFormData = {
      nickname: '',
      areaCode: '+86',
      mobile: '',
      email: '',
      username: '',
      password: '',
      roleIds: [],
      confirmPassword: '',
      deptId: '',
      status: 1,
    }
    const newEditUserForm = ref<{ [key: string]: any }>({ ...defaultFormData })

    const validatorPassWrod = (rule: object, value: string, callback: any) => {
      const isExtent = /^.{8,16}$/.exec(value)
      const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9a-zA-Z_]{8,16}$/
      if (!reg.test(value)) {
        return callback(new Error(t('check_password')))
      }
      if (!isExtent) {
        return callback(new Error(t('password_check', 1)))
      }

      const { password, confirmPassword } = newEditUserForm.value
      const isExist = password && confirmPassword
      const isUnlikeness = password !== confirmPassword

      if (isExist && isUnlikeness) {
        return callback(new Error(t('password_check', 2)))
      }

      return callback()
    }

    const roleIdsValidtor = (rule: any, value: string[], callback: any) => {
      if (!value.length) {
        callback(new Error(t('roleId_checked')))
      }
      callback()
    }

    const nickNameValitor = (rule: any, value: string, callback: any) => {
      if (!value) {
        callback(new Error(t('please_enter_user_name')))
      }
      if (value.length > 20) {
        callback(new Error(t('name_length_prompt')))
      }
      if (value.includes(' ')) {
        callback(new Error(t('name_empty')))
      }
      callback()
    }

    const mobileValitor = (rule: any, value: string, callback: any) => {
      if (!value) {
        callback(new Error(t('please_enter_phone_number', 1)))
      }
      if (value.includes(' ')) {
        callback(new Error(t('mobile_empty')))
      }
      callback()
    }

    const userNameValitor = (rule: any, value: string, callback: any) => {
      if (!value) {
        callback(new Error(t('please_enter_login_account')))
      }
      if (value.includes(' ')) {
        callback(new Error(t('username_empty')))
      }
      callback()
    }

    const newEditUserRule = {
      nickname: [
        { required: true, message: t('please_enter_user_name'), trigger: 'blur' },
        // { min: 1, max: 20, message: t('name_length_prompt'), trigger: 'blur' },
        { validator: nickNameValitor, trigger: 'blur' },
      ],
      mobile: [
        { required: true, message: t('please_enter_phone_number', 1), trigger: 'blur' },
        { validator: mobileValitor, trigger: 'blur' },
      ],
      username: [
        { required: true, message: t('please_enter_login_account'), trigger: 'blur' },
        { validator: userNameValitor, trigger: 'blur' },
      ],
      email: [
        {
          pattern: '^[A-Za-z0-9-._]+@[A-Za-z0-9-]+(.[A-Za-z0-9]+)*(.[A-Za-z]{2,6})$',
          message: t('email_check'),
          trigger: 'blur',
        },
      ],
      roleIds: [{ validator: roleIdsValidtor, trigger: 'blur' }],
      password: [
        { required: true, message: t('please_enter_login_password'), trigger: 'blur' },
        { validator: validatorPassWrod, trigger: 'blur' },
      ],
      confirmPassword: [
        { required: true, message: t('please_enter_confirm_password'), trigger: 'blur' },
        { validator: validatorPassWrod, trigger: 'blur' },
      ],
      deptId: [{ required: true, message: t('please_select_department'), trigger: 'change' }],
      status: [{ required: true, message: t('please_select_state'), trigger: 'change' }],
    }
    const toNewUser = () => {
      userNewEditType.value = 'new'
      isShowNewEditUser.value = true

      toGetUserAssignRoles({})
    }

    // 关闭新增/修改弹窗
    const onCloseEditDialog = () => {
      newEditUserRef.value.resetFields()
      newEditUserForm.value = { ...defaultFormData }
    }

    const roleChangeHandle = (roles: string[]) => {
      newEditUserForm.value.roleIds = roles
    }

    const editLoading = ref(false)

    const confirmNewEditUser = () => {
      newEditUserRef.value.validate((validate: boolean) => {
        if (validate) {
          editLoading.value = true
          if (userNewEditType.value === 'new') {
            const params = cloneDeep(newEditUserForm.value)
            params.password = passwordEncrypt(params.password)
            newUserApi(params)
              .then(() => {
                ElMessage.success(t('new_user_success'))
                isShowNewEditUser.value = false
                toGetUserManagementList()
              })
              .finally(() => {
                editLoading.value = false
              })
          } else if (userNewEditType.value === 'edit') {
            const { id } = selectedRow.value
            modifyUserApi({ id, ...newEditUserForm.value })
              .then(() => {
                ElMessage.success(t('modify_user_success'))
                isShowNewEditUser.value = false
                toGetUserManagementList()
              })
              .finally(() => {
                editLoading.value = false
              })
          }
        }
      })
    }

    // 获取部门列表
    const userDeptList = ref()
    getUserDeptList({
      pageSize: 100000,
    }).then((res) => {
      const options = res.result?.records.map((item: { [key: string]: any }) => ({
        value: item.id,
        label: item.name,
      }))
      userDeptList.value = options
    })

    /* 操作列-start */
    // 修改
    const setRoleIdsOfNewEditUserForm = () => {
      const { superAdmin, modules } = userAssignRoles.value
      if (superAdmin && superAdmin.checked) {
        newEditUserForm.value.roleIds = [superAdmin.id]
      } else {
        const roleIds: string[] = []
        modules?.forEach((module: { [key: string]: any }) => {
          module.roles?.forEach((role: { [key: string]: any }) => {
            if (role.checked) {
              roleIds.push(role.id)
            }
          })
        })
        newEditUserForm.value.roleIds = roleIds
      }
    }
    const toModifyUser = (row: any) => {
      userNewEditType.value = 'edit'
      const { id, nickname, areaCode, mobile, email, username, deptId, status, roleName } = row
      newEditUserForm.value.nickname = nickname
      newEditUserForm.value.areaCode = areaCode
      newEditUserForm.value.mobile = mobile
      newEditUserForm.value.email = email
      newEditUserForm.value.username = username
      newEditUserForm.value.deptId = deptId
      newEditUserForm.value.status = status
      newEditUserForm.value.roleName = roleName

      isShowNewEditUser.value = true
      toGetUserAssignRoles({ id }).then(() => {
        setRoleIdsOfNewEditUserForm()
      })
    }
    // 删除
    const toUserDelete = () => {
      const { id } = selectedRow.value
      userDelete({ id }).then(() => {
        ElMessage.success(t('delete_success'))
        toGetUserManagementList()
      })
    }
    const userDeleteConfirm = () => {
      toUserDelete()
      return true
    }
    // 启动、删除
    const startupConfirm = () => {
      const { id } = selectedRow.value
      userStartup({ id }).then(() => {
        ElMessage.success(t('enable_success'))
        toGetUserManagementList()
      })
      return true
    }
    const forbidConfirm = () => {
      const { id } = selectedRow.value
      userForbid({ id }).then(() => {
        ElMessage.success(t('disable_success'))
        toGetUserManagementList()
      })
      return true
    }
    // 重置密码
    const isShowResetPass = ref(false)
    const resetPassRef = ref()
    const resetPassForm = ref({
      password: '',
      confirmPassword: '',
    })
    const validatorPassWrod2 = (rule: object, value: string, callback: any) => {
      const isExtent = /^.{8,16}$/.exec(value)
      const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9a-zA-Z_]{8,16}$/
      if (!reg.test(value)) {
        return callback(new Error(t('check_password')))
      }
      if (!isExtent) {
        return callback(new Error(t('password_check', 1)))
      }

      const { password, confirmPassword } = resetPassForm.value
      const isExist = password && confirmPassword
      const isUnlikeness = password !== confirmPassword

      if (isExist && isUnlikeness) {
        return callback(new Error(t('password_check', 2)))
      }

      return callback()
    }

    const resetPassRule = ref({
      password: [
        { required: true, message: t('please_enter_password'), trigger: 'blur' },
        { required: true, validator: validatorPassWrod2, trigger: 'blur' },
      ],
      confirmPassword: [
        { required: true, message: t('please_enter_password'), trigger: 'blur' },
        { required: true, validator: validatorPassWrod2, trigger: 'blur' },
      ],
    })
    const openResetPassDialog = () => {
      isShowResetPass.value = true
      resetPassRef.value?.resetFields()
    }

    const passLoading = ref(false)

    const confirmResetPass = () => {
      resetPassRef.value.validate((validate: boolean) => {
        if (validate) {
          passLoading.value = true
          const { id } = selectedRow.value
          const password = passwordEncrypt(resetPassForm.value.password)
          userResetPass({ id, password })
            .then(() => {
              ElMessage.success(t('reset_password_success'))
              isShowResetPass.value = false
            })
            .finally(() => {
              passLoading.value = false
            })
        }
      })
    }

    /* 操作列-end */

    // 分配角色
    const isShowAssignRoles = ref(false)
    const isShowAssignRolesInner = ref(false)
    const openAssignRolesDialog = () => {
      isShowAssignRoles.value = true
      setTimeout(() => {
        const { id } = selectedRow.value
        toGetUserAssignRoles({ id }).then(() => {
          setRoleIdsOfNewEditUserForm()
        })
      }, 20)
    }
    const toAssignRoles = () => {
      isShowAssignRolesInner.value = true
    }

    const assignLoading = ref(false)
    const assignRolesConfirm = () => {
      setTimeout(() => {
        const { id } = selectedRow.value
        assignLoading.value = true
        roleAssignConfirm({ id, roleIds: newEditUserForm.value.roleIds })
          .then(() => {
            ElMessage.success(t('assigning_roles_success'))
            isShowAssignRoles.value = false
            toGetUserManagementList()
          })
          .finally(() => {
            assignLoading.value = false
          })
      }, 20)
    }

    // 批量分配角色
    const isShowBatchAssignRoles = ref(false)
    const openBatchAssignRolesDialog = () => {
      if (tableSelectionRows.length === 0) return ElMessage.warning(t('please_select_user'))
      toGetUserAssignRoles({}).then(() => {
        isShowBatchAssignRoles.value = true
      })
    }

    const roleLoading = ref(false)

    const batchAssignRolesConfirm = () => {
      console.log(89, newEditUserForm.value.roleIds)
      const roleIds = newEditUserForm.value.roleIds || []
      if (roleIds.length === 0) {
        return ElMessage.warning(`${t('please_select')}${t('assign_roles')}`)
      }
      if (tableSelectionRows?.length === 0) return ElMessage.warning(t('please_select_user'))
      const ids = tableSelectionRows.map((item) => item.id)
      roleLoading.value = true
      return batchRolesAssignConfirm({ ids, roleIds: newEditUserForm.value.roleIds })
        .then(() => {
          ElMessage.success(t('assigning_roles_in_batches_success'))
          isShowBatchAssignRoles.value = false
          toGetUserManagementList()
        })
        .finally(() => {
          roleLoading.value = false
        })
    }
    // 检查可用
    const checkUsername = (username: any) => {
      checkUsernameApi({ username }).then((res) => {
        const checkResult = res.result
        if (checkResult === false) {
          ElMessage.success(t('yes_use'))
        } else {
          ElMessage.error(t('no_use'))
        }
      })
      return true
    }

    const visible = ref<boolean>(false)
    const eBatchVisible = ref<boolean>(false)
    const dBatchVisible = ref<boolean>(false)
    const showDelete = (apiStr: string) => {
      if (!tableSelectionRows.length) {
        ElMessage.warning(t('please_select_user'))
        apiStr === 'visible' ? (visible.value = false) : null
        apiStr === 'eVisible' ? (eBatchVisible.value = false) : null
        apiStr === 'dVisible' ? (dBatchVisible.value = false) : null
        return
      }
      apiStr === 'visible' ? (visible.value = true) : null
      apiStr === 'eVisible' ? (eBatchVisible.value = true) : null
      apiStr === 'dVisible' ? (dBatchVisible.value = true) : null
    }

    const onRole = () => {
      if (newEditUserRef.value) newEditUserRef.value.validateField('roleIds')
      isShowNewEditUserRole.value = false
    }

    return {
      selectedRow,
      tableConfig,
      paginationConfig,
      statusText,
      filterConfig,
      searchHandle,
      resetHandle,
      batchDeleteConfirm,
      batchStartupConfirm,
      batchForbidConfirm,
      isShowNewEditUser,
      userNewEditType,
      newEditUserRef,
      newEditUserForm,
      newEditUserRule,
      toNewUser,
      isShowNewEditUserRole,
      userDeptList,
      confirmNewEditUser,
      toModifyUser,
      userDeleteConfirm,
      startupConfirm,
      forbidConfirm,
      isShowResetPass,
      resetPassRef,
      resetPassForm,
      resetPassRule,
      openResetPassDialog,
      confirmResetPass,
      passLoading,
      userAssignRoles,
      isShowAssignRoles,
      isShowAssignRolesInner,
      openAssignRolesDialog,
      toAssignRoles,
      assignRolesConfirm,
      assignLoading,
      isShowBatchAssignRoles,
      openBatchAssignRolesDialog,
      batchAssignRolesConfirm,
      roleLoading,
      roleChangeHandle,
      checkUsername,
      isLoading,
      editLoading,
      visible,
      showDelete,
      areaList,
      eBatchVisible,
      dBatchVisible,
      onCloseEditDialog,
      onRole,
    }
  },
})
</script>
<style lang="scss" scoped>
.mr10 {
  margin-right: 10px;
}

:deep(.el-input-group__prepend) {
  width: 118px;
}

:deep(.el-form) {
  .el-form-item {
    .el-input {
      &.suffix-mobile-copy {
        .el-input {
          width: 100px;
        }
      }
    }
  }
}

:deep(.el-input__validateIcon) {
  display: none;
}

.filter {
  :deep(.el-select) {
    width: 200px !important;
  }
}
</style>

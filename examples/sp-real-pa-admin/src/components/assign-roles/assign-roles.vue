<template>
  <div class="assign-roles">
    <el-checkbox-group
      v-if="superAdmin?.id"
      v-model="superModel.super"
      class="super-item"
      @change="superChange"
    >
      <el-checkbox :label="superAdmin.id">
        <span class="super-title">{{ superAdmin.name }}</span>
      </el-checkbox>
    </el-checkbox-group>
    <div v-for="group of modules" :key="group.code" class="module-item">
      <div class="module-title">{{ group.name }}:</div>
      <el-checkbox-group
        v-model="roleModel[group.code]"
        :disabled="disabledModules"
        @change="modulesChange"
      >
        <el-checkbox
          v-for="item of group.roles"
          :key="item.id"
          :label="item.id"
          class="checkbox-item"
        >
          {{ item.name }}
        </el-checkbox>
      </el-checkbox-group>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, ref, watch } from 'vue'

export default defineComponent({
  name: 'AssignRoles',
  props: {
    data: Object,
  },
  emits: ['roleChange'],
  setup(props, { emit }) {
    const disabledModules = ref(false)
    const { data } = props
    const { superAdmin = {}, modules = [] } = data || {}

    const obj: { [key: string]: any } = {}
    modules?.forEach((item: { code: string }) => {
      obj[item.code] = []
    })
    const roleModel = reactive(obj)
    const superModel = reactive<{ super: string[] }>({ super: [] })

    const superChange = (value: string[]) => {
      if (value?.length > 0) {
        superModel.super = value
        Object.keys(roleModel).forEach((key) => {
          roleModel[key] = []
          disabledModules.value = true
        })
      } else {
        disabledModules.value = false
      }
      emit('roleChange', value)
    }
    const modulesChange = () => {
      let moduleRole: string[] = []
      Object.keys(roleModel).forEach((key) => {
        if (roleModel[key]) moduleRole = [...moduleRole, ...roleModel[key]]
      })
      emit('roleChange', moduleRole)
    }

    // 回显
    const fillChecked = (superAdminParam: { [key: string]: any }, modulesParam: any[]) => {
      if (superAdminParam?.checked) {
        superChange([superAdminParam.id])
      } else {
        superModel.super = []
        disabledModules.value = false
        modulesParam?.forEach((module) => {
          const checkedRoles = module.roles?.filter((role: { [key: string]: any }) => role.checked)
          roleModel[module.code] = checkedRoles?.map(
            (checkedRole: { [key: string]: any }) => checkedRole.id
          )
        })
      }
    }

    watch(
      () => props.data,
      (newVal: { [Key: string]: any }) => {
        fillChecked(newVal.superAdmin, newVal.modules)
      }
    )

    onMounted(() => {
      fillChecked(superAdmin, modules)
    })

    return {
      disabledModules,
      superAdmin,
      modules,
      roleModel,
      superModel,
      superChange,
      modulesChange,
    }
  },
})
</script>
<style lang="scss" scoped>
.assign-roles {
  .super-item {
    margin-bottom: 15px;
    .super-title {
      font-weight: bold;
    }
  }
  .module-item {
    margin-bottom: 15px;
    .module-title {
      display: none;
      font-weight: bold;
      margin-bottom: 5px;
    }

    .checkbox-item {
      width: 50%;
      margin: 0 0 5px 0;
      padding-right: 30px;
      box-sizing: border-box;
    }

    :deep(.el-checkbox-group) {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      width: 100%;
    }

    :deep(.el-checkbox__label) {
      white-space: pre-wrap;
    }
  }
}
</style>

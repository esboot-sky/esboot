<template>
  <!-- 统计报表-上报报表 -->
  <!-- 结算管理-利息结算模块 -->
  <div class="page-container">
    <el-tabs v-model="activeName" type="border-card" class="demo-tabs">
      <el-tab-pane :label="t('hk_market_order_details_table')" name="0">
        <OrderForm />
      </el-tab-pane>
      <!-- <el-tab-pane :label="t('hk_market_trial_table')" name="1">
        <TrialForm />
      </el-tab-pane> -->
      <el-tab-pane :label="t('us_user_declaration_form')" name="2">
        <UserDeclarationForm />
      </el-tab-pane>
      <el-tab-pane :label="t('us_market_report')" name="3">
        <MarketForm />
      </el-tab-pane>
      <!-- <el-tab-pane label="员工表" name="2">
        <StaffForm />
      </el-tab-pane> -->
    </el-tabs>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import OrderForm from './conponent/order-form/order-form.vue'
import TrialForm from './conponent/trial-form/trial-form.vue'
import UserDeclarationForm from './conponent/user-declaration-form/user-declaration-form.vue'
import MarketForm from './conponent/market-form/market-form.vue'
// import StaffForm from './conponent/staff-form/staff-form.vue'
const { t } = useI18n()
const activeName = ref('0')
</script>

<style lang="scss" scoped></style>

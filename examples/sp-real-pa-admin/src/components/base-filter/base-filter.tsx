import { defineComponent, toRefs, reactive, PropType,watch } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  ElForm,
  ElFormItem,
  ElInput,
  ElDatePicker,
  ElSelect,
  ElOption,
  ElButton,
} from 'element-plus'
import './base-filter.scss'
import { computed } from '@vue/reactivity'

interface filterProps {
  formProps: Partial<typeof ElForm>
  formItems: any[]
}

export default defineComponent({
  components: { ElForm, ElFormItem, ElInput, ElDatePicker, ElSelect, ElOption, ElButton },
  props: {
    config: {
      type: Object as PropType<filterProps>,
      required: true,
    },
    tabActive: String,
  },
  setup(props, { slots, emit }: { [name: string]: any }) {
    const { t } = useI18n()
    const { config, tabActive } = toRefs(props)
    const { model } = reactive(config.value.formProps)
    const onSearch = () => {
      emit('onSearch', model)
    }

    const onReset = () => {
      Object.keys(model).forEach((key) => (model[key] = ''))
      emit('onReset', model)
    }
    watch(
      () => props.tabActive,
      () => {
        onReset()
        // Object.keys(model).forEach((key) => (model[key] = ''))
      }
    )
    return () => (
      <div class="base-filter">
        <el-form inline={true} {...config.value?.formProps} class="demo-form-inline">
          {config.value?.formItems.map((formItem) => {
            let formItemTag = null
            if (formItem.slot) {
              formItemTag = slots[formItem.slot]()
            } else {
              let innerElTag = null
              const { innerEl, ...params } = formItem              
              switch (innerEl?.elType) {
                case 'input':
                  innerElTag = (
                    <el-input
                      clearable
                      v-model={model[formItem.prop]}
                      {...innerEl.props}
                    ></el-input>
                  )
                  break
                case 'datePicke':
                  innerElTag = (
                    <el-date-picker
                      v-model={model[formItem.prop]}
                      type="datetimerange"
                      picker-options={{ format: 'yyyy-MM' }}
                      range-separator="至"
                      start-placeholder={t('start_date')}
                      end-placeholder={t('end_date')}
                      {...innerEl.props}
                    ></el-date-picker>
                  )
                  break
                case 'select':
                  innerElTag = (
                    <el-select
                      clearable
                      v-model={model[formItem.prop]}
                      placeholder={t('please_select')}
                      {...innerEl.props}
                    >
                      {innerEl.options?.map((option: { label: string; value: number | string }) => {
                        return <el-option label={option.label} value={option.value}></el-option>
                      })}
                    </el-select>
                  )
                  break
              }
              formItemTag = <el-form-item {...params}>{innerElTag}</el-form-item>
            }
            return formItemTag
          })}
          <el-form-item>
            <el-button type="primary" onClick={onSearch}>
              {t('query')}
            </el-button>
            <el-button type="primary" onClick={onReset}>
              {t('reset')}
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    )
  },
})

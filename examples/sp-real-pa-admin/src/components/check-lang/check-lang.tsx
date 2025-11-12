import { defineComponent, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import './check-lang.scss'
import IconZh from './image/zh.svg'
import IconHk from './image/hk.svg'
import IconEn from './image/en.svg'

export function getLangIcon(lang: string) {
  if (lang === 'zh-TW') return IconHk
  if (lang === 'en-US') return IconEn

  return IconZh
}

export default defineComponent({
  name: 'CheckLang',
  props: {
    modelValue: {
      type: String
    }
  },
  setup(props, { emit }) {
    const value = computed(() => props.modelValue)
    const store = useStore()
    const { t } = useI18n()
    const changeLang = (v: string) => {
      emit('update:modelValue', v)
    }

    return () => (
      <div class="check-lang">
        {store.state.languageList.length > 1
          ? store.state.languageList.map((item: any) => {
              return (
                <div
                  class={value.value === item[0] ? 'active check-lang-item' : 'check-lang-item'}
                  onClick={() => changeLang(item[0])}
                >
                  {t(item[0])}
                </div>
              )
            })
          : null}
      </div>
    )
  }
})

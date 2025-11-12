import { defineComponent, getCurrentInstance, computed } from 'vue';
import { useI18n } from 'vue-i18n'
import './check-lang.scss'
import IconZh from './image/zh.svg';
import IconHk from './image/hk.svg';
import IconEn from './image/en.svg';

export function getLangIcon(lang: string) {
  if (lang === 'zh_TW') return IconHk;
  if (lang === 'en_US') return IconEn;

  return IconZh;
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
    const { t } = useI18n()
    const changeLang = (v: string) => {
      emit('update:modelValue', v)
    }

    return () => (
      <div class="check-lang">
        <div
          class={value.value === 'zh_CN' ? 'active check-lang-item' : 'check-lang-item'}
          onClick={() => changeLang('zh_CN')}
        >
          {t('zh_cn')}
        </div>

        <div class={value.value === 'zh_TW' ? 'active check-lang-item' : 'check-lang-item'}
          onClick={() => changeLang('zh_TW')}
        >
          {t('zh_tw')}
        </div>

        <div class={value.value === 'en_US' ? 'active check-lang-item' : 'check-lang-item'}
          onClick={() => changeLang('en_US')}
        >
          {t('en_us')}
        </div>
      </div>
    )
  }
})

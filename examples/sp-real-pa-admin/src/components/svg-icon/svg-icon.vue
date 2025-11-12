<template>
  <svg :width="size" :height="size" aria-hidden="true" :style="{ fill: 'currentColor' }">
    <image :href="path" style="width: 100%; height: 100%" />
  </svg>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'SvgIcon',
  props: {
    // prefix: {
    //   type: String,
    //   default: 'svg-icons',
    // },
    path: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      default: 20,
    },
  },
  setup(props: any) {
    // const path = computed(() => require(`@/${props.prefix}/${props.name}.svg`))
    // return { path: '' }
  },
})
</script>

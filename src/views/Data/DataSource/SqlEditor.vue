<template>
  <codemirror v-model="status.code" :options="status.option" />
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import { codemirror } from 'vue-codemirror'
import 'codemirror/mode/sql/sql.js'
import 'codemirror/theme/solarized.css'

export default defineComponent({
  components: { codemirror },
  setup() {
    const status = reactive<{
      option: object
      code: string
    }>({
      option: {
        tabSize: 4,
        styleActiveLine: true,
        lineNumbers: true,
        line: true,
        mode: 'text/x-mysql',
        theme: 'solarized light'
      },
      code: ''
    })

    return { status }
  }
})
</script>

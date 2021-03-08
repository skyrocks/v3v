<template>
  <div>
    <Group ref="refGroup" group-type="dataSourceGroup"></Group>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import { useStore } from 'vuex'
import { dsApi } from '@/api/modules/ds'
import Group from '@/components/Group/index.vue'

export default defineComponent({
  components: { Group },
  setup() {
    const store = useStore()

    onMounted(() => {
      dsApi.getGroups().then(resp => {
        if (resp.success) {
          store.dispatch('dataSourceGroup/setList', resp.data)
        }
      })
    })
  }
})
</script>

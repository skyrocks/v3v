import { defineComponent } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  setup() {
    const store = useStore()
    return () => (
      <div>
        <h2 style="text-align:center">Dashboard</h2>
        <p>{store.getters.user.userName} </p>
      </div>
    )
  }
})

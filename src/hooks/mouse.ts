import { ref, onMounted, onUnmounted } from 'vue'

export type MouseMoveDirection = 'up' | 'down'

export function useMousePosition() {
  const x = ref(0)
  const y = ref(0)

  const direction = ref('')

  function update(e: any) {
    if (x.value > e.pageX) {
      direction.value = 'down'
    } else {
      direction.value = 'up'
    }
    x.value = e.pageX
    y.value = e.pageY
  }

  onMounted(() => {
    window.addEventListener('mousemove', update)
  })

  onUnmounted(() => {
    window.removeEventListener('mousemove', update)
  })

  return { x, y, direction }
}

import { onMounted, UnwrapRef } from 'vue'
import { CustomResponse } from '@/api/types'
import { useRouter } from 'vue-router'

export default function hooks(
  routeBase: string,
  apiPromise: Promise<CustomResponse>,
  status: UnwrapRef<{
    groups: any[]
    subMenuOpen: { [key: number]: boolean }
    searchText: string
  }>
) {
  const router = useRouter()
  const getGroups = () => {
    apiPromise.then(response => {
      status.groups = response.data
    })
  }
  onMounted(getGroups)

  const handleOpenClose = (index: number) => {
    status.subMenuOpen[index] = !status.subMenuOpen[index]
  }

  const handleSelect = (path: string) => {
    const id = path[1].split('-')[1]
    router.push(`${routeBase}/${id}`)
  }

  return { handleOpenClose, handleSelect }
}

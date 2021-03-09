import { localStore } from '@/utils/storage/localStorage'

export function getToken() {
  return localStore.get('token')
}

export function setToken(token: string) {
  localStore.set('token', token)
}

export function removeToken() {
  localStore.remove('token')
}

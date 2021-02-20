export default import.meta.env

export const API_DOMAIN = import.meta.env.VITE_API_DOMAIN as string

export const BASE_URL = import.meta.env.BASE_URL as string

export const isDev = import.meta.env.DEV as boolean

export const MODE = import.meta.env.MODE as string

export const isProd = import.meta.env.PROD as boolean

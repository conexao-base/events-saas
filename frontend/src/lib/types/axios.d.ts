import 'axios'

declare module 'axios' {
  interface AxiosRequestConfig {
    skipAuthHandling?: boolean
  }
}
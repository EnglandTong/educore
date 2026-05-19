import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'

import { useAuthStore } from '@/stores/authStore'
import { useToastStore } from '@/stores/toastStore'
import { getWarmLoginRedirectMessage } from '@/utils/warmMessages'

import { isApiFailure } from './meta'

const baseURL = import.meta.env.VITE_API_URL ?? '/api/v1'

export const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
})

let refreshInFlight: Promise<string | null> | null = null

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = useAuthStore.getState().refreshToken
  if (!refreshToken) return null
  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      try {
        const res = await api.post('/auth/refresh', { refreshToken })
        const data = res.data as {
          success: boolean
          data?: { accessToken: string; refreshToken: string }
        }
        if (data.success && data.data) {
          useAuthStore.setState({
            accessToken: data.data.accessToken,
            refreshToken: data.data.refreshToken,
          })
          return data.data.accessToken
        }
        return null
      } catch {
        return null
      } finally {
        refreshInFlight = null
      }
    })()
  }
  return refreshInFlight
}

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const isRefresh = config.url?.includes('/auth/refresh')
  if (isRefresh) {
    delete config.headers.Authorization
    return config
  }
  const token = useAuthStore.getState().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined
    const status = error.response?.status

    if (original?.url?.includes('/auth/refresh') && status === 401) {
      useAuthStore.getState().clearSession()
      useToastStore.getState().pushToast({
        variant: 'info',
        title: 'Session refresh',
        message: getWarmLoginRedirectMessage(),
      })
      return Promise.reject(error)
    }

    if (status === 401 && original && !original._retry) {
      original._retry = true
      const newAccess = await refreshAccessToken()
      if (newAccess) {
        original.headers.Authorization = `Bearer ${newAccess}`
        return api(original)
      }
      useAuthStore.getState().clearSession()
      useToastStore.getState().pushToast({
        variant: 'info',
        title: 'Session refresh',
        message: getWarmLoginRedirectMessage(),
      })
    }

    const body = error.response?.data
    if (isApiFailure(body)) {
      useToastStore.getState().pushToast({
        variant: 'error',
        title: 'Something needs another try',
        message: body.error.message,
      })
    } else if (error.message === 'Network Error') {
      useToastStore.getState().pushToast({
        variant: 'error',
        title: 'Connection hiccup',
        message: "Hmm, we're having trouble connecting. Let's try again in a moment!",
      })
    } else if (status && status >= 500) {
      useToastStore.getState().pushToast({
        variant: 'error',
        title: 'Something went wrong on our end',
        message: 'Our team feels the bump too — please try again in a little while.',
      })
    } else if (status === 404) {
      useToastStore.getState().pushToast({
        variant: 'error',
        title: 'We could not find that',
        message: 'It may have moved or needs a different path — take a breath, then try again when you are ready.',
      })
    } else if (status && status !== 401) {
      useToastStore.getState().pushToast({
        variant: 'error',
        title: 'Something needs another try',
        message: 'The request did not land the way we hoped — a refresh or a gentler retry usually helps.',
      })
    }

    return Promise.reject(error)
  },
)

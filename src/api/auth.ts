import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5002'
const AUTH_API = `${API_BASE_URL}/auth/get-token`
const COOKIE_EXPIRE_SECONDS = 86400 // Store token in cookie with 1 day expiration (86400 seconds)

export function getCookie(name: string): string | undefined {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift()
  }
  return undefined
}

export function setCookie(name: string, value: string, expireSeconds: number): void {
  const date = new Date()
  date.setTime(date.getTime() + expireSeconds * 1000)
  const expires = `expires=${date.toUTCString()}`
  document.cookie = `${name}=${value}; ${expires}; path=/`
}

export async function createAccessToken(): Promise<string> {
  const existingToken = getCookie('access_token_new')
  if (existingToken && existingToken !== 'undefined') {
    return existingToken
  }

  try {
    const response = await axios.get(AUTH_API, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (response.data.access_token) {
      setCookie('access_token_new', response.data.access_token, COOKIE_EXPIRE_SECONDS)
      return response.data.access_token
    } else {
      throw new Error('Failed to get access token')
    }
  } catch (error) {
    console.error('Error getting access token:', error)
    // TODO: ga4
    throw error
  }
}

export async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = await createAccessToken()
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

export const callApiWithAuth = async <T>(
  url: string,
  options?: AxiosRequestConfig
): Promise<T | null> => {
  try {
    const authHeaders = await getAuthHeaders()
    const config: AxiosRequestConfig = {
      ...options,
      headers: {
        ...authHeaders,
        ...options?.headers,
      },
    }

    const res: AxiosResponse<T> = await axios(url, config)
    return res.data
  } catch (error) {
    if (error instanceof axios.AxiosError) {
      return error.response?.data || error.message
    }
    return null
  }
}

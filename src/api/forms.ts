import { callApiWithAuth } from '@/api/auth'
import { SubmitTakakuData } from '@/types/form'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5002'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const postTakakuFormData = async (data: SubmitTakakuData): Promise<any> => {
  try {
    const body = JSON.parse(JSON.stringify(data))

    return callApiWithAuth(`${API_BASE_URL}/raiten`, {
      method: 'POST',
      data: JSON.stringify(body),
    })
  } catch (error) {
    // TODO: send event Error ga4
    if (error instanceof axios.AxiosError) {
      return error.response?.data.message
    }
  }
}

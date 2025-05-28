import { FormLocation } from '@/types'
import axios from 'axios'

export const getAddressByZipCode = async (zipCode: string): Promise<FormLocation | null> => {
  const apiUrl =
    'https://3fpocjd826.execute-api.ap-northeast-1.amazonaws.com/prod/get-address-by-zip'
  const params = {
    zip: zipCode,
  }
  try {
    const response = await axios.get(apiUrl, { params })
    if (response.status === 200 && !response.data.errorMessage) {
      return response.data
    } else {
      return null
    }
  } catch (error) {
    // TODO: send Error event to GA4
    console.error('Error fetching address:', error)
    return null
  }
}

export const checkZipCodeCombineAddress = async (
  zipCode: string,
  pref: string,
  address: string
) => {
  const apiUrl = 'https://www.takakuureru.com/v2logi/diff_zip'
  const params = {
    zip_code: zipCode,
    pref: pref,
    address: address,
  }
  try {
    const response = await axios.get(apiUrl, { params })
    if (response.data.status === 'ok' && response.data.exists) {
      return true
    } else {
      return false
    }
  } catch (error) {
    // TODO: send Error event to GA4
    console.error('Error checking zip code and address:', error)
    return false
  }
}

export async function getShopList() {
  const apiUrl = 'https://39hwxygwkc.execute-api.ap-northeast-1.amazonaws.com/prod/api/shop/list'
  try {
    const response = await axios.get(apiUrl)
    if (response.status !== 200) {
      throw new Error(`Error fetching shop list: ${response.statusText}`)
    }
    return response.data
  } catch (error) {
    // TODO: send Error event to GA4
    console.error('Error fetching shop list:', error)
    throw error
  }
}

export async function getCenterList() {
  const apiUrl = 'https://39hwxygwkc.execute-api.ap-northeast-1.amazonaws.com/prod/api/center/list'
  try {
    const response = await axios.get(apiUrl)
    if (response.status !== 200) {
      throw new Error(`Error fetching center list: ${response.statusText}`)
    }
    return response.data
  } catch (error) {
    // TODO: send Error event to GA4
    console.error('Error fetching center list:', error)
    throw error
  }
}

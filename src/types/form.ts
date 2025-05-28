import { Site } from '@/types/index'
export type ConditionProduct = '中古' | '新品' | 'ジャンク'
export type SubmitTakakuData = {
  business_domain: string
  oeoe93: string
  kana: string
  email: string
  phone_number: string
  zip?: string
  pref?: string
  address?: string
  subscribe_mm?: string
  memo?: string
  items: {
    title: string
    condition: string
    item_comment?: string | null
  }[]
  site: Site
}

export interface Product {
  title: string
  condition: ConditionProduct
  item_comment?: string
}

export interface CustomerInfo {
  name: string
  email: string
  phone: string
  zipCode: string
  pref: string
  address: string
}

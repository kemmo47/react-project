import type { DomainHead } from '@/config/domainHeadMap'
import type { CenterList } from '@/types'
import { CustomerInfo, Product } from '@/types/form'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FormTakakuData {
  selectedShop: string | null
  selectedDate: number | null
  products: Product[]
  customerInfo: CustomerInfo
  pageHead: DomainHead
  centerList: CenterList[]
}

interface FormActions {
  setSelectedShop: (shop: string) => void
  setSelectedDate: (date: number) => void
  addProduct: (product: Product) => void
  updateProduct: (index: number, product: Partial<Product>) => void
  removeProduct: (index: number) => void
  setCustomerInfo: (info: CustomerInfo) => void
  setPageHead: (pageHead: DomainHead) => void
  setCenter: (centerList: CenterList[]) => void
  reset: () => void
}

const initialState: Omit<FormTakakuData, 'products'> & { products: Product[] } = {
  selectedShop: null,
  selectedDate: null,
  products: [],
  customerInfo: {
    name: '',
    email: '',
    phone: '',
    zipCode: '',
    pref: '',
    address: '',
  },
  pageHead: {
    favicon: () => import('@/assets/favicon.ico'),
    logo: () => import('@/assets/logo.svg'),
    pageStep: {
      '0': {
        title: '',
        description: '',
      },
    },
  },
  centerList: [],
}

export const useFormStore = create<FormTakakuData & FormActions>()(
  persist(
    (set) => ({
      ...initialState,
      setSelectedShop: (shop) => set({ selectedShop: shop }),
      setSelectedDate: (date) => set({ selectedDate: date }),
      addProduct: (product) => set((state) => ({ products: [...state.products, product] })),
      updateProduct: (index: number, updatedFields) =>
        set((state) => ({
          products: state.products.map((p, i) =>
            i === Number(index) ? { ...p, ...updatedFields } : p
          ),
        })),
      removeProduct: (index) =>
        set((state) => ({
          products: state.products.filter((_, i) => i !== Number(index)),
        })),
      setCustomerInfo: (info) => set({ customerInfo: info }),
      setPageHead: (pageHead) => set({ pageHead }),
      setCenter: (centerList) => set({ centerList }),
      reset: () =>
        set({
          selectedShop: '',
          selectedDate: 0,
          products: [],
          customerInfo: {
            name: '',
            email: '',
            phone: '',
            zipCode: '',
            pref: '',
            address: '',
          },
        }),
    }),
    {
      name: 'takaku_form_store',
      storage: {
        getItem: (name) => {
          const item = sessionStorage.getItem(name)
          return item ? JSON.parse(item) : null
        },
        setItem: (name, value) => sessionStorage.setItem(name, JSON.stringify(value)),
        removeItem: (name) => sessionStorage.removeItem(name),
      },
    }
  )
)

import { useFormStore } from '@/store'
import { useEffect, useRef } from 'react'

type WrapperListShopProps = {
  isOpen: boolean
  close: () => void
}

const WrapperListShop = ({ isOpen, close }: WrapperListShopProps) => {
  const { setSelectedShop, centerList, selectedShop } = useFormStore()
  const itemRefs = useRef<Map<string, HTMLDivElement | null>>(new Map())

  useEffect(() => {
    if (isOpen && selectedShop) {
      const el = itemRefs.current.get(selectedShop)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }, [isOpen, selectedShop])

  return (
    <div className="pr-1 mr-1 overflow-y-auto h-[calc(100%-40px)]">
      <div className="py-2.5 pl-2.5 pr-1">
        {centerList.map((item, key) => (
          <div
            ref={(el) => {
              itemRefs.current.set(item.business_domain, el)
            }}
            key={key}
            className={`${selectedShop === item.business_domain ? 'bg-[#f2fdfa] border-[#059467]' : 'border-[#d0d5dc]'} relative border rounded overflow-hidden p-2 text-[13px] mb-3 cursor-pointer user-select-none`}
            onClick={() => {
              setSelectedShop(item.business_domain)
              close()
            }}
          >
            <p className="font-semibold pr-12">{item.name}</p>
            <p>{item.address}</p>
            <p>
              {item.hours}
              {'　'}駐車場あり
            </p>
            <a
              type="button"
              onClick={(e) => e.stopPropagation()}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`${selectedShop === item.business_domain ? 'border-[#059467]' : 'border-[#d0d5dc]'} absolute right-0 top-0 block border-l border-b px-3 py-0.5 text-[#4492f8] text-[13px] duration-200 hover:bg-[#f1f5f9] active:bg-[#e2e8f0] focus:outline-none`}
            >
              経路
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
export default WrapperListShop

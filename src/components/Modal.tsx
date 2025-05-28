import Close from '@/components/icons/Close'
import React from 'react'

type ModalProps = {
  isOpen: boolean
  children: React.ReactNode
  onClose: () => void
}

const Modal: React.FC<ModalProps> = ({ isOpen, children, onClose }) => {
  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/60 flex justify-center items-center z-50">
      <div
        className="bg-white rounded-lg shadow-lg h-[calc(100%-100px)] overflow-hidden max-w-[425px] w-full relative mx-4 sm:mx-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pl-3 pr-2 py-1.5 border-b border-[#d0d5dc]">
          <h3 className="font-semibold text-[13px]">店舗を検索する</h3>
          <button
            className="text-5xl cursor-pointer duration-100 hover:text-red-500"
            onClick={onClose}
          >
            <Close
              strokeWidth={2}
              classNameSvg="h-7 w-7"
              classNameI="text-black duration-100 hover:text-red-500"
            />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export default Modal

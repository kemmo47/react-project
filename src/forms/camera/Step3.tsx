import product_icon from '@/assets/product_icon.png' // Adjust the path as needed
import { useFormStore } from '@/store'
import { Product } from '@/types/form'

type Step3Props = {
  onNext: (step: string, index?: string) => void
}

const Step3 = ({ onNext }: Step3Props) => {
  // Get products and removeProduct from store
  const products = useFormStore((state) => state.products)
  const removeProduct = useFormStore((state) => state.removeProduct)

  // Delete product handler
  const handleDelete = (index: number) => {
    removeProduct(index)
  }

  // Edit product handler (placeholder)
  const handleEdit = (index: number) => {
    onNext('2', index.toString())
  }

  // Add product handler (placeholder)
  const handleAdd = () => {
    // Implement navigation to Step2 or product add logic
    onNext('2')
  }

  // Next handler
  const handleNext = () => {
    onNext('4')
  }

  return (
    <div className="px-2.5 mb-3.5 md:px-0 flex flex-col">
      <h1 className="text-lg font-semibold text-center mt-1.5 mb-4 sm:text-2xl">商品確認</h1>

      <div className="flex-1">
        {products.map((product: Product, idx) => (
          <div
            key={idx}
            className="grid grid-cols-3 gap-2 border-b-0 border border-[#d0d5dc] bg-[#f5f5f5] p-3 first:rounded-t last:rounded-b last:border-b sm:grid-cols-[auto_auto_auto] sm:gap-6"
          >
            <div className="flex items-center gap-2 col-span-2 sm:gap-3">
              <img
                src={product_icon}
                alt="Product icon"
                width={24}
                height={24}
                className="object-contain w-4 h-4 sm:w-6 sm:h-6"
              />
              <span className="flex-1 text-[13px] sm:text-base font-medium text-gray-800 break-all">
                {product.title}
              </span>
            </div>

            <div className="flex items-center justify-end gap-px col-span-1">
              <button
                type="button"
                className="bg-[#d0d5dc] text-[13px] rounded-l w-[50px] h-[30px] cursor-pointer sm:text-base sm:h-11 sm:w-[60px] duration-150 hover:bg-[#c0c5d0] active:bg-[#b0b5c0] focus:outline-none"
                onClick={() => handleEdit(idx)}
              >
                修正
              </button>
              <button
                type="button"
                className="bg-[#d0d5dc] text-[13px] rounded-r w-[50px] h-[30px] cursor-pointer sm:text-base sm:h-11 sm:w-[60px] duration-150 hover:bg-red-600/30 active:bg-red-600/30 focus:outline-none"
                onClick={() => handleDelete(idx)}
              >
                削除
              </button>
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <div className="text-center text-gray-400 py-8">商品がありません</div>
        )}
      </div>
      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-3 mt-6 min-[370px]:gap-4 sm:gap-6">
        <button
          type="button"
          className="col-span-1 text-xs text-white bg-[#fbbd23] rounded cursor-pointer duration-150 hover:bg-[#f9a800] active:bg-[#f78c00] focus:outline-none sm:text-base sm:px-4 sm:py-2"
          onClick={handleAdd}
        >
          商品を追加する
        </button>
        <button
          type="button"
          disabled={products.length === 0}
          className="col-span-2 text-base text-white font-semibold bg-[#059467] rounded py-3 cursor-pointer duration-150 hover:bg-[#047857] active:bg-[#036d4b] focus:outline-none sm:text-xl sm:py-4 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-500"
          onClick={handleNext}
        >
          次へ
        </button>
      </div>
    </div>
  )
}

export default Step3

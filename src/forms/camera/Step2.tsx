import InputFormCustomer from '@/forms/camera/InputFormCustomer'
import { useFormStore } from '@/store'
import { Product } from '@/types/form'
import { useLayoutEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router'

type Step2Props = {
  onNext: (step: string) => void
}

const Step2 = ({ onNext }: Step2Props) => {
  const { products, addProduct, updateProduct } = useFormStore()
  const [searchParams, setSearchParams] = useSearchParams()
  const index = searchParams.get('index')

  useLayoutEffect(() => {
    if (!products[Number(index)]) {
      const newParams = new URLSearchParams(searchParams)

      if (products[products.length - 1]) {
        newParams.set('index', (products.length - 1).toString())
        setSearchParams(newParams)
        setValue('title', products[products.length - 1].title)
        setValue('condition', products[products.length - 1].condition)
        setValue('item_comment', products[products.length - 1].item_comment)
      } else {
        newParams.delete('index')
        setSearchParams(newParams)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  const methods = useForm<Product>({
    mode: 'onChange',
    defaultValues: {
      title: index && products[Number(index)] ? products[Number(index)].title : '',
      condition: index && products[Number(index)] ? products[Number(index)].condition : '中古',
      item_comment: index && products[Number(index)] ? products[Number(index)].item_comment : '',
    },
  })

  const {
    setValue,
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = methods

  const onSubmit = (data: Product) => {
    if (index && products[Number(index)]) {
      updateProduct(Number(index), data)
    } else {
      addProduct(data)
    }

    onNext('3')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="px-2.5 mb-4 md:px-0">
      <h1 className="text-lg font-semibold text-center mt-1.5 mb-6 sm:text-2xl">商品確認</h1>

      {/* Product Name Field */}
      <InputFormCustomer
        label="商品名"
        isRequired={true}
        classNameLabel="flex items-center justify-between text-[13px] mb-1.5 sm:text-base"
        errorMessage={errors.title?.message}
      >
        <input
          type="text"
          placeholder="例）キャノン一眼レフカメラ"
          {...register('title', {
            required: { value: true, message: '商品名は必須です' },
            maxLength: { value: 250, message: '商品名は250文字以内で入力してください' },
            validate: (value) => value.trim() !== '' || '商品名は空白だけでは入力できません',
          })}
          className="border border-gray-300 p-2 rounded text-[13px] w-full sm:text-base"
        />
      </InputFormCustomer>

      {/* Product Condition Field */}
      <div className="mb-5">
        <span
          className="block text-[13px] font-medium mb-2 sm:text-base"
          id="product-condition-label"
        >
          商品の状態
        </span>
        <div
          className="flex gap-7 sm:gap-12"
          role="radiogroup"
          aria-labelledby="product-condition-label"
        >
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="radio"
              value="中古"
              {...register('condition')}
              className="accent-blue-600 w-4 h-4 cursor-pointer sm:w-5 sm:h-5"
            />
            <span className="ml-1 text-[13px] sm:text-base">中古</span>
          </label>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="radio"
              value="新品"
              {...register('condition')}
              className="accent-blue-600 w-4 h-4 cursor-pointer sm:w-5 sm:h-5"
            />
            <span className="ml-1 text-[13px] sm:text-base">新品</span>
          </label>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="radio"
              value="ジャンク"
              {...register('condition')}
              className="accent-blue-600 w-4 h-4 cursor-pointer sm:w-5 sm:h-5"
            />
            <span className="ml-1 text-[13px] sm:text-base">ジャンク</span>
          </label>
        </div>
      </div>

      {/* Supplementary Information Field */}
      <div className="mb-6">
        <label
          htmlFor="product-item_comment"
          className="block text-[13px] font-medium mb-1 sm:text-base"
        >
          補足事項
        </label>
        <textarea
          id="product-item_comment"
          {...register('item_comment')}
          placeholder="例）カラー：ブラック レンズ：EF24-70L IS USM 付属品：バッテリー、箱、保証書、取扱説明書"
          className="w-full border rounded px-3 py-2 mt-1 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 min-h-[80px] resize-y sm:text-base"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!isValid}
        className="text-base text-white font-semibold bg-[#059467] rounded w-full mx-auto flex items-center justify-center gap-0.5 py-3 cursor-pointer duration-200 hover:bg-[#047857] active:bg-[#036d4b] focus:outline-none sm:text-xl sm:py-4 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-500"
      >
        次へ
      </button>
    </form>
  )
}

export default Step2

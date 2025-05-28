import { postTakakuFormData } from '@/api/forms'
import InputFormCustomer from '@/forms/camera/InputFormCustomer'
import { useFormStore } from '@/store'
import { Site } from '@/types'
import { CustomerInfo, SubmitTakakuData } from '@/types/form'
import { getCenterDetail } from '@/utils/dateUtils'
import { errorMessage, fetchAddress, validateEmail, validatePhoneNumber } from '@/utils/validators'
import { useEffect, useLayoutEffect } from 'react'
import { FormProvider, SubmitHandler, useForm, useWatch } from 'react-hook-form'
import toast from 'react-hot-toast'

type Step4Props = {
  onNext: (step: string) => void
}

export type FormCustomer = CustomerInfo & {
  receiveSpecial: boolean
  personalInformation: boolean
}

const Step4 = ({ onNext }: Step4Props) => {
  const { customerInfo, selectedShop, selectedDate, products, centerList, setCustomerInfo, reset } =
    useFormStore()

  const methods = useForm<FormCustomer>({
    mode: 'onChange',
    defaultValues: {
      name: customerInfo?.name || '',
      email: customerInfo?.email || '',
      phone: customerInfo?.phone || '',
      zipCode: customerInfo?.zipCode || '',
      pref: customerInfo?.pref || '',
      address: customerInfo?.address || '',
      receiveSpecial: false,
      personalInformation: false,
    },
  })

  const {
    clearErrors,
    getValues,
    setValue,
    register,
    handleSubmit,
    setError,
    formState: { isValid, errors },
    control,
  } = methods

  const watchedValues = useWatch({
    control,
    name: ['name', 'email', 'phone', 'zipCode', 'pref', 'address'],
  })

  useLayoutEffect(() => {
    if (selectedShop && selectedDate && products.length > 0) {
      sessionStorage.removeItem('form_data_thanks')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => {
      const [name, email, phone, zipCode, pref, address] = watchedValues
      setCustomerInfo({
        name: name || '',
        email: email || '',
        phone: phone || '',
        zipCode: zipCode || '',
        pref: pref || '',
        address: address || '',
      })
    }, 300) // debounce 300ms

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedValues])

  const onSubmit: SubmitHandler<FormCustomer> = async (data) => {
    const body: SubmitTakakuData = {
      business_domain: selectedShop || '',
      oeoe93: selectedDate ? selectedDate.toString() : '',
      kana: data.name,
      email: data.email,
      phone_number: data.phone,
      zip: data.zipCode,
      pref: data.pref,
      address: data.address,
      subscribe_mm: data.receiveSpecial ? 'yes' : 'no',
      memo: '',
      items: products.map((product) => ({
        title: product.title,
        condition: product.condition,
        item_comment: product.item_comment || null,
      })),
      site: 'camera-takakuureru.com' as Site,
    }

    const res = await postTakakuFormData(body)

    if (res.error && res.message) {
      Object.entries(res.message).forEach(([field, messages]) => {
        if (Array.isArray(messages)) {
          if (field in getValues()) {
            setError(field as keyof FormCustomer, { type: 'server', message: messages.join('、') })
          } else {
            toast.error(`サーバーエラー: ${messages.join('、')}`, {
              className: '!bg-red-100 !text-red-900 font-bold',
              duration: 3500,
            })
          }
        }
      })
    } else if (res.offer_id) {
      toast.success('お客様情報を送信しました。', {
        className: '!bg-green-100 !text-green-900 font-bold',
        duration: 3500,
      })

      sessionStorage.setItem(
        'form_data_thanks',
        JSON.stringify({
          offer_id: res.offer_id,
          oeoe93: body.oeoe93,
          business_name: getCenterDetail(body.business_domain, centerList, 'name'),
          business_address: getCenterDetail(body.business_domain, centerList, 'address'),
          business_short_link: getCenterDetail(body.business_domain, centerList, 'short_link'),
        })
      )

      reset()
      onNext('thanks')
    } else {
      // Failed to send your information, please try again later
      toast.error('情報を送信できませんでした。再度お試しください。', {
        className: '!bg-red-100 !text-red-900 font-bold',
        duration: 3500,
      })
    }
  }

  return (
    <div className="px-3 mb-3.5 md:px-0">
      <h1 className="text-lg font-semibold text-center mt-1.5 mb-4 sm:text-2xl">お客様情報</h1>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* name kana */}
          <InputFormCustomer
            label="お名前（カナ）"
            isRequired={true}
            classNameLabel="flex items-center justify-between text-[13px] mb-1.5 sm:text-base"
            errorMessage={errors.name?.message}
          >
            <input
              type="text"
              placeholder="例）カイトリ　タロウ"
              {...register('name', {
                required: errorMessage.nameRequired,
                maxLength: { value: 250, message: 'お名前は250文字以内で入力してください' },
                validate: (value) => value.trim() !== '' || 'お名前は空白だけでは入力できません',
              })}
              className="border border-gray-300 p-2 rounded text-[13px] w-full sm:text-base sm:py-[9px]"
            />
          </InputFormCustomer>

          {/* email */}
          <InputFormCustomer
            label="メールアドレス"
            isRequired={true}
            classNameLabel="flex items-center justify-between text-[13px] mb-1.5 sm:text-base"
            errorMessage={errors.email?.message}
          >
            <input
              type="email"
              placeholder="例）info@takakuureru.com"
              {...register('email', {
                required: errorMessage.emailRequired,
                onBlur: async (e) => {
                  const email = e.target.value.trim()
                  if (email) {
                    const result = await validateEmail(email)
                    if (result !== true) {
                      setError('email', { type: 'validate', message: errorMessage.emailInvalid })
                    }
                  }
                },
              })}
              className="border border-gray-300 p-2 rounded text-[13px] w-full sm:text-base sm:py-[9px]"
            />
          </InputFormCustomer>

          {/* phone */}
          <InputFormCustomer
            label="電話番号"
            isRequired={true}
            classNameLabel="flex items-center justify-between text-[13px] mb-1.5 sm:text-base"
            errorMessage={errors.phone?.message}
          >
            <input
              type="text"
              inputMode="numeric"
              placeholder="例）090XXXXXXXX"
              {...register('phone', {
                required: errorMessage.phoneRequired,
                validate: (phone) => {
                  const result = validatePhoneNumber(phone)
                  return result.status ? true : result.msg
                },
              })}
              className="border border-gray-300 p-2 rounded text-[13px] w-full sm:text-base sm:py-[9px]"
            />
          </InputFormCustomer>

          {/* zipCode */}
          <InputFormCustomer
            label="郵便番号"
            isRequired={false}
            classNameLabel="flex items-center justify-between text-[13px] mb-1.5 sm:text-base"
            errorMessage={errors.zipCode?.message}
          >
            <input
              type="text"
              inputMode="numeric"
              placeholder="例）1040061"
              {...register('zipCode', {
                required: false,
                pattern: {
                  value: /^[0-9]{7}$/,
                  message: errorMessage.zipCodeDoesNotExist,
                },
                onChange: (e) => {
                  const timeout = setTimeout(async () => {
                    const success = await fetchAddress(e.target.value)
                    const customer = useFormStore.getState().customerInfo

                    if (success) {
                      setValue('zipCode', customer.zipCode)
                      setValue('pref', customer.pref)
                      setValue('address', customer.address)
                      clearErrors('zipCode')
                      clearErrors('pref')
                      clearErrors('address')
                    }
                  }, 500)
                  return () => clearTimeout(timeout)
                },
              })}
              className="border border-gray-300 p-2 rounded text-[13px] w-full sm:text-base sm:py-[9px]"
            />
          </InputFormCustomer>

          {/* pref */}
          <InputFormCustomer
            label="都道府県"
            isRequired={false}
            classNameLabel="flex items-center justify-between text-[13px] mb-1.5 sm:text-base"
            errorMessage={errors.pref?.message}
          >
            <input
              type="text"
              placeholder="例）東京都"
              {...register('pref', {
                required: false,
              })}
              className="border border-gray-300 p-2 rounded text-[13px] w-full sm:text-base sm:py-[9px]"
            />
          </InputFormCustomer>

          {/* address */}
          <InputFormCustomer
            label="都道府県"
            isRequired={false}
            classNameLabel="flex items-center justify-between text-[13px] mb-1.5 sm:text-base"
            errorMessage={errors.address?.message}
          >
            <input
              type="text"
              placeholder="例）中央区銀座"
              {...register('address', {
                required: false,
              })}
              className="border border-gray-300 p-2 rounded text-[13px] w-full sm:text-base sm:py-[9px]"
            />
          </InputFormCustomer>

          {/* receiveSpecial */}
          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              {...register('receiveSpecial')}
              name="receiveSpecial"
              className="w-4 h-4 mr-2 sm:w-5 sm:h-5"
              id="receiveSpecial"
            />
            <label
              htmlFor="receiveSpecial"
              className="text-[13px] sm:text-base user-select-none cursor-pointer"
            >
              当店からお得情報を受け取る
            </label>
          </div>

          {/* personalInformation */}
          <div>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register('personalInformation', { required: true })}
                  name="personalInformation"
                  className="w-4 h-4 mr-2 sm:w-5 sm:h-5"
                  id="personalInformation"
                />
                <label
                  htmlFor="personalInformation"
                  className="text-[13px] sm:text-base user-select-none cursor-pointer"
                >
                  個人情報の取り扱いに同意する
                </label>
              </div>
              <span className="text-xs text-white bg-[#dc3848] px-[9px] py-[3px] rounded font-medium sm:text-sm sm:py-0.5">
                必須
              </span>
            </div>
            {errors.personalInformation && (
              <span className="text-sm text-red-500 pt-0.5">
                個人情報の取り扱いに同意してください
              </span>
            )}
          </div>

          <div className="mt-2 h-20 border-2 border-[#d0d5dc] p-2.5 rounded-xs text-[13px] overflow-y-auto sm:text-sm sm:h-[100px]">
            <p>
              株式会社マーケットエンタープライズ（以下「当社」）では、お預かりした個人情報について、当社が定めたプライバシーポリシーのとおり適正かつ安全に管理・運用することに努めます。
            </p>
            <p>
              <br />
              詳細内容は、
              <a
                href="https://www.marketenterprise.co.jp/privacy"
                target="”_blank"
                className="text-blue-500 hover:underline"
              >
                {' '}
                プライバシーポリシー{' '}
              </a>
              ページをご覧ください。
            </p>
            <p>
              また、【「おいくら」を利用して、最大20店舗へ情報送信】をチェックしていただいた方に対し、当社は次に定める情報を当社グループサービスの
              「おいくら」 を利用する加盟店に提供することがあります。
            </p>
            <p>・提供予定情報</p>
            <p>氏名、住所、郵便番号、電話番号、メールアドレス、商品情報、住居設備に関わる情報</p>
            <p>
              上記情報は、当社の買取サービスで買取が困難な場合に、 「
              <a
                href="https://oikura.jp/"
                target="”_blank"
                className="text-blue-500 hover:underline"
              >
                おいくら
              </a>{' '}
              」 サービスを通じて、
              登録加盟店にて事前査定を実施し、登録加盟店からお客様にご連絡を行うことを目的に利用いたします。
            </p>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={!isValid}
              className="text-base text-white font-semibold bg-[#059467] rounded w-full mx-auto flex items-center justify-center gap-0.5 py-3 cursor-pointer duration-200 hover:bg-[#047857] active:bg-[#036d4b] focus:outline-none sm:text-xl sm:py-4 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-500"
            >
              送信
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}

export default Step4

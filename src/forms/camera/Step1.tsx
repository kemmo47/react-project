import { getCenterList } from '@/api/location'
import Search from '@/components/icons/Search'
import Modal from '@/components/Modal'
import { NextButton, PrevButton } from '@/forms/camera/EmblaCarouselArrowButtons'
import '@/forms/camera/index.css'
import WrapperListShop from '@/forms/camera/WrapperListShop'
import { useModal } from '@/hooks/useModal'
import { usePrevNextButtons } from '@/hooks/usePrevNextButtons'
import { useFormStore } from '@/store'
import { formatDate, getCenterDetail, getShopDateSets } from '@/utils/dateUtils'
import useEmblaCarousel from 'embla-carousel-react'
import { useEffect } from 'react'
import toast from 'react-hot-toast'

type Step1Props = {
  onNext: (step: string) => void
}

const Step1 = ({ onNext }: Step1Props) => {
  const { isOpen, open, close } = useModal()
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'start', slidesToScroll: 7 })
  const { centerList, setCenter, setSelectedDate, selectedDate, selectedShop } = useFormStore()
  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } =
    usePrevNextButtons(emblaApi)

  useEffect(() => {
    const fetchCenterList = async () => {
      // Only fetch if centerList is not available
      if (!centerList || centerList.length === 0) {
        const fetchedCenterList = await getCenterList()
        setCenter(fetchedCenterList)
      }
    }

    fetchCenterList()
  }, [centerList, setCenter])

  const handleStep2 = () => {
    if (selectedShop && selectedDate) {
      onNext('2')
    } else {
      toast.error('店舗と来店日を選択してください。', {
        className: '!bg-red-100 !text-red-900 font-bold',
        duration: 3500,
      })
    }
  }

  return (
    <div className="px-2.5 mb-4 md:px-0">
      <h1 className="text-lg font-semibold text-center mt-1.5 mb-4 sm:text-2xl">来店申込</h1>
      {selectedShop ? (
        <div className="border border-[#d0d5dc] rounded overflow-hidden flex justify-between">
          <div className="p-3 text-[13px] sm:text-base">
            <p>{getCenterDetail(selectedShop, centerList, 'name')}</p>
            <p>{getCenterDetail(selectedShop, centerList, 'address')}</p>
            <p>{getCenterDetail(selectedShop, centerList, 'hours')} 駐車場あり</p>
          </div>
          <div>
            <button
              onClick={open}
              type="button"
              className="flex items-center justify-center font-semibold h-full w-16 sm:w-20 bg-[#d0d5dc] text-[13px] sm:text-base cursor-pointer duration-150 hover:bg-[#cbd5e1] active:bg-[#9ca3af] focus:outline-none"
            >
              変更
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={open}
          className="border border-[#d0d5dc] rounded w-full mx-auto flex items-center justify-center gap-0.5 py-3 cursor-pointer duration-150 hover:bg-[#f1f5f9] active:bg-[#e2e8f0] focus:outline-none sm:gap-1 sm:py-[17px]"
        >
          <span className="font-light text-[13px] sm:text-base">店舗を検索する</span>
          <Search classNameSvg="text-[#2563EB]" />
        </button>
      )}

      <div className="flex items-center justify-between mt-4 mb-3">
        <p className="text-[13px] sm:text-base">ご希望の来店日を選択してください</p>
        <span className="text-xs text-white bg-[#dc3848] px-[9px] py-[3px] rounded font-medium sm:text-sm sm:py-0.5">
          必須
        </span>
      </div>

      <div className="relative mb-6 sm:mb-8">
        <div className="mb-3 flex items-center justify-between">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>

        <div className="embla" ref={emblaRef}>
          <div className="embla__container pr-px">
            {getShopDateSets(14).map((item, key) => (
              <div
                className={`embla__slide ${selectedDate === item.date ? 'bg-[#ffe79e]' : ''} text-xs sm:text-base duration-150 cursor-pointer hover:bg-amber-100/25`}
                key={key}
                onClick={() => setSelectedDate(item.date)}
              >
                <div className="text-center border-b border-[#d0d5dc] py-1">
                  {formatDate(item.date).date}
                </div>
                <div className="text-center py-1">{formatDate(item.date).dayOfWeek}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          className="text-base text-white font-semibold bg-[#059467] rounded w-full mx-auto flex items-center justify-center gap-0.5 py-3 cursor-pointer duration-200 hover:bg-[#047857] active:bg-[#036d4b] focus:outline-none sm:text-xl sm:py-4"
          onClick={() => {
            handleStep2()
          }}
        >
          次へ
        </button>
      </div>

      <Modal isOpen={isOpen} onClose={close}>
        <WrapperListShop isOpen={isOpen} close={close} />
      </Modal>
    </div>
  )
}

export default Step1

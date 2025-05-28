import Layout from '@/components/layouts/Layout'
import Step1 from '@/forms/camera/Step1'
import Step2 from '@/forms/camera/Step2'
import Step3 from '@/forms/camera/Step3'
import Step4 from '@/forms/camera/Step4'
import Thanks from '@/forms/camera/Thanks'
import { useFormStore } from '@/store'
import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { useSearchParams } from 'react-router'

const STEPS = {
  1: Step1,
  2: Step2,
  3: Step3,
  4: Step4,
  thanks: Thanks,
}

export default function CameraForm() {
  const { selectedShop, selectedDate, products } = useFormStore()
  const [searchParams, setSearchParams] = useSearchParams()
  const step = searchParams.get('step') || '1'

  const handleStepChange = (newStep: string, index?: string) => {
    if (!index) {
      searchParams.delete('index')
    }

    setSearchParams({
      ...Object.fromEntries(searchParams),
      step: newStep.toString(),
      ...(index !== undefined ? { index } : {}),
    })
  }

  useEffect(() => {
    // If there is no `step`, set the default to '1' in the URL
    if (!searchParams.get('step')) {
      handleStepChange('1')
      return
    }

    if ((!selectedShop || !selectedDate) && step !== 'thanks') {
      handleStepChange('1')
      return
    }

    if (products.length === 0 && step === '4') {
      handleStepChange('2')
      return
    }

    if (step === 'thanks' && !sessionStorage.getItem('form_data_thanks')) {
      handleStepChange('4')
      return
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  const CurrentStep = STEPS[step as keyof typeof STEPS] || (() => <div>Invalid step</div>)

  return (
    <Layout>
      <Toaster />
      <div className="flex flex-col min-h-[calc(100vh-120px)] mx-auto sm:pt-1.25 md:max-w-[600px]">
        <CurrentStep onNext={handleStepChange} />
      </div>
    </Layout>
  )
}

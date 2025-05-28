import { useFormStore } from '@/store'
import { useLayoutEffect, useState } from 'react'
import { useSearchParams } from 'react-router'

function RenderLogo({ logoPromise }: { readonly logoPromise: () => Promise<{ default: string }> }) {
  const [logo, setLogo] = useState<string | null>(null)

  useLayoutEffect(() => {
    let isMounted = true
    logoPromise().then((module) => {
      if (isMounted) setLogo(module.default)
    })
    return () => {
      isMounted = false
    }
  }, [logoPromise])

  if (!logo) return <div>Loading...</div>
  return <img src={logo} alt="logo" className="h-[34px] sm:h-10" />
}

const Header = () => {
  const [step] = useSearchParams()
  const { pageHead } = useFormStore.getState()
  const listStep = Object.entries(pageHead.pageStep).filter(([key]) => key !== 'thanks')

  return (
    <header className="bg-white md:max-w-[600px] mx-auto">
      <div className="container mx-auto p-2.5 flex items-center justify-between md:px-0">
        {/* Logo */}
        {pageHead.logo && <RenderLogo logoPromise={pageHead.logo} />}

        {/* Progress Steps */}
        {step.get('step') !== 'thanks' ? (
          <nav className="flex items-center w-full">
            {listStep.map(([key, value]) => (
              <div key={key} className="relative flex flex-col items-center flex-1">
                <div
                  className={`z-[2] w-4 h-4 rounded-full flex items-center border justify-center text-[11px] font-medium sm:w-5 sm:h-5 sm:text-[13px] ${
                    Number(key) > Number(step.get('step') || 1)
                      ? 'border-[#999] bg-white text-[#999]'
                      : 'border-[#2463eb] bg-[#2463eb] text-white'
                  }`}
                >
                  <span>{key}</span>
                </div>

                {Number(key) !== listStep.length && (
                  <div
                    className={`absolute z-[1] top-1/4 right-0 translate-x-1/2 -translate-y-1/2 h-px w-full ${
                      Number(key) > Number(step.get('step') || 1) ? 'bg-[#999]' : 'bg-[#2463eb]'
                    }`}
                  ></div>
                )}

                {/* Step Label */}
                <span
                  className={`text-[11px] font-light mt-px sm:text-sm ${Number(key) > Number(step.get('step') || 1) ? 'text-[#999]' : 'text-[#2463eb]'}`}
                >
                  {value.titleStep}
                </span>
              </div>
            ))}
          </nav>
        ) : null}
      </div>
    </header>
  )
}

export default Header

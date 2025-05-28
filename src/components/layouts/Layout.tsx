import Footer from '@/components/layouts/Footer'
import Header from '@/components/layouts/Header'
import { useFormStore } from '@/store'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'

interface LayoutProps {
  children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const [favicon, setFavicon] = useState<string>('')
  const [step] = useSearchParams()

  useEffect(() => {
    useFormStore
      .getState()
      .pageHead.favicon()
      .then((result: { default: string }) => {
        setFavicon(result.default)
      })
  }, [])

  return (
    <div className="bg-white mx-auto sm:pt-1.25">
      <title>
        {useFormStore.getState().pageHead.pageStep[step.get('step') || '1']?.title ||
          'Step không tồn tại'}
      </title>
      <meta
        name="description"
        content={
          useFormStore.getState().pageHead.pageStep[step.get('step') || '1']?.description ||
          'Step không tồn tại'
        }
      />
      {favicon !== '' && <link rel="icon" type="image/svg+xml" href={favicon} />}
      <Header />
      <main className="container mx-auto">{children}</main>
      <Footer />
    </div>
  )
}

export default Layout

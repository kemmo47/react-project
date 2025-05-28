import Layout from '@/components/layouts/Layout'
import { useSearchParams } from 'react-router'

export default function AudioForm() {
  const [step] = useSearchParams()

  const renderStep = () => {
    switch (step.get('step')) {
      case '1':
        return <div>Step 1 AudioForm</div>
      case '2':
        return <div>Step 2 AudioForm</div>
      case '3':
        return <div>Step 3 AudioForm</div>
      case 'thanks':
        return <div>Thank you! AudioForm</div>
      default:
        return <div>Invalid step</div>
    }
  }

  return (
    <Layout>
      <div className="container bg-white flex flex-col sm:pt-1.25">{renderStep()}</div>
    </Layout>
  )
}

import { useDomainComponent } from '@/hooks/useDomainComponent'
import { Suspense, lazy } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'

/**
 * App component: dynamically load form based on domain/path
 * Marketing team can edit HTML/CSS directly on Optimize Next
 */
export default function App() {
  const loadForm = useDomainComponent()
  const Form = lazy(loadForm)

  return (
    <BrowserRouter>
      <Suspense fallback={<div className="loading">Loading…</div>}>
        <Routes>
          <Route path="*" element={<Form />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

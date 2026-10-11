import { useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import UploadCard from './components/UploadCard.jsx'
import Loader from './components/Loader.jsx'
import Result from './components/Result.jsx'
import HowItWorks from './components/HowItWorks.jsx'
import Footer from './components/Footer.jsx'
import { MOCK_RESULTS } from './data/mockResults.js'

export default function App() {
  // "idle" | "loading" | "done"
  const [stage, setStage] = useState('idle')
  const [fileName, setFileName] = useState('')
  const [data, setData] = useState(null)

  function handleFile(file) {
    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file.')
      return
    }

    setFileName(file.name)
    setStage('loading')

    // Simulated parsing — replace with a real API call later.
    setTimeout(() => {
      setData(MOCK_RESULTS[Math.floor(Math.random() * MOCK_RESULTS.length)])
      setStage('done')
    }, 1600)
  }

  function reset() {
    setStage('idle')
    setFileName('')
    setData(null)
  }

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <section className="parser" id="parser">
          {stage === 'idle' && <UploadCard fileName={fileName} onFile={handleFile} />}
          {stage === 'loading' && <Loader />}
          {stage === 'done' && <Result data={data} onReset={reset} />}
        </section>
        <HowItWorks />
      </main>
      <Footer />
    </>
  )
}

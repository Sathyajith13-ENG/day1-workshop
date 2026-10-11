export default function HowItWorks() {
  return (
    <section className="how" id="how">
      <h2>How it works</h2>
      <div className="steps">
        <div className="step">
          <span className="step-num">1</span>
          <h3>Upload</h3>
          <p>Drop in your PDF resume. It stays on your machine.</p>
        </div>
        <div className="step">
          <span className="step-num">2</span>
          <h3>Parse</h3>
          <p>We scan the text and extract the skills you actually list.</p>
        </div>
        <div className="step">
          <span className="step-num">3</span>
          <h3>Ship</h3>
          <p>Get a score and a gap list, then fix what&apos;s missing.</p>
        </div>
      </div>
    </section>
  )
}

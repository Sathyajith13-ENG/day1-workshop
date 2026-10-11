import { useEffect, useState } from 'react'

const CIRCLE_LENGTH = 2 * Math.PI * 52 // ~327, matches stroke-dasharray in CSS

export default function Result({ data, onReset }) {
  const [displayed, setDisplayed] = useState(0)

  useEffect(() => {
    // Count the score up from 0 to data.score.
    const step = Math.max(1, Math.round(data.score / 40))
    const timer = setInterval(() => {
      setDisplayed((current) => Math.min(data.score, current + step))
    }, 30)
    return () => clearInterval(timer)
  }, [data])

  return (
    <div className="result">
      <div className="score-ring">
        <svg viewBox="0 0 120 120">
          <circle className="ring-bg" cx="60" cy="60" r="52" />
          <circle
            className="ring-fill"
            cx="60" cy="60" r="52"
            strokeDasharray={CIRCLE_LENGTH}
            strokeDashoffset={CIRCLE_LENGTH * (1 - data.score / 100)}
          />
        </svg>
        <div className="score-number">{displayed}</div>
      </div>

      <h2 className="result-title">{data.verdict}</h2>

      <div className="skills">
        <div className="skill-col">
          <h3>✅ Skills present</h3>
          <ul>
            {data.present.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </div>
        <div className="skill-col">
          <h3>❌ Skills missing</h3>
          <ul>
            {data.missing.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </div>
      </div>

      <button className="cta ghost" onClick={onReset}>
        Parse another resume
      </button>
    </div>
  )
}

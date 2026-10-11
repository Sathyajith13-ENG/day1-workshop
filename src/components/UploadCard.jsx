import { useRef, useState } from 'react'

export default function UploadCard({ fileName, onFile }) {
  const fileInputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)

  function handleDrop(e) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) onFile(file)
  }

  return (
    <div
      className={`upload-card ${dragOver ? 'dragover' : ''}`}
      onDragOver={(e) => {
        e.preventDefault()
        setDragOver(true)
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
    >
      <div className="upload-icon">📄</div>
      <h2>{fileName ? `📄 ${fileName}` : 'Drop your resume here'}</h2>
      <p>PDF only · max ~5MB · nothing leaves your browser</p>
      <button className="cta" onClick={() => fileInputRef.current?.click()}>
        Choose PDF
      </button>
      <input
        type="file"
        accept="application/pdf"
        hidden
        ref={fileInputRef}
        onChange={(e) => e.target.files[0] && onFile(e.target.files[0])}
      />
    </div>
  )
}

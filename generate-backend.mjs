import { writeFileSync, mkdirSync } from 'fs'

const root = process.cwd() === 'backend' ? '.' : 'backend'

function write(path, contents) {
  writeFileSync(`${root}/${path}`, contents)
  console.log(`wrote ${path} (${contents.length} bytes)`)
}

mkdirSync(`${root}/routes`, { recursive: true })
mkdirSync(`${root}/controllers`, { recursive: true })
mkdirSync(`${root}/services`, { recursive: true })
mkdirSync(`${root}/config`, { recursive: true })
mkdirSync(`${root}/middleware`, { recursive: true })

// ---------- server.js ----------
write(
  'server.js',
  `import express from 'express'
import cors from 'cors'
import analyzeRouter from './routes/analyze.routes.js'
import { errorHandler } from './middleware/error.middleware.js'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => res.json({ ok: true }))
app.use('/api', analyzeRouter)

app.use(errorHandler)

export default app
`
)

// ---------- config/db.js ----------
write(
  'config/db.js',
  `import mongoose from 'mongoose'

export function connectDB() {
  const uri = process.env.MONGO_URI

  if (!uri) {
    console.warn('[db] MONGO_URI not set in backend/.env - running without persistence')
    return
  }

  mongoose
    .connect(uri)
    .then(() => console.log('[db] MongoDB connected'))
    .catch((err) => console.error('[db] MongoDB connection failed:', err.message))
}

export function isDBConnected() {
  return mongoose.connection.readyState === 1
}
`
)

// ---------- models/Analysis.js ----------
write(
  'models/Analysis.js',
  `import mongoose from 'mongoose'

const analysisSchema = new mongoose.Schema(
  {
    resumeFileName: { type: String, required: true },
    jdText: { type: String, default: '' },
    score: { type: Number, required: true },
    presentSkills: { type: [String], default: [] },
    missingSkills: { type: [String], default: [] },
  },
  { timestamps: true },
)

export default mongoose.model('Analysis', analysisSchema)
`
)

// ---------- routes/analyze.routes.js ----------
write(
  'routes/analyze.routes.js',
  `import { Router } from 'express'
import { upload } from '../middleware/upload.middleware.js'
import { analyzeResume } from '../controllers/analyze.controller.js'

const router = Router()

router.post('/analyze', upload.single('resume'), analyzeResume)

export default router
`
)

// ---------- middleware/upload.middleware.js ----------
write(
  'middleware/upload.middleware.js',
  `import multer from 'multer'

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true)
    else cb(new Error('Only PDF files are accepted'))
  },
})
`
)

// ---------- middleware/error.middleware.js ----------
write(
  'middleware/error.middleware.js',
  `export function errorHandler(err, req, res, next) {
  // Multer errors land here (wrong file type, file too large)
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'File too large (max 5MB)' })
  }
  res.status(err.status || 400).json({ error: err.message })
}
`
)

// ---------- controllers/analyze.controller.js ----------
write(
  'controllers/analyze.controller.js',
  `import { extractResumeText } from '../services/pdf.service.js'
import { scoreResumeAgainstJD } from '../services/score.service.js'
import { saveAnalysis } from '../services/analysis.service.js'

export async function analyzeResume(req, res, next) {
  try {
    const { file, body } = req

    if (!file) {
      return res.status(400).json({ error: 'Resume PDF is required (field name: "resume")' })
    }
    if (!body.jdText) {
      return res.status(400).json({ error: 'Job description is required (field name: "jdText")' })
    }

    const resumeText = await extractResumeText(file.buffer)
    const result = scoreResumeAgainstJD(resumeText, body.jdText)
    const id = await saveAnalysis({
      resumeFileName: file.originalname,
      jdText: body.jdText,
      ...result,
    })

    res.json({ id, ...result })
  } catch (err) {
    next(err)
  }
}
`
)

// ---------- services/pdf.service.js ----------
write(
  'services/pdf.service.js',
  `import { extractText, getDocumentProxy } from 'unpdf'

export async function extractResumeText(pdfBuffer) {
  const pdf = await getDocumentProxy(new Uint8Array(pdfBuffer))
  const { text } = await extractText(pdf, { mergePages: true })
  return text
}
`
)

// ---------- services/score.service.js ----------
write(
  'services/score.service.js',
  `import { SKILLS } from '../utils.js'

// Keyword matcher - the stub the AI integration replaces later.
export function scoreResumeAgainstJD(resumeText, jdText) {
  const resume = resumeText.toLowerCase()
  const jd = jdText.toLowerCase()

  const presentSkills = SKILLS.filter((skill) => resume.includes(skill))
  const missingSkills = SKILLS.filter((skill) => jd.includes(skill) && !resume.includes(skill))
  const total = presentSkills.length + missingSkills.length
  const score = total === 0 ? 0 : Math.round((presentSkills.length / total) * 100)

  return { score, presentSkills, missingSkills }
}
`
)

// ---------- services/analysis.service.js ----------
write(
  'services/analysis.service.js',
  `import Analysis from '../models/Analysis.js'
import { isDBConnected } from '../config/db.js'

export async function saveAnalysis(data) {
  if (!isDBConnected()) return null

  try {
    const doc = await Analysis.create(data)
    return doc._id
  } catch (err) {
    // A DB outage logs a warning instead of failing the analysis.
    console.error('[analysis] save failed:', err.message)
    return null
  }
}
`
)

// ---------- utils.js ----------
write(
  'utils.js',
  `export const SKILLS = [
  'javascript', 'typescript', 'react', 'node', 'express', 'mongodb',
  'html', 'css', 'git', 'docker', 'sql', 'rest', 'graphql', 'redux',
  'next', 'tailwind', 'python', 'java',
]
`
)

// ---------- index.js ----------
write(
  'index.js',
  `import 'dotenv/config'
import app from './server.js'
import { connectDB } from './config/db.js'

connectDB()

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log('API listening on http://localhost:' + PORT))
`
)

console.log('backend written')

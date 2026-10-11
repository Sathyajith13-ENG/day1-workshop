import { writeFileSync } from 'fs'

console.log('write ok')

const pkg = {
  name: 'day1-workshop',
  private: true,
  version: '0.0.0',
  type: 'module',
  scripts: {
    dev: 'vite',
    build: 'vite build',
    preview: 'vite preview',
  },
  dependencies: {
    react: '^18.3.1',
    'react-dom': '^18.3.1',
  },
  devDependencies: {
    '@vitejs/plugin-react': '^4.3.4',
    vite: '^5.4.11',
  },
}

writeFileSync('package.json', JSON.stringify(pkg, null, 2))
console.log('package.json rewritten on disk')

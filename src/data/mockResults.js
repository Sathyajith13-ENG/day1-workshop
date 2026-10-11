// Fake "parser" results — swap these arrays for real parsing later.
export const MOCK_RESULTS = [
  {
    score: 78,
    verdict: 'Solid resume — a few gaps to close',
    present: ['JavaScript', 'HTML', 'CSS', 'Git', 'React', 'REST APIs'],
    missing: ['TypeScript', 'Testing (Jest)', 'CI/CD', 'Docker'],
  },
  {
    score: 52,
    verdict: 'Early stage — build out the core stack',
    present: ['HTML', 'CSS', 'JavaScript'],
    missing: ['React', 'Node.js', 'MongoDB', 'Git', 'Testing', 'CI/CD'],
  },
  {
    score: 91,
    verdict: 'Strong resume — ship it',
    present: [
      'JavaScript', 'TypeScript', 'React', 'Node.js', 'MongoDB',
      'Express', 'Git', 'Docker', 'CI/CD', 'Testing',
    ],
    missing: ['GraphQL'],
  },
]

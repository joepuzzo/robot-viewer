module.exports = {
  '**/!(package-lock).json': ['exec-if-exists prettier --write', 'exec-if-exists sortier'],
  '**/*.md': ['exec-if-exists prettier --write'],
  '**/*.{css,scss,less}': ['exec-if-exists stylelint --fix'],
  '**/*.{html,css,scss,less}': ['exec-if-exists prettier --write', 'exec-if-exists sortier'],
  '**/*.{js,jsx}': [
    'exec-if-exists eslint --fix',
    'exec-if-exists prettier --write',
    'exec-if-exists sortier',
  ],
  '**/*.{ts,tsx}': [
    'exec-if-exists tslint --fix',
    'exec-if-exists eslint --fix',
    'exec-if-exists prettier --write',
    'exec-if-exists sortier',
  ],
};

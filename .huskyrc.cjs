module.exports = {
  hooks: {
    'commit-msg': 'npx --no-install exec-if-exists commitlint --edit \\$1',
    'pre-commit': 'npx --no-install exec-if-exists lint-staged',
    'pre-push': 'npm test',
  },
};

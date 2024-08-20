module.exports = {
  hooks: {
    'pre-commit': 'prettier && lint-staged',
  },
};

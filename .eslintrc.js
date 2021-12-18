module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    camelcase: 'off',
    // console, debuggerは書いて良い(build時に消す設定にしているので)
    'no-console': 'off',
    'no-debugger': 'off',
    'max-len': ['error', { code: 200 }],
    //    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    //    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },
};

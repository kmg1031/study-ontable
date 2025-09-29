module.exports = {
  presets: [
    ['@vue/cli-plugin-babel/preset', {
      useBuiltIns: 'entry',
      polyfills: []
    }],
    ['@babel/preset-typescript', {
      allExtensions: true,
      isTSX: false
    }]
  ]
}

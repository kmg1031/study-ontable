const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  // ESLint 비활성화 (일시적)
  lintOnSave: false,

  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Express 서버 주소 (결제 API)
        changeOrigin: true,
      },
    },
  },
  // 빌드 출력 디렉토리 설정
  outputDir: 'dist',

  // index.html의 위치 설정
  indexPath: 'index.html',

  // 트랜스파일 설정
  transpileDependencies: true,

  // 웹팩 설정을 통해 Express 서버와의 충돌 방지
  configureWebpack: {
    devtool: 'source-map',
    entry: './src/main.js',
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        '@': require('path').resolve(__dirname, 'src')
      }
    },
    plugins: [
      // TypeScript 체크 비활성화
    ]
  },

  // TypeScript 관련 플러그인 비활성화
  chainWebpack: config => {
    config.plugins.delete('fork-ts-checker')
  },
});
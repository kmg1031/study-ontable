module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Express 서버 주소
        changeOrigin: true,
      },
    },
  },
  // 빌드 출력 디렉토리 설정
  outputDir: 'dist',

  // index.html의 위치 설정
  indexPath: 'index.html',

  // 웹팩 설정을 통해 Express 서버와의 충돌 방지
  configureWebpack: {
    devtool: 'source-map',
    entry: './src/main.ts',
  },
};
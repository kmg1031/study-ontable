const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const path = require('path');

// 미들웨어 설정
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// API 라우트 설정
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// 정적 파일 경로 설정 (프로덕션 빌드 시 필요)
app.use(express.static(path.join(__dirname, '../dist')));

// 모든 기타 요청에 대해 Vue 앱 반환 (HTML5 History 모드 지원)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// 서버 시작
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Express server is running on port ${port}`);
});

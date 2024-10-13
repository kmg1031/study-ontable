import axios from 'axios';

const instance = axios.create({
    baseURL: '/', // 상대 경로 사용
    timeout: 10000,
});

export default instance;

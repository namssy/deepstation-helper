// API 설정 파일
export const API_CONFIG = {
  BASE_URL: 'https://u9q3vta531.execute-api.ap-northeast-2.amazonaws.com/default',
  ENDPOINTS: {
    LOGIN: '/deepstation-login',
    DAY_INFO: '/dayinfo'
  }
};

// 이메일 형식 검증 함수
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};


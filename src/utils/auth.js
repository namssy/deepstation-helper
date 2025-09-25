// 인증 관련 유틸리티 함수들

/**
 * 로컬스토리지에서 인증 데이터를 가져오고 만료 여부를 확인
 * @returns {Object|null} 유효한 인증 데이터 또는 null
 */
export const getValidAuthData = () => {
  try {
    const storedAuth = localStorage.getItem('deepstation_auth');
    if (!storedAuth) {
      return null;
    }

    const authData = JSON.parse(storedAuth);
    
    // 만료 시간이 없는 경우 (이전 버전 호환성)
    if (!authData.expiresAt) {
      localStorage.removeItem('deepstation_auth');
      return null;
    }

    // 현재 시간과 만료 시간 비교
    const now = new Date();
    const expiresAt = new Date(authData.expiresAt);
    
    if (now > expiresAt) {
      // 만료된 경우 로컬스토리지에서 삭제
      localStorage.removeItem('deepstation_auth');
      return null;
    }

    return authData;
  } catch (error) {
    console.error('Failed to parse auth data:', error);
    localStorage.removeItem('deepstation_auth');
    return null;
  }
};

/**
 * 인증 데이터가 유효한지 확인
 * @returns {boolean} 인증 데이터가 유효한지 여부
 */
export const isAuthenticated = () => {
  return getValidAuthData() !== null;
};

/**
 * 로그아웃 처리 (로컬스토리지에서 인증 데이터 삭제)
 */
export const logout = () => {
  localStorage.removeItem('deepstation_auth');
};

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';
import { API_CONFIG, isValidEmail } from '../config/api';

import { getCurrentISOString, getFutureISOString } from '../utils/date';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isTermsAgreed, setIsTermsAgreed] = useState(false);

  useEffect(() => {
    // 이미 로그인된 사용자인지 확인 (만료 시간 포함)
    if (isAuthenticated()) {
      // 유효한 로그인 정보가 있으면 홈페이지로 리다이렉트
      navigate('/');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // 이용약관 동의 확인
    if (!isTermsAgreed) {
      setError('이용약관에 동의해주세요.');
      setIsLoading(false);
      return;
    }

    // 이메일 형식 검증
    if (!isValidEmail(formData.email)) {
      setError('올바른 이메일 형식을 입력해주세요.');
      setIsLoading(false);
      return;
    }

    try {
      // DeepStation 로그인 API 호출
      const response = await axios.post(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGIN}`,
        {
          email: formData.email,
          password: formData.password
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // 로그인 성공 후 처리
      // 응답 데이터에 만료 시간 추가하여 로컬스토리지에 저장
      const authDataWithExpiry = {
        ...response.data,
        loginTime: getCurrentISOString(),
        expiresAt: getFutureISOString(60) // 60분(1시간) 후 만료
      };
      localStorage.setItem('deepstation_auth', JSON.stringify(authDataWithExpiry));

      // 루트 경로로 리다이렉트
      navigate('/');
    } catch (err) {
      setError('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
      // 프로덕션에서는 상세한 에러 로그를 제거
      if (process.env.NODE_ENV === 'development') {
        console.error('Login error:', err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            DeepStation Helper
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            계정에 로그인하세요
          </p>

          {/* 서비스 중단 안내 배너 */}
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg shadow-sm">
            <div className="flex items-center justify-center mb-2">
              <span className="text-2xl mr-2">🚫</span>
              <h3 className="text-lg font-bold text-red-700">
                서비스 운영 중단
              </h3>
            </div>
            <p className="text-sm text-red-600 text-center font-medium">
              현재 API가 차단된 상태로 검토 중이며,<br />
              추후 다른 채널을 통해 안내드리겠습니다.
            </p>
          </div>

          {/* 이용약관 */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg opacity-75">
            <h3 className="text-sm font-semibold text-yellow-800 mb-3 text-center">
              ⚠️ 이용 전 필수 안내사항
            </h3>
            <div className="text-xs text-yellow-800 space-y-2 leading-relaxed">
              <div>
                <strong>1. 🤖 이건 비공식(Unofficial) 툴입니다!</strong><br />
                딥스테이션에서 만들거나 인증한 공식 툴이 아니므로, 이 툴로 인해 발생하는 문제에 대해 딥스테이션은 어떠한 책임도 지지 않습니다.
              </div>
              <div>
                <strong>2. 💥 정보가 정확하지 않거나, 갑자기 작동을 멈출 수 있습니다.</strong><br />
                이 툴은 딥스테이션 웹사이트의 현재 구조를 기반으로 정보를 읽어옵니다. 따라서 사이트가 업데이트되면 예고 없이 작동을 멈추거나, 실제와 다른 정보를 보여줄 수 있습니다.<br />
                <span className="font-semibold">※ 중요: 여기서 확인한 정보는 참고용으로만 활용하시고, 실제 예약은 반드시 딥스테이션 공식 사이트에서 직접 진행하며 최종 확인해 주세요.</span>
              </div>
              <div>
                <strong>3. ✅ 모든 책임은 사용자에게 있습니다.</strong><br />
                이 툴이 보여주는 정보를 신뢰하고 행동(예: 일정 계획)한 결과에 대한 책임은 사용자 본인에게 있다는 점에 동의하시는 경우에만 사용해 주세요.
              </div>
              <div>
                <strong>4. ⚠️ 개인정보 처리 및 보안 위험 고지</strong><br />
                입력하신 아이디와 비밀번호는 딥스테이션 인증을 위해 서버에 직접 전달하는 과정을 거칩니다. 이 과정에서 비밀번호를 별도로 저장하지 않더라도, 공식 사이트가 아닌 곳에서 민감한 정보를 다루는 것은 근본적인 보안 위험을 내포하고 있습니다. 따라서 이 툴의 개발자와 작동 방식을 완전히 신뢰하시는 경우에만 사용해 주시기 바랍니다.
              </div>
            </div>
          </div>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                이메일 주소
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                disabled
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-500 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm bg-gray-200 cursor-not-allowed"
                placeholder="이메일 주소 (운영 중단)"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                disabled
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-500 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm bg-gray-200 cursor-not-allowed"
                placeholder="비밀번호 (운영 중단)"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* 이용약관 동의 체크박스 */}
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms-agreement"
                name="terms-agreement"
                type="checkbox"
                checked={isTermsAgreed}
                disabled
                onChange={(e) => setIsTermsAgreed(e.target.checked)}
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded bg-gray-200 cursor-not-allowed"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms-agreement" className="text-gray-500 cursor-not-allowed">
                위 이용약관을 읽었으며, 모든 내용에 동의합니다.
              </label>
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={true}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-400 cursor-not-allowed hover:bg-gray-400"
            >
              현재 이용 불가
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

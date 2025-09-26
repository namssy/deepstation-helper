import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getValidAuthData, logout } from '../utils/auth';
import { API_CONFIG } from '../config/api';
import axios from 'axios';

const HomePage = () => {
  const navigate = useNavigate();
  const [authData, setAuthData] = useState(null);
  const [isChecking, setIsChecking] = useState(true);
  const [weekData, setWeekData] = useState([]);
  const [isLoadingWeek, setIsLoadingWeek] = useState(false);
  const [weekError, setWeekError] = useState('');


  // 일주일 데이터를 가져오는 함수
  const fetchWeekData = async () => {
    if (!authData || !authData.cookies) {
      setWeekError('쿠키 정보가 없습니다.');
      return;
    }

    setIsLoadingWeek(true);
    setWeekError('');

    try {
      const weekPromises = [];
      
      // 내일부터 7일간의 데이터를 가져오기
      for (let i = 1; i <= 2; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dateString = `${year}-${month}-${day}`;
        
        weekPromises.push(
          axios.post(
            `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DAY_INFO}`,
            {
              date: dateString,
              cookies: authData.cookies
            },
            {
              headers: {
                'Content-Type': 'application/json'
              }
            }
          ).then(response => ({
            date: dateString,
            data: response.data
          }))
        );
      }
      
      const results = await Promise.all(weekPromises);
      setWeekData(results);
    } catch (error) {
      setWeekError('일주일 일정 정보를 가져오는데 실패했습니다.');
      // 프로덕션에서는 상세한 에러 로그를 제거
      if (process.env.NODE_ENV === 'development') {
        console.error('Week data API error:', error);
      }
    } finally {
      setIsLoadingWeek(false);
    }
  };

  useEffect(() => {
    // 유효한 인증 데이터 확인 (만료 시간 포함)
    const validAuthData = getValidAuthData();
    if (validAuthData) {
      setAuthData(validAuthData);
      setIsChecking(false);
    } else {
      // 로그인 정보가 없거나 만료된 경우 로그인 페이지로 리다이렉트
      setIsChecking(false);
      navigate('/login');
    }
  }, [navigate]);

  // 인증 데이터가 로드되면 일주일 데이터 호출
  useEffect(() => {
    if (authData) {
      fetchWeekData();
    }
  }, [authData]);

  const handleLogout = () => {
    logout();
    setAuthData(null);
    navigate('/login');
  };

  // 로그인 상태 확인 중일 때 로딩 표시
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로그인 상태를 확인하는 중...</p>
        </div>
      </div>
    );
  }

  // 로그인 정보가 없으면 아무것도 렌더링하지 않음 (리다이렉트 중)
  if (!authData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">DeepStation Helper</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-0 sm:py-6 lg:px-8">
        <div className="px-0 sm:px-4 sm:py-6">
          <div className="border-0 p-0 sm:border-4 sm:border-dashed sm:border-gray-200 sm:rounded-lg sm:p-8">
              {/* 일주일 데이터 표시 */}
              <div className="bg-white shadow rounded-lg p-2 mb-6 sm:mb-2 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">일주일 일정</h3>
                  <button
                    onClick={fetchWeekData}
                    disabled={isLoadingWeek}
                    className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {isLoadingWeek ? '로딩 중...' : '새로고침'}
                  </button>
                </div>
                
                {weekError && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-800 text-sm">{weekError}</p>
                  </div>
                )}
                
                {isLoadingWeek && (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
                    <p className="text-gray-600 text-sm">일주일 일정 정보를 불러오는 중...</p>
                  </div>
                )}
                
                {weekData.length > 0 && !isLoadingWeek && (
                  <div className="space-y-4">
                    {weekData.map((dayData, dayIndex) => (
                      <div key={dayIndex} className="border border-gray-200 rounded-md p-4">
                        <h4 className="text-md font-medium text-gray-900 mb-3">
                          {dayData.date} ({new Date(dayData.date).toLocaleDateString('ko-KR', { weekday: 'long' })})
                        </h4>
                        
                        {dayData.data.data && dayData.data.data.remain_buoys && (
                          <div className="bg-green-50 border border-green-200 rounded-md p-3">
                            <h5 className="text-sm font-medium text-green-900 mb-3">예약 현황</h5>
                            <div className="overflow-x-auto">
                              <table className="min-w-full text-sm">
                                <thead>
                                  <tr className="border-b border-green-300">
                                    <th className="text-center py-2 px-3 text-green-900 font-medium">시간대</th>
                                    <th className="text-center py-2 px-3 text-green-900 font-medium">잔여</th>
                                    <th className="text-left py-2 px-3 text-green-900 font-medium">부이</th>
                                    <th className="text-center py-2 px-3 text-green-900 font-medium">잔여</th>
                                    <th className="text-center py-2 px-3 text-green-900 font-medium">상태</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {Array.from({ length: Math.ceil(dayData.data.data.remain_buoys.length / 2) }, (_, groupIndex) => {
                                    const firstHalfIndex = groupIndex * 2;
                                    const secondHalfIndex = groupIndex * 2 + 1;
                                    const firstHalf = dayData.data.data.remain_buoys[firstHalfIndex];
                                    const secondHalf = dayData.data.data.remain_buoys[secondHalfIndex];
                                    const buoyNumber = groupIndex + 1;

                                    const remainGen = dayData.data.data.remain.gen[groupIndex];

                                    const remainUsers = remainGen.remain;
                                    
                                    // remainUsers가 0이면 빨간 배경, 아니면 기본 배경
                                    const rowBgClass = remainUsers === 0 ? 'bg-red-50' : '';
                                    const textColorClass = remainUsers === 0 ? 'text-red-800' : 'text-green-800';
                                    
                                    return (
                                      <React.Fragment key={groupIndex}>
                                        <tr className={`border-b border-green-200 ${rowBgClass}`}>
                                          <td rowSpan="2" className={`py-2 px-3 ${textColorClass} font-medium align-middle`}>
                                            {buoyNumber}부
                                          </td>
                                          <td rowSpan="2" className={`py-2 px-3 ${textColorClass}`}>
                                            {remainUsers}
                                          </td>
                                          <td className={`py-2 px-3 ${textColorClass}`}>
                                            전반 {firstHalf.buoy_time}
                                          </td>
                                          <td className={`py-2 px-3 text-center ${textColorClass} font-medium`}>
                                            {firstHalf.remain_buoys}개
                                          </td>
                                          <td className="py-2 px-3 text-center">
                                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                              firstHalf.remain_buoys > 0 && remainUsers > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                                            }`}>
                                              {firstHalf.remain_buoys > 0 && remainUsers > 0 ? '예약가능' : '예약불가'}
                                            </span>
                                          </td>
                                        </tr>
                                        <tr className={`border-b border-green-200 last:border-b-0 ${rowBgClass}`}>
                                          <td className={`py-2 px-3 ${textColorClass}`}>
                                            후반 {secondHalf.buoy_time}
                                          </td>
                                          <td className={`py-2 px-3 text-center ${textColorClass} font-medium`}>
                                            {secondHalf.remain_buoys}개
                                          </td>
                                          <td className="py-2 px-3 text-center">
                                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                              secondHalf.remain_buoys > 0 && remainUsers > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                                            }`}>
                                              {secondHalf.remain_buoys > 0 && remainUsers > 0 ? '예약가능' : '예약불가'}
                                            </span>
                                          </td>
                                        </tr>
                                      </React.Fragment>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;

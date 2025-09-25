import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getValidAuthData, logout } from '../utils/auth';
import axios from 'axios';

const HomePage = () => {
  const navigate = useNavigate();
  const [authData, setAuthData] = useState(null);
  const [isChecking, setIsChecking] = useState(true);
  const [dayInfoData, setDayInfoData] = useState(null);
  const [isLoadingDayInfo, setIsLoadingDayInfo] = useState(false);
  const [dayInfoError, setDayInfoError] = useState('');
  const [weekData, setWeekData] = useState([]);
  const [isLoadingWeek, setIsLoadingWeek] = useState(false);
  const [weekError, setWeekError] = useState('');

  // dayinfo API 호출 함수
  const fetchDayInfo = async () => {
    if (!authData || !authData.cookies) {
      setDayInfoError('쿠키 정보가 없습니다.');
      return;
    }

    setIsLoadingDayInfo(true);
    setDayInfoError('');

    try {
      const today = new Date();
      const dateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
      
      const response = await axios.post(
        'https://u9q3vta531.execute-api.ap-northeast-2.amazonaws.com/default/dayinfo',
        {
          date: dateString,
          cookies: authData.cookies
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      setDayInfoData(response.data);
    } catch (error) {
      setDayInfoError('일정 정보를 가져오는데 실패했습니다.');
      console.error('DayInfo API error:', error);
    } finally {
      setIsLoadingDayInfo(false);
    }
  };

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
      for (let i = 1; i <= 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        
        weekPromises.push(
          axios.post(
            'https://u9q3vta531.execute-api.ap-northeast-2.amazonaws.com/default/dayinfo',
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
      console.error('Week data API error:', error);
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

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
              {/* 일주일 데이터 표시 */}
              <div className="bg-white shadow rounded-lg p-6 mb-6">
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
                            <h5 className="text-sm font-medium text-green-900 mb-2">부이 현황</h5>
                            <div className="text-sm text-green-800">
                              {dayData.data.data.remain_buoys.map((buoy, buoyIndex) => {
                                const buoyNumber = Math.floor(buoyIndex / 2) + 1;
                                const isFirstHalf = buoyIndex % 2 === 0;
                                const halfText = isFirstHalf ? '전반' : '후반';
                                
                                const isAvailable = buoy.remain_buoys > 0;
                                const availabilityText = isAvailable ? '예약가능' : '예약불가';
                                const textColor = isAvailable ? 'text-green-800' : 'text-red-600';
                                
                                return (
                                  <div key={buoyIndex} className={`mb-1 ${textColor}`}>
                                    {buoyNumber}부 {halfText} {buoy.buoy_time}: {buoy.remain_buoys}개 남음 - {availabilityText}
                                  </div>
                                );
                              })}
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

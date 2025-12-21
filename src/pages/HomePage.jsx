import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getValidAuthData, logout } from '../utils/auth';
import { API_CONFIG } from '../config/api';
import axios from 'axios';
import Navbar from '../components/Navbar';
import DateNavigator from '../components/DateNavigator';
import ReservationTable from '../components/ReservationTable';

import { getTodayString, addDays, isBefore } from '../utils/date';

const HomePage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [authData, setAuthData] = useState(null);
  const [isChecking, setIsChecking] = useState(true);
  const [dailyDataList, setDailyDataList] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [dataError, setDataError] = useState('');

  // URL에서 날짜를 가져오거나 기본값(내일) 설정
  const getSelectedDate = () => {
    const dateFromUrl = searchParams.get('date');
    const today = getTodayString();

    if (dateFromUrl) {
      // 오늘 이전 날짜인지 확인
      if (isBefore(dateFromUrl, today)) {
        // 오늘 이전 날짜면 내일로 리다이렉트
        const tomorrowString = addDays(today, 1);
        setSearchParams({ date: tomorrowString });
        return tomorrowString;
      }
      return dateFromUrl;
    }

    // 기본값을 내일로 설정
    return addDays(today, 1);
  };

  const selectedDate = getSelectedDate();


  // 선택된 날짜의 데이터를 가져오는 함수
  const fetchDateData = async (dateString) => {
    if (!authData || !authData.cookies) {
      setDataError('쿠키 정보가 없습니다.');
      return;
    }

    setIsLoadingData(true);
    setDataError('');

    try {
      const response = await axios.post(
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
      );

      setDailyDataList([{
        date: dateString,
        data: response.data
      }]);
    } catch (error) {
      setDataError('일정 정보를 가져오는데 실패했습니다.');
      // 프로덕션에서는 상세한 에러 로그를 제거
      if (process.env.NODE_ENV === 'development') {
        console.error('Date data API error:', error);
      }
    } finally {
      setIsLoadingData(false);
    }
  };

  // 날짜 변경 핸들러
  const handleDateChange = (newDate) => {
    setSearchParams({ date: newDate });
    fetchDateData(newDate);
  };

  // 이전 날짜로 이동
  const goToPreviousDay = () => {
    const newDateString = addDays(selectedDate, -1);
    handleDateChange(newDateString);
  };

  // 다음 날짜로 이동
  const goToNextDay = () => {
    const newDateString = addDays(selectedDate, 1);
    handleDateChange(newDateString);
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

  // 인증 데이터가 로드되면 선택된 날짜 데이터 호출
  useEffect(() => {
    if (authData) {
      fetchDateData(selectedDate);
    }
  }, [authData, selectedDate]);

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
      <Navbar onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto py-0 sm:py-6 lg:px-8">
        <div className="px-0 sm:px-4 sm:py-6">
          <div className="border-0 p-0 sm:border-4 sm:border-dashed sm:border-gray-200 sm:rounded-lg sm:p-8">

            <DateNavigator
              selectedDate={selectedDate}
              onDateChange={handleDateChange}
              onPrevDay={goToPreviousDay}
              onNextDay={goToNextDay}
              minDate={getTodayString()}
            />

            {/* 일정 데이터 표시 */}
            <div className="bg-white shadow rounded-lg p-2 mb-6 sm:mb-2 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">예약 현황</h3>
                <button
                  onClick={() => fetchDateData(selectedDate)}
                  disabled={isLoadingData}
                  className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isLoadingData ? '로딩 중...' : '새로고침'}
                </button>
              </div>

              {dataError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-800 text-sm">{dataError}</p>
                </div>
              )}

              <ReservationTable dailyDataList={dailyDataList} isLoading={isLoadingData} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;

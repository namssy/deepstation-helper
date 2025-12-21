import React from 'react';

const DateNavigator = ({ selectedDate, onDateChange, onPrevDay, onNextDay, minDate }) => {
    return (
        <div className="bg-white shadow rounded-lg p-4 mb-4">
            <div className="flex items-center justify-center space-x-4">
                <button
                    onClick={onPrevDay}
                    className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
                    title="이전 날"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <div className="flex flex-col items-center">
                    <label htmlFor="date-picker" className="text-sm font-medium text-gray-700 mb-1">
                        날짜 선택
                    </label>
                    <input
                        id="date-picker"
                        type="date"
                        value={selectedDate}
                        min={minDate}
                        onChange={(e) => onDateChange(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                <button
                    onClick={onNextDay}
                    className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
                    title="다음 날"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default DateNavigator;

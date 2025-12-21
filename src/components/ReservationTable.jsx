import React from 'react';
import { formatDateWithDay } from '../utils/date';

const ReservationTable = ({ dailyDataList, isLoading }) => {
    if (isLoading) {
        return (
            <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
                <p className="text-gray-600 text-sm">일정 정보를 불러오는 중...</p>
            </div>
        );
    }

    if (!dailyDataList || dailyDataList.length === 0) {
        return null;
    }

    return (
        <div className="space-y-4">
            {dailyDataList.map((dayData, dayIndex) => (
                <div key={dayIndex} className="border border-gray-200 rounded-md p-4">
                    <h4 className="text-md font-medium text-gray-900 mb-3">
                        {formatDateWithDay(dayData.date)}
                    </h4>

                    {dayData.data.data && dayData.data.data.remain_buoys && (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr className="border-b border-black-300">
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

                                        const rowBgClass = remainUsers === 0 ? 'bg-red-50' : 'bg-green-50';
                                        const borderColorClass = remainUsers === 0 ? 'border-red-300' : 'border-green-300';
                                        const textColorClass = remainUsers === 0 ? 'text-red-800' : 'text-green-800';

                                        return (
                                            <React.Fragment key={groupIndex}>
                                                <tr className={`border-b ${borderColorClass} ${rowBgClass}`}>
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
                                                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${firstHalf.remain_buoys > 0 && remainUsers > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                                                            }`}>
                                                            {firstHalf.remain_buoys > 0 && remainUsers > 0 ? '예약가능' : '예약불가'}
                                                        </span>
                                                    </td>
                                                </tr>
                                                <tr className={`border-b last:border-b-0 ${rowBgClass}`}>
                                                    <td className={`py-2 px-3 ${textColorClass}`}>
                                                        후반 {secondHalf.buoy_time}
                                                    </td>
                                                    <td className={`py-2 px-3 text-center ${textColorClass} font-medium`}>
                                                        {secondHalf.remain_buoys}개
                                                    </td>
                                                    <td className="py-2 px-3 text-center">
                                                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${secondHalf.remain_buoys > 0 && remainUsers > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
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
                    )}
                </div>
            ))}
        </div>
    );
};

export default ReservationTable;

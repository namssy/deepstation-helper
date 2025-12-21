import { format, addDays as addDaysFns, isBefore as isBeforeFns, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';

/**
 * 오늘 날짜를 YYYY-MM-DD 포맷의 문자열로 반환
 * @returns {string} 'YYYY-MM-DD'
 */
export const getTodayString = () => {
    return format(new Date(), 'yyyy-MM-dd');
};

/**
 * 기준 날짜 문자열에 일수를 더하거나 뺌
 * @param {string} dateString 'YYYY-MM-DD'
 * @param {number} amount 더할 일수 (음수면 뺌)
 * @returns {string} 'YYYY-MM-DD'
 */
export const addDays = (dateString, amount) => {
    const date = parseISO(dateString);
    const result = addDaysFns(date, amount);
    return format(result, 'yyyy-MM-dd');
};

/**
 * date1이 date2보다 이전 날짜인지 확인
 * @param {string} date1String 'YYYY-MM-DD'
 * @param {string} date2String 'YYYY-MM-DD'
 * @returns {boolean}
 */
export const isBefore = (date1String, date2String) => {
    return isBeforeFns(parseISO(date1String), parseISO(date2String));
};

/**
 * 날짜 문자열을 UI 표시용으로 포맷팅 (예: 2024-12-25 (수요일))
 * @param {string} dateString 'YYYY-MM-DD'
 * @returns {string}
 */
export const formatDateWithDay = (dateString) => {
    return format(parseISO(dateString), 'yyyy-MM-dd (eeee)', { locale: ko });
};

/**
 * 현재 시간을 ISO 포맷으로 반환
 * @returns {string} ISO String
 */
export const getCurrentISOString = () => {
    return new Date().toISOString();
};

/**
 * 현재 시간으로부터 지정된 분 후의 시간을 ISO 포맷으로 반환
 * @param {number} minutes 분
 * @returns {string} ISO String
 */
export const getFutureISOString = (minutes) => {
    const date = new Date();
    date.setMinutes(date.getMinutes() + minutes);
    return date.toISOString();
};

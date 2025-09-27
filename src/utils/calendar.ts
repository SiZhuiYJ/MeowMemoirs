
// import calendars, { type LunarDateInfo } from "@/views/console/calendar/components/calendar-converter";

// interface SlotData {
//     day: string;
// }

// // 是否节假日
// export function isFestival(slotData: SlotData): boolean {
//     const solarDayArr = slotData.day.split("-");
//     const lunarDay = calendars.solar2lunar(
//         parseInt(solarDayArr[0]),
//         parseInt(solarDayArr[1]),
//         parseInt(solarDayArr[2])
//     ) as LunarDateInfo;

//     // 公历节日\农历节日\农历节气
//     const festAndTerm: string[] = [];
//     festAndTerm.push(lunarDay.festival == null ? "" : " " + lunarDay.festival);
//     festAndTerm.push(lunarDay.lunarFestival == null ? "" : "" + lunarDay.lunarFestival);

//     return festAndTerm.join("") !== "";
// }

// // 公历转农历
// export function solarToLunar(slotData: SlotData): string {
//     const solarDayArr = slotData.day.split("-");
//     const lunarDay = calendars.solar2lunar(
//         parseInt(solarDayArr[0]),
//         parseInt(solarDayArr[1]),
//         parseInt(solarDayArr[2])
//     ) as LunarDateInfo;

//     // 农历日期
//     let lunarMD = "";
//     if (lunarDay.IDayCn === "初一") {
//         lunarMD = lunarDay.IMonthCn;
//     } else {
//         lunarMD = lunarDay.IDayCn;
//     }

//     // 公历节日\农历节日\农历节气
//     const festAndTerm: string[] = [];
//     festAndTerm.push(lunarDay.festival == null ? "" : " " + lunarDay.festival);
//     festAndTerm.push(lunarDay.lunarFestival == null ? "" : " " + lunarDay.lunarFestival);
//     festAndTerm.push(lunarDay.Term == null ? "" : " " + lunarDay.Term);

//     const result = festAndTerm.join("");
//     return result === "" ? lunarMD : result;
// }
// // 数字转中文数字（如‘11’转为十一）
// export function numberToChinese(number: number): string {
//     const chineseNumbers = [
//         "零",
//         "一",
//         "二",
//         "三",
//         "四",
//         "五",
//         "六",
//         "七",
//         "八",
//         "九",
//         "十",
//     ];
//     if (number <= 10) {
//         return chineseNumbers[number];
//     }
//     if (number < 20) {
//         return "十" + chineseNumbers[number - 10];
//     }
//     if (number <= 100) {
//         return (
//             chineseNumbers[Math.floor(number / 10)] +
//             "十" +
//             (number % 10 == 0 ? "" : chineseNumbers[number % 10])
//         );
//     }
//     return chineseNumbers[Math.floor(number / 100)] + "百" + numberToChinese(number % 100);
// }

// //获取当前日期格式为yyyy-mm-dd
// export function getCurrentDate() {
//     const now = new Date();
//     return getDateFormatYYYYMMDD(now);
// }

// /** 通用函数：获取任意日期的前n天 */
// export const getDateDaysBefore = (date: Date, days: number): Date => {
//     const copy = new Date(date); // 创建副本避免修改原对象
//     copy.setDate(copy.getDate() - days);
//     return copy;
// };
// /** 获取任意日期的yyyy-mm-dd格式 */
// export function getDateFormatYYYYMMDD(date: Date): string {
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const day = String(date.getDate()).padStart(2, "0");
//     return `${year}-${month}-${day}`;
// }
// /** 获取任意日期的mm-dd格式 */
// export function formatDateToMMDD(date: Date): string {
//     const month = (date.getMonth() + 1).toString().padStart(2, "0");
//     const day = date.getDate().toString().padStart(2, "0");
//     return `${month}-${day}`;
// }
// // 获取今日是startDate的第几周
// export function getWeekNumber(input: string, startDate: Date): number {
//     const inputDate = new Date(input);
//     // 获取日期的时间戳（毫秒数）
//     const startMs = startDate.getTime();
//     const inputMs = inputDate.getTime();
//     // 计算日期差值（天）
//     const dayDiff = Math.floor((inputMs - startMs) / (1000 * 60 * 60 * 24));
//     // 计算周数（向上取整）
//     const weekNumber = Math.ceil((dayDiff + 1) / 7);
//     return weekNumber;
// }


/**
 * 日历增强工具类
 * 提供公历农历转换、节假日判断、日期格式化等功能
 */

import calendars, { type LunarDateInfo } from "@/views/console/calendar/components/calendar-converter";

interface SlotData {
    day: string; // 格式: "YYYY-MM-DD"
}

/**
 * 判断指定日期是否为节日（公历节日、农历节日或节气）
 * @param slotData - 包含日期字符串的对象
 * @returns 如果是节日返回true，否则返回false
 */
export function isFestival(slotData: SlotData): boolean {
    const lunarDay = parseSolarDate(slotData.day);

    // 判断是否存在公历节日、农历节日或节气
    return !!(lunarDay.festival || lunarDay.lunarFestival || lunarDay.Term);
}

/**
 * 将公历日期转换为农历显示字符串
 * 优先显示节日/节气，没有则显示农历日期
 * @param slotData - 包含日期字符串的对象
 * @returns 农历日期或节日字符串
 */
export function solarToLunar(slotData: SlotData): string {
    const lunarDay = parseSolarDate(slotData.day);

    // 农历日期显示规则：初一显示月份，其他显示日期
    let lunarMD = lunarDay.IDayCn === "初一" ? lunarDay.IMonthCn : lunarDay.IDayCn;

    // 优先显示节日和节气
    const festAndTerm = [lunarDay.festival, lunarDay.lunarFestival, lunarDay.Term]
        .filter(item => item != null)
        .join(" ");

    return festAndTerm || lunarMD;
}

/**
 * 将数字转换为中文数字
 * @param number - 需要转换的数字 (0-999)
 * @returns 中文数字字符串
 * @example 
 * numberToChinese(11) // "十一"
 * numberToChinese(25) // "二十五"
 * numberToChinese(100) // "一百"
 */
export function numberToChinese(number: number): string {
    if (number < 0 || number > 999) {
        return number.toString(); // 超出范围直接返回数字字符串
    }

    const chineseNumbers = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];

    // 0-10直接返回
    if (number <= 10) {
        return chineseNumbers[number];
    }

    // 11-19特殊处理
    if (number < 20) {
        return "十" + chineseNumbers[number - 10];
    }

    // 20-99处理
    if (number < 100) {
        const tens = Math.floor(number / 10);
        const units = number % 10;
        return chineseNumbers[tens] + "十" + (units === 0 ? "" : chineseNumbers[units]);
    }

    // 100-999处理
    if (number <= 999) {
        const hundreds = Math.floor(number / 100);
        const remainder = number % 100;
        return chineseNumbers[hundreds] + "百" + (remainder === 0 ? "" : numberToChinese(remainder));
    }

    return number.toString();
}

/**
 * 获取当前日期，格式为YYYY-MM-DD
 * @returns 当前日期字符串
 */
export function getCurrentDate(): string {
    return getDateFormatYYYYMMDD(new Date());
}

/**
 * 获取指定日期前几天的日期
 * @param date - 基准日期
 * @param days - 天数（正整数）
 * @returns 计算后的新日期对象
 */
export const getDateDaysBefore = (date: Date, days: number): Date => {
    const copy = new Date(date); // 创建副本避免修改原对象
    copy.setDate(copy.getDate() - days);
    return copy;
};

/**
 * 将日期格式化为YYYY-MM-DD格式
 * @param date - 需要格式化的日期对象
 * @returns 格式化后的日期字符串
 */
export function getDateFormatYYYYMMDD(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

/**
 * 将日期格式化为MM-DD格式
 * @param date - 需要格式化的日期对象
 * @returns 格式化后的月份-日期字符串
 */
export function formatDateToMMDD(date: Date): string {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${month}-${day}`;
}

/**
 * 计算指定日期相对于起始日期是第几周
 * @param inputDateStr - 需要计算的日期字符串(YYYY-MM-DD)
 * @param startDate - 起始日期
 * @returns 周数（从1开始）
 */
export function getWeekNumber(inputDateStr: string, startDate: Date): number {
    const inputDate = new Date(inputDateStr);

    // 验证日期有效性
    if (isNaN(inputDate.getTime())) {
        throw new Error("Invalid input date string");
    }

    // 计算两个日期之间的天数差
    const startMs = startDate.getTime();
    const inputMs = inputDate.getTime();
    const dayDiff = Math.floor((inputMs - startMs) / (1000 * 60 * 60 * 24));

    // 计算周数（向上取整，保证第一天为第1周）
    return Math.ceil((dayDiff + 1) / 7);
}

/**
 * 内部工具函数：解析公历日期字符串为农历信息
 * @param dateStr - 公历日期字符串(YYYY-MM-DD)
 * @returns 农历日期信息对象
 */
function parseSolarDate(dateStr: string): LunarDateInfo {
    const dateParts = dateStr.split("-");
    if (dateParts.length !== 3) {
        throw new Error("Invalid date format, expected YYYY-MM-DD");
    }

    const [year, month, day] = dateParts.map(part => parseInt(part, 10));

    if (isNaN(year) || isNaN(month) || isNaN(day)) {
        throw new Error("Invalid date components");
    }

    return calendars.solar2lunar(year, month, day) as LunarDateInfo;
}

export default {
    isFestival,
    solarToLunar,
    numberToChinese,
    getCurrentDate,
    getDateDaysBefore,
    getDateFormatYYYYMMDD,
    formatDateToMMDD,
    getWeekNumber
};
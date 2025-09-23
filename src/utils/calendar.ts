
import calendars, { type LunarDateInfo } from "@/views/console/calendar/components/calendar-converter";

interface SlotData {
    day: string;
}

// 是否节假日
export function isFestival(slotData: SlotData): boolean {
    const solarDayArr = slotData.day.split("-");
    const lunarDay = calendars.solar2lunar(
        parseInt(solarDayArr[0]),
        parseInt(solarDayArr[1]),
        parseInt(solarDayArr[2])
    ) as LunarDateInfo;

    // 公历节日\农历节日\农历节气
    const festAndTerm: string[] = [];
    festAndTerm.push(lunarDay.festival == null ? "" : " " + lunarDay.festival);
    festAndTerm.push(lunarDay.lunarFestival == null ? "" : "" + lunarDay.lunarFestival);

    return festAndTerm.join("") !== "";
}

// 公历转农历
export function solarToLunar(slotData: SlotData): string {
    const solarDayArr = slotData.day.split("-");
    const lunarDay = calendars.solar2lunar(
        parseInt(solarDayArr[0]),
        parseInt(solarDayArr[1]),
        parseInt(solarDayArr[2])
    ) as LunarDateInfo;

    // 农历日期
    let lunarMD = "";
    if (lunarDay.IDayCn === "初一") {
        lunarMD = lunarDay.IMonthCn;
    } else {
        lunarMD = lunarDay.IDayCn;
    }

    // 公历节日\农历节日\农历节气
    const festAndTerm: string[] = [];
    festAndTerm.push(lunarDay.festival == null ? "" : " " + lunarDay.festival);
    festAndTerm.push(lunarDay.lunarFestival == null ? "" : " " + lunarDay.lunarFestival);
    festAndTerm.push(lunarDay.Term == null ? "" : " " + lunarDay.Term);

    const result = festAndTerm.join("");
    return result === "" ? lunarMD : result;
}
// 数字转中文数字（如‘11’转为十一）
export function numberToChinese(number: number): string {
    const chineseNumbers = [
        "零",
        "一",
        "二",
        "三",
        "四",
        "五",
        "六",
        "七",
        "八",
        "九",
        "十",
    ];
    if (number <= 10) {
        return chineseNumbers[number];
    }
    if (number < 20) {
        return "十" + chineseNumbers[number - 10];
    }
    if (number <= 100) {
        return (
            chineseNumbers[Math.floor(number / 10)] +
            "十" +
            (number % 10 == 0 ? "" : chineseNumbers[number % 10])
        );
    }
    return chineseNumbers[Math.floor(number / 100)] + "百" + numberToChinese(number % 100);
}

//获取当前日期格式为yyyy-mm-dd
export function getCurrentDate() {
    const now = new Date();
    return getDateFormatYYYYMMDD(now);
}

/** 通用函数：获取任意日期的前n天 */
export const getDateDaysBefore = (date: Date, days: number): Date => {
    const copy = new Date(date); // 创建副本避免修改原对象
    copy.setDate(copy.getDate() - days);
    return copy;
};
/** 获取任意日期的yyyy-mm-dd格式 */
export function getDateFormatYYYYMMDD(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}
/** 获取任意日期的mm-dd格式 */
export function formatDateToMMDD(date: Date): string {
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${month}-${day}`;
}
// 获取今日是startDate的第几周
export function getWeekNumber(input: string, startDate: Date): number {
    const inputDate = new Date(input);
    // 获取日期的时间戳（毫秒数）
    const startMs = startDate.getTime();
    const inputMs = inputDate.getTime();
    // 计算日期差值（天）
    const dayDiff = Math.floor((inputMs - startMs) / (1000 * 60 * 60 * 24));
    // 计算周数（向上取整）
    const weekNumber = Math.ceil((dayDiff + 1) / 7);
    return weekNumber;
}


// index.ts
export interface LunarDateInfo {
    date: string;
    lunarDate: string;
    festival: string | null;
    lunarFestival: string | null;
    lYear: number;
    lMonth: number;
    lDay: number;
    Animal: string;
    IMonthCn: string;
    IDayCn: string;
    cYear: number;
    cMonth: number;
    cDay: number;
    gzYear: string;
    gzMonth: string;
    gzDay: string;
    isToday: boolean;
    isLeap: boolean;
    nWeek: number;
    ncWeek: string;
    isTerm: boolean;
    Term: string | null;
    astro: string;
}

export interface FestivalItem {
    title: string;
}

export interface FestivalData {
    [key: string]: FestivalItem;
}

const calendar = (function (): {
    lunarInfo: number[];
    solarMonth: number[];
    Gan: string[];
    Zhi: string[];
    Animals: string[];
    festival: FestivalData;
    lFestival: FestivalData;
    solarTerm: string[];
    sTermInfo: string[];
    nStr1: string[];
    nStr2: string[];
    nStr3: string[];
    getFestival: () => FestivalData;
    getLunarFestival: () => FestivalData;
    setFestival: (param?: FestivalData) => void;
    setLunarFestival: (param?: FestivalData) => void;
    lYearDays: (y: number) => number;
    leapMonth: (y: number) => number;
    leapDays: (y: number) => number;
    monthDays: (y: number, m: number) => number;
    solarDays: (y: number, m: number) => number;
    toGanZhiYear: (lYear: number) => string;
    toAstro: (cMonth: number, cDay: number) => string;
    toGanZhi: (offset: number) => string;
    getTerm: (y: number, n: number) => number;
    toChinaMonth: (m: number) => string;
    toChinaDay: (d: number) => string;
    getAnimal: (y: number) => string;
    solar2lunar: (yPara: number | string, mPara: number | string, dPara: number | string) => LunarDateInfo | -1;
    lunar2solar: (y: number | string, m: number | string, d: number | string, isLeapMonth?: boolean) => LunarDateInfo | -1;
} {
    'use strict';

    const lunarInfo: number[] = [
        0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
        // 1900-1909
        0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
        // 1910-1919
        0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
        // 1920-1929
        0x06566, 0x0d4a0, 0x0ea50, 0x16a95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
        // 1930-1939
        0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
        // 1940-1949
        0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0,
        // 1950-1959
        0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
        // 1960-1969
        0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6,
        // 1970-1979
        0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
        // 1980-1989
        0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x05ac0, 0x0ab60, 0x096d5, 0x092e0,
        // 1990-1999
        0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
        // 2000-2009
        0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
        // 2010-2019
        0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
        // 2020-2029
        0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,
        // 2030-2039
        0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0,
        // 2040-2049
        /**Add By JJonline@JJonline.Cn**/
        0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0,
        // 2050-2059
        0x092e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4,
        // 2060-2069
        0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0,
        // 2070-2079
        0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160,
        // 2080-2089
        0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252,
        // 2090-2099
        0x0d520, // 2100
    ];

    const solarMonth: number[] = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    const Gan: string[] = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    const Zhi: string[] = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

    const ChineseZodiac: string[] = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];

    const festival: FestivalData = {
        '1-1': { title: '元旦节' },
        '2-14': { title: '情人节' },
        '5-1': { title: '劳动节' },
        '5-4': { title: '青年节' },
        '6-1': { title: '儿童节' },
        '9-10': { title: '教师节' },
        '10-1': { title: '国庆节' },
        '12-25': { title: '圣诞节' },
        '3-8': { title: '妇女节' },
        '3-12': { title: '植树节' },
        '4-1': { title: '愚人节' },
        '5-12': { title: '护士节' },
        '7-1': { title: '建党节' },
        '8-1': { title: '建军节' },
        '12-24': { title: '平安夜' },
    };

    const lFestival: FestivalData = {
        '12-30': { title: '除夕' },
        '1-1': { title: '春节' },
        '1-15': { title: '元宵节' },
        '2-2': { title: '龙抬头' },
        '5-5': { title: '端午节' },
        '7-7': { title: '七夕节' },
        '7-15': { title: '中元节' },
        '8-15': { title: '中秋节' },
        '9-9': { title: '重阳节' },
        '10-1': { title: '寒衣节' },
        '10-15': { title: '下元节' },
        '12-8': { title: '腊八节' },
        '12-23': { title: '北方小年' },
        '12-24': { title: '南方小年' },
    };

    const solarTerm: string[] = [
        '小寒', '大寒', '立春', '雨水', '惊蛰', '春分', '清明', '谷雨', '立夏', '小满', '芒种', '夏至',
        '小暑', '大暑', '立秋', '处暑', '白露', '秋分', '寒露', '霜降', '立冬', '小雪', '大雪', '冬至',
    ];

    const sTermInfo: string[] = [
        '9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e', '97bcf97c3598082c95f8c965cc920f',
        '97bd0b06bdb0722c965ce1cfcc920f', 'b027097bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e',
        '97bcf97c359801ec95f8c965cc920f', '97bd0b06bdb0722c965ce1cfcc920f', 'b027097bd097c36b0b6fc9274c91aa',
        '97b6b97bd19801ec9210c965cc920e', '97bcf97c359801ec95f8c965cc920f', '97bd0b06bdb0722c965ce1cfcc920f',
        'b027097bd097c36b0b6fc9274c91aa', '9778397bd19801ec9210c965cc920e', '97b6b97bd19801ec95f8c965cc920f',
        '97bd09801d98082c95f8e1cfcc920f', '97bd097bd097c36b0b6fc9210c8dc2', '9778397bd197c36c9210c9274c91aa',
        '97b6b97bd19801ec95f8c965cc920e', '97bd09801d98082c95f8e1cfcc920f', '97bd097bd097c36b0b6fc9210c8dc2',
        '9778397bd097c36c9210c9274c91aa', '97b6b97bd19801ec95f8c965cc920e', '97bcf97c3598082c95f8e1cfcc920f',
        '97bd097bd097c36b0b6fc9210c8dc2', '9778397bd097c36c9210c9274c91aa', '97b6b97bd19801ec9210c965cc920e',
        '97bcf97c3598082c95f8c965cc920f', '97bd097bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa',
        '97b6b97bd19801ec9210c965cc920e', '97bcf97c3598082c95f8c965cc920f', '97bd097bd097c35b0b6fc920fb0722',
        '9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e', '97bcf97c359801ec95f8c965cc920f',
        '97bd097bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e',
        '97bcf97c359801ec95f8c965cc920f', '97bd097bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa',
        '97b6b97bd19801ec9210c965cc920e', '97bcf97c359801ec95f8c965cc920f', '97bd097bd07f595b0b6fc920fb0722',
        '9778397bd097c36b0b6fc9210c8dc2', '9778397bd19801ec9210c9274c920e', '97b6b97bd19801ec95f8c965cc920f',
        '97bd07f5307f595b0b0bc920fb0722', '7f0e397bd097c36b0b6fc9210c8dc2', '9778397bd097c36c9210c9274c920e',
        '97b6b97bd19801ec95f8c965cc920f', '97bd07f5307f595b0b0bc920fb0722', '7f0e397bd097c36b0b6fc9210c8dc2',
        '9778397bd097c36c9210c9274c91aa', '97b6b97bd19801ec9210c965cc920e', '97bd07f1487f595b0b0bc920fb0722',
        '7f0e397bd097c36b0b6fc9210c8dc2', '9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e',
        '97bcf7f1487f595b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa',
        '97b6b97bd19801ec9210c965cc920e', '97bcf7f1487f595b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722',
        '9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e', '97bcf7f1487f531b0b0bb0b6fb0722',
        '7f0e397bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e',
        '97bcf7f1487f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa',
        '97b6b97bd19801ec9210c9274c920e', '97bcf7f0e47f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b0bc920fb0722',
        '9778397bd097c36b0b6fc9210c91aa', '97b6b97bd197c36c9210c9274c920e', '97bcf7f0e47f531b0b0bb0b6fb0722',
        '7f0e397bd07f595b0b0bc920fb0722', '9778397bd097c36b0b6fc9210c8dc2', '9778397bd097c36c9210c9274c920e',
        '97b6b7f0e47f531b0723b0b6fb0722', '7f0e37f5307f595b0b0bc920fb0722', '7f0e397bd097c36b0b6fc9210c8dc2',
        '9778397bd097c36b0b70c9274c91aa', '97b6b7f0e47f531b0723b0b6fb0721', '7f0e37f1487f595b0b0bb0b6fb0722',
        '7f0e397bd097c35b0b6fc9210c8dc2', '9778397bd097c36b0b6fc9274c91aa', '97b6b7f0e47f531b0723b0b6fb0721',
        '7f0e27f1487f595b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa',
        '97b6b7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722',
        '9778397bd097c36b0b6fc9274c91aa', '97b6b7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722',
        '7f0e397bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa', '97b6b7f0e47f531b0723b0b6fb0721',
        '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b0bc920fb0722', '9778397bd097c36b0b6fc9274c91aa',
        '97b6b7f0e47f531b0723b0787b0721', '7f0e27f0e47f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b0bc920fb0722',
        '9778397bd097c36b0b6fc9210c91aa', '97b6b7f0e47f149b0723b0787b0721', '7f0e27f0e47f531b0723b0b6fb0722',
        '7f0e397bd07f595b0b0bc920fb0722', '9778397bd097c36b0b6fc9210c8dc2', '977837f0e37f149b0723b0787b0721',
        '7f07e7f0e47f531b0723b0b6fb0722', '7f0e37f5307f595b0b0bc920fb0722', '7f0e397bd097c35b0b6fc9210c8dc2',
        '977837f0e37f14998082b0787b0721', '7f07e7f0e47f531b0723b0b6fb0721', '7f0e37f1487f595b0b0bb0b6fb0722',
        '7f0e397bd097c35b0b6fc9210c8dc2', '977837f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721',
        '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722', '977837f0e37f14998082b0787b06bd',
        '7f07e7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722',
        '977837f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722',
        '7f0e397bd07f595b0b0bc920fb0722', '977837f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721',
        '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b0bc920fb0722', '977837f0e37f14998082b0787b06bd',
        '7f07e7f0e47f149b0723b0787b0721', '7f0e27f0e47f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b0bc920fb0722',
        '977837f0e37f14998082b0723b06bd', '7f07e7f0e37f149b0723b0787b0721', '7f0e27f0e47f531b0723b0b6fb0722',
        '7f0e397bd07f595b0b0bc920fb0722', '977837f0e37f14898082b0723b02d5', '7ec967f0e37f14998082b0787b0721',
        '7f07e7f0e47f531b0723b0b6fb0722', '7f0e37f1487f595b0b0bb0b6fb0722', '7f0e37f0e37f14898082b0723b02d5',
        '7ec967f0e37f14998082b0787b0721', '7f07e7f0e47f531b0723b0b6fb0722', '7f0e37f1487f531b0b0bb0b6fb0722',
        '7f0e37f0e37f14898082b0723b02d5', '7ec967f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721',
        '7f0e37f1487f531b0b0bb0b6fb0722', '7f0e37f0e37f14898082b072297c35', '7ec967f0e37f14998082b0787b06bd',
        '7f07e7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e37f0e37f14898082b072297c35',
        '7ec967f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722',
        '7f0e37f0e366aa89801eb072297c35', '7ec967f0e37f14998082b0787b06bd', '7f07e7f0e47f149b0723b0787b0721',
        '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e37f0e366aa89801eb072297c35', '7ec967f0e37f14998082b0723b06bd',
        '7f07e7f0e47f149b0723b0787b0721', '7f0e27f0e47f531b0723b0b6fb0722', '7f0e37f0e366aa89801eb072297c35',
        '7ec967f0e37f14998082b0723b06bd', '7f07e7f0e37f14998083b0787b0721', '7f0e27f0e47f531b0723b0b6fb0722',
        '7f0e37f0e366aa89801eb072297c35', '7ec967f0e37f14898082b0723b02d5', '7f07e7f0e37f14998082b0787b0721',
        '7f07e7f0e47f531b0723b0b6fb0722', '7f0e36665b66aa89801e9808297c35', '665f67f0e37f14898082b0723b02d5',
        '7ec967f0e37f14998082b0787b0721', '7f07e7f0e47f531b0723b0b6fb0722', '7f0e36665b66a449801e9808297c35',
        '665f67f0e37f14898082b0723b02d5', '7ec967f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721',
        '7f0e36665b66a449801e9808297c35', '665f67f0e37f14898082b072297c35', '7ec967f0e37f14998082b0787b06bd',
        '7f07e7f0e47f531b0723b0b6fb0721', '7f0e26665b66a449801e9808297c35', '665f67f0e37f1489801eb072297c35',
        '7ec967f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722',
    ];

    const nStr1: string[] = ['日', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
    const nStr2: string[] = ['初', '十', '廿', '卅'];
    const nStr3: string[] = ['正', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'];

    const calendar = {
        lunarInfo,
        solarMonth,
        Gan,
        Zhi,
        Animals: ChineseZodiac,
        festival,
        lFestival,
        solarTerm,
        sTermInfo,
        nStr1,
        nStr2,
        nStr3,

        getFestival(): FestivalData {
            return this.festival;
        },

        getLunarFestival(): FestivalData {
            return this.lFestival;
        },

        setFestival(param: FestivalData = {}): void {
            this.festival = param;
        },

        setLunarFestival(param: FestivalData = {}): void {
            this.lFestival = param;
        },

        lYearDays(y: number): number {
            let sum = 348;
            for (let i = 0x8000; i > 0x8; i >>= 1) {
                sum += this.lunarInfo[y - 1900] & i ? 1 : 0;
            }
            return sum + this.leapDays(y);
        },

        leapMonth(y: number): number {
            return this.lunarInfo[y - 1900] & 0xf;
        },

        leapDays(y: number): number {
            if (this.leapMonth(y)) {
                return this.lunarInfo[y - 1900] & 0x10000 ? 30 : 29;
            }
            return 0;
        },

        monthDays(y: number, m: number): number {
            if (m > 12 || m < 1) {
                return -1;
            }
            return this.lunarInfo[y - 1900] & (0x10000 >> m) ? 30 : 29;
        },

        solarDays(y: number, m: number): number {
            if (m > 12 || m < 1) {
                return -1;
            }
            const ms = m - 1;
            if (ms === 1) {
                return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0 ? 29 : 28;
            } else {
                return this.solarMonth[ms];
            }
        },

        toGanZhiYear(lYear: number): string {
            let ganKey = (lYear - 3) % 10;
            let zhiKey = (lYear - 3) % 12;
            if (ganKey === 0) ganKey = 10;
            if (zhiKey === 0) zhiKey = 12;
            return this.Gan[ganKey - 1] + this.Zhi[zhiKey - 1];
        },

        toAstro(cMonth: number, cDay: number): string {
            const s = '魔羯水瓶双鱼白羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯';
            const arr = [20, 19, 21, 21, 21, 22, 23, 23, 23, 23, 22, 22];
            return s.substr(cMonth * 2 - (cDay < arr[cMonth - 1] ? 2 : 0), 2) + '座';
        },

        toGanZhi(offset: number): string {
            return this.Gan[offset % 10] + this.Zhi[offset % 12];
        },

        getTerm(y: number, n: number): number {
            if (y < 1900 || y > 2100 || n < 1 || n > 24) {
                return -1;
            }
            const _table = this.sTermInfo[y - 1900];
            const _calcDay: string[] = [];
            for (let index = 0; index < _table.length; index += 5) {
                const chunk = parseInt('0x' + _table.substr(index, 5)).toString();
                _calcDay.push(chunk[0], chunk.substr(1, 2), chunk[3], chunk.substr(4, 2));
            }
            return parseInt(_calcDay[n - 1]);
        },

        toChinaMonth(m: number): string {
            if (m > 12 || m < 1) {
                return '-1';
            }
            return this.nStr3[m - 1] + '月';
        },

        toChinaDay(d: number): string {
            let s: string;
            switch (d) {
                case 10:
                    s = '初十';
                    break;
                case 20:
                    s = '二十';
                    break;
                case 30:
                    s = '三十';
                    break;
                default:
                    s = this.nStr2[Math.floor(d / 10)];
                    s += this.nStr1[d % 10];
            }
            return s;
        },

        getAnimal(y: number): string {
            return this.Animals[(y - 4) % 12];
        },

        solar2lunar(yPara: number | string, mPara: number | string, dPara: number | string): LunarDateInfo | -1 {
            const y = parseInt(yPara as string);
            const m = parseInt(mPara as string);
            const d = parseInt(dPara as string);

            if (y < 1900 || y > 2100) {
                return -1;
            }
            if (y === 1900 && m === 1 && d < 31) {
                return -1;
            }

            let objDate: Date;
            if (!y) {
                objDate = new Date();
            } else {
                objDate = new Date(y, parseInt(mPara as string) - 1, d);
            }

            let i: number;
            let leap = 0;
            let temp = 0;

            const _y = objDate.getFullYear();
            const _m = objDate.getMonth() + 1;
            const _d = objDate.getDate();
            let offset = (Date.UTC(objDate.getFullYear(), objDate.getMonth(), objDate.getDate()) - Date.UTC(1900, 0, 31)) / 86400000;

            for (i = 1900; i < 2101 && offset > 0; i++) {
                temp = this.lYearDays(i);
                offset -= temp;
            }
            if (offset < 0) {
                offset += temp;
                i--;
            }

            const isTodayObj = new Date();
            const isToday = isTodayObj.getFullYear() === _y && isTodayObj.getMonth() + 1 === _m && isTodayObj.getDate() === _d;

            const nWeek = objDate.getDay();
            const cWeek = this.nStr1[nWeek];
            const _nWeek = nWeek === 0 ? 7 : nWeek;

            const year = i;
            leap = this.leapMonth(i);
            let isLeap = false;

            for (i = 1; i < 13 && offset > 0; i++) {
                if (leap > 0 && i === leap + 1 && !isLeap) {
                    --i;
                    isLeap = true;
                    temp = this.leapDays(year);
                } else {
                    temp = this.monthDays(year, i);
                }

                if (isLeap && i === leap + 1) {
                    isLeap = false;
                }
                offset -= temp;
            }

            if (offset === 0 && leap > 0 && i === leap + 1) {
                if (isLeap) {
                    isLeap = false;
                } else {
                    isLeap = true;
                    --i;
                }
            }
            if (offset < 0) {
                offset += temp;
                --i;
            }

            const month = i;
            const day = offset + 1;
            const sm = _m - 1;
            const gzY = this.toGanZhiYear(year);

            const firstNode = this.getTerm(_y, _m * 2 - 1);
            const secondNode = this.getTerm(_y, _m * 2);

            let gzM = this.toGanZhi((_y - 1900) * 12 + _m + 11);
            if (_d >= firstNode) {
                gzM = this.toGanZhi((_y - 1900) * 12 + _m + 12);
            }

            let isTerm = false;
            let Term: string | null = null;
            if (firstNode === _d) {
                isTerm = true;
                Term = this.solarTerm[_m * 2 - 2];
            }
            if (secondNode === _d) {
                isTerm = true;
                Term = this.solarTerm[_m * 2 - 1];
            }

            const dayCyclical = Date.UTC(_y, sm, 1, 0, 0, 0, 0) / 86400000 + 25567 + 10;
            const gzD = this.toGanZhi(dayCyclical + _d - 1);
            const astro = this.toAstro(_m, _d);
            const solarDate = _y + '-' + _m + '-' + _d;
            const lunarDate = year + '-' + month + '-' + day;
            const festivalDate = _m + '-' + _d;
            let lunarFestivalDate = month + '-' + day;

            if (month === 12 && day === 29 && this.monthDays(year, month) === 29) {
                lunarFestivalDate = '12-30';
            }

            return {
                date: solarDate,
                lunarDate: lunarDate,
                festival: this.festival[festivalDate] ? this.festival[festivalDate].title : null,
                lunarFestival: this.lFestival[lunarFestivalDate] ? this.lFestival[lunarFestivalDate].title : null,
                lYear: year,
                lMonth: month,
                lDay: day,
                Animal: this.getAnimal(year),
                IMonthCn: (isLeap ? '闰' : '') + this.toChinaMonth(month),
                IDayCn: this.toChinaDay(day),
                cYear: _y,
                cMonth: _m,
                cDay: _d,
                gzYear: gzY,
                gzMonth: gzM,
                gzDay: gzD,
                isToday: isToday,
                isLeap: isLeap,
                nWeek: _nWeek,
                ncWeek: '星期' + cWeek,
                isTerm: isTerm,
                Term: Term,
                astro: astro,
            };
        },

        lunar2solar(y: number | string, m: number | string, d: number | string, isLeapMonth?: boolean): LunarDateInfo | -1 {
            const _y = parseInt(y as string);
            const _m = parseInt(m as string);
            const _d = parseInt(d as string);
            const _isLeapMonth = !!isLeapMonth;

            const leapMonth = this.leapMonth(_y);
            if (_isLeapMonth && leapMonth !== _m) {
                return -1;
            }
            if ((_y === 2100 && _m === 12 && _d > 1) || (_y === 1900 && _m === 1 && _d < 31)) {
                return -1;
            }

            const day = this.monthDays(_y, _m);
            let _day = day;
            if (_isLeapMonth) {
                _day = this.leapDays(_y);
            }
            if (_y < 1900 || _y > 2100 || _d > _day) {
                return -1;
            }

            let offset = 0;
            let i: number;
            for (i = 1900; i < _y; i++) {
                offset += this.lYearDays(i);
            }

            let leap = 0;
            let isAdd = false;
            for (i = 1; i < _m; i++) {
                leap = this.leapMonth(_y);
                if (!isAdd) {
                    if (leap <= i && leap > 0) {
                        offset += this.leapDays(_y);
                        isAdd = true;
                    }
                }
                offset += this.monthDays(_y, i);
            }

            if (_isLeapMonth) {
                offset += day;
            }

            const strap = Date.UTC(1900, 1, 30, 0, 0, 0);
            const calObj = new Date((offset + _d - 31) * 86400000 + strap);
            const cY = calObj.getUTCFullYear();
            const cM = calObj.getUTCMonth() + 1;
            const cD = calObj.getUTCDate();

            return this.solar2lunar(cY, cM, cD);
        },
    };

    return calendar;
})();

export default calendar;
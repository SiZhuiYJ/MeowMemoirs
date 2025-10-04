import { UAParser, type IResult } from 'ua-parser-js';

// 定义输出结构
interface ParsedUserAgent {
    deviceType: 'Unknown' | 'console' | 'desktop' | 'embedded' | 'mobile' | 'smarttv' | 'tablet' | 'wearable' | 'xr';
    os: { name: string; version: string };
    browser: { name: string; version: string };
}

// 核心解析函数
export function parseUserAgent(uaString: string): ParsedUserAgent {
    const parser = new UAParser(uaString);
    const result = parser.getResult() as IResult;

    // 设备类型判断（优先使用库结果，辅以关键词检测）
    let deviceType: ParsedUserAgent['deviceType'] = result.device.type || 'Unknown';
    console.log("deviceString", uaString);
    console.log("deviceType", result.device);
    if (!deviceType || deviceType === 'console') {
        const uaLower = uaString.toLowerCase();
        if (uaLower.includes('mobile') || uaLower.includes('android')) {
            deviceType = 'mobile';
        } else if (uaLower.includes('tablet') || uaLower.includes('ipad')) {
            deviceType = 'tablet';
        } else {
            deviceType = 'desktop';
        }
    }

    // 操作系统处理（处理版本号格式）
    const os = {
        name: result.os.name || 'Unknown',
        version: result.os.version ? result.os.version.split('.')[0] : 'Unknown'
    };

    // 浏览器处理（优先主浏览器，处理复合UA）
    const browser = {
        name: result.browser.name || 'Unknown',
        version: result.browser.version || 'Unknown'
    };

    return { deviceType, os, browser };
}
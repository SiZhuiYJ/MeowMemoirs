import { UAParser, type IResult } from 'ua-parser-js';

/**
 * 用户代理解析结果接口
 * 定义了解析用户代理字符串后返回的数据结构
 */
interface ParsedUserAgent {
    // 设备类型
    deviceType: 'Unknown' | 'console' | 'desktop' | 'embedded' | 'mobile' | 'smarttv' | 'tablet' | 'wearable' | 'xr';
    // 操作系统信息
    os: { name: string; version: string };
    // 浏览器信息
    browser: { name: string; version: string };
}

/**
 * 解析用户代理字符串
 * 
 * 该函数用于解析浏览器的User-Agent字符串，提取设备类型、操作系统和浏览器信息
 * 主要用于响应式设计和浏览器兼容性处理
 * 
 * @param uaString 用户代理字符串
 * @returns 解析后的设备信息对象
 * 
 * @example
 * const userAgent = "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)";
 * const result = parseUserAgent(userAgent);
 * console.log(result.deviceType); // "mobile"
 */
export function parseUserAgent(uaString: string): ParsedUserAgent {
    // 创建UAParser实例并解析用户代理字符串
    const parser = new UAParser(uaString);
    const result = parser.getResult() as IResult;

    // 设备类型判断（优先使用库结果，辅以关键词检测）
    let deviceType: ParsedUserAgent['deviceType'] = result.device.type || 'Unknown';
    
    // 输出调试信息
    console.log("deviceString", uaString);
    console.log("deviceType", result.device);
    
    // 如果设备类型未识别或为控制台设备，则通过关键词进一步判断
    if (!deviceType || deviceType === 'console') {
        const uaLower = uaString.toLowerCase();
        if (uaLower.includes('mobile') || uaLower.includes('android')) {
            deviceType = 'mobile';         // 移动设备
        } else if (uaLower.includes('tablet') || uaLower.includes('ipad')) {
            deviceType = 'tablet';         // 平板设备
        } else {
            deviceType = 'desktop';        // 桌面设备
        }
    }

    // 操作系统处理（处理版本号格式，只保留主版本号）
    const os = {
        name: result.os.name || 'Unknown',                           // 操作系统名称
        version: result.os.version ? result.os.version.split('.')[0] : 'Unknown'  // 主版本号
    };

    // 浏览器处理（优先主浏览器，处理复合UA）
    const browser = {
        name: result.browser.name || 'Unknown',      // 浏览器名称
        version: result.browser.version || 'Unknown' // 浏览器版本
    };

    // 返回解析结果
    return { deviceType, os, browser };
}
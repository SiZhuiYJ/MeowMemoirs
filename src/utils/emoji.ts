const hua = {
    '向日葵': '🌻',
    '玫瑰': '💐',
    '大树': '🌾',
    '枫叶': '🍁',
    '樱花': '🌸'
} as const; // 使用 `as const` 确保对象属性为字面量类型

type HuaKey = keyof typeof hua; // 定义 `hua` 对象的键类型

export function emoji(text: string) {
    return hua[text as HuaKey] || text; // 使用类型断言确保 `match` 是 `HuaKey` 类型
}
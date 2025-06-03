// 导入json
import cursorRulesList from "../dist/cursor-styles.json" assert { type: "json" };
// 或使用 require（如果是 CommonJS）
// const jsonData = require('./cursor-styles.json');
// 定义原始数据类型

// 原始数据
const cursorRules = cursorRulesList;

// 重组函数
function groupCursorRules(rules) {
  // 1. 创建映射表：cursor值 -> 选择器数组
  const cursorMap = new Map();

  // 2. 遍历所有规则
  for (const rule of rules) {
    // 标准化 cursor 值（去除多余空格）
    const normalizedCursor = rule.cursor.trim();

    // 如果该 cursor 值尚未在映射表中，初始化一个空数组
    if (!cursorMap.has(normalizedCursor)) {
      cursorMap.set(normalizedCursor, []);
    }

    // 将选择器添加到对应的 cursor 分组中
    cursorMap.get(normalizedCursor).push(rule.selector);
  }

  // 3. 转换为最终结构并按字母排序
  const result = [];

  for (const [cursor, selectors] of cursorMap) {
    // 按字母顺序排序选择器
    const sortedSelectors = selectors.sort((a, b) => a.localeCompare(b));

    result.push({
      name: cursor,
      list: sortedSelectors,
    });
  }

  // 4. 按分组大小排序（可选）
  result.sort((a, b) => b.list.length - a.list.length);

  return result;
}

// 执行重组
const groupedCursors = groupCursorRules(cursorRules);

// 打印结果
console.log(JSON.stringify(groupedCursors, null, 2));

// 如果需要保存到文件
import fs from "fs";
fs.writeFileSync(
  "plugins/grouped-cursors.json",
  JSON.stringify(groupedCursors, null, 2)
);
console.log("结果已保存到 grouped-cursors.json");

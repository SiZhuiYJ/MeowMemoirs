import { Plugin } from "vite";
import { promises as fs } from "fs";
import path from "path";
import cursorExtractor from "./postcss-cursor-extractor";

export default function cssAnalyzerPlugin(): Plugin {
  // 存储所有收集到的 cursor 规则
  const cursorRules: Array<{
    selector: string;
    cursor: string;
    file?: string;
  }> = [];

  return {
    name: "vite-plugin-css-analyzer",
    apply: "build",

    // 配置 PostCSS
    config() {
      return {
        css: {
          postcss: {
            plugins: [cursorExtractor({ store: cursorRules })],
          },
        },
      };
    },

    // 构建完成后写入文件
    async closeBundle() {
      if (cursorRules.length === 0) return;

      // 步骤1: 确定每个选择器的最终 cursor 值
      const selectorCursorMap = new Map<string, string>();
      for (const rule of cursorRules) {
        const cursor = rule.cursor?.trim();
        if (cursor) {
          selectorCursorMap.set(rule.selector, cursor);
        }
      }

      // 步骤2: 按 cursor 分组
      const cursorGroupMap = new Map<string, string[]>();
      for (const [selector, cursor] of selectorCursorMap) {
        const group = cursorGroupMap.get(cursor) || [];
        group.push(selector);
        cursorGroupMap.set(cursor, group);
      }

      // 步骤3: 处理结果并排序
      const groupedCursors: { name: string; list: string[] }[] = Array.from(
        cursorGroupMap.entries()
      )
        .map(([cursor, selectors]) => ({
          name: cursor,
          list: [...new Set(selectors)].sort(), // 去重并排序
        }))
        .sort(
          (a, b) =>
            b.list.length - a.list.length || a.name.localeCompare(b.name)
        );
      // 步骤4: 确保输出目录存在
      const outDir = "dist";
      const outputPath = path.join(outDir, "cursor-styles.json");

      try {
        await fs.mkdir(outDir, { recursive: true });
        await fs.writeFile(outputPath, JSON.stringify(groupedCursors, null, 2));
        console.log(`Cursor styles saved to: ${outputPath}`);
      } catch (error) {
        console.error("Failed to write cursor styles:", error);
      }
    },
  };
}

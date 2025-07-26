export interface blogPost {
  id: number;
  title: string; // 标题
  content: string; // 内容
  author: string; // 作者
  CreatedAt: string; // 发布时间
  updatedAt: string; // 更新时间
  coverContent: string; // 封面内容
  tags: string[]; // 标签
}
export type operation = "add" | "update";

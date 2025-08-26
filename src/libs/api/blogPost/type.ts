export interface blogPost {
  id: number; // 博客id
  title: string; // 标题
  content: string; // 内容
  authorId: number; // 作者id
  author: string; // 作者
  createdAt: string; // 发布时间
  updatedAt: string; // 更新时间
  coverContent: string; // 封面内容
  tags: string; // 标签
}
export type operation = "add" | "update";

export interface Tag {
  tagName: string;
  tagId: number;
  tagColor: string;
}
// 上传博客
export interface UploadBlog {
  title: string;
  content: string;
  tags: string;
  coverContent: string;
}
// 添加标签
export interface AddTag {
  TagColor: string;
  TagDescription: string;
  TagIcon: string;
  TagName: string;
}

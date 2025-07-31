// @/libs/api/blogPost/index.ts
import http from "@/libs/http";
import type { ResponseData } from "@/libs/http/type";
import type { blogPost, operation, Tag } from "@/libs/api/blogPost/type";

interface BlogList {
  blogs: blogPost[];
}
interface Blog {
  blog: blogPost;
}
interface BlogTags {
  tags: Tag[];
}
export const BlogPostApi = {
  // 获取文章列表
  MMPostBlogGetList() {
    return http.get<ResponseData<BlogList>>(`/Blog/GetAllBlogs`);
  },
  // 获取文章详情
  MMPostBlogPostDetail(id: number) {
    return http.get<ResponseData<Blog>>(`/Blog/GetBlogById/${id}`);
  },
  // 获取文章标签列表
  MMPostBlogGetTags() {
    return http.get<ResponseData<BlogTags>>(`/Blog/GetBlogTags`);
  },
  // 上传文章
  MMPostBlogPostUpload(blog: blogPost, operation: operation) {
    return http.post<ResponseData<Blog>>(`/Blog/UploadBlog/${operation}`, blog);
  },
};

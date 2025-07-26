// @/libs/api/blogPost/index.ts
import http from "@/libs/http";
import type { ResponseData } from "@/libs/http/type";
import type { blogPost, operation } from "@/libs/api/blogPost/type";

interface BlogList {
  blogs: blogPost[];
}

export const BlogPostApi = {
  // 获取文章列表
  MMPostBlogGetList() {
    return http.get<ResponseData<BlogList>>(`/Blog/GetAllBlogs`);
  },
  // 获取文章详情
  MMPostBlogPostDetail(id: number) {
    return http.get<ResponseData<blogPost>>(`/Blog/GetBlogById/${id}`);
  },
  // 上传文章
  MMPostBlogPostUpload(blog: blogPost, operation: operation) {
    return http.post<ResponseData<blogPost>>(
      `/Blog/UploadBlog/${operation}`,
      blog
    );
  },
};

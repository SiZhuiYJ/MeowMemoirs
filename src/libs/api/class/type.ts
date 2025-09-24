// 课程类
export interface Class {
  id: number; // 课程id
  name: string; // 课程名
  location: string; // 地点
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 周几
  week: number[]; // 周数
  number: number[]; // 节次
  teacher: string; // 教师
  color: string; // 颜色
  remark?: string; // 备注
}
export interface ClassDto {
  id: number; // 课程id
  name: string; // 课程名
  location: string; // 地点
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 周几
  week: string; // 周数
  number: string; // 节次
  teacher: string; // 教师
  color: string; // 颜色
  remark?: string; // 备注
}
// id: 4,
// date: "2025-09-08",
// type: "anniversary",
// info: "结婚纪念日",
// color: "blue",
export interface Event {
  id: number;
  date: string;
  type: "anniversary" | "countdown" | "festival" | "important" | "birthday" | "other";
  info: string;
  color: string;
}
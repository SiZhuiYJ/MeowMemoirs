// 课程时间段类型
export interface CourseTime {
    /** 时间段ID */
    id: number;
    /** 课程ID */
    courseId: number;
    /** 课程地点 */
    location: string;
    /** 教师姓名 */
    teacher: string;
    /** 周次数组，如 [1,2,3,4,5] */
    weekList: number[];
    /** 节次数组，如 [1,2] 表示第1-2节 */
    sectionList: number[];
    /** 周几，1-7 表示周一至周日 */
    dayOfWeek: number;
    /** 备注 */
    remark?: string;
    /** 创建时间 */
    createTime: string;
    /** 更新时间 */
    updateTime: string;
    /** 删除标记 */
    isDeleted: 0 | 1;
}

// 课程项类型
export interface Course {
    /** 课程表ID */
    id: number;
    /** 关联的课表ID */
    scheduleId: number;
    /** 课程名称 */
    courseName: string;
    /** 课程颜色，十六进制颜色码，如 #FF0000 */
    color: string;
    /** 备注 */
    remark?: string;
    /** 创建时间 */
    createTime: string;
    /** 更新时间 */
    updateTime: string;
    /** 删除标记 */
    isDeleted: 0 | 1;
    /** 扩展字段 */
    ext_attr1?: string;
    ext_attr2?: string;
    ext_attr3?: string;
}

// 课表类型
export interface Schedule {
    /** 课表ID */
    id: number;
    /** 用户ID */
    userId: number;
    /** 课表名称 */
    scheduleName: string;
    /** 开课时间，格式：YYYY-MM-DD */
    startTime: string;
    /** 本学期周数 */
    weekCount: number;
    /** 作息时间表，如 ["08:00-08:45", "08:55-09:40"] */
    timetable: string[];
    /** 备注 */
    remark?: string;
    /** 创建时间 */
    createTime: string;
    /** 更新时间 */
    updateTime: string;
    /** 删除标记 */
    is_deleted: 0 | 1;
    /** 扩展字段 */
    ext_attr1?: string;
    ext_attr2?: string;
    ext_attr3?: string;
}
// 课表类型
export interface ScheduleDto {
    /** 课表ID */
    id: number;
    /** 用户ID */
    userId: number;
    /** 课表名称 */
    scheduleName: string;
    /** 开课时间，格式：YYYY-MM-DD */
    startTime: string;
    /** 本学期周数 */
    weekCount: number;
    /** 作息时间表，如 ["08:00-08:45", "08:55-09:40"] */
    timetable: string;
    /** 备注 */
    remark?: string;
    /** 创建时间 */
    createTime: string;
    /** 更新时间 */
    updateTime: string;
    /** 删除标记 */
    is_deleted: 0 | 1;
    /** 扩展字段 */
    ext_attr1?: string;
    ext_attr2?: string;
    ext_attr3?: string;
}
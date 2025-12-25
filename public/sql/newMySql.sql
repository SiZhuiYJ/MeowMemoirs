USE `rainbow_database`;
-- 设置默认字符集和排序规则以充分利用 MySQL 8.0 特性
-- 设置默认字符集和排序规则
SET @OLD_CHARACTER_SET_CLIENT = @@CHARACTER_SET_CLIENT;

SET @OLD_CHARACTER_SET_RESULTS = @@CHARACTER_SET_RESULTS;

SET @OLD_COLLATION_CONNECTION = @@COLLATION_CONNECTION;

SET NAMES utf8mb4;

SET @OLD_UNIQUE_CHECKS = @@UNIQUE_CHECKS, UNIQUE_CHECKS = 0;

SET
    @OLD_FOREIGN_KEY_CHECKS = @@FOREIGN_KEY_CHECKS,
    FOREIGN_KEY_CHECKS = 0;

-- ✅ 修复：移除 NO_AUTO_CREATE_USER
SET
    @OLD_SQL_MODE = @@SQL_MODE,
    SQL_MODE = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- 用户表
CREATE TABLE IF NOT EXISTS `user` (
    `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '用户ID',
    `rainbow_id` varchar(20) NOT NULL DEFAULT 'rainbow_001' COMMENT 'RainbowID',
    `user_name` varchar(20) NOT NULL DEFAULT 'rainbow_user' COMMENT '用户名',
    `user_password` varchar(255) NOT NULL COMMENT '密码(加密存储)',
    `user_phone` char(11) DEFAULT NULL COMMENT '手机号',
    `user_email` varchar(30) NOT NULL COMMENT '邮箱',
    `user_img` varchar(100) DEFAULT 'default_avatar.jpg' COMMENT '头像',
    `permission_level` varchar(10) NOT NULL DEFAULT 'v1' COMMENT '权限等级: v1-普通用户 admin-管理员',
    `security_question` varchar(200) DEFAULT NULL COMMENT '密保问题',
    `security_answer` varchar(200) DEFAULT NULL COMMENT '密保答案',
    `is_deleted` tinyint NOT NULL DEFAULT 0 COMMENT '0-正常 1-删除',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `ext_attr1` varchar(255) DEFAULT NULL COMMENT '扩展字段1',
    `ext_attr2` varchar(255) DEFAULT NULL COMMENT '扩展字段2',
    `ext_attr3` varchar(255) DEFAULT NULL COMMENT '扩展字段3',
    PRIMARY KEY (`id`),
    UNIQUE KEY `udx_rainbow_id` (`rainbow_id`),
    UNIQUE KEY `udx_user_name` (`user_name`),
    UNIQUE KEY `udx_user_email` (`user_email`),
    INDEX `idx_permission_level` (`permission_level`),
    INDEX `idx_user_status` (
        `is_deleted`,
        `permission_level`
    ) COMMENT '复合状态索引'
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '用户表';

-- 用户资料表 - 修复：移除 SPATIAL 索引相关代码
CREATE TABLE IF NOT EXISTS `user_profile` (
    `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '用户资料ID',
    `user_id` bigint UNSIGNED NOT NULL COMMENT '用户ID',
    `birthday` date DEFAULT '2024-04-30' COMMENT '生日',
    `gender` tinyint NOT NULL DEFAULT 2 COMMENT '0-女 1-男 2-未知',
    `longitude` decimal(10, 7) DEFAULT NULL COMMENT '用户经度',
    `latitude` decimal(10, 7) DEFAULT NULL COMMENT '用户纬度',
    `address` varchar(200) DEFAULT NULL COMMENT '用户地址',
    `is_deleted` tinyint NOT NULL DEFAULT 0 COMMENT '0-正常 1-删除',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `ext_attr1` varchar(255) DEFAULT NULL COMMENT '扩展字段1',
    `ext_attr2` varchar(255) DEFAULT NULL COMMENT '扩展字段2',
    `ext_attr3` varchar(255) DEFAULT NULL COMMENT '扩展字段3',
    PRIMARY KEY (`id`),
    UNIQUE KEY `udx_user_id` (`user_id`),
    INDEX `idx_gender` (`gender`),
    INDEX `idx_profile_status` (`is_deleted`, `gender`),
    CONSTRAINT `fk_user_profile_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
    CONSTRAINT `chk_gender` CHECK (`gender` IN (0, 1, 2))
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '用户资料表';

-- 博客表 - 修复：移除有问题的 JSON 索引
CREATE TABLE IF NOT EXISTS `blogs` (
    `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '博客ID',
    `user_id` bigint UNSIGNED NOT NULL COMMENT '用户ID',
    `title` varchar(255) NOT NULL COMMENT '博客标题',
    `summary` varchar(100) DEFAULT NULL COMMENT '博客摘要内容',
    `content` text NOT NULL COMMENT '博客内容',
    `tags` json NOT NULL COMMENT '博客标签(JSON格式)',
    `view_count` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '浏览量',
    `like_count` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '点赞数',
    `is_deleted` tinyint NOT NULL DEFAULT 0 COMMENT '0-正常 1-删除',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `ext_attr1` varchar(255) DEFAULT NULL COMMENT '扩展字段1',
    `ext_attr2` varchar(255) DEFAULT NULL COMMENT '扩展字段2',
    `ext_attr3` varchar(255) DEFAULT NULL COMMENT '扩展字段3',
    PRIMARY KEY (`id`),
    INDEX `idx_user_id` (`user_id`),
    INDEX `idx_create_time` (`create_time`),
    INDEX `idx_blog_status` (`is_deleted`, `create_time`),
    FULLTEXT KEY `ft_title_content` (`title`, `content`),
    CONSTRAINT `fk_blog_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '博客表';

-- 博客标签表
CREATE TABLE IF NOT EXISTS `blog_tag` (
    `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '标签ID',
    `user_id` bigint UNSIGNED NOT NULL COMMENT '创建者ID',
    `tag_name` varchar(20) NOT NULL COMMENT '标签名称',
    `tag_color` varchar(7) NOT NULL COMMENT '标签颜色',
    `tag_icon` varchar(100) NOT NULL COMMENT '标签图标',
    `tag_description` varchar(200) NOT NULL COMMENT '标签描述',
    `tag_status` tinyint NOT NULL DEFAULT 1 COMMENT '0-禁用 1-启用',
    `is_deleted` tinyint NOT NULL DEFAULT 0 COMMENT '0-正常 1-删除',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `ext_attr1` varchar(255) DEFAULT NULL COMMENT '扩展字段1',
    `ext_attr2` varchar(255) DEFAULT NULL COMMENT '扩展字段2',
    `ext_attr3` varchar(255) DEFAULT NULL COMMENT '扩展字段3',
    PRIMARY KEY (`id`),
    INDEX `idx_user_id` (`user_id`),
    INDEX `idx_tag_status` (`tag_status`),
    INDEX `idx_tag_global_status` (`is_deleted`, `tag_status`),
    UNIQUE KEY `udx_tag_name` (`tag_name`),
    CONSTRAINT `fk_blog_tag_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '博客标签表';

-- 课程表 - 修复：移除有问题的 JSON 索引
CREATE TABLE IF NOT EXISTS `class` (
    `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '课程ID',
    `user_id` bigint UNSIGNED NOT NULL COMMENT '用户ID',
    `class_name` varchar(255) NOT NULL COMMENT '课程名',
    `location` varchar(255) NOT NULL COMMENT '地点',
    `day_of_week` tinyint UNSIGNED NOT NULL COMMENT '周几(1-7)',
    `week_list` json NOT NULL COMMENT '周数(JSON数组)',
    `session_list` json NOT NULL COMMENT '节次(JSON数组)',
    `teacher` varchar(255) NOT NULL COMMENT '教师',
    `color` varchar(7) NOT NULL DEFAULT '#1890ff' COMMENT '颜色',
    `remark` text DEFAULT NULL COMMENT '备注',
    `is_deleted` tinyint NOT NULL DEFAULT 0 COMMENT '0-正常 1-删除',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `ext_attr1` varchar(255) DEFAULT NULL COMMENT '扩展字段1',
    `ext_attr2` varchar(255) DEFAULT NULL COMMENT '扩展字段2',
    `ext_attr3` varchar(255) DEFAULT NULL COMMENT '扩展字段3',
    PRIMARY KEY (`id`),
    INDEX `idx_user_id` (`user_id`),
    INDEX `idx_day_of_week` (`day_of_week`),
    INDEX `idx_class_status` (`is_deleted`, `day_of_week`),
    CONSTRAINT `fk_class_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
    CONSTRAINT `chk_day_of_week` CHECK (`day_of_week` BETWEEN 1 AND 7)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '课程表';

-- IP访问记录表 - 修复：移除有问题的 JSON 索引
CREATE TABLE IF NOT EXISTS `ip_access_log` (
    `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '自增主键',
    `ip_id` varchar(64) GENERATED ALWAYS AS (
        sha2(
            concat(`ip_address`, `request_time`),
            256
        )
    ) STORED COMMENT 'IP和时间戳哈希值',
    `ip_address` varchar(45) NOT NULL COMMENT '客户端IP地址',
    `user_agent` text DEFAULT NULL COMMENT '客户端浏览器信息',
    `request_body` text DEFAULT NULL COMMENT '请求体内容(脱敏)',
    `request_time` datetime(3) NOT NULL COMMENT '请求时间(毫秒)',
    `request_method` varchar(10) NOT NULL COMMENT 'HTTP请求方法',
    `request_url` varchar(2048) NOT NULL COMMENT '完整请求路径',
    `http_version` varchar(20) DEFAULT NULL COMMENT 'HTTP协议版本',
    `response_status` int DEFAULT NULL COMMENT '响应状态码',
    `response_time_ms` int UNSIGNED DEFAULT NULL COMMENT '处理耗时(毫秒)',
    `referer` varchar(2048) DEFAULT NULL COMMENT '来源页面URL',
    `headers` json DEFAULT NULL COMMENT '请求头信息(JSON)',
    `geo_location` json DEFAULT NULL COMMENT 'IP地理位置(JSON)',
    `device_type` varchar(20) DEFAULT NULL COMMENT '设备类型',
    `os_name` varchar(50) DEFAULT NULL COMMENT '操作系统',
    `browser_name` varchar(50) DEFAULT NULL COMMENT '浏览器',
    `is_bot` tinyint NOT NULL DEFAULT 0 COMMENT '0-正常 1-爬虫',
    `threat_level` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '威胁等级0-5',
    `session_id` varchar(128) DEFAULT NULL COMMENT '用户会话ID',
    `user_id` varchar(64) DEFAULT NULL COMMENT '关联用户ID',
    `extra_notes` text DEFAULT NULL COMMENT '备注信息',
    `is_deleted` tinyint NOT NULL DEFAULT 0 COMMENT '0-正常 1-删除',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `ext_attr1` varchar(255) DEFAULT NULL COMMENT '扩展字段1',
    `ext_attr2` varchar(255) DEFAULT NULL COMMENT '扩展字段2',
    `ext_attr3` varchar(255) DEFAULT NULL COMMENT '扩展字段3',
    PRIMARY KEY (`id`),
    INDEX `idx_ip_address` (`ip_address`),
    INDEX `idx_request_time` (`request_time`),
    INDEX `idx_response_status` (`response_status`),
    INDEX `idx_threat_level` (`threat_level`),
    INDEX `idx_access_analysis` (
        `ip_address`,
        `request_time`,
        `response_status`
    ),
    INDEX `idx_log_status` (`is_deleted`, `threat_level`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = 'IP访问记录表';

-- 登录会话表
CREATE TABLE IF NOT EXISTS `login_session` (
    `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '会话ID',
    `user_id` bigint UNSIGNED NOT NULL COMMENT '用户ID',
    `access_token` varchar(500) NOT NULL COMMENT '访问令牌',
    `refresh_token` varchar(500) NOT NULL COMMENT '刷新令牌',
    `expire_time` datetime NOT NULL COMMENT '令牌到期时间',
    `device_info` varchar(200) DEFAULT NULL COMMENT '设备信息',
    `ip_address` varchar(50) DEFAULT NULL COMMENT '登录IP地址',
    `is_deleted` tinyint NOT NULL DEFAULT 0 COMMENT '0-正常 1-删除',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后活动时间',
    `ext_attr1` varchar(255) DEFAULT NULL COMMENT '扩展字段1',
    `ext_attr2` varchar(255) DEFAULT NULL COMMENT '扩展字段2',
    `ext_attr3` varchar(255) DEFAULT NULL COMMENT '扩展字段3',
    PRIMARY KEY (`id`),
    UNIQUE KEY `udx_refresh_token` (`refresh_token` (255)),
    INDEX `idx_user_id` (`user_id`),
    INDEX `idx_expire_time` (`expire_time`),
    INDEX `idx_access_token` (`access_token` (255)),
    INDEX `idx_session_cleanup` (`is_deleted`, `expire_time`),
    CONSTRAINT `fk_login_session_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '用户登录会话表';

-- 系统黑名单表
CREATE TABLE IF NOT EXISTS `blacklist` (
    `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '黑名单ID',
    `blacklist_type` enum('token', 'user', 'ip') NOT NULL COMMENT '类型:token/user/ip',
    `blacklist_value` varchar(255) NOT NULL COMMENT '具体值',
    `reason` varchar(200) DEFAULT NULL COMMENT '加入原因',
    `expire_time` datetime DEFAULT NULL COMMENT '过期时间',
    `admin_id` bigint UNSIGNED DEFAULT NULL COMMENT '操作管理员ID',
    `is_deleted` tinyint NOT NULL DEFAULT 0 COMMENT '0-正常 1-删除',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `ext_attr1` varchar(255) DEFAULT NULL COMMENT '扩展字段1',
    `ext_attr2` varchar(255) DEFAULT NULL COMMENT '扩展字段2',
    `ext_attr3` varchar(255) DEFAULT NULL COMMENT '扩展字段3',
    PRIMARY KEY (`id`),
    UNIQUE KEY `udx_type_value` (
        `blacklist_type`,
        `blacklist_value`
    ),
    INDEX `idx_expire_time` (`expire_time`),
    INDEX `idx_admin_id` (`admin_id`),
    INDEX `idx_blacklist_management` (
        `is_deleted`,
        `blacklist_type`,
        `expire_time`
    )
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '系统黑名单表';

CREATE TABLE `schedule` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '课表ID',
    `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
    `schedule_name` varchar(255) NOT NULL COMMENT '课程名',
    `start_time` VARCHAR(20) NOT NULL COMMENT '开课时间',
    `week_count` INT NOT NULL COMMENT '本学期周数',
    `timetable` JSON NOT NULL COMMENT '作息表',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `remark` text DEFAULT NULL COMMENT '备注',
    `is_deleted` TINYINT NOT NULL DEFAULT 0 COMMENT '0-正常 1-删除',
    `ext_attr1` VARCHAR(255) DEFAULT NULL COMMENT '扩展字段1',
    `ext_attr2` VARCHAR(255) DEFAULT NULL COMMENT '扩展字段2',
    `ext_attr3` VARCHAR(255) DEFAULT NULL COMMENT '扩展字段3',
    INDEX `idx_user_id` (`user_id`),
    INDEX `idx_create_time` (`create_time`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '课表主表';

CREATE TABLE `course` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '课程表ID',
    `schedule_id` BIGINT UNSIGNED NOT NULL COMMENT '课表ID',
    `course_name` varchar(255) NOT NULL COMMENT '课程名',
    `color` VARCHAR(7) NOT NULL COMMENT '课程颜色',
    `time_slots` JSON NOT NULL COMMENT '课程时间段',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `remark` text DEFAULT NULL COMMENT '备注',
    `is_deleted` TINYINT NOT NULL DEFAULT 0 COMMENT '0-正常 1-删除',
    `ext_attr1` VARCHAR(255) DEFAULT NULL COMMENT '扩展字段1',
    `ext_attr2` VARCHAR(255) DEFAULT NULL COMMENT '扩展字段2',
    `ext_attr3` VARCHAR(255) DEFAULT NULL COMMENT '扩展字段3',
    INDEX `idx_schedule_id` (`schedule_id`),
    INDEX `idx_create_time` (`create_time`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '课程详情表';

CREATE TABLE `course_time` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '课程时间段 ID',
    `course_id` BIGINT UNSIGNED NOT NULL COMMENT '课程表 ID',
    `location` VARCHAR(100) NOT NULL COMMENT '课程地点',
    `teacher` VARCHAR(50) NOT NULL COMMENT '教师姓名',
    `week_list` JSON NOT NULL COMMENT '周次列表，如 [1,2,3]',
    `section_list` JSON NOT NULL COMMENT '节次列表，如 [1,2,3]',
    `day_of_week` TINYINT UNSIGNED NOT NULL COMMENT '周几，1-7',
    `remark` TEXT DEFAULT NULL COMMENT '备注',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `is_deleted` TINYINT NOT NULL DEFAULT 0 COMMENT '0-正常 1-删除',
    INDEX `idx_course_id` (`course_id`),
    INDEX `idx_teacher` (`teacher`),
    INDEX `idx_location` (`location`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '课程时间段表';

-- 恢复原始设置
SET SQL_MODE = @OLD_SQL_MODE;

SET FOREIGN_KEY_CHECKS = @OLD_FOREIGN_KEY_CHECKS;

SET UNIQUE_CHECKS = @OLD_UNIQUE_CHECKS;

SET CHARACTER_SET_CLIENT = @OLD_CHARACTER_SET_CLIENT;

SET CHARACTER_SET_RESULTS = @OLD_CHARACTER_SET_RESULTS;

SET COLLATION_CONNECTION = @OLD_COLLATION_CONNECTION;

-- 初始化数据
-- 插入管理员账户
INSERT IGNORE INTO
    `user` (
        `rainbow_id`,
        `user_name`,
        `user_password`,
        `user_email`,
        `permission_level`,
        `create_time`,
        `update_time`
    )
VALUES (
        'admin_001',
        'system_admin',
        -- 密码应为加密后的值，这里使用示例值
        '$2y$10$YourEncryptedPasswordHashHere',
        'admin@rainbow.com',
        'admin',
        NOW(),
        NOW()
    );

-- 插入管理员用户资料
INSERT IGNORE INTO
    `user_profile` (
        `user_id`,
        `gender`,
        `create_time`,
        `update_time`
    )
SELECT id, 1, NOW(), NOW()
FROM `user`
WHERE
    `user_name` = 'system_admin';

-- 插入课程数据到 class 表
INSERT INTO
    `class` (
        `id`,
        `user_id`,
        `class_name`,
        `location`,
        `day_of_week`,
        `week_list`,
        `session_list`,
        `teacher`,
        `color`,
        `remark`
    )
VALUES
    -- 第1条：中国近现代史纲要
    (
        1,
        1,
        '中国近现代史纲要',
        '成都校区 E405',
        1,
        '[1, 2, 3, 4, 9, 10, 11, 12, 13, 14, 15, 16]',
        '[9, 10]',
        '王雪山',
        '#1F0000',
        '中国近现代史纲要/AB21400002/(9-9节)1-4周,9-16周/成都校区 E405/王雪山/(2025-2026-1)-AB21400002-10/48/3.0\n中国近现代史纲要/AB21400002/(10-10节)1-4周,9-16周/成都校区 E405/王雪山/(2025-2026-1)-AB21400002-10/48/3.0'
    ),
    -- 第2条：形势与政策1
    (
        2,
        1,
        '形势与政策1',
        '成都校区 E405',
        1,
        '[6, 7]',
        '[9, 10]',
        '王雪山',
        '#2F0001',
        '形势与政策1/AB21400005/(9-9节)6-7周/成都校区 E405/王雪山/(2025-2026-1)-AB21400005-08/8/0.5\n形势与政策1/AB21400005/(10-10节)6-7周/成都校区 E405/王雪山/(2025-2026-1)-AB21400005-08/8/0.5'
    ),
    -- 第3条：婴幼儿回应性照料
    (
        3,
        1,
        '婴幼儿回应性照料',
        '成都校区 C107（音乐综合实训室）',
        2,
        '[1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]',
        '[3, 4]',
        '周红',
        '#3F0002',
        '婴幼儿回应性照料/BB10403020/(3-3节)1-4周,6-17周/成都校区 C107（音乐综合实训室）/周红/(2025-2026-1)-BB10403020-13/34/2\n婴幼儿回应性照料/BB10403020/(4-4节)1-4周,6-17周/成都校区 C107（音乐综合实训室）/周红/(2025-2026-1)-BB10403020-13/34/2'
    ),
    -- 第4条：教育见习I
    (
        4,
        1,
        '教育见习I',
        '成都校区 外出',
        3,
        '[8]',
        '[1, 2, 3, 4, 5, 6, 7, 8]',
        '唐金金',
        '#4F0004',
        '教育见习I/CB21500008/(1-1节)8周/成都校区 外出/唐金金/(2025-2026-1)-CB21500008-06/17/1\n教育见习I/CB21500008/(2-2节)8周/成都校区 外出/唐金金/(2025-2026-1)-CB21500008-06/17/1\n教育见习I/CB21500008/(3-3节)8周/成都校区 外出/唐金金/(2025-2026-1)-CB21500008-06/17/1\n教育见习I/CB21500008/(4-4节)8周/成都校区 外出/唐金金/(2025-2026-1)-CB21500008-06/17/1\n教育见习I/CB21500008/(5-5节)8周/成都校区 外出/唐金金/(2025-2026-1)-CB21500008-06/17/1\n教育见习I/CB21500008/(6-6节)8周/成都校区 外出/唐金金/(2025-2026-1)-CB21500008-06/17/1\n教育见习I/CB21500008/(7-7节)8周/成都校区 外出/唐金金/(2025-2026-1)-CB21500008-06/17/1\n教育见习I/CB21500008/(8-8节)8周/成都校区 外出/唐金金/(2025-2026-1)-CB21500008-06/17/1'
    ),
    -- 第5条：教育见习I
    (
        5,
        1,
        '教育见习I',
        '成都校区 外出',
        4,
        '[8]',
        '[1, 2, 3, 4, 5, 6, 7, 8]',
        '唐金金',
        '#5F0004',
        '教育见习I/CB21500008/(1-1节)8周/成都校区 外出/唐金金/(2025-2026-1)-CB21500008-06/17/1\n教育见习I/CB21500008/(2-2节)8周/成都校区 外出/唐金金/(2025-2026-1)-CB21500008-06/17/1\n教育见习I/CB21500008/(3-3节)8周/成都校区 外出/唐金金/(2025-2026-1)-CB21500008-06/17/1\n教育见习I/CB21500008/(4-4节)8周/成都校区 外出/唐金金/(2025-2026-1)-CB21500008-06/17/1\n教育见习I/CB21500008/(5-5节)8周/成都校区 外出/唐金金/(2025-2026-1)-CB21500008-06/17/1\n教育见习I/CB21500008/(6-6节)8周/成都校区 外出/唐金金/(2025-2026-1)-CB21500008-06/17/1\n教育见习I/CB21500008/(7-7节)8周/成都校区 外出/唐金金/(2025-2026-1)-CB21500008-06/17/1\n教育见习I/CB21500008/(8-8节)8周/成都校区 外出/唐金金/(2025-2026-1)-CB21500008-06/17/1'
    ),
    -- 第6条：教育见习I
    (
        6,
        1,
        '教育见习I',
        '成都校区 外出',
        5,
        '[8]',
        '[1, 2, 3, 4, 5, 6, 7, 8]',
        '唐金金',
        '#6F0004',
        '教育见习I/CB21500008/(1-1节)8周/成都校区 外出/唐金金/(2025-2026-1)-CB21500008-06/17/1\n教育见习I/CB21500008/(2-2节)8周/成都校区 外出/唐金金/(2025-2026-1)-CB21500008-06/17/1\n教育见习I/CB21500008/(3-3节)8周/成都校区 外出/唐金金/(2025-2026-1)-CB21500008-06/17/1\n教育见习I/CB21500008/(4-4节)8周/成都校区 外出/唐金金/(2025-2026-1)-CB21500008-06/17/1\n教育见习I/CB21500008/(5-5节)8周/成都校区 外出/唐金金/(2025-2026-1)-CB21500008-06/17/1\n教育见习I/CB21500008/(6-6节)8周/成都校区 外出/唐金金/(2025-2026-1)-CB21500008-06/17/1\n教育见习I/CB21500008/(7-7节)8周/成都校区 外出/唐金金/(2025-2026-1)-CB21500008-06/17/1\n教育见习I/CB21500008/(8-8节)8周/成都校区 外出/唐金金/(2025-2026-1)-CB21500008-06/17/1'
    ),
    -- 第7条：幼儿园课程设计与实施
    (
        7,
        1,
        '幼儿园课程设计与实施',
        '成都校区 B104',
        3,
        '[1, 2, 3, 6, 9, 10, 11, 12, 13, 14, 15, 16]',
        '[3, 4]',
        '唐金金',
        '#7F0000',
        '幼儿园课程设计与实施/BB10403017/(3-3节)1-3周,6周,9-17周/成都校区 B104/唐金金/(2025-2026-1)-BB10403017-06/34/2\n幼儿园课程设计与实施/BB10403017/(4-4节)1-3周,6周,9-17周/成都校区 B104/唐金金/(2025-2026-1)-BB10403017-06/34/2'
    ),
    -- 第8条：幼儿园教育活动设计与实施
    (
        8,
        1,
        '幼儿园教育活动设计与实施',
        '成都校区 D107',
        3,
        '[1, 2, 3, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16]',
        '[5, 6]',
        '徐冬梅',
        '#8F0000',
        '幼儿园教育活动设计与实施/BB10403003/(5-5节)1-3周,6-7周,9-17周/成都校区 D107/徐冬梅/(2025-2026-1)-BB10403003-16/34/2\n幼儿园教育活动设计与实施/BB10403003/(6-6节)1-3周,6-7周,9-17周/成都校区 D107/徐冬梅/(2025-2026-1)-BB10403003-16/34/2'
    ),
    -- 第9条：形势与政策1
    (
        9,
        1,
        '形势与政策1',
        '成都校区 E405',
        3,
        '[6, 7]',
        '[9, 10]',
        '王雪山',
        '#9F0000',
        '形势与政策1/AB21400005/(9-9节)6-7周/成都校区 E405/王雪山/(2025-2026-1)-AB21400005-08/8/0.5\n形势与政策1/AB21400005/(10-10节)6-7周/成都校区 E405/王雪山/(2025-2026-1)-AB21400005-08/8/0.5'
    ),
    -- 第10条：形势与政策1
    (
        10,
        1,
        '形势与政策1',
        '成都校区 E405',
        3,
        '[1, 2, 3, 9, 10, 11, 12, 13, 14, 15, 16]',
        '[9, 10]',
        '王雪山',
        '#AF0000',
        '中国近现代史纲要/AB21400002/(9-9节)1-3周,9-16周/成都校区 E405/王雪山/(2025-2026-1)-AB21400002-10/48/3.0\n中国近现代史纲要/AB21400002/(10-10节)1-3周,9-16周/成都校区 E405/王雪山/(2025-2026-1)-AB21400002-10/48/3.0'
    ),
    -- 第11条：奥尔夫音乐教学法Ⅰ
    (
        11,
        1,
        '奥尔夫音乐教学法Ⅰ',
        '成都校区 F506（舞台排练实训室）',
        4,
        '[1, 2, 3, 5, 6, 7]',
        '[5, 6, 7, 8]',
        '张莹',
        '#BF0000',
        '奥尔夫音乐教学法Ⅰ/BB30403018/(5-5节)1-3周,5-7周/成都校区 F506（舞台排练实训室）/张莹/(2025-2026-1)-BB30403018-14/34/2.0\n奥尔夫音乐教学法Ⅰ/BB30403018/(6-6节)1-3周,5-7周/成都校区 F506（舞台排练实训室）/张莹/(2025-2026-1)-BB30403018-14/34/2.0\n奥尔夫音乐教学法Ⅰ/BB30403018/(7-7节)1-3周,5-7周/成都校区 F506（舞台排练实训室）/张莹/(2025-2026-1)-BB30403018-14/34/2.0\n奥尔夫音乐教学法Ⅰ/BB30403018/(8-8节)1-3周,5-7周/成都校区 F506（舞台排练实训室）/张莹/(2025-2026-1)-BB30403018-14/34/2.0'
    ),
    -- 第12条：教师职业道德与教育政策法规
    (
        12,
        1,
        '教师职业道德与教育政策法规',
        '成都校区 B102',
        5,
        '[1, 2, 3, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16]',
        '[5, 6]',
        '杨薛琳',
        '#CF0000',
        '教师职业道德与教育政策法规/BB10403016/(5-5节)1-3周,5-7周,9-17周/成都校区 B102/杨薛琳/(2025-2026-1)-BB10403016-06/34/2.0\n教师职业道德与教育政策法规/BB10403016/(6-6节)1-3周,5-7周,9-17周/成都校区 B102/杨薛琳/(2025-2026-1)-BB10403016-06/34/2.0'
    ),
    -- 第13条：幼儿中医推拿Ⅰ
    (
        13,
        1,
        '幼儿中医推拿Ⅰ',
        '成都校区 C107（音乐综合实训室）',
        5,
        '[1, 2, 3, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16]',
        '[7, 8]',
        '李姝涵',
        '#DF0000',
        '幼儿中医推拿Ⅰ/BB30403021/(7-7节)1-3周,5-7周,9-17周/成都校区 C107（音乐综合实训室）/李姝涵/(2025-2026-1)-BB30403021-13/34/2\n幼儿中医推拿Ⅰ/BB30403021/(8-8节)1-3周,5-7周,9-17周/成都校区 C107（音乐综合实训室）/李姝涵/(2025-2026-1)-BB30403021-13/34/2'
    ),
    -- 第14条：奥尔夫音乐教学法Ⅰ
    (
        14,
        1,
        '奥尔夫音乐教学法Ⅰ',
        '成都校区 F506（舞台排练实训室）',
        6,
        '[5]',
        '[5, 6, 7, 8]',
        '张莹',
        '#EF0000',
        '奥尔夫音乐教学法Ⅰ/BB30403018/(5-5节)5周/成都校区 F506（舞台排练实训室）/张莹/(2025-2026-1)-BB30403018-14/34/2.0\n奥尔夫音乐教学法Ⅰ/BB30403018/(6-6节)5周/成都校区 F506（舞台排练实训室）/张莹/(2025-2026-1)-BB30403018-14/34/2.0\n奥尔夫音乐教学法Ⅰ/BB30403018/(7-7节)5周/成都校区 F506（舞台排练实训室）/张莹/(2025-2026-1)-BB30403018-14/34/2.0\n奥尔夫音乐教学法Ⅰ/BB30403018/(8-8节)5周/成都校区 F506（舞台排练实训室）/张莹/(2025-2026-1)-BB30403018-14/34/2.0'
    ),
    -- 第15条：幼儿园课程设计与实施
    (
        15,
        1,
        '幼儿园课程设计与实施',
        '成都校区 B104',
        7,
        '[3]',
        '[3, 4]',
        '唐金金',
        '#FF0000',
        '幼儿园课程设计与实施/BB10403017/(3-3节)3周/成都校区 B104/唐金金/(2025-2026-1)-BB10403017-06/34/2\n幼儿园课程设计与实施/BB10403017/(4-4节)3周/成都校区 B104/唐金金/(2025-2026-1)-BB10403017-06/34/2'
    ),
    -- 第16条：幼儿园教育活动设计与实施
    (
        16,
        1,
        '幼儿园教育活动设计与实施',
        '成都校区 D107',
        7,
        '[3]',
        '[5, 6]',
        '徐冬梅',
        '#F00000',
        '幼儿园教育活动设计与实施/BB10403003/(5-5节)3周/成都校区 D107/徐冬梅/(2025-2026-1)-BB10403003-16/34/2\n幼儿园教育活动设计与实施/BB10403003/(6-6节)3周/成都校区 D107/徐冬梅/(2025-2026-1)-BB10403003-16/34/2'
    ),
    -- 第17条：中国近现代史纲要
    (
        17,
        1,
        '中国近现代史纲要',
        '成都校区 E405',
        7,
        '[3]',
        '[9, 10]',
        '王雪山',
        '#F10000',
        '中国近现代史纲要/AB21400002/(9-9节)3周/成都校区 E405/王雪山/(2025-2026-1)-AB21400002-10/48/3.0\n中国近现代史纲要/AB21400002/(10-10节)3周/成都校区 E405/王雪山/(2025-2026-1)-AB21400002-10/48/3.0'
    );
-- 验证插入结果
SELECT COUNT(*) AS '插入的课程数量' FROM `class` WHERE `user_id` = 1;

INSERT INTO
    `blogs` (
        `id`,
        `user_id`,
        `title`,
        `summary`,
        `content`,
        `create_time`,
        `update_time`,
        `tags`
    )
VALUES (
        1,
        1,
        '视频（mp4）转动图（GIF）',
        '某一天我朋友突然找我问我会不会转 gif 做手机熄屏显示。 主播我包会的呀！',
        '# 视频（mp4）转动图（gif）\n\n某一天我朋友突然找我问我会不会转 gif 做手机熄屏显示。\n主播我包会的呀！\n打开朋友发的链接发现这玩意是实况图，我说也还好我打开控制台发现微信实现实况的方案是脚本控制播放视频关键是还下载不了那个视频……\n但是主播有的是力气解决！\n<a href=\"https://mp.weixin.qq.com/s/_tX5A6JJ2g7MkLfYQcfxjg\" target=\"_blank\">微信文章链接</a>\n![image](https://www.meowmemoirs.cn/MeowMemoirs/File/DownloadFile?path=StaticFile/BlogPost/20250718/img/0-1.webp)\n![image](https://www.meowmemoirs.cn/MeowMemoirs/File/DownloadFile?path=StaticFile/BlogPost/20250718/img/0-2.webp)\n\n解决不了朋友就要让主播去做动图了\n![image](https://www.meowmemoirs.cn/MeowMemoirs/File/DownloadFile?path=StaticFile/BlogPost/20250718/img/0-3.webp)\n\n## 一、获取视频\n\n### 1.微信实况图\n\n实况图效果：\n![image](https://www.meowmemoirs.cn/MeowMemoirs/File/DownloadFile?path=StaticFile/BlogPost/20250718/img/1.webp)\n![image](https://www.meowmemoirs.cn/MeowMemoirs/File/DownloadFile?path=StaticFile/BlogPost/20250718/img/2.webp)\n\n### 2.获取视频\n\n使用 CocoCut 插件获取视频\n![image](https://www.meowmemoirs.cn/MeowMemoirs/File/DownloadFile?path=StaticFile/BlogPost/20250718/img/3.webp)\n\n但是还是有点糊待会解决这边推荐几个插件：\n![image](https://www.meowmemoirs.cn/MeowMemoirs/File/DownloadFile?path=StaticFile/BlogPost/20250718/img/4.webp)\n首先是浏览器插件：\n\n1. <a href=\"https://microsoftedge.microsoft.com/addons/detail/bilibili%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B/cagicamgdlbdmonbclkpgiabbldodgae?hl=zh-CN\" target=\"_blank\"> bilibili 哗哩哗哩下载助手；</a>\n2. <a href=\"https://microsoftedge.microsoft.com/addons/detail/%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E5%99%A8-cococut/hcppimlenafppomfhfmlfckomalgmmga?hl=zh-CN\" target=\"_blank\"> CocoCut;</a>\n   ![image](https://www.meowmemoirs.cn/MeowMemoirs/File/DownloadFile?path=StaticFile/BlogPost/20250718/img/5.webp)\n\n   其次油猴脚本：\n\n3. <a href=\"https://greasyfork.org/scripts/413228\" target=\"_blank\"> bilibili 视频下载；</a>\n4. media-source-extract；\n   ![image](https://www.meowmemoirs.cn/MeowMemoirs/File/DownloadFile?path=StaticFile/BlogPost/20250718/img/6.webp)\n\n   大多数脚本和插件主要是获取小破站的视频，还有其他的工具可以自行使用获取到视频即可~\n\n## 二、视频高清（清晰度高或不需要可以跳过）\n\n这里使用的是 BIGMP4\n链接：<a href=\"https://bigmp4.com/\" target=\"_blank\">BIGMP4</a>\n\n### 1.上传视频\n\n可以多文件上传一起转换，这里只有一个视频就不展示了\n![image](https://www.meowmemoirs.cn/MeowMemoirs/File/DownloadFile?path=StaticFile/BlogPost/20250718/img/7.webp)\n\n### 2.配置参数并开始转换\n\n因为是动漫风格所以就选“动漫/卡通”，主播不知道区别大不大或者有没有影响；不过有这个选项就直接选咯。\n![image](https://www.meowmemoirs.cn/MeowMemoirs/File/DownloadFile?path=StaticFile/BlogPost/20250718/img/8.webp)\n\n转换完成直接下载（视频越大配置越高转换需要的时间就会越长~）\n![image](https://www.meowmemoirs.cn/MeowMemoirs/File/DownloadFile?path=StaticFile/BlogPost/20250718/img/9.webp)\n\n注：从上传到下载之前不要刷新网站除非已经登录账号，不然会把记录刷新掉就只能重新转换了\n\n### 3.图片放大\n\n他家还提供图片放大的功能操作流程差不多~\n链接：<a href=\"https://bigjpg.com/\" target=\"_blank\">BIGJPG</a>\n![image](https://www.meowmemoirs.cn/MeowMemoirs/File/DownloadFile?path=StaticFile/BlogPost/20250718/img/13.webp)\n\n## 三、转 GIF\n\n主播这里用的是 EzGIF\n链接：<a href=\"https://ezgif.com/\" target=\"_blank\">EzGIF</a>\n\n### 1.视频转 GIF\n\n按上操作即可：\n因为是国外网站(主播猜的)加载速度可能不会很快，所以在加载的时候任何按钮处于加载状态都不要着急，等待加载完成~\n加载和转换时间随文件大小而变\n\n1. 选择 Video to gif\n2. 选择 Video to gif\n3. 上传视频\n   ![image](https://www.meowmemoirs.cn/MeowMemoirs/File/DownloadFile?path=StaticFile/BlogPost/20250718/img/19.webp)\n\n4. 开始转换\n   ![image](https://www.meowmemoirs.cn/MeowMemoirs/File/DownloadFile?path=StaticFile/BlogPost/20250718/img/10.webp)\n\n5. 转换完成\n   ![image](https://www.meowmemoirs.cn/MeowMemoirs/File/DownloadFile?path=StaticFile/BlogPost/20250718/img/11.webp)\n\n6. 点击 save 下载\n   ![image](https://www.meowmemoirs.cn/MeowMemoirs/File/DownloadFile?path=StaticFile/BlogPost/20250718/img/12.webp)\n\n## 四、结语\n\n### 1. 吹小牛\n\n主播也是轻松解决问题了。\n![image](https://www.meowmemoirs.cn/MeowMemoirs/File/DownloadFile?path=StaticFile/BlogPost/20250718/img/99.webp)\n\n保存不到手机是微信认为 gif 都是表情包所以保存不了，其他传文件的方式很多就不赘述啦~\n\n### 2. 结小语\n\n主播主要是提供一个视频转动图的思路，还有好多工具网站差不多都一样的。',
        '2025-07-29 07:11:38',
        '2025-10-22 15:06:36',
        '\"[10000,10001,10002]\"'
    ),
    (
        2,
        1,
        'C#进阶-在 Ubuntu 上部署 ASP.NET Core Web API 应用',
        '在服务器部署C#+mysql后端项目',
        '# C#进阶-在 Ubuntu 上部署 ASP.NET Core Web API 应用\n\n我的项目是.NET 8.0 + MySQL\n\n2025-07-22\n\n## 环境\n\n1. 安装 dotnet core， 运行 dotnet 程序必备条件(必须)\n2. 安装 supervisor 守护进程，可以帮助你自动启动站点（非必须）\n\n## 一、准备工作\n\n1. 安装.NET Core 运行时\n2. 运行以下命令来添加.NET Core 运行时存储库：\n   [来源](https://www.oryoy.com/news/zai-ubuntu-shang-qing-song-bu-shu-net-core-ying-yong-cheng-xu-yi-bu-dao-wei-de-zhi-nan-yu-shi-zhan-j.html)\n\n```bash / shell\nsudo apt update\nsudo apt install dotnet-sdk-8.0\n```\n\n![image](https://www.meowmemoirs.cn/MeowMemoirs/File/DownloadFile?path=StaticFile/BlogPost/20250722/img/3.webp)\n![image](https://www.meowmemoirs.cn/MeowMemoirs/File/DownloadFile?path=StaticFile/BlogPost/20250722/img/4.webp)\n\n3. 下载 dotnet-install 脚本用于 SDK 和运行时的自动化和非管理员安装。\n   [来源](https://learn.microsoft.com/zh-cn/dotnet/core/install/linux-scripted-manual#scripted-install)\n\n```bash / shell\ncurl -L https://dot.net/v1/dotnet-install.sh -o dotnet-install.sh\n```\n\n![image](https://www.meowmemoirs.cn/MeowMemoirs/File/DownloadFile?path=StaticFile/BlogPost/20250722/img/1.webp)\n\n4. 此脚本默认安装最新的长期支持 (LTS) SDK 版本，即 .NET 8。 若要安装最新版本（可能不是 (LTS) 版本），请使用 --version latest 参数。\n   运行以下命令来安装.NET Core 运行时：\n\n```bash / shell\n./dotnet-install.sh --version latest\n```\n\n![image](https://www.meowmemoirs.cn/MeowMemoirs/File/DownloadFile?path=StaticFile/BlogPost/20250722/img/2.webp)\n\n## 二、运行项目\n\n导出项目文件\n\n1. 导出为文件夹\n2. 更改配置\n3. 切换运行时为 linux\n\n   ![image](https://www.meowmemoirs.cn/MeowMemoirs/File/DownloadFile?path=StaticFile/BlogPost/20250722/img/6.webp)\n\n4. 导出项目\n\n确认项目能在本地正常运行后创建一个文件夹存放项目文件\n我的文件上传到了/www/wwwroot/www.meowmemoirs.cn.api/里所以cd到这个目录下\n\n```bash / shell\ncd /www/wwwroot/www.meowmemoirs.cn.api\n```\n\n然后就可以启动项目了：\n\n```bash / shell\ndotnet NET+MySQL.dll\n```\n\n效果：\n![image](https://www.meowmemoirs.cn/MeowMemoirs/File/DownloadFile?path=StaticFile/BlogPost/20250722/img/5.webp)\n这样就运行成功了\n\n## 三、部署开机启动\n\n因为每次 web.config 文件里面有配置，所以不能使用 supervisor 来启动，只能使用 systemctl\n[来源](https://blog.csdn.net/hurrican1990/article/details/144311880)\n\n1. 创建一个文件：\n   /etc/systemd/system/meowmemoirs-api.service\n   添加内容：\n\n```bash / shell\n[Unit]\nDescription=meowmemoirs-api running on Ubuntu\n# 如果有依赖和先后执行顺序要加上以下的\n# Requires=mysql.service\n# After=mysql.service\n# Before=mysql.service\n\n[Service]\n# 发布应用程序的目录\nWorkingDirectory=/www/wwwroot/www.meowmemoirs.cn.api\n# 启动应用程序的命令\nExecStart=dotnet /www/wwwroot/www.meowmemoirs.cn.api/NET+MySQL.dll\nRestart=always\n# Restart service after 10 seconds if the dotnet service crashes:\nRestartSec=10\nKillSignal=SIGINT\n# 系统日志标识符\nSyslogIdentifier=meowmemoirs-api\nUser=www-data\nEnvironment=ASPNETCORE_ENVIRONMENT=Production\nEnvironment=DOTNET_PRINT_TELEMETRY_MESSAGE=false\n\n[Install]\nWantedBy=multi-user.target\n```\n\n![image](https://www.meowmemoirs.cn/MeowMemoirs/File/DownloadFile?path=StaticFile/BlogPost/20250722/img/9.webp)\n\n2. 权限配置：\n\n```bash / shell\nchown -R www-data:www-data /www/wwwroot/www.meowmemoirs.cn.api\nchmod -R 755 /www/wwwroot/www.meowmemoirs.cn.api\n```\n\n3. 运行：\n\n```bash / shell\nsystemctl start meowmemoirs-api.service\n```\n\n4. 启动：\n   上面步骤运行服务后，如果关机，服务不会自动启动，运行以下命令才会每次开机自动运行服务\n\n```bash / shell\nsystemctl enable meowmemoirs-api.service\n```\n\n```bash / shell\n# 也可以加上这个命令，在配置好服务后立即启动\nsystemctl enable meowmemoirs-api.service  --now\n```\n\n5. 查看服务运行状态\n\n```bash / shell\nsystemctl status meowmemoirs-api.service\n# 查看实时日志\njournalctl -fu meowmemoirs-api.service\n```\n\n![image](https://www.meowmemoirs.cn/MeowMemoirs/File/DownloadFile?path=StaticFile/BlogPost/20250722/img/8.webp)\n\n6. 相关的命令\n   如果改了服务配置文件，要记得运行命令\n\n```bash / shell\n# 停止服务，要改配置时，先停止服务\nsystemctl stop meowmemoirs-api.service\n# 改好后，重新加载配置\nsystemctl daemon-reload\n# 重启服务或启动服务\nsystemctl start meowmemoirs-api.service\nsystemctl restart meowmemoirs-api.service\n```',
        '2025-07-29 07:13:08',
        '2025-10-22 15:06:36',
        '\"[10000,10003,10004]\"'
    ),
    (
        3,
        1,
        '我的web项目',
        '喵咪事件簿;MeowMemoirs',
        '# 项目介绍\n\n## 项目描述\n\n![image](https://www.meowmemoirs.cn/favicon.ico)\n\n喵咪 事件簿\nMeow Memoirs\n\n## 项目技术\n\nVue 3 + TypeScript + Vite + Vue Router + Element Plus + Axios\n\n学习制作自己的小网站“喵咪事件簿”\n\n### :sparkles: 项目结构\n\n```text\nMemory Blog/\n|-- src/\n|   |-- hooks        // 自定义 hooks\n|   |-- assets       // 静态资源\n|   |-- libs         // 接口\n|   |-- components   // 通用组件\n|   |-- config       // 配置文件\n|   |-- directives   // 自定义指令\n|   |-- routers      // 路由配置\n|   |-- stores       // 状态管理\n|   |-- views        // 页面\n|   |-- layouts      // 布局\n|   |-- styles       // 样式\n|   |-- utils        // 工具类\n|   |-- App.vue      // 根组件\n|-- package.json\n|-- README.md\n```\n\n### 技术栈\n\n- React\n- TypeScript\n- React Router\n- Element Plus\n- Sass\n- Axios\n- Vite\n- Framer motion\n\n### 使用文档\n\n```bash\ncd MeowMemoirs\nnpm install\nnpm run dev\n\n// 修改你的配置\n// .env.development //本地配置文件\n// .env.production  //服务器配置文件\n\nnpm run build  //打包\n```\n\n## 项目地址\n\n<a target=\"_blank\" href=\"https://www.meowmemoirs.cn/\">https://www.meowmemoirs.cn/</a><br/>\n<a target=\"_blank\" href=\"https://meowmemoirs.cn/\">https://meowmemoirs.cn/</a><br/>\n\n## 项目截图\n\n![image](https://github.com/LinMoQC/Memory-Blog/assets/59323207/161a71ab-6e47-4afd-a3eb-3669ee4a787a)\n',
        '2025-07-29 16:55:20',
        '2025-10-22 15:06:36',
        '\"[10005,10006]\"'
    );

INSERT INTO
    `blog_tag` (
        `id`,
        `user_id`,
        `tag_name`,
        `tag_color`,
        `tag_icon`,
        `tag_description`,
        `tag_status`,
        `create_time`
    )
VALUES (
        10000,
        1,
        'C#',
        '#263A27',
        'Platform',
        'C#相关技术项目',
        1,
        '2025-07-29 15:25:04'
    ),
    (
        10001,
        1,
        'ASP',
        '#F94E4E',
        'Platform',
        'ASP相关技术项目',
        1,
        '2025-07-29 15:29:33'
    ),
    (
        10002,
        1,
        'JS',
        '#1F1F1F',
        'Platform',
        'JS相关技术项目',
        1,
        '2025-07-29 15:29:33'
    ),
    (
        10003,
        1,
        'TS',
        '#89D185',
        'Platform',
        'TS相关技术项目',
        1,
        '2025-07-29 15:29:33'
    ),
    (
        10004,
        1,
        'vue3.5',
        '#263A27',
        'Platform',
        'vue3.5相关技术项目',
        1,
        '2025-07-29 15:29:33'
    ),
    (
        10005,
        1,
        'vite',
        '#3794FF',
        'Platform',
        'vite相关技术项目',
        1,
        '2025-07-29 15:29:33'
    ),
    (
        10006,
        1,
        'web',
        '#1B3339',
        'Platform',
        'web项目',
        1,
        '2025-07-30 00:56:41'
    ),
    (
        10007,
        1,
        '恋爱日记',
        '#409eff',
        'icon-tag',
        '记录甜蜜无间的过往~',
        1,
        '2025-08-04 03:10:53'
    );

INSERT INTO
    schedule (
        `id`,
        `user_id`,
        `schedule_name`,
        `start_time`,
        `week_count`,
        `timetable`,
        `remark`
    )
VALUES (
        1,
        1,
        '2025夏季',
        '2025-09-08',
        17,
        '["8:25-9:10", "9:15-10:00", "10:10-10:55", "11:00-11:45", "14:00-14:45", "14:50-15:35", "15:45-16:30", "16:35-17:20", "18:30-19:15", "19:20-20:05", "20:10-20:55", "21:00-21:45"]',
        '25专升本学前教育6班课表(20250905142900362)'
    )
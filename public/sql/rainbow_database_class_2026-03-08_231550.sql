-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: 8.137.127.7    Database: rainbow_database
-- ------------------------------------------------------
-- Server version	8.0.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `class`
--

DROP TABLE IF EXISTS `class`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `class` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT '课程ID',
  `user_id` bigint unsigned NOT NULL COMMENT '用户ID',
  `class_name` varchar(255) NOT NULL COMMENT '课程名',
  `location` varchar(255) NOT NULL COMMENT '地点',
  `day_of_week` tinyint unsigned NOT NULL COMMENT '周几(1-7)',
  `week_list` json NOT NULL COMMENT '周数(JSON数组)',
  `session_list` json NOT NULL COMMENT '节次(JSON数组)',
  `teacher` varchar(255) NOT NULL COMMENT '教师',
  `color` varchar(7) NOT NULL DEFAULT '#1890ff' COMMENT '颜色',
  `remark` text COMMENT '备注',
  `is_deleted` tinyint NOT NULL DEFAULT '0' COMMENT '0-正常 1-删除',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `ext_attr1` varchar(255) DEFAULT NULL COMMENT '扩展字段1',
  `ext_attr2` varchar(255) DEFAULT NULL COMMENT '扩展字段2',
  `ext_attr3` varchar(255) DEFAULT NULL COMMENT '扩展字段3',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_day_of_week` (`day_of_week`),
  KEY `idx_class_status` (`is_deleted`,`day_of_week`),
  CONSTRAINT `fk_class_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chk_day_of_week` CHECK ((`day_of_week` between 1 and 7))
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='课程表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `class`
--

/*!40000 ALTER TABLE `class` DISABLE KEYS */;
INSERT INTO `class` VALUES (1,1,'中国近现代史纲要','成都校区 E405',1,'[1, 2, 3, 4, 9, 10, 11, 12, 13, 14, 15, 16]','[9, 10]','王雪山','#1F0000','中国近现代史纲要/AB21400002/(9-9节)1-4周,9-16周/成都校区 E405/王雪山/(2025-2026-1)-AB21400002-10/48/3.0\n中国近现代史纲要/AB21400002/(10-10节)1-4周,9-16周/成都校区 E405/王雪山/(2025-2026-1)-AB21400002-10/48/3.0',0,'2025-10-24 23:12:28','2025-10-24 23:12:28',NULL,NULL,NULL)
/*!40000 ALTER TABLE `class` ENABLE KEYS */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-08 23:15:52

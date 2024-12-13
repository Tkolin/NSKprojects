/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
DROP TABLE IF EXISTS `banks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `banks` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `biks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `biks` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `BIK` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `correspondent_account` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `biks_bik_unique` (`BIK`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `chapters_technical_specification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chapters_technical_specification` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `template_text` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `contacts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contacts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `patronymic` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mobile_phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `work_phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `position_id` bigint unsigned DEFAULT NULL,
  `organization_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `birth_day` date DEFAULT NULL,
  `work_email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `contacts_position_id_foreign` (`position_id`),
  KEY `contacts_organization_id_foreign` (`organization_id`),
  CONSTRAINT `contacts_organization_id_foreign` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`id`) ON DELETE SET NULL,
  CONSTRAINT `contacts_position_id_foreign` FOREIGN KEY (`position_id`) REFERENCES `positions` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `education_persons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `education_persons` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `person_id` bigint unsigned NOT NULL,
  `education_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `education_persons_person_id_foreign` (`person_id`),
  KEY `education_persons_education_id_foreign` (`education_id`),
  CONSTRAINT `education_persons_education_id_foreign` FOREIGN KEY (`education_id`) REFERENCES `educations` (`id`),
  CONSTRAINT `education_persons_person_id_foreign` FOREIGN KEY (`person_id`) REFERENCES `persons` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `education_qualifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `education_qualifications` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `education_specializations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `education_specializations` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `educational_institutions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `educational_institutions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `educations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `educations` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `number` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `type_document_id` bigint unsigned NOT NULL,
  `institution_id` bigint unsigned NOT NULL,
  `qualification_id` bigint unsigned NOT NULL,
  `specialization_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `educations_type_document_id_foreign` (`type_document_id`),
  KEY `educations_institution_id_foreign` (`institution_id`),
  KEY `educations_qualification_id_foreign` (`qualification_id`),
  KEY `educations_specialization_id_foreign` (`specialization_id`),
  CONSTRAINT `educations_institution_id_foreign` FOREIGN KEY (`institution_id`) REFERENCES `educational_institutions` (`id`),
  CONSTRAINT `educations_qualification_id_foreign` FOREIGN KEY (`qualification_id`) REFERENCES `education_qualifications` (`id`),
  CONSTRAINT `educations_specialization_id_foreign` FOREIGN KEY (`specialization_id`) REFERENCES `education_specializations` (`id`),
  CONSTRAINT `educations_type_document_id_foreign` FOREIGN KEY (`type_document_id`) REFERENCES `type_education_documents` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `executor_order_task`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `executor_order_task` (
  `executor_order_id` bigint unsigned NOT NULL,
  `project_task_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  KEY `executor_order_task_executor_order_id_foreign` (`executor_order_id`),
  KEY `executor_order_task_project_task_id_foreign` (`project_task_id`),
  CONSTRAINT `executor_order_task_executor_order_id_foreign` FOREIGN KEY (`executor_order_id`) REFERENCES `executor_orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `executor_order_task_project_task_id_foreign` FOREIGN KEY (`project_task_id`) REFERENCES `project_tasks` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `executor_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `executor_orders` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `date_generate` date NOT NULL,
  `date_order` date NOT NULL,
  `date_attachment` date DEFAULT NULL,
  `file_id` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `executor_orders_file_id_foreign` (`file_id`),
  CONSTRAINT `executor_orders_file_id_foreign` FOREIGN KEY (`file_id`) REFERENCES `file` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `facilities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `facilities` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `type_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `facility_group_id` bigint unsigned DEFAULT NULL,
  `code` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `facilities_type_id_foreign` (`type_id`),
  KEY `facilities_facility_group_id_foreign` (`facility_group_id`),
  CONSTRAINT `facilities_facility_group_id_foreign` FOREIGN KEY (`facility_group_id`) REFERENCES `facility_groups` (`id`) ON DELETE SET NULL,
  CONSTRAINT `facilities_type_id_foreign` FOREIGN KEY (`type_id`) REFERENCES `type_facilities` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `fenrirs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fenrirs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `models` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `file`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `file` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `size` int NOT NULL,
  `mime_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `formula_variables`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `formula_variables` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `formula_id` bigint unsigned NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `name_key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `unit_id` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `formula_variables_formula_id_foreign` (`formula_id`),
  KEY `formula_variables_unit_id_foreign` (`unit_id`),
  CONSTRAINT `formula_variables_formula_id_foreign` FOREIGN KEY (`formula_id`) REFERENCES `formulas` (`id`),
  CONSTRAINT `formula_variables_unit_id_foreign` FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `formulas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `formulas` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `original_formula` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rpn_formula` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name_key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `latex_formula` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `facility_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `facility_groups` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `facility_subselection_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `code` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `facility_groups_facility_subselection_id_foreign` (`facility_subselection_id`),
  CONSTRAINT `facility_groups_facility_subselection_id_foreign` FOREIGN KEY (`facility_subselection_id`) REFERENCES `facility_subselections` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `group_type_project_documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `group_type_project_documents` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `technical_specification_id` bigint unsigned DEFAULT NULL,
  `code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `group_type_project_documents_technical_specification_id_foreign` (`technical_specification_id`),
  CONSTRAINT `group_type_project_documents_technical_specification_id_foreign` FOREIGN KEY (`technical_specification_id`) REFERENCES `type_technical_specifications` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `initial_authorization_documentations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `initial_authorization_documentations` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `legal_forms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `legal_forms` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `machinery_excavators`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `machinery_excavators` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `manufacturer_id` bigint unsigned NOT NULL,
  `model` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `bucket_capacity` double(8,2) DEFAULT NULL,
  `digging_depth_max` double(8,2) DEFAULT NULL,
  `digging_height_max` double(8,2) DEFAULT NULL,
  `unloading_height_max` double(8,2) DEFAULT NULL,
  `digging_radius_stationary_max` double(8,2) DEFAULT NULL,
  `digging_radius_max` double(8,2) DEFAULT NULL,
  `unloading_radius_max` double(8,2) DEFAULT NULL,
  `cycle_duration` double(8,2) DEFAULT NULL,
  `excavator_width` double(8,2) DEFAULT NULL,
  `excavator_weight` double(8,2) DEFAULT NULL,
  `engine_power` double(8,2) DEFAULT NULL,
  `bucket_type_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `machinery_excavators_manufacturer_id_foreign` (`manufacturer_id`),
  KEY `machinery_excavators_bucket_type_id_foreign` (`bucket_type_id`),
  CONSTRAINT `machinery_excavators_bucket_type_id_foreign` FOREIGN KEY (`bucket_type_id`) REFERENCES `machinery_excavators_bucket_type` (`id`),
  CONSTRAINT `machinery_excavators_manufacturer_id_foreign` FOREIGN KEY (`manufacturer_id`) REFERENCES `machinery_manufacturer` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `machinery_excavators_bucket_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `machinery_excavators_bucket_type` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `machinery_manufacturer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `machinery_manufacturer` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `oauth_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oauth_access_tokens` (
  `id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `client_id` bigint unsigned NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `scopes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `revoked` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `expires_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `oauth_access_tokens_user_id_index` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `oauth_auth_codes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oauth_auth_codes` (
  `id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `client_id` bigint unsigned NOT NULL,
  `scopes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `revoked` tinyint(1) NOT NULL,
  `expires_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `oauth_auth_codes_user_id_index` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `oauth_clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oauth_clients` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `secret` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `provider` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `redirect` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `personal_access_client` tinyint(1) NOT NULL,
  `password_client` tinyint(1) NOT NULL,
  `revoked` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `oauth_clients_user_id_index` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `oauth_personal_access_clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oauth_personal_access_clients` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `client_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `oauth_refresh_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oauth_refresh_tokens` (
  `id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `access_token_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `revoked` tinyint(1) NOT NULL,
  `expires_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `oauth_refresh_tokens_access_token_id_index` (`access_token_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `organizations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `organizations` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `legal_form_id` bigint unsigned DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `office_number_legal` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `office_number_mail` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone_number` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fax_number` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `INN` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `OGRN` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `OKPO` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `KPP` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `BIK_id` bigint unsigned DEFAULT NULL,
  `payment_account` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `director_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `address_legal` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `address_mail` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `organizations_legal_form_id_foreign` (`legal_form_id`),
  KEY `organizations_bik_id_foreign` (`BIK_id`),
  KEY `organizations_director_id_foreign` (`director_id`),
  CONSTRAINT `organizations_bik_id_foreign` FOREIGN KEY (`BIK_id`) REFERENCES `biks` (`id`) ON DELETE SET NULL,
  CONSTRAINT `organizations_director_id_foreign` FOREIGN KEY (`director_id`) REFERENCES `contacts` (`id`) ON DELETE SET NULL,
  CONSTRAINT `organizations_legal_form_id_foreign` FOREIGN KEY (`legal_form_id`) REFERENCES `legal_forms` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `passport_place_issues`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `passport_place_issues` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `passports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `passports` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `firstname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lastname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `patronymic` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `serial` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `number` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `passport_place_issue_id` bigint unsigned DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `address_registration` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address_residential` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `passports_passport_place_issue_id_foreign` (`passport_place_issue_id`),
  CONSTRAINT `passports_passport_place_issue_id_foreign` FOREIGN KEY (`passport_place_issue_id`) REFERENCES `passport_place_issues` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `password_resets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_resets` (
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  KEY `password_resets_email_index` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `permission_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permission_role` (
  `role_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `permission_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  KEY `permission_role_role_id_foreign` (`role_id`),
  KEY `permission_role_permission_id_foreign` (`permission_id`),
  CONSTRAINT `permission_role_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`name_key`) ON DELETE CASCADE,
  CONSTRAINT `permission_role_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`name_key`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissions` (
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name_key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`name_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `persons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `persons` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `passport_id` bigint unsigned DEFAULT NULL,
  `SHILS` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `INN` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_account` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone_number` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email_sibnipi` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bank_id` bigint unsigned DEFAULT NULL,
  `bik_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `persons_passport_id_foreign` (`passport_id`),
  KEY `persons_bank_id_foreign` (`bank_id`),
  KEY `persons_bik_id_foreign` (`bik_id`),
  KEY `persons_user_id_foreign` (`user_id`),
  CONSTRAINT `persons_bank_id_foreign` FOREIGN KEY (`bank_id`) REFERENCES `banks` (`id`) ON DELETE SET NULL,
  CONSTRAINT `persons_bik_id_foreign` FOREIGN KEY (`bik_id`) REFERENCES `biks` (`id`) ON DELETE SET NULL,
  CONSTRAINT `persons_passport_id_foreign` FOREIGN KEY (`passport_id`) REFERENCES `passports` (`id`) ON DELETE SET NULL,
  CONSTRAINT `persons_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `positions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `positions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `okpd_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `okz_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `project_chapters_technical_specification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_chapters_technical_specification` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `project_id` bigint unsigned NOT NULL,
  `chapters_id` bigint unsigned NOT NULL,
  `number` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `project_chapters_technical_specification_project_id_foreign` (`project_id`),
  KEY `project_chapters_technical_specification_chapters_id_foreign` (`chapters_id`),
  CONSTRAINT `project_chapters_technical_specification_chapters_id_foreign` FOREIGN KEY (`chapters_id`) REFERENCES `chapters_technical_specification` (`id`),
  CONSTRAINT `project_chapters_technical_specification_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `project_delegations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_delegations` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `project_id` bigint unsigned NOT NULL,
  `delegation_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `project_delegations_project_id_foreign` (`project_id`),
  KEY `project_delegations_delegation_id_foreign` (`delegation_id`),
  CONSTRAINT `project_delegations_delegation_id_foreign` FOREIGN KEY (`delegation_id`) REFERENCES `contacts` (`id`),
  CONSTRAINT `project_delegations_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `project_facilities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_facilities` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `project_id` bigint unsigned NOT NULL,
  `facility_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `project_facilities_project_id_foreign` (`project_id`),
  KEY `project_facilities_facility_id_foreign` (`facility_id`),
  CONSTRAINT `project_facilities_facility_id_foreign` FOREIGN KEY (`facility_id`) REFERENCES `facilities` (`id`),
  CONSTRAINT `project_facilities_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `project_fenrirs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_fenrirs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `fenrir_id` bigint unsigned NOT NULL,
  `project_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `project_fenrirs_fenrir_id_foreign` (`fenrir_id`),
  KEY `project_fenrirs_project_id_foreign` (`project_id`),
  CONSTRAINT `project_fenrirs_fenrir_id_foreign` FOREIGN KEY (`fenrir_id`) REFERENCES `fenrirs` (`id`),
  CONSTRAINT `project_fenrirs_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `project_irds`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_irds` (
  `project_id` bigint unsigned NOT NULL,
  `ird_id` bigint unsigned NOT NULL,
  `receivedDate` date DEFAULT NULL,
  `applicationProject` int DEFAULT NULL,
  `stageNumber` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`),
  KEY `project_irds_project_id_foreign` (`project_id`),
  KEY `project_irds_ird_id_foreign` (`ird_id`),
  CONSTRAINT `project_irds_ird_id_foreign` FOREIGN KEY (`ird_id`) REFERENCES `initial_authorization_documentations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `project_irds_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `project_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_messages` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `number_message` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `sender` tinyint(1) NOT NULL,
  `project_id` bigint unsigned NOT NULL,
  `file_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_send` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `project_messages_project_id_foreign` (`project_id`),
  CONSTRAINT `project_messages_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `project_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_payments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `date_time_payment` datetime NOT NULL,
  `project_id` bigint unsigned NOT NULL,
  `type_payment_id` bigint unsigned NOT NULL,
  `price` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `project_payments_project_id_foreign` (`project_id`),
  KEY `project_payments_type_payment_id_foreign` (`type_payment_id`),
  CONSTRAINT `project_payments_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`),
  CONSTRAINT `project_payments_type_payment_id_foreign` FOREIGN KEY (`type_payment_id`) REFERENCES `type_payment` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `project_sections_reference`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_sections_reference` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `section_reference_id` bigint unsigned DEFAULT NULL,
  `values` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `project_id` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `project_sections_reference_section_reference_id_foreign` (`section_reference_id`),
  KEY `project_sections_reference_project_id_foreign` (`project_id`),
  CONSTRAINT `project_sections_reference_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE SET NULL,
  CONSTRAINT `project_sections_reference_section_reference_id_foreign` FOREIGN KEY (`section_reference_id`) REFERENCES `sections_reference` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `project_stages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_stages` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `project_id` bigint unsigned NOT NULL,
  `stage_id` bigint unsigned NOT NULL,
  `date_start` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `date_end` date DEFAULT NULL,
  `price` decimal(12,2) DEFAULT NULL,
  `price_to_paid` decimal(12,2) DEFAULT NULL,
  `paid_sum` decimal(12,2) DEFAULT NULL,
  `payment_deadline` date DEFAULT NULL,
  `percent` int DEFAULT NULL,
  `number` int DEFAULT NULL,
  `duration` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `project_stages_project_id_foreign` (`project_id`),
  KEY `project_stages_stage_id_foreign` (`stage_id`),
  CONSTRAINT `project_stages_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `project_stages_stage_id_foreign` FOREIGN KEY (`stage_id`) REFERENCES `stages` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `project_statuses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_statuses` (
  `name_key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`name_key`),
  UNIQUE KEY `project_statuses_name_key_unique` (`name_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `project_tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_tasks` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `task_id` bigint unsigned DEFAULT NULL,
  `project_id` bigint unsigned NOT NULL,
  `stage_number` int DEFAULT NULL,
  `price` decimal(11,2) DEFAULT NULL,
  `date_start` date DEFAULT NULL,
  `date_end` date DEFAULT NULL,
  `duration` int DEFAULT NULL,
  `executor_id` bigint unsigned DEFAULT NULL,
  `project_task_inherited_id` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `project_tasks_task_id_foreign` (`task_id`),
  KEY `project_tasks_project_id_foreign` (`project_id`),
  KEY `project_tasks_executor_id_foreign` (`executor_id`),
  KEY `project_tasks_project_task_inherited_id_foreign` (`project_task_inherited_id`),
  CONSTRAINT `project_tasks_executor_id_foreign` FOREIGN KEY (`executor_id`) REFERENCES `persons` (`id`),
  CONSTRAINT `project_tasks_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`),
  CONSTRAINT `project_tasks_project_task_inherited_id_foreign` FOREIGN KEY (`project_task_inherited_id`) REFERENCES `project_tasks` (`id`),
  CONSTRAINT `project_tasks_task_id_foreign` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projects` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `number` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `organization_customer_id` bigint unsigned DEFAULT NULL,
  `type_project_document_id` bigint unsigned DEFAULT NULL,
  `date_signing` date DEFAULT NULL,
  `duration` int DEFAULT NULL,
  `date_end` date DEFAULT NULL,
  `date_completion` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `price` int DEFAULT NULL,
  `date_create` date DEFAULT NULL,
  `prepayment` int NOT NULL,
  `status_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `path_project_folder` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'other/',
  PRIMARY KEY (`id`),
  KEY `projects_organization_customer_id_foreign` (`organization_customer_id`),
  KEY `projects_type_project_document_id_foreign` (`type_project_document_id`),
  KEY `fk_projects_project_statuses` (`status_id`),
  CONSTRAINT `fk_projects_project_statuses` FOREIGN KEY (`status_id`) REFERENCES `project_statuses` (`name_key`),
  CONSTRAINT `projects_organization_customer_id_foreign` FOREIGN KEY (`organization_customer_id`) REFERENCES `organizations` (`id`) ON DELETE SET NULL,
  CONSTRAINT `projects_type_project_document_id_foreign` FOREIGN KEY (`type_project_document_id`) REFERENCES `type_project_documents` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `references`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `references` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reference_values` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `role_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_user` (
  `user_id` bigint unsigned NOT NULL,
  `role_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  KEY `role_user_user_id_foreign` (`user_id`),
  KEY `role_user_role_id_foreign` (`role_id`),
  CONSTRAINT `role_user_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`name_key`) ON DELETE CASCADE,
  CONSTRAINT `role_user_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name_key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`name_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `sections_reference`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sections_reference` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `values` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `facility_selections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `facility_selections` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `code` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `stages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stages` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `task_id` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `stages_task_id_foreign` (`task_id`),
  CONSTRAINT `stages_task_id_foreign` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `facility_subselections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `facility_subselections` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `facility_selection_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `code` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `facility_subselections_facility_selection_id_foreign` (`facility_selection_id`),
  CONSTRAINT `facility_subselections_facility_selection_id_foreign` FOREIGN KEY (`facility_selection_id`) REFERENCES `facility_selections` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tasks` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `technical_specifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `technical_specifications` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `type_education_documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `type_education_documents` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `type_facilities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `type_facilities` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `type_payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `type_payment` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `type_project_documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `type_project_documents` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `group_id` bigint unsigned DEFAULT NULL,
  `template_project_id` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `type_project_documents_group_id_foreign` (`group_id`),
  KEY `type_project_documents_template_project_id_foreign` (`template_project_id`),
  CONSTRAINT `type_project_documents_group_id_foreign` FOREIGN KEY (`group_id`) REFERENCES `group_type_project_documents` (`id`) ON DELETE SET NULL,
  CONSTRAINT `type_project_documents_template_project_id_foreign` FOREIGN KEY (`template_project_id`) REFERENCES `projects` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `type_technical_specifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `type_technical_specifications` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `units`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `units` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name_latex` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (1,'2014_10_12_100000_create_password_reset_tokens_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (2,'2014_10_12_100000_create_password_resets_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (3,'2016_06_01_000001_create_oauth_auth_codes_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (4,'2016_06_01_000002_create_oauth_access_tokens_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (5,'2016_06_01_000003_create_oauth_refresh_tokens_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (6,'2016_06_01_000004_create_oauth_clients_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (7,'2016_06_01_000005_create_oauth_personal_access_clients_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (8,'2019_08_19_000000_create_failed_jobs_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (9,'2019_12_14_000001_create_personal_access_tokens_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (10,'2024_02_05_194140_create_positions_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (11,'2024_02_05_194159_create_contacts_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (12,'2024_02_06_133202_create_roles_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (13,'2024_02_06_133815_create_user_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (14,'2024_02_08_074952_create_banks_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (15,'2024_02_08_075047_create_biks_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (16,'2024_02_08_075126_create_addresses_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (17,'2024_02_08_075214_create_educational_institutions_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (18,'2024_02_08_075227_create_education_qualifications_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (19,'2024_02_08_075347_create_education_specializations_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (20,'2024_02_08_075436_create_type_education_documents_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (21,'2024_02_08_075521_create_type_facilities_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (22,'2024_02_08_075606_create_facilities_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (23,'2024_02_08_075709_create_initial_authorization_documentations_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (24,'2024_02_08_075735_create_legal_forms_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (25,'2024_02_08_075807_create_notes_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (26,'2024_02_08_075921_create_passport_place_issues_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (27,'2024_02_08_075925_create_passports_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (28,'2024_02_08_080000_create_person_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (29,'2024_02_08_080045_create_organizations_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (30,'2024_02_08_080156_create_project_statuses_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (31,'2024_02_08_080214_create_type_project_documents_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (32,'2024_02_08_080256_create_projects_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (33,'2024_02_08_080521_create_stages_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (34,'2024_02_08_080553_create_project_stages_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (35,'2024_02_08_084012_create_educations_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (36,'2024_02_08_084013_create_education_people_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (37,'2024_02_08_163809_update_organizations_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (38,'2024_02_09_101939_update_projects_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (39,'2024_02_09_102718_update_projects_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (40,'2024_02_09_121005_update_contacts_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (41,'2024_02_14_073426_upgrade_contacts_list',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (42,'2024_02_14_081227_upgrade_contacts_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (43,'2024_02_14_113310_upgrade_project_stage__table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (44,'2024_02_14_114221_create_chapters_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (45,'2024_02_14_114222_create_tasks_of_stage_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (46,'2024_02_14_115759_upgrade_projects_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (47,'2024_02_14_115937_create_iads_project_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (48,'2024_02_14_174229_upgrade_address_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (49,'2024_02_14_175707_drop_addresses_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (50,'2024_02_14_181841_update_organizations_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (51,'2024_02_15_140832_update_person_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (52,'2024_02_16_044909_update_passport_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (53,'2024_02_16_045203_update_person_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (54,'2024_02_16_050549_update_projects_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (55,'2024_02_16_092907_update_biks_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (56,'2024_02_16_153850_update_ird_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (57,'2024_02_16_153909_create_irds_projects_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (58,'2024_02_16_153956_create_template_irds_projects_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (59,'2024_02_19_080523_create_contents_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (60,'2024_02_19_084308_create_template_stages_type_project_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (61,'2024_02_19_084609_create_template_content_type_project_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (62,'2024_02_19_093114_create_project_contents_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (63,'2024_02_20_041702_update_tempalte_sgates_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (64,'2024_02_20_041956_update_temolate_irds_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (65,'2024_02_21_023323_update_tempalte_sgates_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (66,'2024_02_21_023325_update_tempalte_stage_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (67,'2024_02_21_025003_update_tempalte_ird_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (68,'2024_02_22_082944_drop_and_create_tempalte_sgates_table',2);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (69,'2024_02_26_070639_update_temolate_stages_table',3);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (70,'2024_02_26_082136_drop_content_tabels',4);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (71,'2024_02_26_082355_drop_task_tabels',4);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (72,'2024_02_26_082521_create_tasks_tables',4);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (73,'2024_02_28_084831_create_type_payments_tables',5);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (74,'2024_02_28_084849_create_projects_payments_tables',5);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (75,'2024_02_28_121206_update_projects_tables',5);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (76,'2024_03_01_034331_create_project_facilities_table',6);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (77,'2024_03_01_035907_update_projects_table',6);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (78,'2024_03_01_082301_update_template_stages_type_project_table',6);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (79,'2024_03_05_065503_create_project_delegetes_table',6);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (80,'2024_03_05_065514_update_projec_table',6);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (81,'2024_03_05_074115_update_projec_table',6);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (82,'2024_03_07_042754_update_stage_to_projects_table',6);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (83,'2024_03_07_043309_update_stage_to_projects_table',6);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (84,'2024_03_07_052718_update_ird_to_projects_table',6);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (85,'2024_03_07_070320_update_ird_to_projects_table',6);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (86,'2024_03_11_033143_update_tasks_to_projects_table',6);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (87,'2024_03_11_033201_create_project_tasks_executor_table',6);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (88,'2024_03_12_171448_create_type_files_table',7);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (89,'2024_03_12_171449_create_file_template_table',7);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (90,'2024_03_12_171717_drop_any_table',7);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (91,'2024_03_13_043354_update_passport_table',7);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (92,'2024_03_14_110854_update_project_table',8);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (93,'2024_03_18_025645_create_group_project_documents_table',8);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (94,'2024_03_18_032129_create_technical_specification_table',8);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (95,'2024_03_19_045129_create_facility_selection_tables',9);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (96,'2024_03_19_053131_update_facility_selection_tables',9);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (97,'2024_03_27_091740_create__sections_terms_reference_table',10);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (98,'2024_03_28_040207_update__sections_terms_reference_table',11);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (99,'2024_04_02_100016_update_project_tasks_table',12);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (100,'2024_04_03_091702_project__tasks__ingeriteds',13);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (101,'2024_04_03_092234_update__project__tasks_table',14);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (102,'2024_04_16_065810_update_projects_table',15);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (103,'2024_04_20_073458_create_type_technical_specifications_table',16);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (104,'2024_04_20_073515_create_chapters_technical_specifications_table',16);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (105,'2024_04_20_073540_create_project_chapters_technical_specifications_table',16);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (106,'2024_04_20_075323_create_machinery_manufacturer_table',16);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (107,'2024_04_20_075831_create_formulas_table',16);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (108,'2024_04_20_075901_create_formula_variables_table',16);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (110,'2024_04_20_080431_update_group_type_project_documents_table',17);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (111,'2024_04_22_062323_update_formula_variables_table',18);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (112,'2024_04_22_074704_update_formula_table',19);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (113,'2024_04_24_034122_update_formula_table',20);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (114,'2024_04_24_074558_update_formula_variables_table',21);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (115,'2024_04_24_102649_create_machinery_excavators_table',22);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (120,'2024_05_03_103541_create_reference_table',23);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (121,'2024_05_07_080652_create_template_fenrirs_table',24);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (122,'2024_05_07_080828_create_fenrirs_table',24);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (123,'2024_05_07_081221_create_template_fenrirs__type__project_table',24);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (124,'2024_05_07_081239_create_fenrirs__project_table',24);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (125,'2024_06_05_062537_update_group_type_project',25);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (126,'2024_06_11_060456_update__type_project_document_table',26);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (127,'2024_06_14_074157_update__stage_table',27);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (128,'2024_06_17_042330_update_project_task_executor_table',28);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (129,'2024_06_17_045119_update_project_task_executor_table',29);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (130,'2024_06_17_070758_update_project_task_table',30);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (131,'2024_06_20_023926_clear_template_table_and_references',31);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (132,'2024_06_24_072456_update_project_tsks_table',32);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (133,'2024_06_25_045416_update_project_tasks_table',33);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (134,'2024_06_27_021711_update_project_statuses_table',34);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (150,'2024_06_28_021703_update_projects_table',35);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (152,'2024_06_28_090601_create_mail_message_table',36);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (153,'2024_06_28_101455_update_project_statuses_table',37);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (154,'2024_07_02_102858_update_ird_table',38);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (155,'2024_07_04_062928_update_persons_table',39);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (162,'2024_07_04_063834_update_users_table',40);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (163,'2024_07_04_065526_create_permissions_table',41);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (164,'2024_07_10_110031_create_file_table',42);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (171,'2024_07_10_110053_create_executor_orders_table',43);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (172,'2024_07_10_110401_create_executor_orders_task_table',43);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (173,'2024_07_11_041730_change_task_to_simple_schema',43);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (174,'2024_07_14_170525_update_project_table',44);

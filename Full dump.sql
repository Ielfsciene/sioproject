CREATE DATABASE  IF NOT EXISTS `projectsio` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `projectsio`;
-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: projectsio
-- ------------------------------------------------------
-- Server version	8.0.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `centers`
--

DROP TABLE IF EXISTS `centers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `centers` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `street` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `zip` int unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `centers`
--

LOCK TABLES `centers` WRITE;
/*!40000 ALTER TABLE `centers` DISABLE KEYS */;
INSERT INTO `centers` VALUES (1,'Centre Hospitalier Universitaire de Bordeaux','12 Rue Dubernat','Talence','Nouvelle-Aquitaine',33400),(2,'Hôpital Européen Georges-Pompidou','20 Rue Leblanc','Paris','Île-de-France',75015),(3,'Clinique du Parc','155 Boulevard Stalingrad','Lyon','Auvergne-Rhône-Alpes',69006),(4,'Hôpital de la Timone','264 Rue Saint Pierre','Marseille','Provence-Alpes-Côte d\'Azur',13005),(5,'Centre Hospitalier Régional Universitaire de Lille','2 Avenue Oscar Lambret','Lille','Hauts-de-France',59000),(6,'Clinique Saint-Jean','36 Avenue Bouisson Bertrand','Montpellier','Occitanie',34090);
/*!40000 ALTER TABLE `centers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departments` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `center_id` int unsigned NOT NULL,
  `is_doctor` tinyint NOT NULL,
  `created_datetime` datetime DEFAULT CURRENT_TIMESTAMP,
  `modified_datetime` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_center3_idx` (`center_id`),
  CONSTRAINT `fk_center3` FOREIGN KEY (`center_id`) REFERENCES `centers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
INSERT INTO `departments` VALUES (1,'Cardiologie',1,1,'2024-04-19 12:39:12','2024-04-19 15:03:10'),(2,'Radiologie',1,1,'2024-04-19 12:39:12','2024-04-19 15:03:10'),(3,'Ressources Humaines',1,0,'2024-04-19 12:39:12','2024-04-19 15:03:10'),(4,'Neurologie',1,1,'2024-04-19 12:39:12','2024-04-19 15:03:10'),(5,'Maintenance',1,0,'2024-04-19 12:39:12','2024-04-19 12:39:12'),(6,'Urgences',2,1,'2024-04-19 12:39:12','2024-04-19 15:03:10'),(7,'Oncologie',2,1,'2024-04-19 12:39:12','2024-04-19 15:03:10'),(8,'Relations Publiques',2,0,'2024-04-19 12:39:12','2024-04-19 15:03:10'),(9,'Dermatologie',2,1,'2024-04-19 12:39:12','2024-04-19 15:03:10'),(10,'Services d\'Entretien',2,0,'2024-04-19 12:39:12','2024-04-19 15:03:10'),(11,'Orthopédie',3,1,'2024-04-19 12:39:12','2024-04-19 15:03:10'),(12,'Maternité',3,1,'2024-04-19 12:39:12','2024-04-19 15:03:10'),(13,'Finance',3,0,'2024-04-19 12:39:12','2024-04-19 12:39:12'),(14,'Gastroentérologie',3,1,'2024-04-19 12:39:12','2024-04-19 15:03:10'),(15,'DSI',3,0,'2024-04-19 12:39:12','2024-04-19 15:03:10'),(16,'Pédiatrie',4,1,'2024-04-19 12:39:12','2024-04-19 15:03:10'),(17,'Endocrinologie',4,1,'2024-04-19 12:39:12','2024-04-19 15:03:10'),(18,'Services Légaux',4,0,'2024-04-19 12:39:12','2024-04-19 15:03:10'),(19,'Psychiatrie',4,1,'2024-04-19 12:39:12','2024-04-19 15:03:10'),(20,'Moyens Généraux',4,0,'2024-04-19 12:39:12','2024-04-19 15:03:10'),(21,'Néphrologie',5,1,'2024-04-19 12:39:12','2024-04-19 15:03:10'),(22,'Chirurgie',5,1,'2024-04-19 12:39:12','2024-04-19 15:03:10'),(23,'Ressources Humaines',5,0,'2024-04-19 12:39:12','2024-04-19 15:03:10'),(24,'Ophthalmologie',5,1,'2024-04-19 12:39:12','2024-04-19 15:03:10'),(25,'Sécurité',5,0,'2024-04-19 12:39:12','2024-04-19 15:03:10'),(26,'Médecine Générale',6,1,'2024-04-19 12:39:12','2024-04-19 15:03:10'),(27,'Rhumatologie',6,1,'2024-04-19 12:39:12','2024-04-19 15:03:10'),(28,'Communications',6,0,'2024-04-19 12:39:12','2024-04-19 12:39:12'),(29,'Urologie',6,1,'2024-04-19 12:39:12','2024-04-19 15:03:10'),(30,'Restauration',6,0,'2024-04-19 12:39:12','2024-04-19 15:03:10');
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `documents`
--

DROP TABLE IF EXISTS `documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `documents` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `patient_id` int unsigned NOT NULL,
  `author_id` int unsigned NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `category` enum('prescription','lab_results','xrays','invoices','other') DEFAULT 'other',
  `created_datetime` datetime DEFAULT CURRENT_TIMESTAMP,
  `modified_datetime` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_patient_idx` (`patient_id`),
  KEY `fk_author_idx` (`author_id`),
  CONSTRAINT `fk_document_author` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_document_owner` FOREIGN KEY (`patient_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `documents`
--

LOCK TABLES `documents` WRITE;
/*!40000 ALTER TABLE `documents` DISABLE KEYS */;
INSERT INTO `documents` VALUES (1,9,19,'/files/prescriptions/001.pdf','Prescription for Alice Smith','prescription','2024-04-19 17:26:37','2024-04-19 17:26:37'),(2,12,20,'/files/lab_results/002.pdf','Lab Results for Diana Brown','lab_results','2024-04-19 17:26:37','2024-04-19 17:26:37'),(3,13,22,'/files/xrays/003.pdf','X-ray Report for Eric Davis','xrays','2024-04-19 17:26:37','2024-04-19 17:26:37'),(4,15,24,'/files/invoices/004.pdf','Invoice for George Wilson','invoices','2024-04-19 17:26:37','2024-04-19 17:26:37'),(5,9,25,'/files/prescriptions/005.pdf','Follow-up Prescription for Alice Smith','prescription','2024-04-19 17:26:37','2024-04-19 17:26:37'),(6,15,27,'/files/lab_results/006.pdf','Lab Results for George Wilson','lab_results','2024-04-19 17:26:37','2024-04-19 17:26:37'),(7,12,30,'/files/xrays/007.pdf','X-ray Report for Diana Brown','xrays','2024-04-19 17:26:37','2024-04-19 17:26:37'),(8,13,34,'/files/invoices/008.pdf','Medical Invoice for Eric Davis','invoices','2024-04-19 17:26:37','2024-04-19 17:26:37'),(9,9,35,'/files/lab_results/009.pdf','Annual Check-up Report for Alice Smith','lab_results','2024-04-19 17:26:37','2024-04-19 17:26:37'),(10,15,37,'/files/prescriptions/010.pdf','Prescription from recent visit for George Wilson','prescription','2024-04-19 17:26:37','2024-04-19 17:26:37');
/*!40000 ALTER TABLE `documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `health_history`
--

DROP TABLE IF EXISTS `health_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `health_history` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `patient_id` int unsigned NOT NULL,
  `center_id` int unsigned NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `created_datetime` datetime DEFAULT CURRENT_TIMESTAMP,
  `modified_datetime` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_patient_idx` (`patient_id`),
  KEY `fk_center_idx` (`center_id`),
  CONSTRAINT `fk_center2` FOREIGN KEY (`center_id`) REFERENCES `centers` (`id`),
  CONSTRAINT `fk_patient2` FOREIGN KEY (`patient_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `health_history`
--

LOCK TABLES `health_history` WRITE;
/*!40000 ALTER TABLE `health_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `health_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `meetings`
--

DROP TABLE IF EXISTS `meetings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `meetings` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `patient_id` int unsigned NOT NULL,
  `professional_id` int unsigned NOT NULL,
  `center_id` int unsigned NOT NULL COMMENT 'Refers to the specific clinic or hospital where the meeting is to take place',
  `department_id` int unsigned NOT NULL COMMENT 'Refers to the particular department for the meeting',
  `meeting_date` datetime NOT NULL,
  `status` enum('confirmed','ready','closed','cancelled') NOT NULL DEFAULT 'confirmed',
  `created_datetime` datetime DEFAULT CURRENT_TIMESTAMP,
  `modified_datetime` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_idx` (`patient_id`),
  KEY `meeter_idx` (`professional_id`),
  KEY `fk_center_idx` (`center_id`),
  KEY `fk_department_idx` (`department_id`),
  CONSTRAINT `fk_center` FOREIGN KEY (`center_id`) REFERENCES `centers` (`id`),
  CONSTRAINT `fk_department` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`),
  CONSTRAINT `fk_patient` FOREIGN KEY (`patient_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_professional` FOREIGN KEY (`professional_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `meetings`
--

LOCK TABLES `meetings` WRITE;
/*!40000 ALTER TABLE `meetings` DISABLE KEYS */;
INSERT INTO `meetings` VALUES (13,9,19,1,1,'2024-04-29 17:30:45','confirmed','2024-04-19 17:30:45','2024-04-19 17:30:45'),(14,12,24,2,6,'2024-05-09 17:30:45','confirmed','2024-04-19 17:30:45','2024-04-19 17:30:45'),(15,13,30,3,11,'2024-05-04 17:30:45','confirmed','2024-04-19 17:30:45','2024-04-19 17:30:45'),(16,15,34,4,16,'2024-05-14 17:30:45','confirmed','2024-04-19 17:30:45','2024-04-19 17:30:45'),(17,9,35,5,21,'2024-03-20 17:30:45','confirmed','2024-04-19 17:30:45','2024-04-19 17:30:45'),(18,12,44,6,27,'2024-03-05 17:30:45','confirmed','2024-04-19 17:30:45','2024-04-19 17:30:45'),(19,13,22,1,4,'2024-02-19 17:30:45','confirmed','2024-04-19 17:30:45','2024-04-19 17:30:45'),(20,15,25,2,9,'2024-02-04 17:30:45','confirmed','2024-04-19 17:30:45','2024-04-19 17:30:45');
/*!40000 ALTER TABLE `meetings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_types`
--

DROP TABLE IF EXISTS `user_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_types` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `descriptor` varchar(255) NOT NULL,
  `permissions` tinyint unsigned NOT NULL DEFAULT '0' COMMENT 'From LSB to MSB:\\nCan see list of patients\\nCan see patient records\\nCan modify patient records\\nCan create or cancel appointments\\nCan reassign doctors on appointments\\nCan manage user accounts\\nCan manage user permissions\\nCan manage centers\\nCan manage departments',
  `created_datetime` datetime DEFAULT CURRENT_TIMESTAMP,
  `modified_datetime` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_types`
--

LOCK TABLES `user_types` WRITE;
/*!40000 ALTER TABLE `user_types` DISABLE KEYS */;
INSERT INTO `user_types` VALUES (1,'Default',0,'2024-04-17 09:45:00','2024-04-17 09:45:45'),(3,'Receptionist',17,'2024-04-19 15:25:44','2024-04-19 15:25:44'),(4,'Nurse',25,'2024-04-19 15:25:44','2024-04-19 15:25:44'),(5,'Doctor',31,'2024-04-19 15:25:44','2024-04-19 15:25:44'),(6,'Department Head',63,'2024-04-19 15:25:44','2024-04-19 15:25:44'),(7,'HR Manager',192,'2024-04-19 15:25:44','2024-04-19 15:25:44'),(8,'Administrator',255,'2024-04-19 15:25:44','2024-04-19 15:25:44');
/*!40000 ALTER TABLE `user_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `type_id` int unsigned NOT NULL DEFAULT '1' COMMENT 'Defines the privileges the user has access to',
  `status` enum('active','inactive','deleted') NOT NULL DEFAULT 'active',
  `department` int unsigned DEFAULT NULL,
  `photo_uuid` varchar(255) DEFAULT NULL COMMENT 'Points to the path to the image on the server',
  `gender` enum('male','female','other') DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `created_datetime` datetime DEFAULT CURRENT_TIMESTAMP,
  `modified_datetime` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  KEY `user_type_idx` (`type_id`),
  KEY `fk_department_idx` (`department`),
  CONSTRAINT `fk_department2` FOREIGN KEY (`department`) REFERENCES `departments` (`id`),
  CONSTRAINT `fk_type` FOREIGN KEY (`type_id`) REFERENCES `user_types` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (9,'Alice','Smith',1,'active',NULL,NULL,'female','1990-05-15','alice.smith@example.com','+1234567890','1234 Maple Street',NULL,'2024-04-17 17:43:41','2024-04-17 17:43:41'),(10,'Bob','Johnson',1,'inactive',NULL,NULL,'male','1985-12-22','bob.johnson@example.com','+1234567891','5678 Oak Street',NULL,'2024-04-17 17:43:41','2024-04-17 17:43:41'),(11,'Charlie','Williams',1,'deleted',NULL,NULL,'other','1978-03-09','charlie.williams@example.com','+1234567892','9101 Pine Street',NULL,'2024-04-17 17:43:41','2024-04-17 17:43:41'),(12,'Diana','Brown',1,'active',NULL,NULL,'female','2000-07-30','diana.brown@example.com','+1234567893','1213 Cedar Blvd',NULL,'2024-04-17 17:43:41','2024-04-17 17:43:41'),(13,'Eric','Davis',1,'active',NULL,NULL,'male','1995-11-19','eric.davis@example.com','+1234567894','1415 Elm Avenue',NULL,'2024-04-17 17:43:41','2024-04-17 17:43:41'),(14,'Fiona','Garcia',1,'inactive',NULL,NULL,'female','1982-09-05','fiona.garcia@example.com','+1234567895','1617 Spruce Street',NULL,'2024-04-17 17:43:41','2024-04-17 17:43:41'),(15,'George','Wilson',1,'active',NULL,NULL,'male','1975-02-27','george.wilson@example.com','+1234567896','1819 Birch Road',NULL,'2024-04-17 17:43:41','2024-04-17 17:43:41'),(19,'Jean','Dupont',5,'active',1,NULL,NULL,NULL,'jean.dupont@hospital.com',NULL,NULL,NULL,'2024-04-19 15:33:58','2024-04-19 15:33:58'),(20,'Marie','Curie',4,'active',2,NULL,NULL,NULL,'marie.curie@hospital.com',NULL,NULL,NULL,'2024-04-19 15:33:58','2024-04-19 15:33:58'),(21,'Paul','Martin',7,'active',3,NULL,NULL,NULL,'paul.martin@hospital.com',NULL,NULL,NULL,'2024-04-19 15:33:58','2024-04-19 15:33:58'),(22,'Sophie','Durand',5,'active',4,NULL,NULL,NULL,'sophie.durand@hospital.com',NULL,NULL,NULL,'2024-04-19 15:33:58','2024-04-19 15:33:58'),(23,'Luc','Petit',8,'active',5,NULL,NULL,NULL,'luc.petit@hospital.com',NULL,NULL,NULL,'2024-04-19 15:33:58','2024-04-19 15:33:58'),(24,'Anne','Leroy',4,'active',6,NULL,NULL,NULL,'anne.leroy@hospital.com',NULL,NULL,NULL,'2024-04-19 15:33:58','2024-04-19 15:33:58'),(25,'François','Moreau',5,'active',7,NULL,NULL,NULL,'francois.moreau@hospital.com',NULL,NULL,NULL,'2024-04-19 15:33:58','2024-04-19 15:33:58'),(26,'Julie','Robert',8,'active',8,NULL,NULL,NULL,'julie.robert@hospital.com',NULL,NULL,NULL,'2024-04-19 15:33:58','2024-04-19 15:33:58'),(27,'David','Simon',5,'active',9,NULL,NULL,NULL,'david.simon@hospital.com',NULL,NULL,NULL,'2024-04-19 15:33:58','2024-04-19 15:33:58'),(28,'Chloé','Laurent',8,'active',10,NULL,NULL,NULL,'chloe.laurent@hospital.com',NULL,NULL,NULL,'2024-04-19 15:33:58','2024-04-19 15:33:58'),(29,'Eric','Roux',5,'active',11,NULL,NULL,NULL,'eric.roux@hospital.com',NULL,NULL,NULL,'2024-04-19 15:33:58','2024-04-19 15:33:58'),(30,'Laura','David',4,'active',12,NULL,NULL,NULL,'laura.david@hospital.com',NULL,NULL,NULL,'2024-04-19 15:33:58','2024-04-19 15:33:58'),(31,'Nicolas','Bertrand',7,'active',13,NULL,NULL,NULL,'nicolas.bertrand@hospital.com',NULL,NULL,NULL,'2024-04-19 15:33:58','2024-04-19 15:33:58'),(32,'Charlotte','Lefevre',5,'active',14,NULL,NULL,NULL,'charlotte.lefevre@hospital.com',NULL,NULL,NULL,'2024-04-19 15:33:58','2024-04-19 15:33:58'),(33,'Thomas','Garnier',8,'active',15,NULL,NULL,NULL,'thomas.garnier@hospital.com',NULL,NULL,NULL,'2024-04-19 15:33:58','2024-04-19 15:33:58'),(34,'Emilie','Lemoine',4,'active',16,NULL,NULL,NULL,'emilie.lemoine@hospital.com',NULL,NULL,NULL,'2024-04-19 15:33:58','2024-04-19 15:33:58'),(35,'Alexandre','Perrin',5,'active',17,NULL,NULL,NULL,'alexandre.perrin@hospital.com',NULL,NULL,NULL,'2024-04-19 15:33:58','2024-04-19 15:33:58'),(36,'Benoît','Poirier',8,'active',18,NULL,NULL,NULL,'benoit.poirier@hospital.com',NULL,NULL,NULL,'2024-04-19 15:33:58','2024-04-19 15:33:58'),(37,'Clara','Girard',5,'active',19,NULL,NULL,NULL,'clara.girard@hospital.com',NULL,NULL,NULL,'2024-04-19 15:33:58','2024-04-19 15:33:58'),(38,'Mathieu','Renaud',8,'active',20,NULL,NULL,NULL,'mathieu.renaud@hospital.com',NULL,NULL,NULL,'2024-04-19 15:33:58','2024-04-19 15:33:58'),(39,'Sarah','Schmidt',5,'active',21,NULL,NULL,NULL,'sarah.schmidt@hospital.com',NULL,NULL,NULL,'2024-04-19 15:33:58','2024-04-19 15:33:58'),(40,'Olivier','Moulin',6,'active',22,NULL,NULL,NULL,'olivier.moulin@hospital.com',NULL,NULL,NULL,'2024-04-19 15:33:58','2024-04-19 15:33:58'),(41,'Isabelle','Dupuis',7,'active',23,NULL,NULL,NULL,'isabelle.dupuis@hospital.com',NULL,NULL,NULL,'2024-04-19 15:33:58','2024-04-19 15:33:58'),(42,'Philippe','Lemaire',5,'active',24,NULL,NULL,NULL,'philippe.lemaire@hospital.com',NULL,NULL,NULL,'2024-04-19 15:33:58','2024-04-19 15:33:58'),(43,'Stéphanie','Dumas',8,'active',25,NULL,NULL,NULL,'stephanie.dumas@hospital.com',NULL,NULL,NULL,'2024-04-19 15:33:58','2024-04-19 15:33:58'),(44,'Vincent','Brun',5,'active',26,NULL,NULL,NULL,'vincent.brun@hospital.com',NULL,NULL,NULL,'2024-04-19 15:33:58','2024-04-19 15:33:58'),(45,'Catherine','Roy',4,'active',27,NULL,NULL,NULL,'catherine.roy@hospital.com',NULL,NULL,NULL,'2024-04-19 15:33:58','2024-04-19 15:33:58'),(46,'Emmanuel','Blanc',8,'active',28,NULL,NULL,NULL,'emmanuel.blanc@hospital.com',NULL,NULL,NULL,'2024-04-19 15:33:58','2024-04-19 15:33:58'),(47,'Nathalie','Marchand',5,'active',29,NULL,NULL,NULL,'nathalie.marchand@hospital.com',NULL,NULL,NULL,'2024-04-19 15:33:58','2024-04-19 15:33:58'),(48,'Flore','Barbier',8,'active',30,NULL,NULL,NULL,'flore.barbier@hospital.com',NULL,NULL,NULL,'2024-04-19 15:33:58','2024-04-19 15:33:58');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-04-19 23:42:52

CREATE DATABASE  IF NOT EXISTS `hospital_management_system` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `hospital_management_system`;
-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: hospital_management_system
-- ------------------------------------------------------
-- Server version	8.0.44

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
-- Table structure for table `admissions`
--

DROP TABLE IF EXISTS `admissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admissions` (
  `admission_id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int NOT NULL,
  `ward_id` int NOT NULL,
  `admission_date` date NOT NULL,
  `discharge_date` date DEFAULT NULL,
  `room_number` varchar(10) DEFAULT NULL,
  `bed_number` varchar(10) DEFAULT NULL,
  `reason` text,
  PRIMARY KEY (`admission_id`),
  KEY `fk_admission_patient` (`patient_id`),
  KEY `fk_admission_ward` (`ward_id`),
  CONSTRAINT `fk_admission_patient` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`patient_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_admission_ward` FOREIGN KEY (`ward_id`) REFERENCES `wards` (`ward_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admissions`

--

LOCK TABLES `admissions` WRITE;
/*!40000 ALTER TABLE `admissions` DISABLE KEYS */;
INSERT INTO `admissions` VALUES (1,1,6,'2026-01-20',NULL,'ICU-01','B2','Cardiac monitoring'),(2,3,7,'2026-01-22','2026-01-25','GW-A-12','A12','Knee injury'),(3,5,8,'2026-01-23','2026-03-19','PR-05','P5','Observation'),(4,7,9,'2026-01-24','2026-01-26','GW-B-08','B8','Severe headache'),(5,9,10,'2026-01-25','2026-03-19','GW-A-09','A9','Skin infection'),(6,25,6,'2026-03-20','2026-03-19',NULL,NULL,NULL),(7,8,6,'2026-03-20','2026-03-19',NULL,NULL,NULL),(8,8,10,'2026-03-19',NULL,NULL,NULL,NULL),(11,1,6,'2026-03-19',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `admissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `appointments`
--

DROP TABLE IF EXISTS `appointments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appointments` (
  `appointment_id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int NOT NULL,
  `doctor_id` int NOT NULL,
  `appointment_date` date NOT NULL,
  `appointment_time` time NOT NULL,
  `status` varchar(20) DEFAULT 'Scheduled',
  `reason` text,
  `notes` text,
  PRIMARY KEY (`appointment_id`),
  KEY `fk_appointment_patient` (`patient_id`),
  KEY `fk_appointment_doctor` (`doctor_id`),
  CONSTRAINT `fk_appointment_doctor` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`doctor_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_appointment_patient` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`patient_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=102 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointments`
--

LOCK TABLES `appointments` WRITE;
/*!40000 ALTER TABLE `appointments` DISABLE KEYS */;
INSERT INTO `appointments` VALUES (11,1,61,'2026-01-25','10:30:00','completed','Chest pain','Urgent checkup'),(13,3,63,'2026-01-26','09:00:00','Scheduled','Knee pain',NULL),(14,4,64,'2026-01-26','14:30:00','Cancelled','Skin allergy','Patient unavailable'),(15,5,65,'2026-01-27','16:00:00','Scheduled','Routine checkup',NULL),(16,6,61,'2026-01-27','12:00:00','Completed','Heart follow-up','Stable condition'),(17,7,62,'2026-01-28','10:45:00','Scheduled','Headache',NULL),(18,8,63,'2026-01-28','15:30:00','Scheduled','Back pain',NULL),(19,9,64,'2026-01-29','09:30:00','Completed','Rash','Cream prescribed'),(20,10,65,'2026-01-29','11:00:00','Scheduled','Pregnancy consultation',NULL),(21,3,62,'2026-02-03','11:15:00','Scheduled','Regular checkup','First visit'),(22,23,67,'2026-02-06','10:30:00','Scheduled','Fever','urgent'),(23,22,64,'2026-02-07','15:00:00','Scheduled','Fever','urgent'),(25,25,64,'2026-02-12','15:00:00','Scheduled','aids','urgent'),(26,22,66,'2026-03-19','10:30:00','Scheduled','23','23'),(27,22,70,'2026-03-20','11:30:00','Scheduled','fever',NULL),(28,22,61,'2026-03-20','10:30:00','Scheduled','fever',NULL),(29,22,62,'2026-03-20','10:30:00','Scheduled','fever',NULL),(30,23,69,'2026-03-21','11:30:00','Scheduled','232323',NULL),(31,3,69,'2026-03-20','09:30:00','Scheduled','23222',NULL),(32,1,69,'2026-03-19','11:30:00','Scheduled','fever',NULL),(101,5,61,'2026-04-01','10:00:00','Scheduled',NULL,NULL);
/*!40000 ALTER TABLE `appointments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bills`
--

DROP TABLE IF EXISTS `bills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bills` (
  `bill_id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int NOT NULL,
  `appointment_id` int DEFAULT NULL,
  `treatment_id` int DEFAULT NULL,
  `admission_id` int DEFAULT NULL,
  `consultation_charge` decimal(10,2) DEFAULT '0.00',
  `medicine_charge` decimal(10,2) DEFAULT '0.00',
  `room_charge` decimal(10,2) DEFAULT '0.00',
  `total_amount` decimal(10,2) NOT NULL,
  `payment_status` varchar(20) NOT NULL,
  `bill_date` date NOT NULL,
  `payment_date` date DEFAULT NULL,
  PRIMARY KEY (`bill_id`),
  KEY `fk_bill_patient` (`patient_id`),
  KEY `fk_bill_appointment` (`appointment_id`),
  KEY `fk_bill_treatment` (`treatment_id`),
  KEY `fk_bill_admission` (`admission_id`),
  CONSTRAINT `fk_bill_admission` FOREIGN KEY (`admission_id`) REFERENCES `admissions` (`admission_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_bill_appointment` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`appointment_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_bill_patient` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`patient_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_bill_treatment` FOREIGN KEY (`treatment_id`) REFERENCES `treatments` (`treatment_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bills`
--


LOCK TABLES `bills` WRITE;
/*!40000 ALTER TABLE `bills` DISABLE KEYS */;
INSERT INTO `bills` VALUES (1,1,11,NULL,NULL,500.00,200.00,100.00,800.00,'Paid','2026-01-10','2026-01-10'),(3,3,13,NULL,1,500.00,0.00,10000.00,10500.00,'Pending','2026-01-11',NULL),(4,4,14,2,2,700.00,300.00,6000.00,7000.00,'Paid','2026-01-15','2026-01-15'),(5,5,15,NULL,NULL,400.00,200.00,0.00,600.00,'Paid','2026-01-12','2026-01-12'),(6,6,16,3,3,500.00,500.00,3500.00,4500.00,'Pending','2026-01-13',NULL),(7,7,17,NULL,NULL,600.00,300.00,0.00,900.00,'Paid','2026-01-14','2026-01-14'),(8,8,18,4,4,1000.00,500.00,17000.00,18500.00,'Paid','2026-01-18','2026-01-18'),(9,9,19,NULL,NULL,700.00,500.00,0.00,1200.00,'Pending','2026-01-16',NULL),(10,10,20,5,5,1000.00,3000.00,20000.00,24000.00,'Paid','2026-01-17','2026-01-20'),(22,25,NULL,NULL,NULL,10000.00,900.00,17.00,10917.00,'Pending','2026-03-10',NULL),(23,25,NULL,NULL,NULL,12.00,12.00,12.00,36.00,'Paid','2026-03-18','2026-03-18'),(24,25,NULL,NULL,NULL,2.00,5.00,12.00,19.00,'Paid','2026-03-19','2026-03-19'),(25,25,NULL,NULL,NULL,12.00,12.00,12.00,36.00,'Pending','2026-03-19',NULL),(26,25,NULL,NULL,NULL,12.00,12.00,12.00,36.00,'Pending','2026-03-19',NULL),(27,25,NULL,NULL,NULL,112.00,12.00,12.00,136.00,'Pending','2026-03-19',NULL),(28,23,NULL,NULL,NULL,12.00,12.00,2.00,26.00,'Pending','2026-03-19',NULL),(29,22,NULL,NULL,NULL,123.00,345.00,67878.00,68346.00,'Pending','2026-03-19',NULL),(30,22,NULL,NULL,NULL,1222.00,1222.00,12222.00,14666.00,'Pending','2026-03-19',NULL),(31,5,NULL,NULL,NULL,500.00,300.00,200.00,1000.00,'Pending','2026-03-23',NULL);
/*!40000 ALTER TABLE `bills` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = cp850 */ ;
/*!50003 SET character_set_results = cp850 */ ;
/*!50003 SET collation_connection  = cp850_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `auto_total_bill` BEFORE INSERT ON `bills` FOR EACH ROW BEGIN
    SET NEW.total_amount =
        IFNULL(NEW.consultation_charge,0) +
        IFNULL(NEW.medicine_charge,0) +
        IFNULL(NEW.room_charge,0);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departments` (
  `department_id` int NOT NULL AUTO_INCREMENT,
  `department_name` varchar(100) NOT NULL,
  `head_doctor_id` int DEFAULT NULL,
  `floor_number` int DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`department_id`),
  KEY `fk_department_head` (`head_doctor_id`),
  CONSTRAINT `fk_department_head` FOREIGN KEY (`head_doctor_id`) REFERENCES `doctors` (`doctor_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
INSERT INTO `departments` VALUES (3,'Cardiology',61,2,'022-4567890','Heart-related diagnosis and treatments');
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doctors`
--

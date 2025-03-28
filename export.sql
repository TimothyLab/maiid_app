/*!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.11.8-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: maiid_app
-- ------------------------------------------------------
-- Server version	10.11.8-MariaDB-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `ANALYSE`
--

DROP TABLE IF EXISTS `ANALYSE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ANALYSE` (
  `id_analyse` int(11) NOT NULL AUTO_INCREMENT,
  `date_analyse` datetime NOT NULL,
  `algo_config` text DEFAULT NULL,
  `user_feedback` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `id_user` int(11) NOT NULL,
  `id_image` int(11) NOT NULL,
  PRIMARY KEY (`id_analyse`),
  KEY `ANALYSE_ibfk_1` (`id_user`),
  KEY `ANALYSE_ibfk_2` (`id_image`),
  CONSTRAINT `ANALYSE_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `UTILISATEUR` (`id_user`) ON DELETE CASCADE,
  CONSTRAINT `ANALYSE_ibfk_2` FOREIGN KEY (`id_image`) REFERENCES `IMAGE` (`id_image`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ANALYSE`
--

LOCK TABLES `ANALYSE` WRITE;
/*!40000 ALTER TABLE `ANALYSE` DISABLE KEYS */;
INSERT INTO `ANALYSE` VALUES
(1,'2025-03-28 17:36:23',NULL,NULL,'2025-03-28 16:36:23',1,1),
(2,'2025-03-28 17:37:11',NULL,NULL,'2025-03-28 16:37:11',7,2),
(3,'2025-03-28 17:37:17',NULL,NULL,'2025-03-28 16:37:17',7,2),
(4,'2025-03-28 17:37:26',NULL,NULL,'2025-03-28 16:37:26',7,3);
/*!40000 ALTER TABLE `ANALYSE` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `BOUNDING_BOX`
--

DROP TABLE IF EXISTS `BOUNDING_BOX`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `BOUNDING_BOX` (
  `id_bounding_box` int(11) NOT NULL AUTO_INCREMENT,
  `x1` float NOT NULL,
  `y1` float NOT NULL,
  `x2` float NOT NULL,
  `y2` float NOT NULL,
  `class_result` varchar(255) NOT NULL,
  `id_image` int(11) NOT NULL,
  PRIMARY KEY (`id_bounding_box`),
  KEY `BOUNDING_BOX_ibfk_2` (`id_image`),
  CONSTRAINT `BOUNDING_BOX_ibfk_2` FOREIGN KEY (`id_image`) REFERENCES `IMAGE` (`id_image`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `BOUNDING_BOX`
--

LOCK TABLES `BOUNDING_BOX` WRITE;
/*!40000 ALTER TABLE `BOUNDING_BOX` DISABLE KEYS */;
INSERT INTO `BOUNDING_BOX` VALUES
(1,1936.71,3435.13,2750.07,4280.36,'Moustique',1),
(2,772.328,574.133,1037.54,786.484,'Moustique',2),
(3,772.328,574.133,1037.54,786.484,'Moustique',2),
(4,209.9,387.242,382.028,571.272,'Moustique',3),
(5,952.011,604.585,1090.88,752.46,'Moustique',3);
/*!40000 ALTER TABLE `BOUNDING_BOX` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `GROUPE`
--

DROP TABLE IF EXISTS `GROUPE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `GROUPE` (
  `id_groupe` int(11) NOT NULL AUTO_INCREMENT,
  `nom_groupe` varchar(255) NOT NULL,
  PRIMARY KEY (`id_groupe`),
  UNIQUE KEY `nom_groupe` (`nom_groupe`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `GROUPE`
--

LOCK TABLES `GROUPE` WRITE;
/*!40000 ALTER TABLE `GROUPE` DISABLE KEYS */;
INSERT INTO `GROUPE` VALUES
(1,'Admin'),
(2,'Utilisateur'),
(3,'Visiteur');
/*!40000 ALTER TABLE `GROUPE` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `IMAGE`
--

DROP TABLE IF EXISTS `IMAGE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `IMAGE` (
  `id_image` int(11) NOT NULL AUTO_INCREMENT,
  `md5_hash` char(32) NOT NULL,
  `image_path` text NOT NULL,
  PRIMARY KEY (`id_image`),
  UNIQUE KEY `md5_hash` (`md5_hash`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `IMAGE`
--

LOCK TABLES `IMAGE` WRITE;
/*!40000 ALTER TABLE `IMAGE` DISABLE KEYS */;
INSERT INTO `IMAGE` VALUES
(1,'74e07ced2d96dbaa3fb205427acca142','uploaded_images/74e07ced2d96dbaa3fb205427acca142.jpg'),
(2,'a74b535ece6c62f32296657cda5b4e35','uploaded_images/a74b535ece6c62f32296657cda5b4e35.jpg'),
(3,'4f599f21d98dcf66321497a54f642b6c','uploaded_images/4f599f21d98dcf66321497a54f642b6c.png');
/*!40000 ALTER TABLE `IMAGE` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UTILISATEUR`
--

DROP TABLE IF EXISTS `UTILISATEUR`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `UTILISATEUR` (
  `id_user` int(11) NOT NULL AUTO_INCREMENT,
  `login` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `prenom` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `date_inscription` date NOT NULL,
  `id_groupe` int(11) NOT NULL,
  PRIMARY KEY (`id_user`),
  UNIQUE KEY `login` (`login`),
  KEY `UTILISATEUR_ibfk_1` (`id_groupe`),
  CONSTRAINT `UTILISATEUR_ibfk_1` FOREIGN KEY (`id_groupe`) REFERENCES `GROUPE` (`id_groupe`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UTILISATEUR`
--

LOCK TABLES `UTILISATEUR` WRITE;
/*!40000 ALTER TABLE `UTILISATEUR` DISABLE KEYS */;
INSERT INTO `UTILISATEUR` VALUES
(1,'Tim','$2b$12$DRyjQn26icHcVBLQRnSBk.mDm1va8uYXraAEz9LSIVMVGqBNgSHBK','Labidi','Timothy','t@t.fr','2025-03-19',1),
(7,'gab','$2b$12$LGACMb7ckwOXf35fzKTSP.shMqw1bpXpg1/WS9JTGFPUzL/PQuoEC','gabriel','michaux','g.m@gmail.com','2025-03-28',2);
/*!40000 ALTER TABLE `UTILISATEUR` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-28 17:38:36

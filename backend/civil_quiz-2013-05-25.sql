# ************************************************************
# Sequel Pro SQL dump
# Version 4096
#
# http://www.sequelpro.com/
# http://code.google.com/p/sequel-pro/
#
# Host: localhost (MySQL 5.1.49)
# Database: civil_quiz
# Generation Time: 2013-05-25 19:27:09 +0200
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table admins
# ------------------------------------------------------------

DROP TABLE IF EXISTS `admins`;

CREATE TABLE `admins` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;

INSERT INTO `admins` (`id`, `username`, `password`)
VALUES
	(1,'jakob','123');

/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table answers
# ------------------------------------------------------------

DROP TABLE IF EXISTS `answers`;

CREATE TABLE `answers` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `text` varchar(1000) NOT NULL DEFAULT '',
  `question_id` int(11) NOT NULL,
  `correct` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

LOCK TABLES `answers` WRITE;
/*!40000 ALTER TABLE `answers` DISABLE KEYS */;

INSERT INTO `answers` (`id`, `text`, `question_id`, `correct`)
VALUES
	(5,'24 timmar',2,0),
	(6,'36 timmar',2,1),
	(7,'48 timmar',2,0),
	(8,'60 timmar',2,0),
	(9,'Lägger på ett lock',3,1),
	(10,'Blåser med en hårtork',3,0),
	(11,'Häller på iskallt vatten',3,0),
	(12,'Häller på is',3,0),
	(13,'Att rädda andra',4,1),
	(14,'Att öppna alla fönster',4,0),
	(15,'Att rädda foton och minnen',4,0),
	(16,'Att ringa brandkåren',4,0),
	(17,'Du själv',5,1),
	(18,'Polisen',5,0),
	(19,'Boverket',5,0),
	(20,'Kommunen',5,0),
	(21,'Lyssnar på din batteriradio',6,1),
	(22,'Frågar grannen',6,0),
	(23,'Tar bussen till en annan stad',6,0),
	(24,'Läser tidningarna',6,0),
	(25,'3 dagar',7,1),
	(26,'2 dagar',7,0),
	(27,'20 dagar',7,0),
	(28,'30 dagar',7,0),
	(29,'Luften mellan klädlagren',9,1),
	(30,'Stoppningen i tyglagren',9,0),
	(31,'Ytskiktet på ytterkläderna',9,0),
	(32,'Syntet stöter bort kyla',9,0),
	(33,'60 stycken',10,1),
	(34,'600 stycken',10,0),
	(35,'12 stycken',10,0),
	(36,'6 stycken',10,0),
	(37,'Nötter',11,1),
	(38,'Svamp',11,0),
	(39,'Bladväxter',11,0),
	(40,'Morötter',11,0),
	(41,'Täcker över dem på balkongen',12,1),
	(42,'Täcker över dem i trappuppgången',12,0),
	(43,'Slänger dem i närmaste park',12,0),
	(44,'Slänger dem i ett dike',12,0),
	(45,'På strumpan',13,1),
	(46,'På kjolen',13,0),
	(47,'På hatten',13,0),
	(48,'På västen',13,0),
	(49,'Alblad',14,1),
	(50,'Nypon',14,0),
	(51,'Skvattram',14,0),
	(52,'Renlav',14,0),
	(53,'Ringa polisen',15,0),
	(54,'Kyl skadan under svalt rinnande vatten i cirka 20 minuter',15,1),
	(55,'Stick hål på eventuella blåsor',15,0),
	(56,'Gnid in med matfett så huden blir mjuk',15,0),
	(57,'Värma kroppsdelen själv eller med hjälp av någon',16,1),
	(58,'Sminka området',16,0),
	(59,'Smörja in med saliv',16,0),
	(60,'Massera huden helst med hjälp av någon annan',16,0),
	(61,'Vända på den några gånger',17,1),
	(62,'Fylla på vatten',17,0),
	(63,'Ta ut den utomhus',17,0),
	(64,'Knacka på den',17,0),
	(65,'Återsamlingsplats',18,1),
	(66,'Vem som först springer till grannen',18,0),
	(67,'Vem som låser dörren',18,0),
	(68,'Vem som kör iväg bilen',18,0),
	(69,'30 stycken',19,1),
	(70,'En till två varje timme',19,0),
	(71,'Det är bättre att göra ryggmassage',19,0),
	(72,'Akupunktur ger bättre effekt',19,0);

/*!40000 ALTER TABLE `answers` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table questions
# ------------------------------------------------------------

DROP TABLE IF EXISTS `questions`;

CREATE TABLE `questions` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `text` varchar(1000) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

LOCK TABLES `questions` WRITE;
/*!40000 ALTER TABLE `questions` DISABLE KEYS */;

INSERT INTO `questions` (`id`, `text`)
VALUES
	(9,'När det är kallt håller vi värmen bäst genom att ha flera lager av kläder. Vad är det som gör att vi håller värmen?'),
	(2,'Inomhustemperaturen sjunker om vi inte har tillgång till uppvärmning. I ett ordinärt välbyggt småhus med en inomhustemperatur på +21 grader tar det ett antal timmar innan inomhustemperaturen har sjunkit till  +10 grader, förutsatt att utomhustemperaturen är -10 grader. Hur lång tid tar det?'),
	(3,'Om fett börjar brinna vid matlagning, hur släcker du en sådan brand?'),
	(4,'När det brinner är brandförloppet ofta ganska snabbt. Vad prioriterar du först?'),
	(5,'Vem ansvarar för att det installeras brandvarnare i din bostad?'),
	(6,'Hur gör du för att ta del av nyheter och information vid strömavbrott?'),
	(7,'Hur många dagar klarar sig en människa utan vatten? Normalt behöver vi tre liter per dag.'),
	(10,'Hur många stearinljus krävs för att nå samma ljusstyrka som en 60 watts glödlampa?'),
	(11,'Kolhydrater är viktigt för att kroppen ska fungera även i utsatta lägen. Vilken av följande grupper har högst kolhydratvärde?'),
	(12,'Om sophämtningen slutar fungera vid en kris vad gör man med soporna för att de inte ska locka skadedjur eller sprida bakterier?'),
	(13,'Hur ser man skillnad på vit flugsvamp och champinjon?'),
	(14,'I brist på myggmedel kan du ta färska blad från en växt och gnida in dig med som skydd. Från vilken växt?'),
	(15,'Vad ska man göra om man har bränt sig?'),
	(16,'Ett tecken på en ytlig köldskada är att hudområdet blir vitt. Vad ska man då göra?'),
	(17,'En pulversläckare är vanlig i bostäder. Vad ska man minst en gång per år göra med den?'),
	(18,'Vad ska en familj på förhand ha bestämt om det börjar brinna i bostaden?'),
	(19,'Om någon drabbas av hjärtstopp kan man göra hjärt-lungräddning. Hur många kompressioner ska man göra innan två inblåsningar?');

/*!40000 ALTER TABLE `questions` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

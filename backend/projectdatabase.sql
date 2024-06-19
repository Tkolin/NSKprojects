-- phpMyAdmin SQL Dump
-- version 5.1.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Feb 12, 2024 at 03:12 AM
-- Server version: 5.7.24
-- PHP Version: 8.0.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `projectdatabase`
--

-- --------------------------------------------------------

--
-- Table structure for table `addresses`
--

CREATE TABLE `addresses` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `fullAddress` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `banks`
--

CREATE TABLE `banks` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `biks`
--

CREATE TABLE `biks` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `BIK` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `correspondent_account` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contacts`
--

CREATE TABLE `contacts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `first_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `patronymic` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mobile_phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `work_phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sibnipi_email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `position_id` bigint(20) UNSIGNED DEFAULT NULL,
  `organization_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `contacts`
--

INSERT INTO `contacts` (`id`, `first_name`, `last_name`, `patronymic`, `mobile_phone`, `work_phone`, `email`, `sibnipi_email`, `position_id`, `organization_id`, `created_at`, `updated_at`) VALUES
(1, 'Дмитри33', 'Парилов2', NULL, '+79233924329', NULL, '2329192@mail.ru', '2329192@mail.ru', 1, NULL, '2024-02-07 12:36:59', '2024-02-10 04:54:57'),
(2, 'Дмитрий', 'Парилов', 'eee', '+79233924329', NULL, '2329192@mail.ru', '2329192@mail.ru', 1, NULL, '2024-02-07 12:37:08', '2024-02-10 04:54:50'),
(3, '1', '1', '1', '1', NULL, '2329192@mail.ru', '2329192@mail.ru', 2, NULL, '2024-02-07 12:37:11', '2024-02-09 06:39:57'),
(4, 'Дмитрий', 'Парилов', NULL, '+79233924329', NULL, '2329192@mail.ru', '2329192@mail.ru', 1, NULL, '2024-02-07 12:37:14', '2024-02-07 12:37:14'),
(5, 'Дмитрий', 'Парилов', NULL, '+79233924329', NULL, '2329192@mail.ru', '2329192@mail.ru', 3, NULL, '2024-02-07 12:37:16', '2024-02-07 12:37:16'),
(6, 'Дмитрий', 'Парилов', NULL, '+79233924329', NULL, '2329192@mail.ru', '2329192@mail.ru', 1, NULL, '2024-02-07 12:37:19', '2024-02-07 12:37:19'),
(7, 'Дмитрий', 'Парилов', NULL, '+79233924329', NULL, '2329192@mail.ru', '2329192@mail.ru', 2, NULL, '2024-02-07 12:37:25', '2024-02-07 12:37:25'),
(8, 'user', 'user', NULL, 'ывы', NULL, 'user@mail.ru', 'user@mail.ru', 1, NULL, '2024-02-07 12:37:30', '2024-02-07 12:37:30'),
(9, 'Дмитрий', 'Парилов', NULL, 'выв', NULL, '2329192@mail.ru', '2329192@mail.ru', 1, NULL, '2024-02-07 12:37:34', '2024-02-07 12:37:34'),
(10, 'Семен', 'Кучелаев', NULL, 'выы', NULL, '2329192@mail.ru', '2329192@mail.ru', 1, NULL, '2024-02-07 12:37:37', '2024-02-07 12:37:37'),
(11, 'Семен', 'Кучелаев', NULL, '+79994470543', NULL, '2329192@mail.ru', '2329192@mail.ru', 1, NULL, '2024-02-07 12:37:50', '2024-02-07 12:37:50'),
(12, 'Дмитрий', 'Парилов', NULL, '+79233924329', NULL, '2329192@mail.ru', '2329192@mail.ru', 3, NULL, '2024-02-07 12:37:52', '2024-02-07 12:37:52'),
(13, 'Дмитрий', 'Парилов', 'ыффы', '+79233924329', NULL, '2329192@mail.ru', '2329192@mail.ru', 1, NULL, '2024-02-09 04:33:14', '2024-02-09 04:33:14'),
(14, 'Дмитрий', 'Парилов', 'ыффы', '+79233924329', NULL, '2329192@mail.ru', '2329192@mail.ru', 1, NULL, '2024-02-09 04:33:19', '2024-02-09 04:33:19'),
(15, 'Дмитрий', 'Парилов', 'ыффы', '+79233924329', NULL, '2329192@mail.ru', '2329192@mail.ru', 1, NULL, '2024-02-09 04:33:20', '2024-02-09 04:33:20'),
(16, 'Дмитрий', 'Парилов', 'ыффы', '+79233924329', NULL, '2329192@mail.ru', '2329192@mail.ru', 1, NULL, '2024-02-09 04:33:20', '2024-02-09 04:33:20'),
(17, 'Дмитрий', 'Парилов', 'ыффы', '+79233924329', NULL, '2329192@mail.ru', '2329192@mail.ru', 1, NULL, '2024-02-09 04:33:20', '2024-02-09 04:33:20'),
(18, 'Дмитрий', 'Парилов', 'ыффы', '+79233924329', NULL, '2329192@mail.ru', '2329192@mail.ru', 1, NULL, '2024-02-09 04:33:20', '2024-02-09 04:33:20'),
(19, 'Дмитрий', 'Парилов', 'ыффы', '+79233924329', NULL, '2329192@mail.ru', '2329192@mail.ru', 1, NULL, '2024-02-09 04:33:21', '2024-02-09 04:33:21'),
(20, 'Дмитрий', 'Парилов', 'ыффы', '+79233924329', NULL, '2329192@mail.ru', '2329192@mail.ru', 1, NULL, '2024-02-09 04:33:21', '2024-02-09 04:33:21'),
(21, 'Дмитрий', 'Парилов', 'ыффы', '+79233924329', NULL, '2329192@mail.ru', '2329192@mail.ru', 1, NULL, '2024-02-09 04:33:21', '2024-02-09 04:33:21'),
(22, '111111111111111111', '22222222222222222', '3333333333333333', '4444444444444444', NULL, '5555555@mail.ru', '5555555@mail.ru', 1, NULL, '2024-02-09 04:48:42', '2024-02-09 04:48:42'),
(23, '111111111111111111', '22222222222222222', '3333333333333333', '4444444444444444', NULL, '5555555@mail.ru', '5555555@mail.ru', 1, NULL, '2024-02-09 04:49:00', '2024-02-09 04:49:00'),
(24, 'Дмитрий', 'Парилов', 'ыффы', '+79233924329', NULL, '2329192@mail.ru', '2329192@mail.ru', 1, NULL, '2024-02-09 05:08:51', '2024-02-09 05:08:51'),
(25, 'Фамилия', 'отчество', 'имя', '+79231351355', NULL, 'parilow.dima@yandex.ru', 'parilow.dima@yandex.ru', 1, NULL, '2024-02-09 05:09:15', '2024-02-09 05:09:15'),
(26, 'Дмитрий', NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, '2024-02-09 05:21:24', '2024-02-09 05:21:24'),
(27, 'Фамилия', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-09 05:25:04', '2024-02-09 05:25:04'),
(28, 'Фамилия', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-09 05:25:36', '2024-02-09 05:25:36'),
(29, 'Фамилия', 'выфв', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-09 05:26:49', '2024-02-09 05:26:49'),
(30, 'Дмитрий', 'Парилов', 'ыффы', '+79233924329', NULL, '2329192@mail.ru', '2329192@mail.ru', 1, NULL, '2024-02-09 06:07:45', '2024-02-09 06:07:45'),
(31, '111111111111111111', '22222222222222222', '3333333333333333', '4444444444444444', NULL, '5555555@mail.ru', '5555555@mail.ru', NULL, NULL, '2024-02-09 06:27:16', '2024-02-09 06:27:16'),
(32, '111111111111111111', '22222222222222222', '3333333333333333', '4444444444444444', NULL, '5555555@mail.ru', '5555555@mail.ru', NULL, NULL, '2024-02-09 06:27:16', '2024-02-09 06:27:16'),
(33, 'Дмитрий1', 'Парилов2', NULL, '+79233924329', NULL, '2329192@mail.ru', '2329192@mail.ru', NULL, NULL, '2024-02-09 06:36:29', '2024-02-09 06:36:29'),
(34, 'Фамилия', 'отчество', 'имя', '+79231351355', NULL, 'parilow.dima@yandex.ru', 'parilow.dima@yandex.ru', 1, 7, '2024-02-11 02:30:05', '2024-02-11 02:30:05'),
(35, 'Фамилия', 'отчество', 'имя', '+79231351355', NULL, 'parilow.dima@yandex.ru', 'parilow.dima@yandex.ru', NULL, NULL, '2024-02-11 07:32:31', '2024-02-11 07:32:31');

-- --------------------------------------------------------

--
-- Table structure for table `educational_institutions`
--

CREATE TABLE `educational_institutions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `educations`
--

CREATE TABLE `educations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type_document_id` bigint(20) UNSIGNED NOT NULL,
  `institution_id` bigint(20) UNSIGNED NOT NULL,
  `qualification_id` bigint(20) UNSIGNED NOT NULL,
  `specialization_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `education_persons`
--

CREATE TABLE `education_persons` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `person_id` bigint(20) UNSIGNED NOT NULL,
  `education_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `education_qualifications`
--

CREATE TABLE `education_qualifications` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `education_specializations`
--

CREATE TABLE `education_specializations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `facilities`
--

CREATE TABLE `facilities` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `facilities`
--

INSERT INTO `facilities` (`id`, `name`, `type_id`, `created_at`, `updated_at`) VALUES
(1, '	Генеральный план и транспорт предприятия	 ', 1, NULL, NULL),
(2, '	Внешние (межплощадочные) сети и сооружения электроснабжения	 ', 1, NULL, NULL),
(3, '	Здания на внешних сетях электроснабжения(главные понизительные подстанции и т.п.)	 ', 1, NULL, NULL),
(4, '	Внешние (межплощадочные) сети и сооружения водоснабжения и канализации	 ', 1, NULL, NULL),
(5, '	Здания на внешних сетях водоснабжения и канализации	 ', 1, NULL, NULL),
(6, '	Внешние (межплощадочные) тепловые сети и сооружения на них	 ', 1, NULL, NULL),
(7, '	Здания на внешних тепловых сетях (насосные станции и т.п.)	 ', 1, NULL, NULL),
(8, '	Внешние (межплощадочные) сети и сооружения связи	 ', 1, NULL, NULL),
(9, '	Здания на внешних сетях связи	 ', 1, NULL, NULL),
(10, '	Внешние (межплощадочные) сети сжатого воздуха	 ', 1, NULL, NULL),
(11, '	Внешние (межплощадочные) сети кислородоснабжения	 ', 1, NULL, NULL),
(12, '	Внешние (межплощадочные) топливопроводы	 ', 1, NULL, NULL),
(13, '	Комплекс автоматизированных систем управления	 ', 1, NULL, NULL),
(14, '	Внешние (межплощадочные) сети газоснабжения	 ', 1, NULL, NULL),
(15, '	Здания на внешних сетях газоснабжения(газораспределительные станции)	 ', 1, NULL, NULL),
(16, '	Карьер	 ', 2, NULL, NULL),
(17, '	Водоотлив карьера	 ', 2, NULL, NULL),
(18, '	Дробильно-конвейерный комплекс	 ', 2, NULL, NULL),
(19, '	Склад руды, породы	 ', 2, NULL, NULL),
(20, '	Отвал	 ', 2, NULL, NULL),
(21, '	Дробильно-сортировочный завод (установка)	 ', 2, NULL, NULL),
(22, '	Рекультивация карьеров и отвалов	 ', 2, NULL, NULL),
(23, '	Подземные выработки	 ', 3, NULL, NULL),
(24, '	Подземный дробильный комплекс	 ', 3, NULL, NULL),
(25, '	Шахтный подъём	 ', 3, NULL, NULL),
(26, '	Водоотлив шахты	 ', 3, NULL, NULL),
(27, '	Копёр, надшахтное здание	 ', 3, NULL, NULL),
(28, '	Здание подъёмной машины	 ', 3, NULL, NULL),
(29, '	Вентиляторная установка	 ', 3, NULL, NULL),
(30, '	Калориферная установка	 ', 3, NULL, NULL),
(31, '	Склад руды, породы	 ', 3, NULL, NULL),
(32, '	Поверхностный закладочный комплекс	 ', 3, NULL, NULL),
(33, '	Фабрика в целом (ЗИФ, ОФ, ДОФ и т.п.)	 ', 4, NULL, NULL),
(34, '	Корпус крупного дробления	 ', 4, NULL, NULL),
(35, '	Отделение измельчения	 ', 4, NULL, NULL),
(36, '	Отделение флотации	 ', 4, NULL, NULL),
(37, '	Отделение сгущения	 ', 4, NULL, NULL),
(38, '	Участок выщелачивания	 ', 4, NULL, NULL),
(39, '	Участок обезвреживания	 ', 4, NULL, NULL),
(40, '	Плавильный участок	 ', 4, NULL, NULL),
(41, '	Отделение реагентов (в т.ч. участок приготовления известкового молока)	 ', 4, NULL, NULL),
(42, '	Склад кека	 ', 4, NULL, NULL),
(43, '	Склад дроблёной руды	 ', 4, NULL, NULL),
(44, '	Опытно-промышленная установка	 ', 4, NULL, NULL),
(45, '	Сгуститель	 ', 4, NULL, NULL),
(46, '	Пульпонасосная станция	 ', 4, NULL, NULL),
(47, '	Насосная станция оборотного водоснабжения	 ', 4, NULL, NULL),
(48, '	Участок сгущения хвостов и оборотного водоснабжения	 ', 4, NULL, NULL),
(49, '	Хвостохранилище	 ', 5, NULL, NULL),
(50, '	Система гидротранспорта	 ', 5, NULL, NULL),
(51, '	Насосная станция оборотного водоснабжения	 ', 5, NULL, NULL),
(52, '	Водохранилище	 ', 5, NULL, NULL),
(53, '	Водоотводные сооружения	 ', 5, NULL, NULL),
(54, '	Плавильный цех	 ', 6, NULL, NULL),
(55, '	Электролизный цех	 ', 6, NULL, NULL),
(56, '	Производство катанки	 ', 6, NULL, NULL),
(57, '	Электрокотельная (электробойлерная)	 ', 7, NULL, NULL),
(58, '	Котельная на угле	 ', 7, NULL, NULL),
(59, '	Дизельная электростанция	 ', 7, NULL, NULL),
(60, '	Теплоэлектростанция (теплоэлектроцентраль)	 ', 7, NULL, NULL),
(61, '	Главная понизительная подстанция (ГПП)	 ', 7, NULL, NULL),
(62, '	Газовая котельная	 ', 7, NULL, NULL),
(63, '	Внутриплощадочные сети и сооружения электроснабжения,	 ', 8, NULL, NULL),
(64, '	наружное освещение	 ', 8, NULL, NULL),
(65, '	ТП (КТП)-6 (10) кВ (отдельно стоящее сооружение)	 ', 8, NULL, NULL),
(66, '	Внутриплощадочные сети и сооружения водоснабжения и водоотведения	 ', 8, NULL, NULL),
(67, '	Насосные станции водоснабжения	 ', 8, NULL, NULL),
(68, '	Канализационные насосные станции	 ', 8, NULL, NULL),
(69, '	Очистные сооружения	 ', 8, NULL, NULL),
(70, '	Внутриплощадочные тепловые сети и сооружения на них	 ', 8, NULL, NULL),
(71, '	Насосные станции теплоснабжения	 ', 8, NULL, NULL),
(72, '	Внутриплощадочные сети и сооружения связи	 ', 8, NULL, NULL),
(73, '	Внутриплощадочные сети сжатого воздуха	 ', 8, NULL, NULL),
(74, '	Внутриплощадочные сети кислородоснабжения	 ', 8, NULL, NULL),
(75, '	Станции водоподготовки	 ', 8, NULL, NULL),
(76, '	Внутриплощадочные топливопроводы	 ', 8, NULL, NULL),
(77, '	Внутриплощадочные автоматизированные системы управления	 ', 8, NULL, NULL),
(78, '	Внутриплощадочные сети газоснабжения	 ', 8, NULL, NULL),
(79, '	Газораспределительный пункт (ГРП)	 ', 8, NULL, NULL),
(80, '	Градирня 	 ', 8, NULL, NULL),
(81, '	Автомобильные весы	 ', 9, NULL, NULL),
(82, '	Корпус ТО и ТР автомобилей	 ', 9, NULL, NULL),
(83, '	Тёплая стоянка автомобилей	 ', 9, NULL, NULL),
(84, '	Открытая стоянка автомобилей	 ', 9, NULL, NULL),
(85, '	Мойка автомобилей	 ', 9, NULL, NULL),
(86, '	Пункт мойки колёс автомобилей	 ', 9, NULL, NULL),
(87, '	Вертолётная площадка	 ', 9, NULL, NULL),
(88, '	Прирельсовый погрузочный пункт(в т.ч. железнодорожные весы)	 ', 9, NULL, NULL),
(89, '	Железнодорожное депо	 ', 9, NULL, NULL),
(90, '	Железнодорожная станция	 ', 9, NULL, NULL),
(91, '	Пост электрической централизации (ЭЦ)	 ', 9, NULL, NULL),
(92, '	Узел обработки вагонов против смерзания грузов	 ', 9, NULL, NULL),
(93, '	Автодорожный мост	 ', 9, NULL, NULL),
(94, '	Железнодорожный мост	 ', 9, NULL, NULL),
(95, '	Склад ВМ	 ', 10, NULL, NULL),
(96, '	Склад СДЯВ	 ', 10, NULL, NULL),
(97, '	Склад извести	 ', 10, NULL, NULL),
(98, '	Склад химреагентов	 ', 10, NULL, NULL),
(99, '	Открытая площадка складирования	 ', 10, NULL, NULL),
(100, '	Склад МТС	 ', 10, NULL, NULL),
(101, '	Склад продовольственный	 ', 10, NULL, NULL),
(102, '	Склады прочие	 ', 10, NULL, NULL),
(103, '	Склад ГСМ с топливозаправочным пунктом (ТЗП)	 ', 10, NULL, NULL),
(104, '	Склад ГСМ	 ', 10, NULL, NULL),
(105, '	Топливозаправочный пункт	 ', 10, NULL, NULL),
(106, '	Склад масел с маслораздаточной	 ', 10, NULL, NULL),
(107, '	Склад противопожарных материалов	 ', 10, NULL, NULL),
(108, '	Склад цемента	 ', 10, NULL, NULL),
(109, '	Склад флюсов	 ', 10, NULL, NULL),
(110, '	Склад готовой продукции (металлургия)	 ', 10, NULL, NULL),
(111, '	Склад угля	 ', 10, NULL, NULL),
(112, '	Ремонтно-механический завод	 ', 11, NULL, NULL),
(113, '	Центральные ремонтно-механические мастерские	 ', 11, NULL, NULL),
(114, '	Ремонтно-механическая мастерская	 ', 11, NULL, NULL),
(115, '	Ремонтно-механический пункт	 ', 11, NULL, NULL),
(116, '	Электроремонтный цех	 ', 11, NULL, NULL),
(117, '	Ремонтно-строительный цех	 ', 11, NULL, NULL),
(118, '	Цех металлоконструкций/металлозаготовок	 ', 11, NULL, NULL),
(119, '	Столярный цех	 ', 11, NULL, NULL),
(120, '	Бетонорастворный узел	 ', 11, NULL, NULL),
(121, '	Ремонтно-эксплуатационная база (РЭБ) цеха тепловодоснабжения и канализации (ТВСиК)	 ', 11, NULL, NULL),
(122, '	Производственная база цеха сетей и подстанций	 ', 11, NULL, NULL),
(123, '	Производственная база цеха КИПиА и связи	 ', 11, NULL, NULL),
(124, '	Контрольно-пропускной пункт	 ', 12, NULL, NULL),
(125, '	Ограждение площадки	 ', 12, NULL, NULL),
(126, '	Пожарное депо с горноспасательной станцией	 ', 12, NULL, NULL),
(127, '	Пожарное депо	 ', 12, NULL, NULL),
(128, '	Диспетчерская	 ', 12, NULL, NULL),
(129, '	Лаборатория	 ', 12, NULL, NULL),
(130, '	Компрессорная станция	 ', 12, NULL, NULL),
(131, '	Кислородная станция	 ', 12, NULL, NULL),
(132, '	Холодильная станция (установка)	 ', 12, NULL, NULL),
(133, '	Полигон твёрдых отходов	 ', 12, NULL, NULL),
(134, '	Эстакады и галереи	 ', 12, NULL, NULL),
(135, '	Установка получения азота	 ', 12, NULL, NULL),
(136, '	Вахтовый посёлок	 ', 13, NULL, NULL),
(137, '	Административно-бытовой комплекс	 ', 13, NULL, NULL),
(138, '	Административный корпус	 ', 13, NULL, NULL),
(139, '	Бытовой корпус	 ', 13, NULL, NULL),
(140, '	Жилой корпус	 ', 13, NULL, NULL),
(141, '	Гостиница	 ', 13, NULL, NULL),
(142, '	Столовая	 ', 13, NULL, NULL),
(143, '	Пешеходная галерея	 ', 13, NULL, NULL),
(144, '	Павильон ожидания	 ', 13, NULL, NULL),
(145, '	Объекты здравоохранения	 ', 13, NULL, NULL),
(146, '	Прачечная	 ', 13, NULL, NULL),
(147, '	Спортивно-оздоровительный комплекс	 ', 13, NULL, NULL),
(148, '	Коровник на 1200 голов	 ', 14, NULL, NULL),
(149, '	Завод по производству карбида кремния	 ', 15, NULL, NULL),
(150, '	Завод по производству микропорошков и керамоизделий	 ', 15, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `initial_authorization_documentations`
--

CREATE TABLE `initial_authorization_documentations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_issue` date NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `legal_forms`
--

CREATE TABLE `legal_forms` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `legal_forms`
--

INSERT INTO `legal_forms` (`id`, `name`, `full_name`, `created_at`, `updated_at`) VALUES
(1, 'ИП', 'Индивидуальный предприниматель', NULL, NULL),
(2, 'ООО', 'Общество с ограниченной ответственностью', NULL, NULL),
(3, 'АО', 'Акционерное общество', NULL, NULL),
(4, 'ПАО', 'Публичное акционерное общество', NULL, NULL),
(5, 'НКО', 'Некоммерческая организация', NULL, NULL),
(6, 'ОП', 'Обособленное подразделение', NULL, NULL),
(7, 'Иная', 'Иностранные компании', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(27, '2014_10_12_100000_create_password_reset_tokens_table', 1),
(28, '2014_10_12_100000_create_password_resets_table', 1),
(29, '2016_06_01_000001_create_oauth_auth_codes_table', 1),
(30, '2016_06_01_000002_create_oauth_access_tokens_table', 1),
(31, '2016_06_01_000003_create_oauth_refresh_tokens_table', 1),
(32, '2016_06_01_000004_create_oauth_clients_table', 1),
(33, '2016_06_01_000005_create_oauth_personal_access_clients_table', 1),
(34, '2019_08_19_000000_create_failed_jobs_table', 1),
(35, '2019_12_14_000001_create_personal_access_tokens_table', 1),
(36, '2024_02_05_194140_create_positions_table', 1),
(37, '2024_02_05_194159_create_contacts_table', 1),
(38, '2024_02_06_133202_create_roles_table', 1),
(39, '2024_02_06_133815_create_user_table', 1),
(40, '2024_02_08_074952_create_banks_table', 2),
(41, '2024_02_08_075047_create_biks_table', 2),
(42, '2024_02_08_075126_create_addresses_table', 2),
(43, '2024_02_08_075214_create_educational_institutions_table', 2),
(44, '2024_02_08_075227_create_education_qualifications_table', 2),
(45, '2024_02_08_075347_create_education_specializations_table', 2),
(46, '2024_02_08_075436_create_type_education_documents_table', 2),
(47, '2024_02_08_075521_create_type_facilities_table', 2),
(48, '2024_02_08_075606_create_facilities_table', 2),
(49, '2024_02_08_075709_create_initial_authorization_documentations_table', 2),
(50, '2024_02_08_075735_create_legal_forms_table', 2),
(55, '2024_02_08_075807_create_notes_table', 3),
(56, '2024_02_08_075921_create_passport_place_issues_table', 3),
(57, '2024_02_08_075925_create_passports_table', 3),
(58, '2024_02_08_080000_create_person_table', 3),
(59, '2024_02_08_080045_create_organizations_table', 3),
(60, '2024_02_08_080156_create_project_statuses_table', 3),
(61, '2024_02_08_080214_create_type_project_documents_table', 3),
(62, '2024_02_08_080256_create_projects_table', 3),
(63, '2024_02_08_080521_create_stages_table', 3),
(64, '2024_02_08_080553_create_project_stages_table', 3),
(65, '2024_02_08_084012_create_educations_table', 4),
(66, '2024_02_08_084013_create_education_people_table', 4),
(67, '2024_02_08_163809_update_organizations_table', 5),
(68, '2024_02_09_101939_update_projects_table', 6),
(70, '2024_02_09_102718_update_projects_table', 7),
(71, '2024_02_09_121005_update_contacts_table', 8);

-- --------------------------------------------------------

--
-- Table structure for table `notes`
--

CREATE TABLE `notes` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `oauth_access_tokens`
--

CREATE TABLE `oauth_access_tokens` (
  `id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `client_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `scopes` text COLLATE utf8mb4_unicode_ci,
  `revoked` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `expires_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `oauth_access_tokens`
--

INSERT INTO `oauth_access_tokens` (`id`, `user_id`, `client_id`, `name`, `scopes`, `revoked`, `created_at`, `updated_at`, `expires_at`) VALUES
('01029ba0fd2fbcfdd731781eedb9226cae7ec52cfcecc13b2fb298f345b370e258ca7f7a4807dcd0', 7, 4, 'authToken', '[]', 0, '2024-02-07 02:28:10', '2024-02-07 02:28:10', '2025-02-07 09:28:10'),
('0550288565fa5ca5c9bb6e4e021b0a1aab477f54c6ce54a7e20a02cca2a5c23ce8301605910185d5', 21, 4, 'authToken', '[]', 0, '2024-02-08 08:20:29', '2024-02-08 08:20:29', '2025-02-08 15:20:29'),
('06afd998b5a9e4aff2babe2d1cb8a234e64ebdd1b8ce58c5cffd42af5db9a579eac53926717e007e', 21, 4, 'authToken', '[]', 0, '2024-02-08 06:59:42', '2024-02-08 06:59:42', '2025-02-08 13:59:42'),
('078218f6f80780ce182d1cc22d3bbd1abec3074e399ad974edc07860acfd3cd2b0ccbd3c2e2df143', 21, 4, 'authToken', '[]', 0, '2024-02-09 10:03:09', '2024-02-09 10:03:09', '2025-02-09 17:03:09'),
('0857cc997100685d76db89e51578dd384c9fbd08a6112b41cad2191dd9af33a825ed349f87c74e53', 7, 4, 'authToken', '[]', 0, '2024-02-07 01:58:49', '2024-02-07 01:58:49', '2025-02-07 08:58:49'),
('09e0e934ccfc01ca305cdb106502760422a8292b28755b380983d4d264c2253d819828c13ccc3db1', 21, 4, 'authToken', '[]', 0, '2024-02-07 08:13:28', '2024-02-07 08:13:28', '2025-02-07 15:13:28'),
('0e83632b3aa4367f672a997407122084ef41f8ad2a84ecaaf62691c6470b20c88ac879521e036c2f', 4, 2, 'authToken', '[]', 0, '2024-02-06 07:51:49', '2024-02-06 07:51:49', '2025-02-06 14:51:49'),
('13c081fcc747df4b44d7360b18fb97496546bc79d9ba4c3115225b414a5a4b5343c3ac8b2e52623b', 21, 4, 'authToken', '[]', 0, '2024-02-08 08:21:01', '2024-02-08 08:21:01', '2025-02-08 15:21:01'),
('13cdeba73b377088cfe9eba3e67d4f7df9ceba817e101e74bcfb7a050e941fc6aab4375301e0802a', 21, 4, 'authToken', '[]', 0, '2024-02-07 02:54:24', '2024-02-07 02:54:24', '2025-02-07 09:54:24'),
('15279f733485f11c8ad5dd3252d068ab3da043fe579bb642ab366b7135af56fcf636d1fd315d4fc4', 3, 2, 'authToken', '[]', 0, '2024-02-06 07:41:42', '2024-02-06 07:41:42', '2025-02-06 14:41:42'),
('18d522ff623c9482498283ac981781fd0d789b2d635f5323967611f36567996ae29b228e2c37d0ca', 1, 2, 'authToken', '[]', 0, '2024-02-06 07:14:32', '2024-02-06 07:14:32', '2025-02-06 14:14:32'),
('1ba5764c8bf3c9991c87206586904d02c57a85ee8cd51d2353e5a9b6d1e260316e446199e933706f', 7, 4, 'authToken', '[]', 0, '2024-02-07 02:27:39', '2024-02-07 02:27:39', '2025-02-07 09:27:39'),
('243fd85b32c1a4e567f3ff6975adf8d27dd8a7d3e364433a06a84907d416da2f898b7a0b84aa992c', 21, 4, 'authToken', '[]', 0, '2024-02-07 11:51:21', '2024-02-07 11:51:21', '2025-02-07 18:51:21'),
('26219817a833f0d846f4ac581f8b6ce851386838d9bc6084620924ef37af097516a937072e75c15d', 21, 4, 'authToken', '[]', 0, '2024-02-07 11:24:06', '2024-02-07 11:24:06', '2025-02-07 18:24:06'),
('2a670d95000b5feda3591502a35d4af2c9c27652da27e481052f714acddc385b22359a0d2a62b5f7', 21, 4, 'authToken', '[]', 0, '2024-02-09 17:43:01', '2024-02-09 17:43:01', '2025-02-10 00:43:01'),
('2b083114f2f5aae7dd1da982db610901d13e9ec2d7632f338a82b86c315c12923cfc160ffddb6cdf', 7, 4, 'authToken', '[]', 0, '2024-02-07 01:58:18', '2024-02-07 01:58:18', '2025-02-07 08:58:18'),
('2cc78a0a54a72366641469cce00c2001d4616a1c15da9b880c9006b6c12e1ec1d4eb7a5b72ed8fb7', 21, 4, 'authToken', '[]', 0, '2024-02-10 05:14:09', '2024-02-10 05:14:09', '2025-02-10 12:14:09'),
('2ed9155ed5e435ed51e1db6b7a9f2c35589a09a3d2925328e9363347b6bdb374478c14309d276394', 7, 4, 'authToken', '[]', 0, '2024-02-07 02:37:56', '2024-02-07 02:37:56', '2025-02-07 09:37:56'),
('34054251670edc8c2327a1f98048e7546493f07297fff37002cfa7fdb6cc296c8cfd0521e68cdb19', 7, 4, 'authToken', '[]', 0, '2024-02-07 02:15:02', '2024-02-07 02:15:02', '2025-02-07 09:15:02'),
('3a23ce61ca27fdfd2f89fa9ac56bc14af3238477f35947fee4f031a3aa5cdf5963b0be94767c0b39', 5, 2, 'authToken', '[]', 0, '2024-02-06 08:17:12', '2024-02-06 08:17:12', '2025-02-06 15:17:12'),
('3ca35ed112179a6c97294faf90ed48e1638cd5ed541107bc11cb56a3516ab7f12e25da2ce9c4e8aa', 21, 4, 'authToken', '[]', 0, '2024-02-07 11:57:25', '2024-02-07 11:57:25', '2025-02-07 18:57:25'),
('3cfec0693c76f813b22f12feab14b15cfec4ecb2711aca7f2efa049ba9d5eb729dade4835053d7dc', 7, 4, 'authToken', '[]', 0, '2024-02-07 02:00:43', '2024-02-07 02:00:43', '2025-02-07 09:00:43'),
('4323cc1bc5dd002b7ed8d1438d3d36a56ce9614ddfc4998fb740797374609f759671f62e8fa60922', 8, 4, 'authToken', '[]', 0, '2024-02-06 08:49:42', '2024-02-06 08:49:42', '2025-02-06 15:49:42'),
('43ed72a5bc736c0a2149503a8721e328c628cbea6505d0bf2f29561ed4471611551407df01dbc5e4', 21, 4, 'authToken', '[]', 0, '2024-02-08 07:10:56', '2024-02-08 07:10:56', '2025-02-08 14:10:56'),
('46477b724234602a1313617b66024d2586c81afa9ceb3e6eaa13921d786cef91cafffbec0a530a1d', 21, 4, 'authToken', '[]', 0, '2024-02-07 08:34:34', '2024-02-07 08:34:34', '2025-02-07 15:34:34'),
('471bc57f2d81b7af474f52314a97e71d7447d37dfddb91aff48cc9c739d6c3d49893069b040f314b', 21, 4, 'authToken', '[]', 0, '2024-02-10 04:21:22', '2024-02-10 04:21:22', '2025-02-10 11:21:22'),
('48eead16c4ebe4c153ddef40b5a63cc4f4871fa2cf28b6c932ba9b509b199bafb4e6dd7d26cc40d2', 7, 4, 'authToken', '[]', 0, '2024-02-07 02:06:07', '2024-02-07 02:06:07', '2025-02-07 09:06:07'),
('4b8bf8a3b1b6f50eda26d386bf2a977d29df94c724605df2fe1f1fa68cbd7deb4bf438fe2862164d', 7, 4, 'authToken', '[]', 0, '2024-02-07 02:47:47', '2024-02-07 02:47:47', '2025-02-07 09:47:47'),
('5101570db06f827c9e4184cfc2414a9fa2100a49341f6aae4931efef531b4459e539b05c52404a66', 21, 4, 'authToken', '[]', 0, '2024-02-07 11:12:11', '2024-02-07 11:12:11', '2025-02-07 18:12:11'),
('5248073632e1ff737e2397c7be3430edcbd310c336facd674b8e10f7e4d74f510d6027185be4c37b', 21, 4, 'authToken', '[]', 0, '2024-02-07 02:54:30', '2024-02-07 02:54:30', '2025-02-07 09:54:30'),
('56441ac843a510bd7aa290f537e961878a65537778ab52f381bb40a58f326126472306e6b7f10c65', 21, 4, 'authToken', '[]', 0, '2024-02-07 08:34:38', '2024-02-07 08:34:38', '2025-02-07 15:34:38'),
('59d524e9ef2ef7bed29263c8718e40e14b62ca7ab8b673e4eacbd58e74fb1f83963c2dfeb23820eb', 21, 4, 'authToken', '[]', 0, '2024-02-07 05:48:29', '2024-02-07 05:48:29', '2025-02-07 12:48:29'),
('5bbac74ac8a49f5c8dfca84b5f51165c1b4d8cfcf202eca3cb964fd8250616088868f06995be1be1', 21, 4, 'authToken', '[]', 0, '2024-02-07 05:17:25', '2024-02-07 05:17:25', '2025-02-07 12:17:25'),
('6a8bd8d26d6c9e6ef24c9d9f9844d4671ed738595bc7e656212371830984fc691f644b4bc36a358b', 16, 4, 'authToken', '[]', 0, '2024-02-07 00:46:14', '2024-02-07 00:46:14', '2025-02-07 07:46:14'),
('6e9c765197c2a0bebcabdbb891d9e40b67a0c4e026f0c1fd063fb65addce835e28bb15f7d040ca51', 7, 4, 'authToken', '[]', 0, '2024-02-07 02:44:59', '2024-02-07 02:44:59', '2025-02-07 09:44:59'),
('712686c9e9320a8cb21bfb891de5fe84e25d5b17116ad93e787fa3b02c467832d28d91189b2066e1', 13, 4, 'authToken', '[]', 0, '2024-02-07 00:34:07', '2024-02-07 00:34:07', '2025-02-07 07:34:07'),
('7500fdc98f58d4e4ef75059e69e3149d5e14aa83e3cc994485439837b1486aff0e7ddca539189bc1', 21, 4, 'authToken', '[]', 0, '2024-02-07 08:55:36', '2024-02-07 08:55:36', '2025-02-07 15:55:36'),
('7791a5c4cef1f5306420f3c438bdb8db2d3d69ee680ee960e40ca0d1579d746a2ba5bb2d14f60a4b', 7, 4, 'authToken', '[]', 0, '2024-02-07 02:04:14', '2024-02-07 02:04:14', '2025-02-07 09:04:14'),
('78da702255f725a78172b4582cedda82eb412e1f347efbc3f51d1239bf5147dbb7519288a00207e8', 7, 4, 'authToken', '[]', 0, '2024-02-07 02:39:43', '2024-02-07 02:39:43', '2025-02-07 09:39:43'),
('7ea18df0549cb4a49503669b054552abf3c1a71c5ed3b8f5e9018c96201889496b93bd5d40bcf1e6', 21, 4, 'authToken', '[]', 0, '2024-02-07 08:56:44', '2024-02-07 08:56:44', '2025-02-07 15:56:44'),
('7f39a3ade6fc2e5dcf787aaae952a68e58974748839a06828a524f7ca27038b328cfc427177054e6', 21, 4, 'authToken', '[]', 0, '2024-02-07 12:13:45', '2024-02-07 12:13:45', '2025-02-07 19:13:45'),
('806eda014b77a29333127431c852bef08646afe7331ac6894bed062dedc17dd4904a7bcae1003728', 21, 4, 'authToken', '[]', 0, '2024-02-07 08:09:50', '2024-02-07 08:09:50', '2025-02-07 15:09:50'),
('812a0b57dbe22bba3686b622a4d58a3c009b059ed20c2e4e75eaeafa0ea86cc0ed9b02373d78e360', 14, 4, 'authToken', '[]', 0, '2024-02-07 00:40:37', '2024-02-07 00:40:37', '2025-02-07 07:40:37'),
('87a13b110a85c7577f536a2e1b54d892c96aa5fa224b79cd9d229cfb5a84f9a0f89dc9c2c3c6dc28', 20, 4, 'authToken', '[]', 0, '2024-02-07 01:05:53', '2024-02-07 01:05:53', '2025-02-07 08:05:53'),
('8956bc1343b6ada520b5065b269dc4f0536d0127bd3bb7281f3b507f181f971090f6f3245d86c19a', 7, 4, 'authToken', '[]', 0, '2024-02-07 01:59:27', '2024-02-07 01:59:27', '2025-02-07 08:59:27'),
('8c382c7742c143f84bacb93472d0a84525ae55b08894ad09811e0d00e198bd1cfcda98a2cf4fad05', 11, 4, 'authToken', '[]', 0, '2024-02-06 10:00:54', '2024-02-06 10:00:54', '2025-02-06 17:00:54'),
('8da6b624c10e5f251dc77e67b315826fde2a81ceecee650563bfd8384cff10b5cd350aa4029b764e', 21, 4, 'authToken', '[]', 0, '2024-02-07 08:10:18', '2024-02-07 08:10:18', '2025-02-07 15:10:18'),
('8e7cd5d873edaf7ab82cad6b6ab40d98b0ca830dadaf5342ddbb28e43d1b3f6ab789735b83ceb24e', 15, 4, 'authToken', '[]', 0, '2024-02-07 00:41:17', '2024-02-07 00:41:17', '2025-02-07 07:41:17'),
('8efac0c6a59880455e4614d11974a1ecc64fcea5f480f320d73faad0b32a710f601d24f3f5a40c14', 21, 4, 'authToken', '[]', 0, '2024-02-07 08:10:39', '2024-02-07 08:10:39', '2025-02-07 15:10:39'),
('906cb981b29ea5ac9d6f84bb7a01913ee663e86677ffcc28ebe33b50d37a4c85c8e7e46588222b7f', 22, 4, 'authToken', '[]', 0, '2024-02-07 07:58:12', '2024-02-07 07:58:12', '2025-02-07 14:58:12'),
('9547998f84a98479a245d29a34f196cf65a08fa35618da8729a217a00c980c4627e3ceece1ff1274', 21, 4, 'authToken', '[]', 0, '2024-02-08 08:19:15', '2024-02-08 08:19:15', '2025-02-08 15:19:15'),
('970a3adfb49cf9859941802ef2b04dbbb1d1b5d73ad507f61b6ebd22d5ac213057c0740a28c3ce0f', 12, 4, 'authToken', '[]', 0, '2024-02-06 10:46:07', '2024-02-06 10:46:07', '2025-02-06 17:46:07'),
('98fe04d287f951b58ae55aa8c9c40582f62bbb64666ca946b0446539e36511e23c8ca045b5f8bad9', 21, 4, 'authToken', '[]', 0, '2024-02-07 05:17:36', '2024-02-07 05:17:36', '2025-02-07 12:17:36'),
('a14fa06081ef5662d4ebc788952d9b4ffe94f980b06f27b7b7ea50448a1ed241312251e7ad424d70', 18, 4, 'authToken', '[]', 0, '2024-02-07 00:52:02', '2024-02-07 00:52:02', '2025-02-07 07:52:02'),
('a59ce0f514450ec9671e5030a54e1b3206d82e5b64c659957dd4ec577e5ed2002c9cba4a10535bea', 7, 4, 'authToken', '[]', 0, '2024-02-07 02:30:32', '2024-02-07 02:30:32', '2025-02-07 09:30:32'),
('a777fa6c72a6f27474848c985bc34824382a40c6e5c5a63bb4a08aeefcceea01e0690e24d5420b6c', 21, 4, 'authToken', '[]', 0, '2024-02-07 08:14:06', '2024-02-07 08:14:06', '2025-02-07 15:14:06'),
('a88bbb633f00a98a4ad5933c988f34ba033506ae8dd1ad45dbd01c883a80675168aca40227f855b6', 21, 4, 'authToken', '[]', 0, '2024-02-07 12:10:05', '2024-02-07 12:10:05', '2025-02-07 19:10:05'),
('ae9a8d345596b28a73644f0a9027e8db88bd20d826af0fed8c016e22093756ee1e75c33993a947ab', 21, 4, 'authToken', '[]', 0, '2024-02-09 10:08:45', '2024-02-09 10:08:45', '2025-02-09 17:08:45'),
('b22925b2ca1ce28cc9b36df73797da3af043214eee91c7757b6ba228380a0047b21d60a5f4ced6cd', 7, 4, 'authToken', '[]', 0, '2024-02-07 02:30:14', '2024-02-07 02:30:14', '2025-02-07 09:30:14'),
('b3f23b0c88ddb7c5367a5a3175b9758538d9e3463ceab1281cfb100bef47ec1885057ddfdf0981a5', 7, 4, 'authToken', '[]', 0, '2024-02-07 02:44:56', '2024-02-07 02:44:56', '2025-02-07 09:44:56'),
('b4989c697aaf91907be66c4a8ac59854e73e1a0b3d0737cd274aed0034c6beacd2187c6783205e61', 21, 4, 'authToken', '[]', 0, '2024-02-07 08:09:20', '2024-02-07 08:09:20', '2025-02-07 15:09:20'),
('b50aa2506eeae2a90873b4ed707e27c3155f75062ce86e433785e7f218ea7ce20ac9b11a5986dacb', 7, 4, 'authToken', '[]', 0, '2024-02-07 02:04:58', '2024-02-07 02:04:58', '2025-02-07 09:04:58'),
('b8af84ccaf5e80b8e1d3a2d0b3187eea24563d82c9a3b5da5f06fb8174e0170efdaeda5cfdc235de', 7, 4, 'authToken', '[]', 0, '2024-02-07 08:55:58', '2024-02-07 08:55:58', '2025-02-07 15:55:58'),
('bc10b80b536ca2b813ef4d998cd834465f96f8ff407996fb33bb868e87fe0d35d48677d3b6049cbd', 21, 4, 'authToken', '[]', 0, '2024-02-07 05:23:48', '2024-02-07 05:23:49', '2025-02-07 12:23:48'),
('befd6621c123d22765fe448ec53709026ca29e9b6396b03cd3573b048505f23b2a1f0695063f1bd5', 7, 4, 'authToken', '[]', 0, '2024-02-07 02:33:40', '2024-02-07 02:33:40', '2025-02-07 09:33:40'),
('c76aa09afa85219c3146e210a4a37ecebd74fc744858941baea2f6f0d3311d9be1d9b2b766ea40a0', 21, 4, 'authToken', '[]', 0, '2024-02-07 05:39:12', '2024-02-07 05:39:12', '2025-02-07 12:39:12'),
('c844d2ee625bf766da424d4200ec1e988da836117c929d6e22b70ca21c093a19d4e1994b410adfbf', 7, 4, 'authToken', '[]', 0, '2024-02-07 02:47:13', '2024-02-07 02:47:13', '2025-02-07 09:47:13'),
('c9da68f4b59c41339142042e89d208137c15598bfd52854b52c0aee93cc97fe8449cb89c7a7562f0', 7, 4, 'authToken', '[]', 0, '2024-02-07 02:42:50', '2024-02-07 02:42:50', '2025-02-07 09:42:50'),
('cc66c2f6054b84506830fc47e9b16362659287202e2ffbcc0f3836aee53946d63d4c4623a8b8c272', 21, 4, 'authToken', '[]', 0, '2024-02-07 11:51:39', '2024-02-07 11:51:39', '2025-02-07 18:51:39'),
('ce22c18d558bb10224a3eca90b798ebe50ba0b4daefb70805cfa2f720d29a7ca46e1a751e63fc1d3', 21, 4, 'authToken', '[]', 0, '2024-02-08 06:52:12', '2024-02-08 06:52:12', '2025-02-08 13:52:12'),
('d1d5d6a5d14e129f500b4f6ce5158e2d2f4e2a1f5c3f9258c4a46e85d32d25a56f380f2fb594c9df', 21, 4, 'authToken', '[]', 0, '2024-02-07 07:59:16', '2024-02-07 07:59:16', '2025-02-07 14:59:16'),
('d2bc5087ddcefca592cd37bfa3245c1222b3b55ff6c404bf7ba0a9dbd7f03fbec4a4c5bcd7e2725c', 7, 4, 'authToken', '[]', 0, '2024-02-07 02:05:18', '2024-02-07 02:05:18', '2025-02-07 09:05:18'),
('d2fb864f29aae63574f651db563ec4b360ab1fc7fe0cd85d818ffcd1c39b661655bfa57ce90a3b93', 7, 4, 'authToken', '[]', 0, '2024-02-07 02:41:27', '2024-02-07 02:41:27', '2025-02-07 09:41:27'),
('d3e9b9a61d2f7121e02ea1a08068590df53a86cc0ea14cd45457ef5e312173213ecc9f2edb37d826', 7, 4, 'authToken', '[]', 0, '2024-02-07 02:06:11', '2024-02-07 02:06:11', '2025-02-07 09:06:11'),
('d62be23b5c4b874c130305ac52183058e8a7423e1dbe50cc529ca5ad5370607967b2db40e976fe95', 21, 4, 'authToken', '[]', 0, '2024-02-07 08:09:58', '2024-02-07 08:09:58', '2025-02-07 15:09:58'),
('d8722f70d36683cf78d63f0319762be9a69f2f18025d0628f2686144ea199c21da3a74b78258775a', 21, 4, 'authToken', '[]', 0, '2024-02-11 07:55:00', '2024-02-11 07:55:00', '2025-02-11 14:55:00'),
('e13da9bf5b0ec91d0b95fe33ced7058d2d551fdf85d34832371dae61ca0fcb9407378175bde2d019', 17, 4, 'authToken', '[]', 0, '2024-02-07 00:49:51', '2024-02-07 00:49:51', '2025-02-07 07:49:51'),
('e36a000d1cdb2a8b630f540b77f09c17a4aeab3a3e35a9e6ae4aea5ddedae16b60e0a1ca35fcbc6b', 21, 4, 'authToken', '[]', 0, '2024-02-08 03:35:00', '2024-02-08 03:35:00', '2025-02-08 10:35:00'),
('ec1e98df251f398049f5c3a4e304d58b648feafde861fe99f03faeddb332f46522df0219dccfb486', 21, 4, 'authToken', '[]', 0, '2024-02-07 05:25:52', '2024-02-07 05:25:52', '2025-02-07 12:25:52'),
('ef8799f4c9babe821f5be52e37b069624d52f0e76fc9a0ff5d7e08779b3a696c566027f51563e473', 7, 4, 'authToken', '[]', 0, '2024-02-07 01:57:53', '2024-02-07 01:57:53', '2025-02-07 08:57:53'),
('f662103031364914d0f1e7287947871072ce78f9feda51f09f2c05ecfc661ad32ff2bdbf0ca63245', 21, 4, 'authToken', '[]', 0, '2024-02-09 17:43:43', '2024-02-09 17:43:43', '2025-02-10 00:43:43'),
('f7aa93dd99a896dec3201fc4acc7a10c56cea7a98f7153806fc0d49ab52b1f5ddd374d8c5768d7a8', 24, 4, 'authToken', '[]', 0, '2024-02-09 17:52:25', '2024-02-09 17:52:25', '2025-02-10 00:52:25'),
('f91e4ed64ca13466e27a5322a9e09292bf218ba97b6374b094dd387e2bcd2d5c4ae033d6719600cf', 21, 4, 'authToken', '[]', 0, '2024-02-07 08:02:35', '2024-02-07 08:02:35', '2025-02-07 15:02:35'),
('fad3bec2cc4f32be93e9e876d0817534cdcc6d34036f143e639ed20218a6f318f283a28e2bf99163', 7, 4, 'authToken', '[]', 0, '2024-02-06 08:48:23', '2024-02-06 08:48:23', '2025-02-06 15:48:23'),
('fd95301060c10ec8487d30a16fb79c1ffbe6827d7c75d32af1518e668032de8a104b6b9e551240d1', 7, 4, 'authToken', '[]', 0, '2024-02-07 02:14:41', '2024-02-07 02:14:41', '2025-02-07 09:14:41'),
('fe362129ddde0c7ab77a313b0653d39e87ee70682150ed4f4645d5b24130016191c06bba14f9744e', 21, 4, 'authToken', '[]', 0, '2024-02-08 08:21:56', '2024-02-08 08:21:56', '2025-02-08 15:21:56');

-- --------------------------------------------------------

--
-- Table structure for table `oauth_auth_codes`
--

CREATE TABLE `oauth_auth_codes` (
  `id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `client_id` bigint(20) UNSIGNED NOT NULL,
  `scopes` text COLLATE utf8mb4_unicode_ci,
  `revoked` tinyint(1) NOT NULL,
  `expires_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `oauth_clients`
--

CREATE TABLE `oauth_clients` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `secret` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `provider` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `redirect` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `personal_access_client` tinyint(1) NOT NULL,
  `password_client` tinyint(1) NOT NULL,
  `revoked` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `oauth_clients`
--

INSERT INTO `oauth_clients` (`id`, `user_id`, `name`, `secret`, `provider`, `redirect`, `personal_access_client`, `password_client`, `revoked`, `created_at`, `updated_at`) VALUES
(1, NULL, 'Григорий', 'tk0aNjfMPItnIXKGGYk56u1eSwo13YqUbtxh4wON', NULL, 'а', 0, 0, 0, '2024-02-06 06:45:22', '2024-02-06 06:45:22'),
(2, NULL, 'Laravel Personal Access Client', 'HzHbbmmDnkGVHUUsxAvAlE68UECs3H9OEUrd8XD3', NULL, 'http://localhost', 1, 0, 0, '2024-02-06 07:06:36', '2024-02-06 07:06:36'),
(3, NULL, 'Laravel Password Grant Client', 'IQt8nRZXjaXxHZYEbNQgs6K7PzhLAj6ZbtO4t3W8', 'users', 'http://localhost', 0, 1, 0, '2024-02-06 07:06:36', '2024-02-06 07:06:36'),
(4, NULL, 'Laravel Personal Access Client', 'Aft6Bag2qkL3Ty4IZLf3qJEpatHxYbXb2Rt5uDoX', NULL, 'http://localhost', 1, 0, 0, '2024-02-06 08:27:43', '2024-02-06 08:27:43'),
(5, NULL, 'Laravel Password Grant Client', 'OK8gx1rgYaZ5S34J3b1tjqCbFWHrWr9RplSrKFFX', 'users', 'http://localhost', 0, 1, 0, '2024-02-06 08:27:43', '2024-02-06 08:27:43');

-- --------------------------------------------------------

--
-- Table structure for table `oauth_personal_access_clients`
--

CREATE TABLE `oauth_personal_access_clients` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `client_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `oauth_personal_access_clients`
--

INSERT INTO `oauth_personal_access_clients` (`id`, `client_id`, `created_at`, `updated_at`) VALUES
(1, 2, '2024-02-06 07:06:36', '2024-02-06 07:06:36'),
(2, 4, '2024-02-06 08:27:43', '2024-02-06 08:27:43');

-- --------------------------------------------------------

--
-- Table structure for table `oauth_refresh_tokens`
--

CREATE TABLE `oauth_refresh_tokens` (
  `id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `access_token_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `revoked` tinyint(1) NOT NULL,
  `expires_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `organizations`
--

CREATE TABLE `organizations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `legal_form_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address_legal_id` bigint(20) UNSIGNED DEFAULT NULL,
  `office_number_legal` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address_mail_id` bigint(20) UNSIGNED DEFAULT NULL,
  `office_number_mail` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fax_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `INN` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `OGRN` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `OKPO` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `KPP` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `BIK_id` bigint(20) UNSIGNED DEFAULT NULL,
  `payment_account` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `director_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `organizations`
--

INSERT INTO `organizations` (`id`, `legal_form_id`, `name`, `full_name`, `address_legal_id`, `office_number_legal`, `address_mail_id`, `office_number_mail`, `phone_number`, `fax_number`, `email`, `INN`, `OGRN`, `OKPO`, `KPP`, `BIK_id`, `payment_account`, `director_id`, `created_at`, `updated_at`) VALUES
(1, 3, 'Лебединский ГОК', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(2, 3, 'АПАТИТ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(3, 2, 'Перспектива', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(4, 2, 'Рудник \"Веселый\"', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(5, 2, 'ГЕОПОИСК', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(6, 3, 'Саралинский Рудник', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(7, 2, 'Старица', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(8, 2, 'НТЦ \"Геотехнология\"', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(9, 3, 'Твердосплав', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(10, 3, 'Искитимизвесть', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(11, 2, 'Интерминералс', 'ООО Интерминералс', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(12, 2, 'УСТЬ-КАМЕНСКИЙ КАРЬЕР', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(13, 2, 'СТАТУС+', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(14, 7, 'Янтайская компания горнодобывающего оборудования «Дзинь Пен»', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(15, 2, 'АлтайНерудПром', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(16, 2, 'Ресурсы Малого Хингана', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(17, 2, 'Каменка', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(18, 2, 'АГАТ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(19, 2, 'ГК «ТОМС»', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(20, 4, 'ГМК «Норильский никель»', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(21, 2, 'Инертные материалы', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(22, 2, 'Геопроминвест', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(23, 2, 'ЗССМ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(24, 2, 'ГИТП', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(25, 2, 'неиз', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(26, 2, 'РК Катунь', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `passports`
--

CREATE TABLE `passports` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `firstname` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lastname` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `patronymic` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `serial` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `passport_place_issue_id` bigint(20) UNSIGNED NOT NULL,
  `birth_date` date NOT NULL,
  `date` date NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `passport_place_issues`
--

CREATE TABLE `passport_place_issues` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
--

CREATE TABLE `password_resets` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `persons`
--

CREATE TABLE `persons` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `passport_id` bigint(20) UNSIGNED NOT NULL,
  `SHILS` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `INN` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_account` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_sibnipi` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bank_id` bigint(20) UNSIGNED NOT NULL,
  `bik_id` bigint(20) UNSIGNED NOT NULL,
  `note_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `positions`
--

CREATE TABLE `positions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `okpd_code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `okz_code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `positions`
--

INSERT INTO `positions` (`id`, `name`, `okpd_code`, `okz_code`, `created_at`, `updated_at`) VALUES
(1, 'Name1', 'OKPD_code1', 'OKZ_code1', NULL, NULL),
(2, 'Name2', 'OKPD_code2', 'OKZ_code2', NULL, NULL),
(3, 'Name3', 'OKPD_code3', 'OKZ_code3', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `organization_customer_id` bigint(20) UNSIGNED DEFAULT NULL,
  `type_project_document_id` bigint(20) UNSIGNED DEFAULT NULL,
  `facility_id` bigint(20) UNSIGNED DEFAULT NULL,
  `date_signing` date DEFAULT NULL,
  `IAD_id` bigint(20) UNSIGNED DEFAULT NULL,
  `duration` int(11) DEFAULT NULL,
  `date_end` date DEFAULT NULL,
  `status_id` bigint(20) UNSIGNED DEFAULT NULL,
  `date_completion` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`id`, `number`, `name`, `organization_customer_id`, `type_project_document_id`, `facility_id`, `date_signing`, `IAD_id`, `duration`, `date_end`, `status_id`, `date_completion`, `created_at`, `updated_at`) VALUES
(112, '	19-01	  ', '	«Определение максимально-допустимой высоты развала с учетом применяемого экскаваторного оборудования, физико-механических свойств горных пород, рабочих и устойчивых углов»	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(113, NULL, '	«Определить параметры рабочих и нерабочих площадок, уступов по породам рыхлой вскрыши при отработке экскаваторным оборудованием в районе переотложенных пород полиогена»	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(114, NULL, '	«Сравнительный анализ содержания продуктов распада взрывчатых веществ, нефтепродуктов, нитратов в пробах горной массы на территории объекта и фоновых концентраций этих веществ».	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(115, NULL, '	«Проект геологоразведочных работ по участку недр «Гольцовская лицензионная площадь»	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(116, NULL, '	Технический проект «Разработка Синюхинского золоторудного месторождения подземным способом»	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(117, NULL, '	«Создание комплекта карт геологического содержания на площадь Горловского угольного бассейна на основе ретроспективных данных с использованием ГИС технологий (Новосибирская область)	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(118, NULL, '	«Обследование и оценка технического состояния несущих и ограждающих строительных конструкций объекта: Обогатительная фабрика Саралинского рудника»	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(119, NULL, '	Выполнение кадастровых работ по изготовлению технического плана объекта капитального строительства, расположенного в границах с.Приисковое, Орджоникидзевского района, республики Хакасия	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(120, NULL, '	«Обследование состояния напорных дамб, шандорных колодцев, пульпопровода хвостохранилища Саралинской обогатительной фабрики»	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(121, NULL, '	«Разработка декларации промышленной безопасности Базисного склада ВМ транспортно-складского цеха КФ АО «Апатит»	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(122, NULL, '	«Разработка рабочей документации для капитального ремонта Саралинской ЗИФ»	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(123, NULL, '	«Технический проект на опытно-промышленную отработку техногенных отложений и забалансовых запасов россыпного золота по участку недр «Гольцовская лицензионная площадь»	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(124, NULL, '	«Геолого-методическое сопровождение проекта на выполнение геологоразведочных работ по определению и геометризации запасов россыпного золота промышленных категорий С1 и С2 «Гольцовской лицензионной площади», на месторождениях: р. Быстрая, р. Камешкова, руч	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(125, NULL, '	«Технический проект разработки песчано-гравийных материалов на участке недр «Месторождение Кучино». Дополнение №1.»	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(126, NULL, '	Разработка проектной документации «Карта № 5 хвостохранилища фабрики обогатительной цветных металлов «Дуэтская» ООО Рудник «Дуэт»	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(127, NULL, '	«Исследование на обогатимость лежалых хвостов руды Синюхинского месторождения с целью извлечения из них золота и серебра, и дальнейшее обезвреживания вторичных хвостов, для определения  оптимальных параметров   сорбционного выщелачивания   лежалых хвостов	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(128, NULL, '	«Проект отработки запасов Холтосонского месторождения вольфрама гор. 1230-1440м»»	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(129, NULL, '	«Техническое перевооружение Искитимского-1 месторождения известняков»	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(130, NULL, '	«Техническое перевооружение гидротехнического сооружения хвостохранилища наливного типа Саралинской золотоизвлекательной фабрики» и «рабочая документация на техническое перевооружение гидротехнического сооружения хвостохранилища наливного типа Саралинской	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(131, NULL, '	«Техническое перевооружение золотоизвлекательной фабрики Саралинского рудника» и «Рабочей документации на техническое перевооружение золотоизвлекательной фабрики Саралинского рудника»	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(132, NULL, '	«Отчет с подсчетом запасов «участка Центральный Южно-Кахозерского месторождения»»	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(133, NULL, '	Разработка технологического регламента по переработке лежалых хвостов руды Синюхинского месторождения 	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(134, NULL, '	Корректировка технологического регламента Саралинской золотоизвлекательной фабрики» 	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(135, NULL, '	Проект ГРР на флангах и глубоких горизонтах   месторождения Бараньевское в 2020-2022 гг. 	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(136, NULL, '	«Техническое перевооружение карьера «Сопка 7» Буготакской группы месторождений».	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(137, NULL, '	Подготовка материалов для разработки Обоснования безопасности опасного производственного объекта: «Подземный рудник «Бараньевский». 1-ая очередь» в части исключения дополнительного подогрева воздуха в зимний период. Организации и проведение экспертизы про	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(138, NULL, '	«Составление проекта на выполнение дополнительных геологоразведочных работ по определению и геометризации запасов россыпного золота промышленных категорий С1 и С2 на месторождениях: месторождение Танинское Оймяконский район Республика Саха (Якутия)». 	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(139, NULL, '	\"Технологический регламент по переработке лежалых хвостов переработки руды Синюхского месторождения с целью извлечения из них золота и серебра»\r\n\r\n\"	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(140, NULL, '	Технический надзор за строительством ГМЦ на  территории Хабаровского  края, Николаевский район, пром. площадка Белая гора.	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(141, NULL, '	\"«Технический проект на опытно-промышленную отработку забалансовых запасов и техногенных отложений россыпного золота по участку недр «Гольцовская лицензионная площадь».\r\nРазработка «Плана развития горных работ на 2021 год по участку река Камешкова, в рамках\"	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(142, NULL, '	Разработка проекта горного отвода на участке недр «Катковский-4»».	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(143, NULL, '	• Pазработка геологической документации «Анализ геологического строения площадей вдоль автодорог в Усть-Канском и Усть-Коксинском районах Республики Алтай и выделение на его основе потенциально пригодных участков недр для оценки и добычи строительного кам	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(144, NULL, '	Оценки и выдачи рекомендаций по корректировке технологии взрывной отбойки глубокими скважинами на подземных рудниках КФ АО «Апатит».	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(145, NULL, '	\"• Работы по ревизии проектной документации, рабочей документации, исполнительной документации;\r\n• Сбор материалов по технической документации технологического и вспомогательного оборудования;\r\n• Подготовка пакета документов для регистрации ОПО и ввода ОПО в\"	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(146, NULL, '	«Технический проект на добычу и переработку техногенных отложений Хинганского месторождения олова»	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(147, NULL, '	«Технический проект на отработку месторождения россыпного золота р. Каменка Верхняя».	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(148, NULL, '	\"• Проект СЗЗ по участку добычи строительного песка «Катковский-4»\r\n• Проект инвентаризации источников выбросов\r\n• Постановка объекта НВОС 3 категории на учет на региональном уровне \r\n• Кадастровые работы при разработке проекта СЗЗ и внесение границ в ЕГРН\r\n\"	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(149, '	19-01	  ', '	«Определение максимально-допустимой высоты развала с учетом применяемого экскаваторного оборудования, физико-механических свойств горных пород, рабочих и устойчивых углов»	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(150, NULL, '	«Определить параметры рабочих и нерабочих площадок, уступов по породам рыхлой вскрыши при отработке экскаваторным оборудованием в районе переотложенных пород полиогена»	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(151, NULL, '	«Сравнительный анализ содержания продуктов распада взрывчатых веществ, нефтепродуктов, нитратов в пробах горной массы на территории объекта и фоновых концентраций этих веществ».	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(152, NULL, '	«Проект геологоразведочных работ по участку недр «Гольцовская лицензионная площадь»	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(153, NULL, '	Технический проект «Разработка Синюхинского золоторудного месторождения подземным способом»	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(154, NULL, '	«Создание комплекта карт геологического содержания на площадь Горловского угольного бассейна на основе ретроспективных данных с использованием ГИС технологий (Новосибирская область)	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(155, NULL, '	«Обследование и оценка технического состояния несущих и ограждающих строительных конструкций объекта: Обогатительная фабрика Саралинского рудника»	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(156, NULL, '	Выполнение кадастровых работ по изготовлению технического плана объекта капитального строительства, расположенного в границах с.Приисковое, Орджоникидзевского района, республики Хакасия	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(157, NULL, '	«Обследование состояния напорных дамб, шандорных колодцев, пульпопровода хвостохранилища Саралинской обогатительной фабрики»	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(158, NULL, '	«Разработка декларации промышленной безопасности Базисного склада ВМ транспортно-складского цеха КФ АО «Апатит»	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(159, NULL, '	«Разработка рабочей документации для капитального ремонта Саралинской ЗИФ»	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(160, NULL, '	«Технический проект на опытно-промышленную отработку техногенных отложений и забалансовых запасов россыпного золота по участку недр «Гольцовская лицензионная площадь»	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(161, NULL, '	«Геолого-методическое сопровождение проекта на выполнение геологоразведочных работ по определению и геометризации запасов россыпного золота промышленных категорий С1 и С2 «Гольцовской лицензионной площади», на месторождениях: р. Быстрая, р. Камешкова, руч	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(162, NULL, '	«Технический проект разработки песчано-гравийных материалов на участке недр «Месторождение Кучино». Дополнение №1.»	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(163, NULL, '	Разработка проектной документации «Карта № 5 хвостохранилища фабрики обогатительной цветных металлов «Дуэтская» ООО Рудник «Дуэт»	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(164, NULL, '	«Исследование на обогатимость лежалых хвостов руды Синюхинского месторождения с целью извлечения из них золота и серебра, и дальнейшее обезвреживания вторичных хвостов, для определения  оптимальных параметров   сорбционного выщелачивания   лежалых хвостов	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(165, NULL, '	«Проект отработки запасов Холтосонского месторождения вольфрама гор. 1230-1440м»»	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(166, NULL, '	«Техническое перевооружение Искитимского-1 месторождения известняков»	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(167, NULL, '	«Техническое перевооружение гидротехнического сооружения хвостохранилища наливного типа Саралинской золотоизвлекательной фабрики» и «рабочая документация на техническое перевооружение гидротехнического сооружения хвостохранилища наливного типа Саралинской	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(168, NULL, '	«Техническое перевооружение золотоизвлекательной фабрики Саралинского рудника» и «Рабочей документации на техническое перевооружение золотоизвлекательной фабрики Саралинского рудника»	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(169, NULL, '	«Отчет с подсчетом запасов «участка Центральный Южно-Кахозерского месторождения»»	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(170, NULL, '	Разработка технологического регламента по переработке лежалых хвостов руды Синюхинского месторождения 	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(171, NULL, '	Корректировка технологического регламента Саралинской золотоизвлекательной фабрики» 	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(172, NULL, '	Проект ГРР на флангах и глубоких горизонтах   месторождения Бараньевское в 2020-2022 гг. 	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(173, NULL, '	«Техническое перевооружение карьера «Сопка 7» Буготакской группы месторождений».	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(174, NULL, '	Подготовка материалов для разработки Обоснования безопасности опасного производственного объекта: «Подземный рудник «Бараньевский». 1-ая очередь» в части исключения дополнительного подогрева воздуха в зимний период. Организации и проведение экспертизы про	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(175, NULL, '	«Составление проекта на выполнение дополнительных геологоразведочных работ по определению и геометризации запасов россыпного золота промышленных категорий С1 и С2 на месторождениях: месторождение Танинское Оймяконский район Республика Саха (Якутия)». 	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(176, NULL, '	\"Технологический регламент по переработке лежалых хвостов переработки руды Синюхского месторождения с целью извлечения из них золота и серебра»\r\n\r\n\"	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(177, NULL, '	Технический надзор за строительством ГМЦ на  территории Хабаровского  края, Николаевский район, пром. площадка Белая гора.	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(178, NULL, '	\"«Технический проект на опытно-промышленную отработку забалансовых запасов и техногенных отложений россыпного золота по участку недр «Гольцовская лицензионная площадь».\r\nРазработка «Плана развития горных работ на 2021 год по участку река Камешкова, в рамках\"	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(179, NULL, '	Разработка проекта горного отвода на участке недр «Катковский-4»».	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(180, NULL, '	• Pазработка геологической документации «Анализ геологического строения площадей вдоль автодорог в Усть-Канском и Усть-Коксинском районах Республики Алтай и выделение на его основе потенциально пригодных участков недр для оценки и добычи строительного кам	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(181, NULL, '	Оценки и выдачи рекомендаций по корректировке технологии взрывной отбойки глубокими скважинами на подземных рудниках КФ АО «Апатит».	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(182, NULL, '	\"• Работы по ревизии проектной документации, рабочей документации, исполнительной документации;\r\n• Сбор материалов по технической документации технологического и вспомогательного оборудования;\r\n• Подготовка пакета документов для регистрации ОПО и ввода ОПО в\"	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(183, NULL, '	«Технический проект на добычу и переработку техногенных отложений Хинганского месторождения олова»	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(184, NULL, '	«Технический проект на отработку месторождения россыпного золота р. Каменка Верхняя».	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(185, NULL, '	\"• Проект СЗЗ по участку добычи строительного песка «Катковский-4»\r\n• Проект инвентаризации источников выбросов\r\n• Постановка объекта НВОС 3 категории на учет на региональном уровне \r\n• Кадастровые работы при разработке проекта СЗЗ и внесение границ в ЕГРН\r\n\"	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(186, '	19-01	  ', '	«Определение максимально-допустимой высоты развала с учетом применяемого экскаваторного оборудования, физико-механических свойств горных пород, рабочих и устойчивых углов»	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(187, NULL, '	«Определить параметры рабочих и нерабочих площадок, уступов по породам рыхлой вскрыши при отработке экскаваторным оборудованием в районе переотложенных пород полиогена»	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(188, NULL, '	«Сравнительный анализ содержания продуктов распада взрывчатых веществ, нефтепродуктов, нитратов в пробах горной массы на территории объекта и фоновых концентраций этих веществ».	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(189, NULL, '	«Проект геологоразведочных работ по участку недр «Гольцовская лицензионная площадь»	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(190, NULL, '	Технический проект «Разработка Синюхинского золоторудного месторождения подземным способом»	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(191, NULL, '	«Создание комплекта карт геологического содержания на площадь Горловского угольного бассейна на основе ретроспективных данных с использованием ГИС технологий (Новосибирская область)	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(192, NULL, '	«Обследование и оценка технического состояния несущих и ограждающих строительных конструкций объекта: Обогатительная фабрика Саралинского рудника»	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(193, NULL, '	Выполнение кадастровых работ по изготовлению технического плана объекта капитального строительства, расположенного в границах с.Приисковое, Орджоникидзевского района, республики Хакасия	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(194, NULL, '	«Обследование состояния напорных дамб, шандорных колодцев, пульпопровода хвостохранилища Саралинской обогатительной фабрики»	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(195, NULL, '	«Разработка декларации промышленной безопасности Базисного склада ВМ транспортно-складского цеха КФ АО «Апатит»	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(196, NULL, '	«Разработка рабочей документации для капитального ремонта Саралинской ЗИФ»	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(197, NULL, '	«Технический проект на опытно-промышленную отработку техногенных отложений и забалансовых запасов россыпного золота по участку недр «Гольцовская лицензионная площадь»	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(198, NULL, '	«Геолого-методическое сопровождение проекта на выполнение геологоразведочных работ по определению и геометризации запасов россыпного золота промышленных категорий С1 и С2 «Гольцовской лицензионной площади», на месторождениях: р. Быстрая, р. Камешкова, руч	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(199, NULL, '	«Технический проект разработки песчано-гравийных материалов на участке недр «Месторождение Кучино». Дополнение №1.»	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(200, NULL, '	Разработка проектной документации «Карта № 5 хвостохранилища фабрики обогатительной цветных металлов «Дуэтская» ООО Рудник «Дуэт»	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(201, NULL, '	«Исследование на обогатимость лежалых хвостов руды Синюхинского месторождения с целью извлечения из них золота и серебра, и дальнейшее обезвреживания вторичных хвостов, для определения  оптимальных параметров   сорбционного выщелачивания   лежалых хвостов	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(202, NULL, '	«Проект отработки запасов Холтосонского месторождения вольфрама гор. 1230-1440м»»	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(203, NULL, '	«Техническое перевооружение Искитимского-1 месторождения известняков»	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(204, NULL, '	«Техническое перевооружение гидротехнического сооружения хвостохранилища наливного типа Саралинской золотоизвлекательной фабрики» и «рабочая документация на техническое перевооружение гидротехнического сооружения хвостохранилища наливного типа Саралинской	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(205, NULL, '	«Техническое перевооружение золотоизвлекательной фабрики Саралинского рудника» и «Рабочей документации на техническое перевооружение золотоизвлекательной фабрики Саралинского рудника»	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(206, NULL, '	«Отчет с подсчетом запасов «участка Центральный Южно-Кахозерского месторождения»»	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(207, NULL, '	Разработка технологического регламента по переработке лежалых хвостов руды Синюхинского месторождения 	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(208, NULL, '	Корректировка технологического регламента Саралинской золотоизвлекательной фабрики» 	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(209, NULL, '	Проект ГРР на флангах и глубоких горизонтах   месторождения Бараньевское в 2020-2022 гг. 	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(210, NULL, '	«Техническое перевооружение карьера «Сопка 7» Буготакской группы месторождений».	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(211, NULL, '	Подготовка материалов для разработки Обоснования безопасности опасного производственного объекта: «Подземный рудник «Бараньевский». 1-ая очередь» в части исключения дополнительного подогрева воздуха в зимний период. Организации и проведение экспертизы про	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(212, NULL, '	«Составление проекта на выполнение дополнительных геологоразведочных работ по определению и геометризации запасов россыпного золота промышленных категорий С1 и С2 на месторождениях: месторождение Танинское Оймяконский район Республика Саха (Якутия)». 	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(213, NULL, '	\"Технологический регламент по переработке лежалых хвостов переработки руды Синюхского месторождения с целью извлечения из них золота и серебра»\r\n\r\n\"	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(214, NULL, '	Технический надзор за строительством ГМЦ на  территории Хабаровского  края, Николаевский район, пром. площадка Белая гора.	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(215, NULL, '	\"«Технический проект на опытно-промышленную отработку забалансовых запасов и техногенных отложений россыпного золота по участку недр «Гольцовская лицензионная площадь».\r\nРазработка «Плана развития горных работ на 2021 год по участку река Камешкова, в рамках\"	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(216, NULL, '	Разработка проекта горного отвода на участке недр «Катковский-4»».	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(217, NULL, '	• Pазработка геологической документации «Анализ геологического строения площадей вдоль автодорог в Усть-Канском и Усть-Коксинском районах Республики Алтай и выделение на его основе потенциально пригодных участков недр для оценки и добычи строительного кам	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(218, NULL, '	Оценки и выдачи рекомендаций по корректировке технологии взрывной отбойки глубокими скважинами на подземных рудниках КФ АО «Апатит».	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(219, NULL, '	\"• Работы по ревизии проектной документации, рабочей документации, исполнительной документации;\r\n• Сбор материалов по технической документации технологического и вспомогательного оборудования;\r\n• Подготовка пакета документов для регистрации ОПО и ввода ОПО в\"	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(220, NULL, '	«Технический проект на добычу и переработку техногенных отложений Хинганского месторождения олова»	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(221, NULL, '	«Технический проект на отработку месторождения россыпного золота р. Каменка Верхняя».	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(222, NULL, '	\"• Проект СЗЗ по участку добычи строительного песка «Катковский-4»\r\n• Проект инвентаризации источников выбросов\r\n• Постановка объекта НВОС 3 категории на учет на региональном уровне \r\n• Кадастровые работы при разработке проекта СЗЗ и внесение границ в ЕГРН\r\n\"	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(223, NULL, '	«ТЭО постоянных кондиций по месторождению Нявленга»	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(224, NULL, '	«Ликвидация экологических последствий деятельности Джидинского вольфрамо-молибденового комбината».	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(225, NULL, '	выполнение комплекса работ по разработке проектной и рабочей документации Объекта «Горно-обогатительный комплекс на базе золоторудного месторождения «Вернинское» (Бодайбинский район, Иркутская область). Техническое перевооружение ЗИФ «Вернинская»	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(226, NULL, '	«ОТЧЁТ по результатам технического аудита проекта производства работ (ППР)»	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(227, NULL, '	«Проект отработки техногенных запасов(хвосты) Саралинской ЗИФ и разработки конструкторской документации по установке обогащения хвостов», 	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(228, NULL, '	Подготовка геологического пакета документов для подачи Заявки на включение данных участков в перечень участков недр согласно Приказу № 428 (п. 5-6).	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(229, NULL, '	Расчёты новой трассы хвостового пульпопровода, на объекте: «Строительство горно-обогатительного комплекса по переработке лежалых хвостов Солнечного ГОКа»	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(230, NULL, '	«Техническое перевооружение обогатительной фабрики по переработке техногенных отложений Хинганского месторождения олова»	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(231, NULL, '	Проведение комплекса инженерны изысканий  хвостохрагилища ООО \"Рудник Веселый\"	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(232, NULL, '	\"ПРОЕКТ ТЕХНИЧЕСКОГО ПЕРЕВООРУЖЕНИЯ \r\nХВОСТОВОГО ХОЗЯЙСТВА ОБОГАТИТЕЛЬНОГО КОМБИНАТА \r\nМЕСТОРОЖДЕНИЯ «БЕЛАЯ ГОРА»  \"	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(233, NULL, '	«Техническое перевооружение Искитимского-1 месторождения известняков»	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(234, NULL, '	Проект отработки месторождения песка Катковский-4	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(235, NULL, '	Разработка проектной документации хвостохрагилища ООО \"Рудник Веселый\"	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(236, NULL, '	Пруд отстойник II очеди хвостохранилища ОА Коммунаровский рудник	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(237, NULL, '	Технический проект подземной отработки золотосодержащих руд Синюхинского месторождения 	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(238, NULL, '	Проектная и рабочая документация строительства Майской ЗИФ	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(239, NULL, '	Геодезическая съёмка, Проект ГРР, Отчет с подсчетом запасов, Технический проект разработки автомобильных карьеров Новосибирской области, Алтайского края, Республики Алтай	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(240, NULL, '	Проекты консервации и ликвидации автомобильных карьеров Новосибирской области	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(241, NULL, '	 ПРОЕКТ на проведение работ по геологическому изучению недр, включая поиски и оценку золота из россыпных месторождений, на участке недр Река Клык с притоками в Турочакском районе Республики Алтай	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(242, NULL, '	«Анализ и выдача рекомендаций по  производству взрывных работ при торцевом выпуске руды на подземных рудниках КФ АО «Апатит».	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(243, NULL, '	\"ПРОЕКТ на проведение работ по объекту: «Геологическое изучение недр, включая\r\nпоиски и оценку золота из россыпных месторождений, на участке недр\r\nФланги россыпи в среднем течении р. Андоба, р. Чаныш и притоков в\r\nТурочакском районе Республики Алтай»\"	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(244, NULL, '	\"ПРОЕКТ\r\nна проведение работ по геологическому изучению недр, включающему поиски и оценку золота из россыпных месторождений, на участке недр \r\nрека Атла с притоками в Турочакском районе Республики Алтай\"	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(245, NULL, '	\"Проект на проведение работ по объекту:\r\n«Геологическое изучение, включающее поиски и оценку месторождений\r\nроссыпного золота на участке недр «Нояс-Анзаский» в Таштагольском районе Кемеровской области»\"	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(246, NULL, '	Проект на проведение работ по геологическому изучению недр, включающему поиски и оценку золота из россыпных месторождений, на участке недр Ручей Корзунок и руч. Малый Корзунок	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(247, NULL, '	«Технический проект на добычу и переработку техногенных отложений Хинганского месторождения олова» (Уменьшение производительности)	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(248, NULL, '	«Отчет о опытно-промышленных работах по добычи и переработке техногенных отложений Хинганского месторождения олова»\"	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(249, NULL, '	\"Технико-экономическое решение (ТЭР) вариантов организации хвостохранилища для объекта: \"Строительство горно-обогатительного комплекса по переработке лежалых хвостов Солнечного ГОКа»	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(250, NULL, '	Разработка Синюхинского золоторудного месторождения. Дополнение №3	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(251, NULL, '	\"«Проект наливного хвостохранилища Синюхинского золоторудного месторождения»,\r\nинженерные изыскания для проекта наливного хвостохранилища\"	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(252, NULL, '	Разработка проектной и рабочей документации Объекта «Горно-обогатительный комплекс на базе золоторудного месторождения «Вернинское» (Бодайбинский район, Иркутская область). Техническое перевооружение ЗИФ «Вернинская», 	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(253, NULL, '	«Техническое перевооружение обогатительной фабрики по переработке руды Майского месторождения золота»	 ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `project_stages`
--

CREATE TABLE `project_stages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `project_id` bigint(20) UNSIGNED NOT NULL,
  `stage_id` bigint(20) UNSIGNED NOT NULL,
  `progress` tinyint(3) UNSIGNED NOT NULL DEFAULT '0',
  `date_start` date NOT NULL,
  `duration` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `project_stages`
--

INSERT INTO `project_stages` (`id`, `project_id`, `stage_id`, `progress`, `date_start`, `duration`, `created_at`, `updated_at`) VALUES
(1, 112, 6, 23, '2024-02-11', 4, NULL, NULL),
(2, 113, 7, 43, '2024-02-11', 6, NULL, NULL),
(3, 114, 8, 8, '2024-02-11', 6, NULL, NULL),
(4, 115, 9, 73, '2024-02-11', 3, NULL, NULL),
(5, 116, 10, 8, '2024-02-11', 5, NULL, NULL),
(6, 117, 11, 97, '2024-02-11', 6, NULL, NULL),
(7, 118, 12, 67, '2024-02-11', 5, NULL, NULL),
(8, 119, 13, 97, '2024-02-11', 2, NULL, NULL),
(9, 120, 14, 51, '2024-02-11', 3, NULL, NULL),
(10, 121, 15, 83, '2024-02-11', 3, NULL, NULL),
(11, 122, 16, 27, '2024-02-11', 3, NULL, NULL),
(12, 123, 17, 68, '2024-02-11', 4, NULL, NULL),
(13, 124, 18, 52, '2024-02-11', 1, NULL, NULL),
(14, 125, 19, 78, '2024-02-11', 5, NULL, NULL),
(15, 126, 20, 4, '2024-02-11', 2, NULL, NULL),
(16, 127, 21, 87, '2024-02-11', 5, NULL, NULL),
(17, 128, 22, 10, '2024-02-11', 3, NULL, NULL),
(18, 129, 23, 6, '2024-02-11', 4, NULL, NULL),
(19, 130, 24, 33, '2024-02-11', 2, NULL, NULL),
(20, 131, 6, 77, '2024-02-11', 3, NULL, NULL),
(21, 132, 7, 56, '2024-02-11', 5, NULL, NULL),
(22, 133, 8, 68, '2024-02-11', 3, NULL, NULL),
(23, 134, 9, 94, '2024-02-11', 4, NULL, NULL),
(24, 135, 10, 70, '2024-02-11', 1, NULL, NULL),
(25, 136, 11, 92, '2024-02-11', 5, NULL, NULL),
(26, 112, 12, 17, '2024-02-11', 1, NULL, NULL),
(27, 113, 13, 87, '2024-02-11', 2, NULL, NULL),
(28, 114, 14, 7, '2024-02-11', 7, NULL, NULL),
(29, 115, 15, 49, '2024-02-11', 5, NULL, NULL),
(30, 116, 16, 66, '2024-02-11', 3, NULL, NULL),
(31, 117, 17, 7, '2024-02-11', 2, NULL, NULL),
(32, 118, 18, 40, '2024-02-11', 5, NULL, NULL),
(33, 119, 19, 95, '2024-02-11', 6, NULL, NULL),
(34, 120, 20, 47, '2024-02-11', 5, NULL, NULL),
(35, 121, 21, 30, '2024-02-11', 3, NULL, NULL),
(36, 122, 22, 52, '2024-02-11', 6, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `project_statuses`
--

CREATE TABLE `project_statuses` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `project_statuses`
--

INSERT INTO `project_statuses` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, '	В разработке	 ', NULL, NULL),
(2, '	В экспертизе	 ', NULL, NULL),
(3, '	Выполнен	 ', NULL, NULL),
(4, '	На согласовании Заказчиком	 ', NULL, NULL),
(5, '	Согласование договора	 ', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `description`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'Роль с полным доступом ко всем функциям системы', NULL, NULL),
(2, 'manager', 'Роль с доступом к управлению контактами и другими административными функциями', NULL, NULL),
(3, 'user', 'Роль с базовыми правами доступа к функционалу системы', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `stages`
--

CREATE TABLE `stages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `stages`
--

INSERT INTO `stages` (`id`, `name`, `created_at`, `updated_at`) VALUES
(6, '	Анализ исходных данных	 ', NULL, NULL),
(7, '	Согласование ОТР	 ', NULL, NULL),
(8, '	Выполнение проекта в полном объеме	 ', NULL, NULL),
(9, '	Согласование с Заказчиком	 ', NULL, NULL),
(10, '	Прохождение экспертизы промбезопасности	 ', NULL, NULL),
(11, '	Прохожнение экологической экспертизы	 ', NULL, NULL),
(12, '	Прохожнение государственной экспертизы	 ', NULL, NULL),
(13, '	Прохождение геологической экспертизы	 ', NULL, NULL),
(14, '	Сопровождение экспертизы промбезопасности	 ', NULL, NULL),
(15, '	Сопровождение  проекта в ходе экспертизы ЦКР	 ', NULL, NULL),
(16, '	Сопровождение материалов в ходе экспертизы в ГКЗ Роснедра 	 ', NULL, NULL),
(17, '		 ', NULL, NULL),
(18, '	Комплекс инженерных изысканий	 ', NULL, NULL),
(19, '	Геологический отчет с подсчетом  запасов по предлагаемому к утверждению варианту постоянных кондиций. 	 ', NULL, NULL),
(20, '	Гидрогеологическое, инженерно-геологическое, горнотехническое, технологическое, экологическое и экономическое обоснование постоянных кондиций. 	 ', NULL, NULL),
(21, '	Статистический анализ результатов опробования электронной базы данных, предварительная оценка возможных вариантов кондиций.	 ', NULL, NULL),
(22, '	\"Выезд на Объект (включая нахождение в обсерваторе) для \r\nознакомления и сбора исходных данных, обсуждения с \r\nЗаказчиком предварительных решений и требований \"	 ', NULL, NULL),
(23, '	\"Разработка документации в объеме, необходимом для \r\nпрохождения ЭПБ. Текстовая, описательная, графическая \r\nчасти по соответствующим разделам \"	 ', NULL, NULL),
(24, '	 Разработка рабочей документации (чертежи АС,ЭО, ЭМ) 	 ', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `type_education_documents`
--

CREATE TABLE `type_education_documents` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `type_facilities`
--

CREATE TABLE `type_facilities` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `type_facilities`
--

INSERT INTO `type_facilities` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, '	Межплощадочные сети и сооружения	 ', NULL, NULL),
(2, '	Открытые горные работы	 ', NULL, NULL),
(3, '	Подземные горные работы	 ', NULL, NULL),
(4, '	Объекты обогатительных переделов	 ', NULL, NULL),
(5, '	Гидротехнические объекты	 ', NULL, NULL),
(6, '	Объекты металлургии	 ', NULL, NULL),
(7, '	Объекты энергетики	 ', NULL, NULL),
(8, '	Внутриплощадочные инженерные сети и сооружения на них	 ', NULL, NULL),
(9, '	Объекты транспорта	 ', NULL, NULL),
(10, '	Объекты складского хозяйства	 ', NULL, NULL),
(11, '	Объекты ремонтного хозяйства и производственных баз	 ', NULL, NULL),
(12, '	Прочие объекты промышленной инфраструктуры предприятия	 ', NULL, NULL),
(13, '	Объекты непроизводственного назначения	 ', NULL, NULL),
(14, '	Объекты агропрома	 ', NULL, NULL),
(15, '	Комплесные объекты горной промышленности	 ', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `type_project_documents`
--

CREATE TABLE `type_project_documents` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `type_project_documents`
--

INSERT INTO `type_project_documents` (`id`, `code`, `name`, `created_at`, `updated_at`) VALUES
(1, '	ПД	 ', '	Проектная документация	 ', NULL, NULL),
(2, '	РД	 ', '	Рабочая документация	 ', NULL, NULL),
(3, '	ИГДИ	 ', '	Технический отчёт по результатам инженерно-геодезических изысканий	 ', NULL, NULL),
(4, '	ИГИ	 ', '	Технический отчёт по результатам инженерно-геологических изысканий	 ', NULL, NULL),
(5, '	ИГМИ	 ', '	Технический отчёт по результатам инженерно-гидрометерологических изысканий	 ', NULL, NULL),
(6, '	ИГЭ	 ', '	Технический отчёт по результатам инженерно-экологических изысканий	 ', NULL, NULL),
(7, '	ГРР	 ', '	Проект ГРР	 ', NULL, NULL),
(8, '	ТР	 ', '	Технологические регламенты	 ', NULL, NULL),
(9, '	ОПЗ	 ', '	Отчёты с подсчетом запасов	 ', NULL, NULL),
(10, '	ОР	 ', '	Обследовательские работы	 ', NULL, NULL),
(11, '	ТЭ	 ', '	Техническая экспертиза	 ', NULL, NULL),
(12, '	ТА	 ', '	Технический аудит	 ', NULL, NULL),
(13, '	БП	 ', '	Бизнес-план	 ', NULL, NULL),
(14, '	ДН	 ', '	Декларация (ходатайство) о намерениях	 ', NULL, NULL),
(15, '	МВП	 ', '	Материалы к акту выбора площадки	 ', NULL, NULL),
(16, '	ОВОС	 ', '	Оценка воздействия на окружающую среду	 ', NULL, NULL),
(17, '	ОИ	 ', '	Обоснование инвестиций	 ', NULL, NULL),
(18, '	ОК	 ', '	Обоснование кондиций	 ', NULL, NULL),
(19, '	ОТР	 ', '	Основные технические решения	 ', NULL, NULL),
(20, '	ППД	 ', '	Предпроектные документы (прочие)	 ', NULL, NULL),
(21, '	РЭ	 ', '	Рекомендации	 ', NULL, NULL),
(22, '	СПГ	 ', '	Справка ГИП с описанием изменений, внесённых в проектную документацию по результатам отрицательного заключения экспертизы	 ', NULL, NULL),
(23, '	ТД	 ', '	Тендерная документация	 ', NULL, NULL),
(24, '	ТКП	 ', '	Технико-коммерческое предложение	 ', NULL, NULL),
(25, '	ТЭ	 ', '	Техническая экспертиза, технический аудит	 ', NULL, NULL),
(26, '	ТЭО	 ', '	Технико-экономическое обоснование	 ', NULL, NULL),
(27, '	ТЭД	 ', '	Технико-экономический доклад	 ', NULL, NULL),
(28, '	ТЭП	 ', '	Технико-экономическое предложение	 ', NULL, NULL),
(29, '	ТЭР	 ', '	Технико-экономические расчёты	 ', NULL, NULL),
(30, '	ТЭС	 ', '	Технико-экономические сравнения	 ', NULL, NULL),
(31, '	ТППО	 ', '	Техническое перевооружение	 ', NULL, NULL),
(32, '	ПК	 ', '	Проект консервации	 ', NULL, NULL),
(33, '	ПЛ	 ', '	Проект ликвидации	 ', NULL, NULL),
(34, '	ИИСМ	 ', '	Изыскания строительных материалов	 ', NULL, NULL),
(35, '	ИИПВ	 ', '	Изыскания источников водоснабжения на базе подземных вод	 ', NULL, NULL),
(36, '	СМ	 ', '	Сейсмическое микрорайонирование	 ', NULL, NULL),
(37, '	ТП	 ', '	Технический проект	 ', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role_id` bigint(20) UNSIGNED NOT NULL DEFAULT '2',
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `role_id`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Дмитрий', '2329192@mail.ru', NULL, '$2y$12$R88X8jG6Zw9OKo1nbandJO3WQj4E9HL2n2U9sCIX17N7UOBFj9tVG', 2, NULL, '2024-02-06 07:14:32', '2024-02-06 07:14:32'),
(3, 'Дмитрий', '2329fad192@mail.ru', NULL, '$2y$12$HBJQeTzWGFNOhfAzPoxQK.qqBUdoVyllY5l3yM2a38akTJwLI0aCq', 2, NULL, '2024-02-06 07:41:42', '2024-02-06 07:41:42'),
(4, 'Дмитрий', '2329fad192eafea@mail.ru', NULL, '$2y$12$tVOokgWtVtkLsuC5M.0NXui.FqAYUBV6OkEfsJSJFfE0X4JKSs/dS', 2, NULL, '2024-02-06 07:51:49', '2024-02-06 07:51:49'),
(5, 'афвафвафва', '2329fadафвафв192@mail.ru', NULL, '$2y$12$FwQxjzdO94xCj/E6nGUH8O3yiph6nUAp8y.1r9keuTgPW3zxKWDr6', 2, NULL, '2024-02-06 08:17:12', '2024-02-06 08:17:12'),
(7, 'efaefeafaef', '2329fadsss192@mail.ru', NULL, '$2y$12$eBb/f4BAe1kq9HSkkEa3I.E4/UNSI.zuOS5VFREAVnsfrWN4qnvX2', 2, NULL, '2024-02-06 08:48:23', '2024-02-06 08:48:23'),
(8, 'Фамилия', '2329fa111dsss192@mail.ru', NULL, '$2y$12$9q8X8uL5lmBKg3mupI8m7.n0WfffjSU3Wpp0i5Qr3eWMC81SPghcO', 2, NULL, '2024-02-06 08:49:42', '2024-02-06 08:49:42'),
(11, 'Дмитрий', '2329faddaadsss192@mail.ru', NULL, '$2y$12$zT8gXVZcRDk/fsIX5QZ01e1uFM.jDUnitQwRtxrEMXzf9dHaa3KXu', 2, NULL, '2024-02-06 10:00:54', '2024-02-06 10:00:54'),
(12, 'Фамилия', '2329fadssgargars192@mail.ru', NULL, '$2y$12$6IZXJzbc.7um6cGS..o/B.D/hql6cdlVZXXCvxsmuT/Q1Ctua6/Sy', 2, NULL, '2024-02-06 10:46:07', '2024-02-06 10:46:07'),
(13, '111111111111', '111111111111@mail.ru', NULL, '$2y$12$GTPmB6Wo9Wc8pC2vomyJLuBqKcIzGDnu0V10eHPYoItozpbjkz5M2', 2, NULL, '2024-02-07 00:34:07', '2024-02-07 00:34:07'),
(14, 'Дмитрий', 'афвафва92@mail.ru', NULL, '$2y$12$CH.3.QmzCzhbf2XUU6OPGO/5ByhOkV6CsnCv50e6k3.N50YVvlDvK', 2, NULL, '2024-02-07 00:40:37', '2024-02-07 00:40:37'),
(15, 'manager', '2329faауфафуdsss192@mail.ru', NULL, '$2y$12$2P8n4hjm.RjeAKciy/uE8uEckuqUJ4HPRi.TC2fH5ELl4w/QOxe36', 2, NULL, '2024-02-07 00:41:17', '2024-02-07 00:41:17'),
(16, 'Семен', '2329faeeedsss192@mail.ru', NULL, '$2y$12$zYVNsW9ZuZdzF.kOrCypTu5dE6X.yr8FswGN0HueoWrovLol7cvKG', 2, NULL, '2024-02-07 00:46:14', '2024-02-07 00:46:14'),
(17, 'ddddddd', '2329faddddsss192@mail.ru', NULL, '$2y$12$NBZoI0kHkwiRfe8JxW/pFuhpH3Iq.A22usag7/o9xNszWtjcVXybu', 2, NULL, '2024-02-07 00:49:51', '2024-02-07 00:49:51'),
(18, 'Дмитрий', '2329fadesss192@mail.ru', NULL, '$2y$12$SWi4kkSavsvIh0NHbRn5.Oo6EbmK.ingb93M6v8125STPx8MOupvG', 2, NULL, '2024-02-07 00:52:02', '2024-02-07 00:52:02'),
(20, 'Дмитрий', '2329fads2ss192@mail.ru', NULL, '$2y$12$QGv6xThiDjxZjoc.p4lE3.UfT6kYBe7zYc7YhQFx69VmZ20vChht2', 2, NULL, '2024-02-07 01:05:53', '2024-02-07 01:05:53'),
(21, 'admin', 'admin@mail.ru', NULL, '$2y$12$HkYK3/WcHVr.bcHMv6vpnONQvaABicTxY0i7nmR0FeRid36uVG2P2', 1, NULL, '2024-02-07 02:54:24', '2024-02-07 02:54:24'),
(22, 'add', 'adrrmin@mail.ru', NULL, '$2y$12$.y3xTLd8Dg.97zM1FIpg.uJE2gUcmTQl3UPTVfZnuDaOic0JtzjHy', 2, NULL, '2024-02-07 07:58:12', '2024-02-07 07:58:12'),
(24, 'Фамилия', 'admiфыфn@mail.ru', NULL, '$2y$12$c9cKbcV6l3ms.gw.r8.VoOeD9EsVTQlP924EQ4HL36aMq8lbR6C3K', 2, NULL, '2024-02-09 17:52:25', '2024-02-09 17:52:25'),
(25, '22222', '22222@mail.ru', NULL, '$2y$12$Obd9arcJPG/MsrvvRZAKrenAClQWGhKeyeeOyYibeGaEGxiO8oXQm', 2, NULL, '2024-02-09 17:53:03', '2024-02-09 17:53:03'),
(26, '22222', '2ы2222@mail.ru', NULL, '$2y$12$haORsUSiFT5pM2R9iQw95u3Mvs.AVF21grq55Y1i7a.ZBC.iHM/r2', 2, NULL, '2024-02-09 17:53:16', '2024-02-09 17:53:16');

--
-- Indexes for dumped simplesTables
--

--
-- Indexes for table `addresses`
--
ALTER TABLE `addresses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `banks`
--
ALTER TABLE `banks`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `biks`
--
ALTER TABLE `biks`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `biks_bik_unique` (`BIK`);

--
-- Indexes for table `contacts`
--
ALTER TABLE `contacts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `contacts_position_id_foreign` (`position_id`),
  ADD KEY `contacts_organization_id_foreign` (`organization_id`);

--
-- Indexes for table `educational_institutions`
--
ALTER TABLE `educational_institutions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `educations`
--
ALTER TABLE `educations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `educations_type_document_id_foreign` (`type_document_id`),
  ADD KEY `educations_institution_id_foreign` (`institution_id`),
  ADD KEY `educations_qualification_id_foreign` (`qualification_id`),
  ADD KEY `educations_specialization_id_foreign` (`specialization_id`);

--
-- Indexes for table `education_persons`
--
ALTER TABLE `education_persons`
  ADD PRIMARY KEY (`id`),
  ADD KEY `education_persons_person_id_foreign` (`person_id`),
  ADD KEY `education_persons_education_id_foreign` (`education_id`);

--
-- Indexes for table `education_qualifications`
--
ALTER TABLE `education_qualifications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `education_specializations`
--
ALTER TABLE `education_specializations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `facilities`
--
ALTER TABLE `facilities`
  ADD PRIMARY KEY (`id`),
  ADD KEY `facilities_type_id_foreign` (`type_id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `initial_authorization_documentations`
--
ALTER TABLE `initial_authorization_documentations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `legal_forms`
--
ALTER TABLE `legal_forms`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notes`
--
ALTER TABLE `notes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `oauth_access_tokens`
--
ALTER TABLE `oauth_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `oauth_access_tokens_user_id_index` (`user_id`);

--
-- Indexes for table `oauth_auth_codes`
--
ALTER TABLE `oauth_auth_codes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `oauth_auth_codes_user_id_index` (`user_id`);

--
-- Indexes for table `oauth_clients`
--
ALTER TABLE `oauth_clients`
  ADD PRIMARY KEY (`id`),
  ADD KEY `oauth_clients_user_id_index` (`user_id`);

--
-- Indexes for table `oauth_personal_access_clients`
--
ALTER TABLE `oauth_personal_access_clients`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `oauth_refresh_tokens`
--
ALTER TABLE `oauth_refresh_tokens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `oauth_refresh_tokens_access_token_id_index` (`access_token_id`);

--
-- Indexes for table `organizations`
--
ALTER TABLE `organizations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `organizations_legal_form_id_foreign` (`legal_form_id`),
  ADD KEY `organizations_address_legal_id_foreign` (`address_legal_id`),
  ADD KEY `organizations_address_mail_id_foreign` (`address_mail_id`),
  ADD KEY `organizations_bik_id_foreign` (`BIK_id`),
  ADD KEY `organizations_director_id_foreign` (`director_id`);

--
-- Indexes for table `passports`
--
ALTER TABLE `passports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `passports_passport_place_issue_id_foreign` (`passport_place_issue_id`);

--
-- Indexes for table `passport_place_issues`
--
ALTER TABLE `passport_place_issues`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD KEY `password_resets_email_index` (`email`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indexes for table `persons`
--
ALTER TABLE `persons`
  ADD PRIMARY KEY (`id`),
  ADD KEY `persons_passport_id_foreign` (`passport_id`),
  ADD KEY `persons_bank_id_foreign` (`bank_id`),
  ADD KEY `persons_bik_id_foreign` (`bik_id`),
  ADD KEY `persons_note_id_foreign` (`note_id`);

--
-- Indexes for table `positions`
--
ALTER TABLE `positions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`),
  ADD KEY `projects_organization_customer_id_foreign` (`organization_customer_id`),
  ADD KEY `projects_type_project_document_id_foreign` (`type_project_document_id`),
  ADD KEY `projects_facility_id_foreign` (`facility_id`),
  ADD KEY `projects_iad_id_foreign` (`IAD_id`),
  ADD KEY `projects_status_id_foreign` (`status_id`);

--
-- Indexes for table `project_stages`
--
ALTER TABLE `project_stages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_stages_project_id_foreign` (`project_id`),
  ADD KEY `project_stages_stage_id_foreign` (`stage_id`);

--
-- Indexes for table `project_statuses`
--
ALTER TABLE `project_statuses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `roles_name_unique` (`name`);

--
-- Indexes for table `stages`
--
ALTER TABLE `stages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `type_education_documents`
--
ALTER TABLE `type_education_documents`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `type_facilities`
--
ALTER TABLE `type_facilities`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `type_project_documents`
--
ALTER TABLE `type_project_documents`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD KEY `users_role_id_foreign` (`role_id`);

--
-- AUTO_INCREMENT for dumped simplesTables
--

--
-- AUTO_INCREMENT for table `addresses`
--
ALTER TABLE `addresses`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `banks`
--
ALTER TABLE `banks`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `biks`
--
ALTER TABLE `biks`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `contacts`
--
ALTER TABLE `contacts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `educational_institutions`
--
ALTER TABLE `educational_institutions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `educations`
--
ALTER TABLE `educations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `education_persons`
--
ALTER TABLE `education_persons`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `education_qualifications`
--
ALTER TABLE `education_qualifications`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `education_specializations`
--
ALTER TABLE `education_specializations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `facilities`
--
ALTER TABLE `facilities`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=151;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `initial_authorization_documentations`
--
ALTER TABLE `initial_authorization_documentations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `legal_forms`
--
ALTER TABLE `legal_forms`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=72;

--
-- AUTO_INCREMENT for table `notes`
--
ALTER TABLE `notes`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `oauth_clients`
--
ALTER TABLE `oauth_clients`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `oauth_personal_access_clients`
--
ALTER TABLE `oauth_personal_access_clients`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `organizations`
--
ALTER TABLE `organizations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `passports`
--
ALTER TABLE `passports`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `passport_place_issues`
--
ALTER TABLE `passport_place_issues`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `persons`
--
ALTER TABLE `persons`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `positions`
--
ALTER TABLE `positions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=254;

--
-- AUTO_INCREMENT for table `project_stages`
--
ALTER TABLE `project_stages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `project_statuses`
--
ALTER TABLE `project_statuses`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `stages`
--
ALTER TABLE `stages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `type_education_documents`
--
ALTER TABLE `type_education_documents`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `type_facilities`
--
ALTER TABLE `type_facilities`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `type_project_documents`
--
ALTER TABLE `type_project_documents`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- Constraints for dumped simplesTables
--

--
-- Constraints for table `contacts`
--
ALTER TABLE `contacts`
  ADD CONSTRAINT `contacts_organization_id_foreign` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `contacts_position_id_foreign` FOREIGN KEY (`position_id`) REFERENCES `positions` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `educations`
--
ALTER TABLE `educations`
  ADD CONSTRAINT `educations_institution_id_foreign` FOREIGN KEY (`institution_id`) REFERENCES `educational_institutions` (`id`),
  ADD CONSTRAINT `educations_qualification_id_foreign` FOREIGN KEY (`qualification_id`) REFERENCES `education_qualifications` (`id`),
  ADD CONSTRAINT `educations_specialization_id_foreign` FOREIGN KEY (`specialization_id`) REFERENCES `education_specializations` (`id`),
  ADD CONSTRAINT `educations_type_document_id_foreign` FOREIGN KEY (`type_document_id`) REFERENCES `type_education_documents` (`id`);

--
-- Constraints for table `education_persons`
--
ALTER TABLE `education_persons`
  ADD CONSTRAINT `education_persons_education_id_foreign` FOREIGN KEY (`education_id`) REFERENCES `educations` (`id`),
  ADD CONSTRAINT `education_persons_person_id_foreign` FOREIGN KEY (`person_id`) REFERENCES `persons` (`id`);

--
-- Constraints for table `facilities`
--
ALTER TABLE `facilities`
  ADD CONSTRAINT `facilities_type_id_foreign` FOREIGN KEY (`type_id`) REFERENCES `type_facilities` (`id`);

--
-- Constraints for table `organizations`
--
ALTER TABLE `organizations`
  ADD CONSTRAINT `organizations_address_legal_id_foreign` FOREIGN KEY (`address_legal_id`) REFERENCES `addresses` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `organizations_address_mail_id_foreign` FOREIGN KEY (`address_mail_id`) REFERENCES `addresses` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `organizations_bik_id_foreign` FOREIGN KEY (`BIK_id`) REFERENCES `biks` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `organizations_director_id_foreign` FOREIGN KEY (`director_id`) REFERENCES `persons` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `organizations_legal_form_id_foreign` FOREIGN KEY (`legal_form_id`) REFERENCES `legal_forms` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `passports`
--
ALTER TABLE `passports`
  ADD CONSTRAINT `passports_passport_place_issue_id_foreign` FOREIGN KEY (`passport_place_issue_id`) REFERENCES `passport_place_issues` (`id`);

--
-- Constraints for table `persons`
--
ALTER TABLE `persons`
  ADD CONSTRAINT `persons_bank_id_foreign` FOREIGN KEY (`bank_id`) REFERENCES `banks` (`id`),
  ADD CONSTRAINT `persons_bik_id_foreign` FOREIGN KEY (`bik_id`) REFERENCES `biks` (`id`),
  ADD CONSTRAINT `persons_note_id_foreign` FOREIGN KEY (`note_id`) REFERENCES `notes` (`id`),
  ADD CONSTRAINT `persons_passport_id_foreign` FOREIGN KEY (`passport_id`) REFERENCES `passports` (`id`);

--
-- Constraints for table `projects`
--
ALTER TABLE `projects`
  ADD CONSTRAINT `projects_facility_id_foreign` FOREIGN KEY (`facility_id`) REFERENCES `facilities` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `projects_iad_id_foreign` FOREIGN KEY (`IAD_id`) REFERENCES `initial_authorization_documentations` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `projects_organization_customer_id_foreign` FOREIGN KEY (`organization_customer_id`) REFERENCES `organizations` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `projects_status_id_foreign` FOREIGN KEY (`status_id`) REFERENCES `project_statuses` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `projects_type_project_document_id_foreign` FOREIGN KEY (`type_project_document_id`) REFERENCES `type_project_documents` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `project_stages`
--
ALTER TABLE `project_stages`
  ADD CONSTRAINT `project_stages_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `project_stages_stage_id_foreign` FOREIGN KEY (`stage_id`) REFERENCES `stages` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

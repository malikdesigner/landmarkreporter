-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 21, 2024 at 07:57 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `landmarkreporter`
--

-- --------------------------------------------------------

--
-- Table structure for table `tbl_comments`
--

CREATE TABLE `tbl_comments` (
  `id` int(255) NOT NULL,
  `comment` varchar(255) NOT NULL,
  `added_by` int(255) NOT NULL,
  `date_added` datetime(6) NOT NULL,
  `landmark_id` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_comments`
--

INSERT INTO `tbl_comments` (`id`, `comment`, `added_by`, `date_added`, `landmark_id`) VALUES
(2, 'Nice place to visit', 11, '2024-03-20 19:07:12.893000', 1),
(3, 'Beautifull place', 11, '2024-03-20 20:00:09.190000', 2),
(4, 'Good place to visit', 11, '2024-03-20 20:00:38.957000', 1),
(6, 'Excellent place to visit', 11, '2024-03-21 17:49:03.975000', 3),
(7, 'CHeck out this place', 11, '2024-03-21 18:30:09.785000', 3);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_landmark`
--

CREATE TABLE `tbl_landmark` (
  `id` int(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `image` longtext NOT NULL,
  `added_by` int(255) NOT NULL,
  `date_added` datetime(6) NOT NULL,
  `location` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_landmark`
--

INSERT INTO `tbl_landmark` (`id`, `name`, `image`, `added_by`, `date_added`, `location`) VALUES
(1, 'Tulum', '[\"1710954785707.jpg\",\"1710954809622.jpg\"]', 11, '2024-03-20 17:19:58.380000', 'Attock, Pakistan'),
(2, 'Tulum', '[\"1710954785707.jpg\",\"1710954809622.jpg\"]', 11, '2024-03-20 17:19:58.380000', 'Attock, Pakistan'),
(3, 'Chicken Itza', '[\"1711043194003.jpg\",\"1711043163661.jpg\"]', 11, '2024-03-21 17:46:44.120000', 'Attock, Pakistan');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_user`
--

CREATE TABLE `tbl_user` (
  `id` int(11) NOT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `dob` int(11) DEFAULT NULL,
  `phone_code` int(11) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone_number` int(11) DEFAULT NULL,
  `password` varchar(50) DEFAULT NULL,
  `date_added` datetime DEFAULT NULL,
  `userlocation` varchar(255) DEFAULT NULL,
  `role` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_user`
--

INSERT INTO `tbl_user` (`id`, `full_name`, `dob`, `phone_code`, `email`, `phone_number`, `password`, `date_added`, `userlocation`, `role`) VALUES
(1, 'Neymar ', 22, 97, 'neymar@gmail.com', 2147483647, 'Neymar', '2024-03-11 17:36:15', 'Daar Al Salam Colony / دآر السلام کولونی,Attock, Pakistan', 1),
(3, 'Waqar ', 38, 92, 'waqar@gmail.com', 2147483647, 'Waqar', '2024-03-11 19:20:28', 'Daar Al Salam Colony / دآر السلام کولونی,Attock, Pakistan', NULL),
(9, 'Aqib Ria', 26, 92, 'aqibr@gmail.com', 3533322, 'Aqib', '2024-03-14 08:58:31', 'Daar Al Salam Colony / دآر السلام کولونی,Attock, Pakistan', 0),
(10, 'Aqib Riaz', 24, 93, 'aqib@gmail.com', 2147483647, 'Aqib', '2024-03-15 17:01:09', 'Daar Al Salam Colony / دآر السلام کولونی,Attock, Pakistan', 0),
(11, 'Aqib', 22, 88, 'aqibriaz@gmail.com', 2147483647, 'Aqibriaz', '2024-03-20 14:24:33', 'Daar Al Salam Colony / دآر السلام کولونی,Attock, Pakistan', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_comments`
--
ALTER TABLE `tbl_comments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_landmark`
--
ALTER TABLE `tbl_landmark`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_user`
--
ALTER TABLE `tbl_user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_comments`
--
ALTER TABLE `tbl_comments`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `tbl_landmark`
--
ALTER TABLE `tbl_landmark`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tbl_user`
--
ALTER TABLE `tbl_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

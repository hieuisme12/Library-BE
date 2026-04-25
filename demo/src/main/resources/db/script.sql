-- =========================
-- 1. CREATE DATABASE
-- =========================
CREATE DATABASE IF NOT EXISTS librarydb;
USE librarydb;

-- =========================
-- 2. DROP TABLE (nếu có)
-- =========================
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS refresh_tokens;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS books;

SET FOREIGN_KEY_CHECKS = 1;

-- =========================
-- 3. CREATE TABLE books
-- =========================
CREATE TABLE books (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(150) NOT NULL,
    category VARCHAR(100),
    publisher VARCHAR(150),
    published_year INT,
    quantity INT DEFAULT 0,
    description TEXT,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =========================
-- 4. CREATE TABLE users
-- =========================
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('BOOK_KEEPER', 'STUDENT') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- 5. CREATE TABLE refresh_tokens
-- =========================
CREATE TABLE refresh_tokens (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    token VARCHAR(512) NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    revoked_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_refresh_tokens_user 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =========================
-- 6. INSERT DATA books
-- =========================
INSERT INTO books (id, title, author, category, publisher, published_year, quantity, description, image_url, created_at, updated_at) VALUES
(1,'Clean Code','Robert C. Martin','Programming','Prentice Hall',2008,10,'A handbook of agile software craftsmanship.','https://images.unsplash.com/photo-1512820790803-83ca734da794','2026-04-25 17:32:53','2026-04-25 17:32:53'),
(2,'The Pragmatic Programmer','Andrew Hunt','Programming','Addison-Wesley',1999,8,'Journey to mastery for developers.','https://images.unsplash.com/photo-1524995997946-a1c2e315a42f','2026-04-25 17:32:53','2026-04-25 17:32:53'),
(3,'Design Patterns','Erich Gamma','Programming','Addison-Wesley',1994,5,'Elements of reusable object-oriented software.','https://images.unsplash.com/photo-1516979187457-637abb4f9353','2026-04-25 17:32:53','2026-04-25 17:32:53'),
(4,'Java Concurrency in Practice','Brian Goetz','Programming','Addison-Wesley',2006,6,'Concurrency best practices in Java.','https://images.unsplash.com/photo-1519681393784-d120267933ba','2026-04-25 17:32:53','2026-04-25 17:32:53'),
(5,'Spring in Action','Craig Walls','Programming','Manning',2018,7,'Comprehensive Spring framework guide.','https://images.unsplash.com/photo-1495446815901-a7297e633e8d','2026-04-25 17:32:53','2026-04-25 17:32:53'),
(6,'Harry Potter and the Sorcerer''s Stone','J.K. Rowling','Fantasy','Bloomsbury',1997,15,'A young wizard’s journey begins.','https://images.unsplash.com/photo-1528207776546-365bb710ee93','2026-04-25 17:32:53','2026-04-25 17:32:53'),
(7,'The Hobbit','J.R.R. Tolkien','Fantasy','HarperCollins',1937,12,'A hobbit’s unexpected adventure.','https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c','2026-04-25 17:32:53','2026-04-25 17:32:53'),
(8,'1984','George Orwell','Dystopian','Secker & Warburg',1949,9,'A dystopian totalitarian society.','https://images.unsplash.com/photo-1497633762265-9d179a990aa6','2026-04-25 17:32:53','2026-04-25 17:32:53'),
(9,'To Kill a Mockingbird','Harper Lee','Classic','J.B. Lippincott & Co.',1960,11,'Racial injustice in the Deep South.','https://images.unsplash.com/photo-1512820790803-83ca734da794','2026-04-25 17:32:53','2026-04-25 17:32:53'),
(10,'Atomic Habits','James Clear','Self-help','Avery',2018,20,'Build good habits, break bad ones.','https://images.unsplash.com/photo-1512820790803-83ca734da794','2026-04-25 17:32:53','2026-04-25 17:32:53'),
(11,'Deep Work','Cal Newport','Productivity','Grand Central Publishing',2016,14,'Rules for focused success.','https://images.unsplash.com/photo-1495446815901-a7297e633e8d','2026-04-25 17:32:53','2026-04-25 17:32:53'),
(12,'Rich Dad Poor Dad','Robert Kiyosaki','Finance','Warner Books',1997,18,'Financial education and mindset.','https://images.unsplash.com/photo-1524995997946-a1c2e315a42f','2026-04-25 17:32:53','2026-04-25 17:32:53'),
(13,'The Lean Startup','Eric Ries','Business','Crown Business',2011,13,'Startup methodology.','https://images.unsplash.com/photo-1519389950473-47ba0277781c','2026-04-25 17:32:53','2026-04-25 17:32:53'),
(14,'Zero to One','Peter Thiel','Business','Crown Business',2014,10,'Startup innovation thinking.','https://images.unsplash.com/photo-1498050108023-c5249f4df085','2026-04-25 17:32:53','2026-04-25 17:32:53'),
(15,'Sapiens','Yuval Noah Harari','History','Harvill Secker',2011,16,'Brief history of humankind.','https://images.unsplash.com/photo-1524578271613-d550eacf6090','2026-04-25 17:32:53','2026-04-25 17:32:53'),
(16,'Homo Deus','Yuval Noah Harari','History','Harvill Secker',2015,9,'Future of humanity.','https://images.unsplash.com/photo-1524578271613-d550eacf6090','2026-04-25 17:32:53','2026-04-25 17:32:53'),
(17,'The Psychology of Money','Morgan Housel','Finance','Harriman House',2020,17,'Behavioral finance insights.','https://images.unsplash.com/photo-1526304640581-d334cdbbf45e','2026-04-25 17:32:53','2026-04-25 17:32:53'),
(18,'Thinking, Fast and Slow','Daniel Kahneman','Psychology','Farrar, Straus and Giroux',2011,8,'Two systems of thinking.','https://images.unsplash.com/photo-1524995997946-a1c2e315a42f','2026-04-25 17:32:53','2026-04-25 17:32:53'),
(19,'Artificial Intelligence Basics','Tom Taulli','Technology','Apress',2019,6,'Intro to AI concepts.','https://images.unsplash.com/photo-1518770660439-4636190af475','2026-04-25 17:32:53','2026-04-25 17:32:53'),
(20,'Machine Learning Yearning','Andrew Ng','Technology','DeepLearning.ai',2018,5,'ML project strategy.','https://images.unsplash.com/photo-1505678261036-a3fcc5e884ee','2026-04-25 17:32:53','2026-04-25 17:32:53');

-- =========================
-- 7. INSERT users (demo)
-- =========================
INSERT INTO users (id, username, password_hash, role, created_at) VALUES
(1,'admin','123456','BOOK_KEEPER','2026-04-25 17:33:46'),
(2,'librarian1','123456','BOOK_KEEPER','2026-04-25 17:33:46'),
(3,'student1','123456','STUDENT','2026-04-25 17:33:46'),
(4,'student2','123456','STUDENT','2026-04-25 17:33:46'),
(5,'student3','123456','STUDENT','2026-04-25 17:33:46'),
(6,'student4','123456','STUDENT','2026-04-25 17:33:46');

-- =========================
-- 8. INSERT refresh_tokens
-- =========================
INSERT INTO refresh_tokens (id, user_id, token, expires_at, revoked_at, created_at) VALUES
(6,13,'73878e6d-a3e3-49d4-9575-cf386b0418bd','2026-05-09 13:04:58','2026-04-25 13:06:29','2026-04-25 13:04:58'),
(7,13,'8e339d84-e5d6-4da9-b061-1eb68270e0f0','2026-05-09 13:08:41','2026-04-25 13:09:43','2026-04-25 13:08:41'),
(8,14,'86a1dbd8-431c-4518-9c06-5bbf80a4398c','2026-05-09 13:14:57',NULL,'2026-04-25 13:14:57');
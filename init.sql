-- init.sql
CREATE DATABASE IF NOT EXISTS auth_db;
USE auth_db;

-- Users table for authentication system
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    bio TEXT,
    avatar_color VARCHAR(7) DEFAULT '#3B82F6',
    is_admin BOOLEAN DEFAULT FALSE,
    password_reset_token VARCHAR(500),
    reset_token_expires DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_reset_token (password_reset_token)
);

-- Create an alias for case-insensitive queries (some ORMs expect Users)
CREATE TABLE IF NOT EXISTS Users LIKE users;

-- TokenBlacklist table for logout functionality
CREATE TABLE IF NOT EXISTS TokenBlacklist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    token_hash VARCHAR(64) UNIQUE NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_expires (expires_at)
);

-- Insert a test user (optional - uncomment to insert)
-- INSERT INTO users (username, email, password) VALUES ('demo', 'demo@example.com', 'hashed_password_here');
-- Reference SQL for this project.
-- You do NOT need to run this: the app creates the table itself on startup
-- (Base.metadata.create_all in app/db/seed.py). It is here so you can see
-- exactly what the database looks like, or recreate it by hand in MySQL Workbench.

CREATE DATABASE IF NOT EXISTS studentfastapi
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE studentfastapi;

CREATE TABLE IF NOT EXISTS students (
    id          INT          NOT NULL AUTO_INCREMENT,
    name        VARCHAR(100) NOT NULL,
    age         SMALLINT     NOT NULL,
    email       VARCHAR(255) NOT NULL,
    course      VARCHAR(100) NOT NULL,
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY ix_students_email (email),
    KEY ix_students_course (course)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email_address TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    birthdate INTEGER,
    address TEXT,
    about_me TEXT
);

CREATE TABLE IF NOT EXISTS components (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    kind TEXT NOT NULL UNIQUE,
    step INTEGER
);

-- insert default configuration, the step in which each component appears
INSERT INTO components (kind, step) VALUES ('birthdate', 2);
INSERT INTO components (kind, step) VALUES ('address', 2);
INSERT INTO components (kind, step) VALUES ('aboutme', 3);


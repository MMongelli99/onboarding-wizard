CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email_address TEXT,
    password TEXT,
    birthdate TEXT,
    address TEXT,
    about_me TEXT
);

CREATE TABLE IF NOT EXISTS components (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    kind TEXT NOT NULL,
    step INTEGER
);

-- insert default configuration, the step in which each component appears
INSERT INTO components (kind, step) VALUES ('birthdate', 2);
INSERT INTO components (kind, step) VALUES ('address', 2);
INSERT INTO components (kind, step) VALUES ('about_me', 3);


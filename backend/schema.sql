CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email_address TEXT NOT NULL,
    password TEXT NOT NULL,
    birthdate INTEGER,
    address TEXT,
    about_me TEXT
);


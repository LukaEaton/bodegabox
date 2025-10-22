CREATE EXTENSION IF NOT EXISTS pg_cron;

CREATE TABLE IF NOT EXISTS ingredients (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    category_id INT,
    store_id INT
);

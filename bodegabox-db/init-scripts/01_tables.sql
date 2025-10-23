CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS stores (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS ingredients (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    category_id INT REFERENCES categories(id),
    store_id INT REFERENCES stores(id)
);

CREATE TABLE IF NOT EXISTS saved_ingredients (
    ingredient_id INT PRIMARY KEY REFERENCES ingredients(id),
    description TEXT,
    valid BOOLEAN NOT NULL,
    saved TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
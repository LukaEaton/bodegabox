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
    category_id INT REFERENCES categories(id) ON DELETE SET NULL,
    store_id INT REFERENCES stores(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS saved_ingredients (
    ingredient_id INT PRIMARY KEY REFERENCES ingredients(id) ON DELETE CASCADE,
    description TEXT,
    valid BOOLEAN NOT NULL DEFAULT TRUE,
    saved TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS recipes (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    web_url TEXT
);

CREATE TABLE IF NOT EXISTS recipe_ingredients (
    recipe_id INT REFERENCES recipes(id) ON DELETE CASCADE,
    ingredient_id INT REFERENCES ingredients(id) ON DELETE CASCADE
);
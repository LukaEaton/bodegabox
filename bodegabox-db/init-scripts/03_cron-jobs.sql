CREATE EXTENSION IF NOT EXISTS pg_cron;

SELECT cron.schedule(
    'delete_invalid_ingredients',
    '0 0 * * *',
    $$DELETE FROM saved_ingredients
        WHERE valid = FALSE
        AND saved + INTERVAL '1 day' < CURRENT_TIMESTAMP;$$
);
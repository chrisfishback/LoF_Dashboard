CREATE TABLE IF NOT EXISTS RANKED_MATCH (
    id SERIAL PRIMARY KEY NOT NULL,
    summoner_name TEXT NOT NULL,
    champion TEXT NOT NULL,
    win BOOLEAN NOT NULL,
    lane TEXT NOT NULL,
    kills INTEGER NOT NULL,
    deaths INTEGER NOT NULL,
    assists INTEGER NOT NULL
)
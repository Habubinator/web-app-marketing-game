CREATE TABLE
    users (
        id BIGINT PRIMARY KEY,
        first_name TEXT NOT NULL,
        last_name TEXT,
        username TEXT,
        language_code TEXT,
        is_premium BOOLEAN,
        allows_write_to_pm BOOLEAN,
        company_name TEXT,
        company_coins INTEGER,
        last_api_trigger BIGINT
    );

CREATE TABLE
    user_auth (
        query_id TEXT PRIMARY KEY,
        auth_date BIGINT,
        hash TEXT,
        user_id BIGINT REFERENCES users (id)
    );

CREATE TABLE
    user_workers (
        owner_id BIGINT REFERENCES users (id),
        worker_id BIGINT,
        PRIMARY KEY (owner_id, worker_id)
    );
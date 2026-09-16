CREATE TABLE users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    name VARCHAR(100) NOT NULL,

    email VARCHAR(255) NOT NULL UNIQUE,

    password_hash TEXT NOT NULL,

    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT users_status_check
        CHECK (status IN ('ACTIVE', 'SUSPENDED', 'DELETED'))
);

CREATE TABLE refresh_tokens (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    user_id BIGINT NOT NULL,

    token_hash TEXT NOT NULL UNIQUE,

    expires_at TIMESTAMPTZ NOT NULL,

    revoked_at TIMESTAMPTZ,

    replaced_by_token_id BIGINT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    last_used_at TIMESTAMPTZ,

    CONSTRAINT fk_refresh_tokens_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_refresh_tokens_replaced_by
        FOREIGN KEY (replaced_by_token_id)
        REFERENCES refresh_tokens(id)
);
CREATE INDEX idx_refresh_tokens_user_id
ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_expires_at
ON refresh_tokens(expires_at);


ALTER TABLE users
ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'USER';

ALTER TABLE users
ADD CONSTRAINT users_role_check
CHECK (role IN ('USER', 'ADMIN'));


CREATE TABLE events (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    name VARCHAR(200) NOT NULL,

    description TEXT,

    venue VARCHAR(255) NOT NULL,

    event_date TIMESTAMPTZ NOT NULL,

    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',

    created_by BIGINT NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT events_status_check
        CHECK (status IN ('DRAFT', 'PUBLISHED', 'CANCELLED')),

    CONSTRAINT fk_events_created_by
        FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE RESTRICT
);
CREATE INDEX idx_events_created_by
ON events(created_by);
CREATE INDEX idx_events_status_event_date
ON events(status, event_date);
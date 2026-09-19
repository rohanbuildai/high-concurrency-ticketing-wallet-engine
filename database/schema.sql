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


CREATE TABLE event_inventory (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    event_id BIGINT NOT NULL,

    ticket_type VARCHAR(20) NOT NULL,

    total_quantity INTEGER NOT NULL,

    available_quantity INTEGER NOT NULL,

    price NUMERIC(12,2) NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_event_inventory_event
        FOREIGN KEY (event_id)
        REFERENCES events(id)
        ON DELETE CASCADE,

    CONSTRAINT event_inventory_ticket_type_check
        CHECK (
            ticket_type IN ('VIP', 'GENERAL', 'STUDENT')
        ),

    CONSTRAINT event_inventory_total_quantity_check
        CHECK (total_quantity > 0),

    CONSTRAINT event_inventory_available_quantity_check
        CHECK (available_quantity >= 0),

    CONSTRAINT event_inventory_price_check
        CHECK (price >= 0),

    CONSTRAINT unique_event_ticket_type
        UNIQUE (event_id, ticket_type)
);

CREATE TABLE reservations (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    user_id BIGINT NOT NULL,

    inventory_id BIGINT NOT NULL,

    quantity INTEGER NOT NULL,

    status VARCHAR(20) NOT NULL DEFAULT 'HELD',

    expires_at TIMESTAMPTZ NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_reservations_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_reservations_inventory
        FOREIGN KEY (inventory_id)
        REFERENCES event_inventory(id)
        ON DELETE RESTRICT,

    CONSTRAINT reservations_quantity_check
        CHECK (quantity > 0),

    CONSTRAINT reservations_status_check
        CHECK (
            status IN (
                'HELD',
                'EXPIRED',
                'CANCELLED',
                'CONFIRMED'
            )
        )
);
CREATE INDEX idx_reservations_user_id
ON reservations(user_id);

CREATE INDEX idx_reservations_inventory_id
ON reservations(inventory_id);

CREATE INDEX idx_reservations_status_expires_at
ON reservations(status, expires_at);
-- up
CREATE TABLE tasks (
	id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(50) NOT NULL,
    description TEXT,
    status VARCHAR(7) NOT NULL CHECK ( status in (‘pending’, ‘done’) ),
    due_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- down
DROP TABLE tasks;


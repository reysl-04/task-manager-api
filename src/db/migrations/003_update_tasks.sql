-- up
ALTER TABLE tasks
    ADD CONSTRAINT tasks_status_check CHECK (status IN ('pending', 'done')),
    ADD COLUMN IF NOT EXISTS due_date TIMESTAMPTZ;

-- down
ALTER TABLE tasks
    DROP CONSTRAINT IF EXISTS tasks_status_check;
    DROP COLUMN IF EXISTS due_date,

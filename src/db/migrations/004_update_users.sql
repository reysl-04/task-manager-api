-- up
ALTER TABLE users
    ADD CONSTRAINT email_check CHECK (email LIKE '%@gmail.com')

-- down
ALTER TABLE users
    DROP CONSTRAINT IF EXISTS email_check;
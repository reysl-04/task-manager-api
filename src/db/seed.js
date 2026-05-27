import pool from "./pool.js"
import bcript from "bcrypt"

async function seeder() {
    await pool.query(`DELETE from tasks`)
    await pool.query(`DELETE from users`)

    const hash1 = await bcript.hash('password123', 10)
    const hash2 = await bcript.hash('password456', 10)
    const hash3 = await bcript.hash('password789', 10)
    const hash4 = await bcript.hash('password135', 10) 

    const { rows: users } = await pool.query(`
        INSERT INTO users (name, email, password_hash)
        VALUES ('Alex', 'alex123@gmail.com', $1),
        ('Janet', 'janet456@gmail.com', $2),
        ('Orlando', 'Orlando789@gmail.com', $3),
        ('Maria', 'mary135@gmail.com', $4)
        RETURNING id
    `, [hash1, hash2, hash3, hash4])

    await pool.query(`
        INSERT INTO tasks (user_id, title, description, status)
        VALUES ($1, 'Migrate db', 'Migrate current in-memory storage to db', 'pending'),
        ($2, 'Buy groceries', 'Milk and eggs', 'pending'),
        ($3, 'Fix bug', 'Null pointer in auth', 'pending'),
        ($4, 'Read book', 'Clean code chapter 3', 'done'),
        ($2, 'Go to GYM', 'Chest, tricep and shoulders', 'done')
    `, [users[0].id, users[1].id, users[2].id, users[3].id])

    console.log('seeded')
    await pool.end()
}

seeder().catch(err => {
    console.error("seeded failed", err)
    process.exit(1)
})
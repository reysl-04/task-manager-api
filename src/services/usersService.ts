
import bcrypt from "bcrypt"
import pool from "../db/pool.js"

export default async function createUser({name, email, password}: {name: string, email: string, password: string}) {
    const passwordHash = await bcrypt.hash(password, 10)
    const { rows } = await pool.query(`
        INSERT INTO users (name, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING id, name, email, created_at
    `, [name, email, passwordHash])
    
    return rows[0]
}

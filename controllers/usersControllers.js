import pool from "../src/db/pool.js"
import createUser from "../services/usersService.js"

import { NotFoundError, ValidationError } from "../errors/customErrors.js"

export async function getAllUsers(req, res, next) {
    const { rows } = await pool.query(`
        SELECT id, name, email, created_at
        FROM users 
    `)
    res.status(200).json(rows)
}

export async function getUser(req, res, next) {
    const userId = req.params.userId

    const { rows } = await pool.query(`
        SELECT id, name, email, created_at
        FROM users
        WHERE id = $1 
    `, [userId])

    if (!rows[0]) {
        throw new NotFoundError(`User not found: ${userId}`)
    }
    res.status(200).json(rows[0])
}

export async function postUser(req, res, next) {
    const { name, email, password } = req.body
    const user = await createUser({ name, email, password })
    res.status(201).json(user)
}

export async function updateUser(req, res, next) {
    const userId = req.params.userId
    const userKeys = Object.keys(req.body)
    const allowedFields = ["name", "email"]

    for (const key of userKeys) {
        if (!allowedFields.includes(key)) {
            throw new ValidationError(`Invalid field: ${key}`)
        }
    }

    const values = Object.values(req.body)
    const setClause = userKeys.map((val, i) => {
        return `${val} = $${i + 1}`
    })

    const { rows } = await pool.query(`
        UPDATE users
        SET ${setClause.join(`, `)}
        WHERE id = $${setClause.length + 1}
        RETURNING id, name, email, created_at
    `, [...values, userId])

    if (!rows[0]) {
        throw new NotFoundError(`User not found ${userId}`)
    }
    res.status(200).json(rows[0])
}

export async function deleteUser(req, res, next) {
    const userId = req.params.userId

    const { rows } = await pool.query(`
        DELETE FROM users 
        WHERE id = $1
        RETURNING id
    `, [userId])

    if (!rows[0]) {
        throw new NotFoundError(`User does not exist: ID ${userId}`)
    }
    res.status(204).send()
}
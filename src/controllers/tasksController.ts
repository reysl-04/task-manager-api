import type { Request, Response, NextFunction } from 'express'

import pool from "../db/pool.js"
import { NotFoundError, ValidationError } from "../errors/customErrors.js"

export async function getAllTasks(req: Request, res: Response, next: NextFunction) {
    const userId = req.params.userId
    const filterKeys = Object.keys(req.query)

    const allowedFilters = ['status', 'due_date']
    
    for (const key of filterKeys) {
        if (!allowedFilters.includes(key)) {
            return next(new ValidationError(`Invalid field: ${key}`))
        }
    }

    const queryValues = []
    const whereClauses = []

    for (const key of filterKeys) {
        queryValues.push(req.query[key])
        whereClauses.push(`${key} = $${queryValues.length}`)
    }
    queryValues.push(userId)
    whereClauses.push(`user_id = $${queryValues.length}`)

    const query = `SELECT * FROM tasks WHERE ` + whereClauses.join(` AND `)

    const { rows } = await pool.query(query, queryValues)
    res.status(200).json(rows)
}

export async function getTask(req: Request, res: Response, next: NextFunction) {
    const taskId = req.params.taskId

    const { rows } = await pool.query(`
            SELECT *
            FROM tasks
            WHERE id = $1
        `, [taskId])

    if (!rows[0]) {
        return next(new NotFoundError(`Task Id not found: ${taskId}`))
    } else {
        res.status(200).json(rows[0])
    }
}

export async function postTask(req: Request, res: Response, next: NextFunction) {
    const userId = req.params.userId
    const taskBody = req.body

    try {
        const { rows } = await pool.query(`
            INSERT INTO tasks (user_id, title, description, due_date, status)
            VALUES ($1, $2, $3, $4, 'pending')
            RETURNING id
        `, [userId, taskBody.title, taskBody.description, taskBody.dueDate])

        res.status(201).json({ message: `New task created. ID: ${rows[0].id}` })
    } catch(e: any) {
        if (e.code === '23503') {
            return next(new NotFoundError(`User not found`))
        }
        return next(e)
    }
}

export async function updateTask(req: Request, res: Response, next: NextFunction) {
    const taskId = req.params.taskId
    const allowedFields = ['title', 'description', 'due_date', 'status']

    const updates = Object.keys(req.body).filter(key => allowedFields.includes(key))
    if (updates.length === 0) {
        return next(new ValidationError(`No valid field provided`))
    }

    const setClause = updates.map((key, i) => {
        return `${key} = $${i + 1}`
    })
    const values = updates.map(key => req.body[key])
    values.push(taskId)

    const query = `UPDATE tasks SET ${setClause.join(", ")} WHERE id = $${values.length} RETURNING id`
    try {
        const { rows } = await pool.query(`${query}`, values)
        if (!rows[0]) {
            return next(new NotFoundError(`Task Id not found`))
        } else {
            res.status(200).json({message: `Task updated: ${taskId}`})
        }
    } catch(e) {
        return next(e)
    }
}


export async function deleteTask(req: Request, res: Response, next: NextFunction) {
    const taskId = req.params.taskId

    try {
        const { rows } = await pool.query(`
            DELETE FROM tasks
            WHERE id = $1
            RETURNING id
        `, [taskId])

        if (!rows[0]) {
            return next(new NotFoundError(`Task ID not found: ${taskId}`))
        } else {
            res.status(204).send()
        }
    } catch(e) {
        return next(e)
    }
}

// task Id and task index are really repetitive, so Ill have a function thast is called when that work need to be done
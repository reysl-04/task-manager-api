import store from "../data/store.js"
import crypto from "node:crypto"
import { NotFoundError } from "../errors/customErrors.js"
import { ValidationError } from "../errors/customErrors.js"


export function getAllTasks(req, res) {
    // Fix: tried get with not-existing listId, returns an empty list
    const listId = req.params.listId
    const tasksByListId = store.tasks.filter(task => task.listId === listId)

    res.status(200).json(tasksByListId)
}

export function getTask(req, res, next) {
    const taskId = req.params.taskId // Validate Id? I don't t
    const taskIndex = store.tasks.findIndex(task => task.id === taskId)
    
    if (taskIndex !== -1) {
        res.status(200).json(store.tasks[taskIndex])
    } else {
        return next(new NotFoundError(`Task ID not found: ${taskId}`))
    }
}

export function postTask(req, res, next) {
    // Requires listId, dueDate, name & description
    if (!req.body) {
        return next(new Error('No body provided'))
    }

    const taskBody = req.body
    const missingFields = []

    if (!taskBody.name) { 
        missingFields.push('name')
    }
    if (!taskBody.description) {
        missingFields.push('description')
    }
    if (!taskBody.dueDate) {
        missingFields.push('dueDate')
    }

    if (missingFields.length > 0) {
        return next(new ValidationError(`Missing Fields: ${missingFields.join(', ')}`))
    }

    const validListId = store.lists.some(list => list.id === req.params.listId)
    
    if (!validListId) {
        return next(new NotFoundError(`Invalid List ID: ${taskBody.listId}`))
    }

    // I have to validate due date and the other fields, but i think I can use Zod for that. Ill do it later
    const newTask = {
        listId: req.params.listId,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        dueDate: taskBody.dueDate,
        status: 'pending',
        name: taskBody.name,
        description: taskBody.description
    }

    store.tasks.push(newTask)
    res.status(201).json({ message: `New task created - ID: ${newTask.id}` }) // Should I json the whole task information?

}

export function updateTask(req, res, next) {
    const taskId = req.params.taskId
    const taskIndex = store.tasks.findIndex(task => task.id === taskId)
    
    if (taskIndex === -1) {
        return next(new NotFoundError(`Task ID not found: ${taskId}`))
    }

    // I need to add a checker that makes the task.status value be either pending or done. I'll add it later
    const taskBody = req.body
    const allowedFields = ['status', 'name', 'description', 'dueDate']

    for (const field in taskBody) {
        if (allowedFields.includes(field)) {
            store.tasks[taskIndex][field] = taskBody[field]
        } else {
            return next(new ValidationError(`Invalid field: ${field}`))
        }
    }

    res.status(200).json({ message: `Task Updated - ID: ${taskId} `})
}

export function deleteTask(req, res, next) {
    const taskId = req.params.taskId
    const taskIndex = store.tasks.findIndex(task => task.id === taskId)

    if (taskIndex === -1) {
        return next(new NotFoundError(`Task ID not found: ${taskId}`))
    }

    store.tasks.splice(taskIndex, 1)
    res.status(204).send()


}

// task Id and task index are really repetitive, so Ill have a function thast is called when that work need to be done
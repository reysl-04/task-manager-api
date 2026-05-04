import store from "../data/store.js"
import crypto from "node:crypto"
import { NotFoundError, ValidationError } from "../errors/customErrors.js"


export function getAllTasks(req, res, next) {
    const listId = req.params.listId
    const filterKeys = Object.keys(req.query)

    const allowedFilters = ['status', 'dueDate', 'name']
    
    for (const key of filterKeys) {
        if (!allowedFilters.includes(key)) {
            return next(new ValidationError(`Invalid field: ${key}`))
        }
    }

    const allTasks = store.tasks.filter((task) => {
        if (task.listId !== listId) {
            return false
        }
        for (const key of filterKeys) {
            if (req.query[key] !== task[key]) {
                return false
            }
        }
        return true
    })

    res.status(200).json(allTasks)
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
    const taskBody = req.body
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

    const taskBody = req.body

    for (const field in taskBody) {
        store.tasks[taskIndex][field] = taskBody[field]
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
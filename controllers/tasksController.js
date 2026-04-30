import store from "../data/store.js"
import crypto from "node:crypto"

export function getAllTasks(req, res) {
        res.status(200).json(store.tasks)
}

export function getTask(req, res, next) {
    const taskId = req.params.id // Validate Id? I don't t
    const taskIndex = store.tasks.findIndex(task => task.id === taskId)
    
    if (taskIndex !== -1) {
        res.status(200).json(store.tasks[taskIndex])
    } else {
        return next(new Error(`Task ID not found: ${taskId}`))
    }
}

export function postTask(req, res, next) {
    // Requires listId, dueDate, name & description
    if (!req.body) {
        return next(new Error('No body provided'))
    }

    const taskBody = req.body
    // Check for all fields 
    if (!taskBody.listId || !taskBody.name || !taskBody.description || !taskBody.dueDate) {
        return next(new Error('Missing information')) 
        // I can especify what is missing, but later
    }

    const validListId = store.lists.some(list => list.id === taskBody.listId)
    
    if (!validListId) {
        return next(new Error(`Invalid List ID: ${taskBody.listId}`))
    }

    // Status should always be pending though, as its started
    // convert date into a standard format
    // ListID would be a problem, how do I associate it? same id as list most likely


    // I have to validate due date and the other fields, but i think I can use Zod for that. Ill do it later
    const newTask = {
        listId: taskBody.listId,
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
    const taskId = req.params.id
    const taskIndex = store.tasks.findIndex(task => task.id === taskId)
    
    if (taskIndex === -1) {
        return next(new Error(`Task ID not found: ${taskId}`))
    }

    // I need to add a checker that makes the task.status value be either pending or done. I'll add it later
    const taskBody = req.body
    const allowedFields = ['status', 'name', 'description', 'dueDate']

    for (const field in taskBody) {
        if (allowedFields.includes(field)) {
            store.tasks[taskIndex][field] = taskBody[field]
        } else {
            return next(new Error(`Invalid field: ${field}`))
        }
    }

    res.status(200).json({ message: `Task Updated - ID: ${taskId} `})
}

export function deleteTask(req, res, next) {
    const taskId = req.params.id
    const taskIndex = store.tasks.findIndex(task => task.id === taskId)

    if (taskIndex === -1) {
        return next(new Error(`Task ID not found: ${taskId}`))
    }

    store.tasks.splice(taskIndex, 1)
    res.status(204).send()


}

// task Id and task index are really repetitive, so Ill have a function thast is called when that work need to be done
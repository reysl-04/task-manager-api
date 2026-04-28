import store from "../data/store.js"


export function getAllLists(req, res) {
    res.status(200).json(store.lists)
}

export function getList(req, res, next) {
    const id = req.params.id
    const body = store.lists.find(list => list.id === id)

    if (!body) {
        return next(new Error(`List Id not found: ${id}`)) // Add status 4xx that says list not found
    }
    res.status(200).json(body)
}

export function postList(req, res, next) {
    
    if (!req.body || req.body.name) {
        return next(new Error('Name is required'))
    }

    const newList = {
        id: Date.now().toString(),
        name: req.body.name,
        createdAt: new Date().toISOString()
    }

    store.lists.push(newList)
    res.status(201).json(newList)
}

export function deleteList(req, res, next) {
    const id = req.params.id
    let index = store.lists.findIndex(list => list.id === id)

    if (index === -1) {
        return next(new Error(`List Id not found: ${id}`))
    }

    store.lists.splice(index, 1)
    res.status(204).send()
}

export function updateList(req, res, next) {
    const id = req.params.id
    const listId = store.lists.findIndex(list => list.id === id)

    if (listId === -1) {
        return next(new Error(`List Id not found: ${id}`))
    }
    
    store.lists[listId].name = req.body.name
    res.status(200).json(store.lists[listId])
}
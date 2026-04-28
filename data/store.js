const store = {
    lists: [],
    tasks: []
}

const storeTemplate = {
    lists: [
        {
            id: 'int',
            createdAt: 'date',
            name: 'string' 
        }
    ],

    tasks: [
        {
            listId: 'int',
            id: 'int',
            createdAt: 'Date',
            dueDate: 'Date',
            status: 'string: (pending | done)',
            name: 'string',
            description: 'string'
        }
    ] 
}

export default store
import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database()

export const routes = [
	{
		method: 'GET',
		path: buildRoutePath('/tasks'),
		handler: (request, response) => {
			const { search } = request.query
			
			const query = search ? { title: search, description: search } : undefined

			const tasks = database.select('tasks', search ? query : undefined)
			
			return response.end(JSON.stringify(tasks))
		}
	},
	{
		method: 'POST',
		path: buildRoutePath('/tasks'),
		handler: (request, response) => {
			const { title, description } = request.body

			if (!title) {
				return response.writeHead(400).end(JSON
					.stringify({ message: 'Title is required' }))
			}

			if (!description) {
				return response.writeHead(400).end(JSON
					.stringify({ message: 'Description is required' }))
			}
			
			const task = {
				id: randomUUID(),
				title,
				description,
				completedAt: null,
				createdAt: new Date(),
				updatedAt: new Date(),
			}
			
			database.insert('tasks', task)
			
			return response.writeHead(201).end()
		}
	},
	{
		method: 'DELETE',
		path: buildRoutePath('/tasks/:id'),
		handler: (request, response) => {
			const { id } = request.params

			const [ task ] = database.select('tasks', { id })

			if (!task) {
				return response.writeHead(404).end(JSON
					.stringify({ message: 'Task not found' }))
			}
			
			database.delete('tasks', id)
			
			return response.writeHead(204).end()
		}
	},
	{
		method: 'PUT',
		path: buildRoutePath('/tasks/:id'),
		handler: (request, response) => {
			const { id } = request.params
			const { title, description } = request.body

			const [ task ] = database.select('tasks', { id })

			if (!task) {
				return response.writeHead(404).end(JSON
					.stringify({ message: 'Task not found' }))
			}

			if (!title) {
				return response.writeHead(400).end(JSON
					.stringify({ message: 'Title is required' }))
			}

			if (!description) {
				return response.writeHead(400).end(JSON
					.stringify({ message: 'Description is required' }))
			}
			
			database.update('tasks', id, {
				...task,
				title,
				description,
				updatedAt: new Date(),
			})
			
			return response.writeHead(204).end()
		}
	},
	{
		method: 'PATCH',
		path: buildRoutePath('/tasks/:id/complete'),
		handler: (request, response) => {
			const { id } = request.params

			const [ task ] = database.select('tasks', { id })

			if (!task) {
				return response.writeHead(404).end(JSON
					.stringify({ message: 'Task not found' }))
			}
			
			database.update('tasks', id, {
				...task,
				completedAt: new Date(),
				updatedAt: new Date(),
			})
			
			return response.writeHead(204).end()
		}
	}
]
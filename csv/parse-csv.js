import { parse } from 'csv-parse';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

fs.createReadStream(path.join(__dirname, 'tasks.csv'))
	.pipe(parse({
		columns: ['title', 'description'],
		from_line: 2
	}))
	.on('data', async (data) => {
		fetch('http://localhost:3333/tasks', {
			method: 'POST',
			body: JSON.stringify(data),
	})
})
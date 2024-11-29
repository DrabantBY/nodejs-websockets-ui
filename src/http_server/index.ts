import { createServer } from 'node:http';
import { resolve, dirname } from 'node:path';
import { readFile } from 'node:fs';

export const httpServer = createServer((req, res) => {
	const url = req.url === '/' ? '/front/index.html' : `/front${req.url}`;

	const file = resolve(dirname('')) + url;

	readFile(file, (err, data) => {
		if (err) {
			res.writeHead(404);
			res.end(JSON.stringify(err));
			return;
		}
		res.writeHead(200);
		res.end(data);
	});
});

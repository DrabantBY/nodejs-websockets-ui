import { createServer } from 'node:http';
import { resolve, dirname } from 'node:path';
import { readFile } from 'node:fs';

const httpServer = (port: number) => {
	const server = createServer(({ url }, res) => {
		const route = url === '/' ? '/front/index.html' : `/front${url}`;

		const file = resolve(dirname('')) + route;

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

	server.on('listening', () => {
		console.log(`Start static http server on the ${port} port!`);
	});

	server.listen(port);
};

export default httpServer;

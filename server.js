import http from 'http';
import user from './user.js';
import { error } from 'console';

const server = http.createServer((req, res) => {
  const { method, url } = req;
  console.log(`Received ${method} request for ${url}`);

  if (method === 'GET' && url === '/user') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(user));
  } else if (method === 'POST' && url === '/user') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        console.log(body);
        const newUser = JSON.parse(body);
        const addUser = {
          id: user.length + 1,
          name: newUser.name,
        };
        user.push(addUser);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(addUser));
      } catch {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
  } else if (method === 'PUT' && req.url.startsWith('/user/')) {
    const id = parseInt(url.split('/')[2]);
    let body = '';
    res.on('data', (chunk) => {
      body += chunk.toString();
    });
    res.on('end', () => {
      const updatedUser = JSON.parse(body);
      console.log(updatedUser);
      const userIndex = user.findIndex((u) => u.id === id);
      if (userIndex !== -1) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'User not found' }));
      }
      user[userIndex] = { ...user[userIndex], ...updatedUser };
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(user[userIndex]));
    });
  } else if (method === 'DELETE' && url.startsWith('/user/')) {
    const id = parseInt(url.split('/')[2]);
    const userIndex = user.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'user not found' }));
    }
    user = user.filter((u) => u.id !== id);
    res.writeHead(204);
    res.end();
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});

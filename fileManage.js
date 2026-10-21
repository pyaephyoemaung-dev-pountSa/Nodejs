import http from 'http';
// import user from './user.js';
import url from 'node:url';
import fs from 'fs';

const server = http.createServer((req, res) => {
  let addUser = [];
  if (req.method === 'GET') {
    let q = url.parse(req.url, true);
    let filename = '.' + q.pathname + '.json';
    fs.readFile(filename, function (err, data) {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end('404 Not Found');
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.write(data);
      return res.end();
    });
  } else if (req.method === 'POST')
  {
      
      
      req.on("data", (data) =>
      {
          console.log(data)
      })
      console.log(req.data)
    const baseUrl = `http://${req.headers.host}`;
    const parsedUrl = new URL(req.url, baseUrl);
    console.log(parsedUrl);
    let filename = '.' + parsedUrl.pathname + '.json';
    console.log(addUser);
    let newUser = {
      id: addUser.length + 1,
      name: parsedUrl.searchParams.get('name'),
      age: parsedUrl.searchParams.get('age'),
      };
      console.log(newUser)
    addUser = [...newUser];
    fs.appendFile(filename, JSON.stringify(addUser));
    res.writeHead(201, { 'Content-type': 'application/json' });
    return res.end(JSON.stringify(user));
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

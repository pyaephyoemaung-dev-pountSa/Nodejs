import http from 'http';
// import user from './user.js';
import fs from 'fs';

const getUsers = async () => {
  try {
    let data = fs.readFileSync('./user.json', 'utf8');
    const users = JSON.parse(data);
    return users;
  } catch (error) {
    console.log(error);
  }
};

const createUser = (users) => {
  fs.writeFileSync('./user.json', JSON.stringify(users), 'utf-8');
};
const updateUser = (users) => {
  fs.writeFileSync('./user.json', JSON.stringify(users), 'utf-8');
};
const server = http.createServer(async (req, res) => {
  const { method, url } = req;
  console.log(`Received ${method} request for ${url}`);

  if (method === 'GET' && url === '/user') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    const users = getUsers();
    res.end(JSON.stringify(users));
  } else if (method === 'POST' && url === '/user') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const users = getUsers();

        const user = JSON.parse(body);
        const newUser = {
          id: users.length + 1,
          name: user.name,
          age: user.age,
        };

        const updateUsers = users.push(newUser);
        createUser(updateUsers);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(updateUsers));
      } catch {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
  } else if (method === 'PATCH' && req.url.startsWith('/user/')) {
    const id = parseInt(url.split('/')[2]);
    console.log('here put methods -> ', id);
    let body = '';
    for await (const chunk of req) {
      body += chunk;
    }
    try {
      const users = await getUsers();
      const upUser = JSON.parse(body);

      console.log(upUser, users);
      const userIndex = users.findIndex((u) => u.id === id);
      console.log(userIndex);
      if (userIndex !== -1) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'User not found' }));
      }
      users[userIndex] = { ...users[userIndex], ...upUser };
      const upResult = users[userIndex];
      updateUser(upResult);
      console.log(upResult);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(upResult));
    } catch (error) {
      console.log(error);
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid JSON' }));
    }
  } else if (method === 'DELETE' && url.startsWith('/user/')) {
    const id = parseInt(url.split('/')[2]);
    console.log(id);
    const { users } = getUsers();
    const userIndex = users.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'user not found' }));
    }
    const deleteUser = users.filter((u) => u.id !== id);
    createUser(deleteUser);
    res.writeHead(201, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(deleteUser));
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});

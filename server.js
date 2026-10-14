import http from 'http';
const user = [
  {
    id: 1,
    name: 'John Doe',
  },
  {
    id: 2,
    name: 'Jane Smith',
  },
];
const server = http.createServer((req, res) => {
  const { method, url } = req;
  if (method === 'GET' && url === '/users') {
    const newUser = {
      id: user.length + 1,
      name: 'ppm',
    };
    user.push(newUser);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(user));
  }
});
server.listen(3000, () => {
  console.log('Server is running on port 3000');
});

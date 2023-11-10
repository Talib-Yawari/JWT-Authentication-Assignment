const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 30000;
const secretKey = 'yourSecretKey'; 

app.use(bodyParser.json());

const users = [
  { id: 1, username: 'talib', password: '123' },
  { id: 2, username: 'ali', password: 'abc' },
];

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: there is not any token' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized: thres is not any token' });
    }

    req.user = decoded;
    next();
  });
};

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find((u) => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'not correct' });
  }

  const token = jwt.sign({ id: user.id, username: user.username }, secretKey, {
    expiresIn: '1h', 
  });

  res.json({ token });
});

app.get('/protected', verifyToken, (req, res) => {
  res.json({ message: 'Authenticated user', user: req.user });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Load accounts from a JSON file
const accountsFile = 'accounts.json';
let accounts = fs.existsSync(accountsFile) ? JSON.parse(fs.readFileSync(accountsFile)) : {};

// Create account
app.post('/create-account', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send({ message: 'Username and password are required.' });
  }

  if (accounts[username]) {
    return res.status(400).send({ message: 'Username already exists.' });
  }

  accounts[username] = password;
  fs.writeFileSync(accountsFile, JSON.stringify(accounts, null, 2));
  res.send({ message: 'Account created successfully.' });
});

// Login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (accounts[username] && accounts[username] === password) {
    res.send({ message: 'Login successful.' });
  } else {
    res.status(401).send({ message: 'Invalid username or password.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

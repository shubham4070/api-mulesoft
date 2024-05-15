// Import required modules
const express = require('express');

// Create an Express app
const app = express();
const port = 3000; // Port number for the server

// Middleware to parse JSON bodies
app.use(express.json());

// Logger middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    res.on('finish', () => {
        console.log(`${res.statusCode} ${res.statusMessage}; ${res.get('Content-Length') || 0}b sent`);
    });
    next();
});

// Sample data for users
let users = [
    { id: 1, name: 'John' },
    { id: 2, name: 'Alice' }
];

// Route to get all users
app.get('/api/users', (req, res) => {
    res.json(users);
});

// Route to get a single user by ID
app.get('/api/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const user = users.find(user => user.id === userId);
    if (!user) {
        return res.status(404).send('User not found');
    }
    res.json(user);
});

// Route to create a new user
app.post('/api/users', (req, res) => {
    const newUser = {
        id: users.length + 1,
        name: req.body.name
    };
    users.push(newUser);
    res.status(201).json(newUser);
});

// Route to update an existing user
app.put('/api/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const user = users.find(user => user.id === userId);
    if (!user) {
        return res.status(404).send('User not found');
    }
    user.name = req.body.name;
    res.json(user);
});

// Route to delete a user
app.delete('/api/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    users = users.filter(user => user.id !== userId);
    res.status(204).send();
});

// Route with delay and error
app.get('/api/delayed', (req, res) => {
    setTimeout(() => {
        res.status(500).send('Remotely Closed');
    }, 20000); // 20-second delay
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

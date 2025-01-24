const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

let tasks = [];
let taskIdCounter = 1;

app.post('/tasks', (req, res) => {
    const { title, category } = req.body;
    if (!title || !category) {
        return res.status(400).json({ error: 'Title and category are required.' });
    }
    const task = {
        id: taskIdCounter++,
        title,
        category,
        isDeleted: false
    };
    tasks.push(task);
    res.status(201).json(task);
});

app.get('/tasks', (req, res) => {
    const activeTasks = tasks.filter(task => !task.isDeleted);
    res.json(activeTasks);
});

app.get('/tasks/:id', (req, res) => {
    const task = tasks.find(t => t.id === parseInt(req.params.id) && !t.isDeleted);
    if (!task) {
        return res.status(404).json({ error: 'Task not found.' });
    }
    res.json(task);
});

app.put('/tasks/:id', (req, res) => {
    const { title, category } = req.body;
    const task = tasks.find(t => t.id === parseInt(req.params.id) && !t.isDeleted);
    if (!task) {
        return res.status(404).json({ error: 'Task not found.' });
    }
    if (title) task.title = title;
    if (category) task.category = category;
    res.json(task);
});

app.delete('/tasks/:id', (req, res) => {
    const task = tasks.find(t => t.id === parseInt(req.params.id));
    if (!task) {
        return res.status(404).json({ error: 'Task not found.' });
    }
    task.isDeleted = true;
    res.json({ message: 'Task marked as deleted.', task });
});

app.post('/tasks/:id/recover', (req, res) => {
    const task = tasks.find(t => t.id === parseInt(req.params.id) && t.isDeleted);
    if (!task) {
        return res.status(404).json({ error: 'Task not found or not deleted.' });
    }
    task.isDeleted = false;
    res.json({ message: 'Task recovered.', task });
});

app.listen(port, () => {
    console.log(`Task management API is running on http://localhost:${port}`);
});

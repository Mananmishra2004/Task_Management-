const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/taskManager')


const taskSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('task', taskSchema);
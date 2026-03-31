const mongoose = require('mongoose');

// ✅ Use Atlas connection with database name added
mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://mishramanan488_db_user:52pioVPWSUh3olaY@cluster0.kvtejsq.mongodb.net/taskManager?retryWrites=true&w=majority')
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => console.log("❌ MongoDB Error:", err));


// ✅ Schema
const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
    createdAt: { type: Date, default: Date.now }
});

// ✅ Model export
module.exports = mongoose.model('Task', taskSchema);
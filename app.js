const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const taskModel = require('./models/task');

// 🔐 Secret
const JWT_SECRET = process.env.JWT_SECRET || "task_secret_123";

// ✅ MongoDB Connection (Improved)
mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://mishramanan488_db_user:52pioVPWSUh3olaY@cluster0.kvtejsq.mongodb.net/taskManager?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => {
    console.error("❌ MongoDB Error:", err);
    process.exit(1); // stop app if DB fails
});

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Middleware: Protect Admin Routes
const isAdmin = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.redirect('/login');
    try {
        jwt.verify(token, JWT_SECRET);
        next();
    } catch (err) {
        res.clearCookie("token");
        res.redirect('/login');
    }
};

// --- ROUTES ---

// Login
app.get('/login', (req, res) => res.render("login"));

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (email === "admin@gmail.com" && password === "admin123") {
        const token = jwt.sign({ email }, JWT_SECRET);
        res.cookie("token", token, { httpOnly: true });
        return res.redirect("/admin");
    }

    res.send("Invalid Credentials. <a href='/login'>Try Again</a>");
});

// Logout
app.get('/logout', (req, res) => {
    res.clearCookie("token");
    res.redirect("/read");
});

// Create
app.get('/create-task', isAdmin, (req, res) => res.render("index"));

app.post('/create', isAdmin, async (req, res) => {
    try {
        await taskModel.create(req.body);
        res.redirect("/admin");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error creating task");
    }
});

// Read (FIXED 🔥)
app.get('/read', async (req, res) => {
    try {
        let tasks = await taskModel.find();
        let loggedIn = !!req.cookies.token;
        res.render("read", { tasks, isAdmin: loggedIn });
    } catch (err) {
        console.error("❌ READ ERROR:", err);
        res.status(500).send("Internal Server Error");
    }
});

// Admin Dashboard
app.get('/admin', isAdmin, async (req, res) => {
    try {
        let tasks = await taskModel.find();
        res.render("admin", { tasks });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading admin");
    }
});

// Edit
app.get('/edit/:id', isAdmin, async (req, res) => {
    try {
        let task = await taskModel.findById(req.params.id);
        res.render("edit", { task });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading edit page");
    }
});

// Update
app.post('/update/:id', isAdmin, async (req, res) => {
    try {
        await taskModel.findByIdAndUpdate(req.params.id, req.body);
        res.redirect("/admin");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating task");
    }
});

// Delete
app.get('/delete/:id', isAdmin, async (req, res) => {
    try {
        await taskModel.findByIdAndDelete(req.params.id);
        res.redirect("/admin");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting task");
    }
});

// Default route
app.get('/', (req, res) => res.redirect('/read'));

// ✅ Render PORT fix
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
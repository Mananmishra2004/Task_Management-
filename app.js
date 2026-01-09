const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const taskModel = require('./models/task');

const JWT_SECRET = "task_secret_123";

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
        res.cookie("token", token);
        return res.redirect("/admin");
    }
    res.send("Invalid Credentials. <a href='/login'>Try Again</a>");
});

app.get('/logout', (req, res) => {
    res.clearCookie("token");
    res.redirect("/read");
});

// Create (Admin Only)
app.get('/create-task', isAdmin, (req, res) => res.render("index"));
app.post('/create', isAdmin, async (req, res) => {
    await taskModel.create(req.body);
    res.redirect("/admin");
});

// Read (Public)
app.get('/read', async (req, res) => {
    let tasks = await taskModel.find();
    let loggedIn = !!req.cookies.token;
    res.render("read", { tasks, isAdmin: loggedIn });
});

// Admin Dashboard
app.get('/admin', isAdmin, async (req, res) => {
    let tasks = await taskModel.find();
    res.render("admin", { tasks });
});

// Edit & Update
app.get('/edit/:id', isAdmin, async (req, res) => {
    let task = await taskModel.findById(req.params.id);
    res.render("edit", { task });
});

app.post('/update/:id', isAdmin, async (req, res) => {
    await taskModel.findByIdAndUpdate(req.params.id, req.body);
    res.redirect("/admin");
});

// Delete
app.get('/delete/:id', isAdmin, async (req, res) => {
    await taskModel.findByIdAndDelete(req.params.id);
    res.redirect("/admin");
});

app.get('/', (req, res) => res.redirect('/read'));

app.listen(3000, () => console.log("Server at http://localhost:3000"));
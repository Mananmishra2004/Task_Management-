# 🚀 Task Management System (Glassmorphism UI)

A modern, full-stack CRUD application built with Node.js and MongoDB. This system features a dual-access model where public users can view the roadmap, while an authenticated Admin can manage tasks with full authorization.



## ✨ Key Features

* **Admin Authentication:** Secure login using JWT (JSON Web Tokens) and Cookie-parsing.
* **Role-Based Authorization:** * **Admin:** Full CRUD (Create, Read, Update, Delete) permissions.
    * **Public:** Read-only access to the task roadmap.
* **Modern Glassmorphism UI:** Styled with Tailwind CSS, featuring radial gradients, backdrop blurs, and mesh patterns.
* **Persistent Storage:** Powered by MongoDB to ensure your tasks are saved securely.
* **Responsive Design:** Fully optimized for mobile, tablet, and desktop views.

## 🛠️ Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose ODM)
* **Security:** JWT, Cookie-parser, Bcrypt (Optional hashing)
* **Frontend:** EJS (Embedded JavaScript), Tailwind CSS

---

## ⚙️ Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/task-manager.git](https://github.com/your-username/task-manager.git)
    cd task-manager
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Database Connection:**
    Ensure you have MongoDB running locally at `mongodb://127.0.0.1:27017/`. The app will automatically create the `taskManager` database.

4.  **Start the server:**
    ```bash
    node app.js
    ```
    *Or if you have nodemon installed:* `nodemon app.js`

5.  **Access the app:**
    Open your browser and go to `http://localhost:3000`

---

## 🔐 Admin Credentials

To access the management dashboard, use the following default credentials:
* **Email:** `admin@gmail.com`
* **Password:** `admin123`



---

## 📂 Project Structure

```text
├── models/
│   └── task.js          # Mongoose Schema & DB connection
├── views/
│   ├── index.ejs        # Create Task form
│   ├── read.ejs         # Public Roadmap view
│   ├── edit.ejs         # Update Task form
│   ├── login.ejs        # Admin Login page
│   └── admin.ejs        # Admin Control Panel
├── app.js               # Main server and Auth logic
├── package.json         # Project dependencies
└── README.md            # Documentation
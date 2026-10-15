/*
 * Task 4 - UserHub REST API (single file)
 * SaiKet Systems Full Stack Development internship
 *
 * Run:
 *   npm install
 *   node server.js
 * Server: http://localhost:3000
 */
const path = require("path");
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors()); // enable CORS for cross-origin access
app.use(express.json()); // parse JSON request bodies
app.use(express.static(path.join(__dirname, "public"), { index: false }));

// ---------- In-memory data (replaced by MySQL in Task 5) ----------
let users = [
  { id: 1, name: "Asha Raman", email: "asha@example.com", age: 24 },
  { id: 2, name: "Karthik Selvam", email: "karthik@example.com", age: 28 },
];
let nextId = 3;

// ---------- Helpers ----------
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate({ name, email, age }) {
  const errors = [];
  if (typeof name !== "string" || name.trim().length < 2 || name.trim().length > 50)
    errors.push("name must be a string of 2 to 50 characters");
  if (typeof email !== "string" || !emailRegex.test(email.trim()))
    errors.push("email must be a valid email address");
  if (!Number.isInteger(age) || age < 1 || age > 120)
    errors.push("age must be a whole number between 1 and 120");
  return errors;
}

const emailTaken = (email, exceptId) =>
  users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.id !== exceptId);

function findUser(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    res.status(400).json({ error: "id must be a number" });
    return null;
  }
  const user = users.find((u) => u.id === id);
  if (!user) {
    res.status(404).json({ error: `User with id ${id} not found` });
    return null;
  }
  return user;
}

// ---------- Routes ----------
app.get("/", (req, res) => {
  if (req.headers.accept && req.headers.accept.includes("text/html")) {
    return res.sendFile(path.join(__dirname, "public", "index.html"));
  }
  res.json({
    message: "ProfileVault API is running",
    endpoints: ["GET /users", "GET /users/:id", "POST /users", "PUT /users/:id", "DELETE /users/:id"],
  });
});

app.get("/api", (req, res) => {
  res.json({
    message: "ProfileVault API is running",
    endpoints: ["GET /users", "GET /users/:id", "POST /users", "PUT /users/:id", "DELETE /users/:id"],
  });
});

// READ all (optional search: /users?name=asha)
app.get("/users", (req, res) => {
  const { name } = req.query;
  res.json(
    name ? users.filter((u) => u.name.toLowerCase().includes(String(name).toLowerCase())) : users
  );
});

// READ one
app.get("/users/:id", (req, res) => {
  const user = findUser(req, res);
  if (user) res.json(user);
});

// CREATE (single or bulk array)
app.post("/users", (req, res) => {
  if (Array.isArray(req.body)) {
    const created = [];
    const errors = [];
    for (const item of req.body) {
      const errs = validate(item || {});
      if (errs.length) {
        errors.push({ item, error: errs.join(", ") });
        continue;
      }
      if (emailTaken(item.email)) {
        errors.push({ item, error: "Email already exists" });
        continue;
      }
      const user = { id: nextId++, name: item.name.trim(), email: item.email.trim(), age: item.age };
      users.push(user);
      created.push(user);
    }
    return res.status(201).json({ created, errors, total: created.length });
  }

  const errors = validate(req.body || {});
  if (errors.length) return res.status(400).json({ errors });
  if (emailTaken(req.body.email)) return res.status(409).json({ error: "Email already exists" });

  const user = { id: nextId++, name: req.body.name.trim(), email: req.body.email.trim(), age: req.body.age };
  users.push(user);
  res.status(201).json(user);
});

// Clear all users (for manual reset)
app.delete("/users", (req, res) => {
  users = [];
  res.json({ message: "All user profiles cleared successfully" });
});

// UPDATE
app.put("/users/:id", (req, res) => {
  const user = findUser(req, res);
  if (!user) return;
  const errors = validate(req.body || {});
  if (errors.length) return res.status(400).json({ errors });
  if (emailTaken(req.body.email, user.id)) return res.status(409).json({ error: "Email already exists" });

  user.name = req.body.name.trim();
  user.email = req.body.email.trim();
  user.age = req.body.age;
  res.json(user);
});

// DELETE
app.delete("/users/:id", (req, res) => {
  const user = findUser(req, res);
  if (!user) return;
  users = users.filter((u) => u.id !== user.id);
  res.json({ message: "User deleted", user });
});

// ---------- Errors ----------
app.use((req, res) => res.status(404).json({ error: "Route not found" }));

app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Invalid JSON in request body" });
  }
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => console.log(`ProfileVault API running on port ${PORT}`));

module.exports = app;

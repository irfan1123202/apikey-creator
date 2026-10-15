# Task 4 - UserHub REST API

SaiKet Systems Full Stack Development internship, Task 4: Build a Basic REST API (Node.js + Express).
Data is stored in memory (a MySQL database is added in Task 5).

## Run
```
npm install
npm start
```
Server: http://localhost:3000

## Endpoints
| Method | URL | Description | Success |
|--------|-----|-------------|---------|
| GET | /users | List users (optional `?name=` search) | 200 |
| GET | /users/:id | Get one user | 200 |
| POST | /users | Create user | 201 |
| PUT | /users/:id | Update user | 200 |
| DELETE | /users/:id | Delete user | 200 |

User body: `{ "name": "Priya Nair", "email": "priya@example.com", "age": 22 }`
Rules: name 2-50 chars, valid unique email, age 1-120.
Errors: 400 invalid data, 404 not found, 409 duplicate email.

## Test in Postman
Import `UserHub-API.postman_collection.json` and run the collection (9 requests with automatic tests).

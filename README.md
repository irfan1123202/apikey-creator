# AWS ProfileVault API

SaiKet Systems Full Stack Development Internship - Task 4: High-Performance REST API (Node.js + Express) & Interactive Cloud Dashboard.

Data is stored in-memory with manual entry, bulk JSON import, validation, and multi-theme dashboard support.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/irfan1123202/apikey-creator)

## Run Locally
```bash
npm install
npm start
```
Server & Dashboard: http://localhost:3000

## Features
- **Modern Cloud Themes**: AWS Obsidian Gold, Cyber Cloud Cyan, Neo Violet Nebula, and Emerald Matrix.
- **Manual Data Entry**: Quick-insert bar and modal forms directly in the web UI.
- **Bulk Import**: Paste JSON arrays to insert multiple user profiles at once.
- **Export Data**: One-click JSON export of stored profiles.
- **RFC Validation**: Name (2-50 chars), unique valid RFC email, age (1-120 integer).

## REST Endpoints
| Method | URL | Description | Success |
|---|---|---|---|
| `GET` | `/` | Web Dashboard (Browser) or API status (JSON client) | 200 |
| `GET` | `/users` | List profiles (supports `?name=` filter) | 200 |
| `GET` | `/users/:id` | Get profile by ID | 200 |
| `POST` | `/users` | Create profile (single object or bulk array) | 201 |
| `PUT` | `/users/:id` | Update profile by ID | 200 |
| `DELETE` | `/users/:id` | Delete profile by ID | 200 |
| `DELETE` | `/users` | Clear all profiles (for manual reset) | 200 |

Profile schema: `{ "name": "Priya Nair", "email": "priya@example.com", "age": 22 }`

## Postman Tests
Import `UserHub-API.postman_collection.json` into Postman and execute the automated collection tests.

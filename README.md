# Prime Solo Project

Authors: Junior Avalos, Jake Berg, Megan Tegeder, Will Shuford, Michael Silas

## 🌟 Overview
We built a web application designed to **enhance manager/employee relationships** through structured 1:1 meetings, engagement tracking, and leadership development tools. Built for [UpAll](https://upallleaders.com) to address: 
- 70% employee engagement (costing $350B annually)
- 6% engagement drop in remote/hybrid work
- Lack of tools for tracking psychological drivers of performance

**Key Outcomes** 
- 43% lower turnover 📉
- 18% higher productivity 📈
- 23% increased profitability 💰

---

## ✨ Core Features 

### **User Management**
- Role-based access (Admin/Manager/Associate)
- Secure registration and authentication
- Admin dashboard for user assignment

### **Manager Tools** 
- **Weekly Content Hub**: Admin-curated leadership resources
- **1:1 Meeting System**: Task synchonization between managers/employees
- **OKR Tracking**: Quarterly goal alignment

### **Employee Experience**

---

## Technical Implementation

### Tech Stack 
| Layer       | Technology      |
|-------------|-----------------|
| Frontend    | React, Zustand  |
| Backend     | Node.js, Express|
| Database    | PostgreSQL      |
| Deployment  | Heroku          |

## Table of Contents

- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Database Setup](#database-setup)
- [Folder Structure](#folder-structure)
- [Usage](#usage)
- [Features](#features)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/en)
- [PostgreSQL](https://www.postgresql.org)
- [Nodemon](https://nodemon.io)

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone <repo-url>
   cd up-all
   ```

2. **Install Dependencies**
   From the root directory of the project, run:
   ```bash
   npm install
   ```

3. **Create Environment Variables**
   Create a file in the root directory named `.env` and add the following:
   ```plaintext
   SERVER_SESSION_SECRET=yourSuperSecretStringHere
   ```
   Replace `yourSuperSecretStringHere` with a strong, randomly generated secret.

4. **Start the Server and Client**
   - In one terminal, run:
     ```bash
     npm run server
     ```
   - In another terminal, run:
     ```bash
     npm run client
     ```
   - Open your browser and navigate to `http://localhost:5173` to view the application.

## Database Setup

1. **Create Database**
   - Create a new PostgreSQL database (default name is `prime_app`). If you use a different name, update the connection details in `pool.js`.

2. **Create Tables**
   - Run the SQL commands found in `database.sql` to create the necessary tables (e.g., the `user` table).

3. **Insert Initial Data**
   - Use SQL statements to seed your database. For example, insert a user:
     ```sql
     INSERT INTO "user" (
       "username", "email", "password", "role", "first_name", "last_name",
       "pronouns", "company", "job_title", "manager_assigned"
     )
     VALUES
     ('mharper', 'mharper@email.com', 'temp1234', 'manager', 'Megan', 'Harper',
      'she/her', 'Acme Inc', 'People Manager', NULL);
     ```
   - Add additional dummy data as needed for testing.

## Folder Structure

```
up-all/
├── src/  
│   ├── components/         # React components & pages
│   ├── zustand/            # Zustand store and slices
│   └── App.jsx             # Main application file with routes
├── public/                 # Static assets (e.g., favicon.ico)
├── server/                 # Express server and API routes
│   ├── routes/             # Route handlers (e.g., user.router.js, dashboard.router.js)
│   └── modules/            # Database connection pool configuration
├── .env                    # Environment variables
├── package.json            # NPM dependencies and scripts
└── README.md               # Project documentation (this file)
```

## Usage

- **Register/Login:** Users can register and log in using Passport for authentication.
- **Manager Dashboard:** Managers can view a list of employees and see dynamic weekly content.
- **User Updates:** Users can update their profiles via the `/api/user/update` endpoint.

## Features

- **Full-Stack Setup:** Integrated front-end and back-end using React and Express.
- **Authentication:** User authentication handled with Passport.
- **State Management:** Global state managed with Zustand.
- **API Endpoints:** RESTful endpoints for user management, assignments, and dashboard data.
- **Database Integration:** Uses PostgreSQL for persistent data storage.

## Contributing

Contributions are welcome! Please adhere to the following guidelines:
1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Submit pull requests with clear commit messages and documentation.

## License

MIT License ---- Not available for open source. 


Copyright (c) 2025 Junior Avalos, Jake Berg,
Megan Tegeder, Will Shuford, Michael Silas

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


---


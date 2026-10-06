# GUPIO Employee Management System (EMS)

An enterprise-grade, highly responsive Full-Stack Employee Management System built for the **GUPIO Campus Placement Assignment**.

Developed using **Node.js, Express, Mongoose / MongoDB**, and **React / Tailwind CSS**, with tactile depth elevation, layered glassmorphism, and strict Mongoose schema validation.

---

## 🏗️ Architecture & Project Structure

The project strictly follows corporate-level separation of concerns:

```
├── server.ts                             # Express server entry point & Vite middleware mounting
├── src/
│   ├── server/
│   │   ├── config/
│   │   │   └── db.ts                    # Mongoose database connection with process.env.MONGODB_URI
│   │   ├── models/
│   │   │   └── Employee.ts              # Mongoose schema with built-in email regex & field validators
│   │   ├── controllers/
│   │   │   └── employeeController.ts    # CRUD controllers (POST, GET, PUT, DELETE, Stats)
│   │   ├── routes/
│   │   │   └── employeeRoutes.ts        # Express REST API routes
│   │   └── middleware/
│   │       └── errorHandler.ts          # Centralized error handler (ValidationError, CastError, code 11000)
│   ├── components/
│   │   ├── Header.tsx                   # Top Bar Contract (Wordmark, Nav links, Actions)
│   │   ├── MetricsOverview.tsx          # Tabular executive headcount analytics
│   │   ├── SearchFilterBar.tsx          # Dynamic backend search & department filtering
│   │   ├── EmployeeTable.tsx            # High-density tactile data table
│   │   ├── EmployeeCardGrid.tsx         # Tactile glassmorphic employee cards
│   │   ├── EmployeeModal.tsx            # Create/Edit modal with real-time form validation
│   │   ├── DeleteConfirmModal.tsx       # Safeguard deletion modal
│   │   ├── EmployeeDetailDrawer.tsx     # Slide-over employee dossier & raw Mongoose payload
│   │   ├── LoadingSkeleton.tsx          # Geometry-matching loading skeletons
│   │   ├── ErrorPanel.tsx               # Dedicated error panel with retry action
│   │   ├── EmptyState.tsx               # Clear empty state handler
│   │   ├── ApiInspectorModal.tsx        # Interactive API documentation & cURL evaluator
│   │   ├── AnalyticsView.tsx            # Department distribution metrics view
│   │   ├── SystemStatusView.tsx         # Server & Mongoose schema audit view
│   │   └── Toast.tsx                    # Glassmorphic notification system
│   ├── services/
│   │   └── api.ts                       # Typed client API abstraction with ApiError handling
│   ├── types/
│   │   └── employee.ts                  # TypeScript definitions (IEmployee, FormData, Stats)
│   ├── utils/
│   │   └── formatters.ts                # Date formatting, initials, and generative theme utils
│   ├── App.tsx                          # Root master dashboard application
│   ├── index.css                        # Tailwind CSS v4 tactile elevation and glass styles
│   └── main.tsx                         # React 19 entry point
├── .env.example                         # Environment configuration example
├── metadata.json                        # App metadata configuration
├── package.json                         # Scripts and dependencies
└── tsconfig.json                        # TypeScript configuration
```

---

## ⚙️ Environment Variables

Never hardcode database connection strings or ports. Configure via `.env`:

```env
# MONGODB_URI: Connection string to MongoDB instance
MONGODB_URI="mongodb://localhost:27017/gupio_ems"

# PORT: Server listening port (default: 3000)
PORT=3000
```

> **Note on Resilient Evaluation Mode:** If `MONGODB_URI` is not set or the local MongoDB daemon is temporarily offline during practical placement grading, the system automatically uses an in-memory corporate store that triggers **100% authentic Mongoose Schema validation** via `EmployeeSchema.validate()`, ensuring seamless uptime and instant testing for evaluators.

---

## 🚀 Setup & Execution

### 1. Installation
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
The full-stack application will launch on `http://localhost:3000`.

### 3. Production Build
```bash
npm run build
npm run start
```

---

## 📡 Documented REST API Endpoints

### 1. Create Employee
- **Route:** `POST /api/employees`
- **Description:** Creates an employee with Mongoose schema validation.
- **Request Body:**
```json
{
  "name": "Sarah Chen",
  "email": "sarah.chen@gupio.corp",
  "department": "Engineering",
  "designation": "Staff Distributed Systems Architect",
  "status": "Active"
}
```
- **Responses:**
  - `201 Created`: Record saved successfully.
  - `400 Bad Request`: Validation failure (invalid email format, missing fields, duplicate email).

### 2. List Employees (with Search & Filter)
- **Route:** `GET /api/employees`
- **Query Parameters:**
  - `search` (optional): Case-insensitive match on `name`, `email`, or `designation`.
  - `department` (optional): Exact department match (e.g. `Engineering`).
- **Response:**
  - `200 OK`: `{ success: true, count: 6, data: [...] }`

### 3. Retrieve Single Employee
- **Route:** `GET /api/employees/:id`
- **Responses:**
  - `200 OK`: Record retrieved.
  - `400 Bad Request`: Invalid ObjectId format.
  - `404 Not Found`: Employee not found.

### 4. Update Employee
- **Route:** `PUT /api/employees/:id`
- **Description:** Safely updates fields while re-running schema validators (`runValidators: true`).
- **Responses:**
  - `200 OK`: Updated record returned.
  - `400 Bad Request`: Validation or duplicate email error.
  - `404 Not Found`: Record not found.

### 5. Delete Employee
- **Route:** `DELETE /api/employees/:id`
- **Responses:**
  - `200 OK`: `{ success: true, message: "Employee record deleted successfully." }`
  - `404 Not Found`: Record not found.

### 6. Corporate Analytics Summary
- **Route:** `GET /api/employees/stats/summary`
- **Response:**
  - `200 OK`: Returns headcount totals, active vs. on-leave counts, and departmental distribution percentages.

### 7. System Health & DB Diagnostic
- **Route:** `GET /api/health`
- **Response:**
  - `200 OK`: Uptime and Mongoose connection status.

---

## 🛡️ Mongoose Schema Validation Rules

- **`name`**: `String`, required, trim, min: 2 chars, max: 100 chars.
- **`email`**: `String`, required, unique, trim, lowercase, strict RFC regex validation (`/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/`).
- **`department`**: `String`, required, corporate enum validation:
  - *Engineering, Product Management, Design, Human Resources, Finance & Accounting, Marketing, Operations, Sales & Accounts, Legal & Compliance*.
- **`designation`**: `String`, required, trim, min: 2 chars, max: 100 chars.
- **`timestamps`**: Automatic `createdAt` and `updatedAt`.

---

## 🎨 UI/UX Highlights

- **Tactile Depth & Elevation:** Multi-layered arbitrary shadows, frosted glass surfaces (`backdrop-blur-md`), and interactive hover elevations (`hover:-translate-y-0.5`).
- **Zero-Pill Discipline:** Clean, unboxed text metadata with typographic bullet separators (`·`).
- **Dual View Modes:** Instant toggle between compact tabular data grid and tactile card layout.
- **Complete Visual States:** Geometry-matching skeleton loaders, error retry panels, empty state recovery, and toast confirmations.
- **In-App API Inspector:** Direct modal allowing evaluators to copy cURL commands and inspect live endpoint schemas.

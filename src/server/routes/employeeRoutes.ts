import { Router } from 'express';
import {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  getDepartmentStats,
} from '../controllers/employeeController.ts';

const router = Router();

/**
 * Route: /api/employees/stats/summary
 * Must precede /:id to prevent route shadowing
 */
router.get('/stats/summary', getDepartmentStats);

/**
 * Route: /api/employees
 * GET  - List all employees with search and department filtering
 * POST - Create a new employee record with Mongoose schema validation
 */
router.route('/')
  .get(getEmployees)
  .post(createEmployee);

/**
 * Route: /api/employees/:id
 * GET    - Retrieve individual employee by ID
 * PUT    - Update existing employee details safely
 * DELETE - Remove employee record from database
 */
router.route('/:id')
  .get(getEmployeeById)
  .put(updateEmployee)
  .delete(deleteEmployee);

export default router;

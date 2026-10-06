import { Employee, EmployeeFormData, ApiResponse, DepartmentStats } from '../types/employee.ts';

const BASE_URL = '/api';

/**
 * Custom API Error class carrying HTTP status code and server validation details
 */
export class ApiError extends Error {
  statusCode: number;
  details?: Record<string, string> | string[];

  constructor(message: string, statusCode: number, details?: Record<string, string> | string[]) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options.headers,
    },
  });

  let data: any;
  try {
    data = await response.json();
  } catch (_e) {
    throw new ApiError(`Unexpected non-JSON response from ${endpoint}`, response.status);
  }

  if (!response.ok || data.success === false) {
    const errorMsg = data?.error || `Request failed with status ${response.status}`;
    throw new ApiError(errorMsg, response.status, data?.details);
  }

  return data as T;
}

/**
 * Retrieve list of employees with search and department filtering
 */
export async function getEmployees(search?: string, department?: string): Promise<{ data: Employee[]; count: number }> {
  const params = new URLSearchParams();
  if (search && search.trim() !== '') {
    params.set('search', search.trim());
  }
  if (department && department !== 'All') {
    params.set('department', department.trim());
  }

  const query = params.toString() ? `?${params.toString()}` : '';
  const result = await request<ApiResponse<Employee[]>>(`/employees${query}`);
  return {
    data: result.data || [],
    count: result.count || result.data?.length || 0,
  };
}

/**
 * Retrieve an individual employee by ID
 */
export async function getEmployeeById(id: string): Promise<Employee> {
  const result = await request<ApiResponse<Employee>>(`/employees/${id}`);
  return result.data;
}

/**
 * Create a new employee record
 */
export async function createEmployee(payload: EmployeeFormData): Promise<Employee> {
  const result = await request<ApiResponse<Employee>>('/employees', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return result.data;
}

/**
 * Update an existing employee record
 */
export async function updateEmployee(id: string, payload: Partial<EmployeeFormData>): Promise<Employee> {
  const result = await request<ApiResponse<Employee>>(`/employees/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return result.data;
}

/**
 * Delete an employee record
 */
export async function deleteEmployee(id: string): Promise<Employee> {
  const result = await request<ApiResponse<Employee>>(`/employees/${id}`, {
    method: 'DELETE',
  });
  return result.data;
}

/**
 * Get aggregate department metrics
 */
export async function getDepartmentStats(): Promise<DepartmentStats> {
  const result = await request<ApiResponse<DepartmentStats>>('/employees/stats/summary');
  return result.data;
}

/**
 * System health and database connection check
 */
export async function checkSystemHealth(): Promise<any> {
  return request<any>('/health');
}

/**
 * Test and reconnect to a MongoDB instance or URI
 */
export async function connectMongoDB(uri?: string): Promise<{ success: boolean; message: string; status: any }> {
  return request<{ success: boolean; message: string; status: any }>('/health/connect', {
    method: 'POST',
    body: JSON.stringify({ uri }),
  });
}

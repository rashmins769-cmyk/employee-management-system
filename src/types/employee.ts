export interface Employee {
  id: string;
  _id?: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  avatarUrl?: string;
  status: 'Active' | 'On Leave' | 'Terminated';
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeFormData {
  name: string;
  email: string;
  department: string;
  designation: string;
  status: 'Active' | 'On Leave' | 'Terminated';
}

export interface DepartmentDistribution {
  [deptName: string]: number;
}

export interface DepartmentStats {
  totalEmployees: number;
  activeEmployees: number;
  onLeaveEmployees: number;
  departmentsCount: number;
  distribution: DepartmentDistribution;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  count?: number;
  data: T;
  error?: string;
  details?: Record<string, string> | string[];
}

export const DEPARTMENTS = [
  'Engineering',
  'Product Management',
  'Design',
  'Human Resources',
  'Finance & Accounting',
  'Marketing',
  'Operations',
  'Sales & Accounts',
  'Legal & Compliance',
] as const;

export type DepartmentType = typeof DEPARTMENTS[number];

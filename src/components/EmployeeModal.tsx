import React, { useState, useEffect } from 'react';
import { Employee, EmployeeFormData, DEPARTMENTS } from '../types/employee.ts';
import { X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EmployeeFormData) => Promise<void>;
  employeeToEdit?: Employee | null;
  isSubmitting: boolean;
  serverError?: string | null;
}

interface ValidationErrors {
  name?: string;
  email?: string;
  department?: string;
  designation?: string;
}

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const EmployeeModal: React.FC<EmployeeModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  employeeToEdit,
  isSubmitting,
  serverError,
}) => {
  const [formData, setFormData] = useState<EmployeeFormData>({
    name: '',
    email: '',
    department: 'Engineering',
    designation: '',
    status: 'Active',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (employeeToEdit) {
      setFormData({
        name: employeeToEdit.name || '',
        email: employeeToEdit.email || '',
        department: employeeToEdit.department || 'Engineering',
        designation: employeeToEdit.designation || '',
        status: employeeToEdit.status || 'Active',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        department: 'Engineering',
        designation: '',
        status: 'Active',
      });
    }
    setErrors({});
    setTouched({});
  }, [employeeToEdit, isOpen]);

  if (!isOpen) return null;

  const validateField = (field: keyof EmployeeFormData, value: string): string | undefined => {
    switch (field) {
      case 'name':
        if (!value.trim()) return 'Employee name is required.';
        if (value.trim().length < 2) return 'Name must be at least 2 characters long.';
        if (value.trim().length > 100) return 'Name cannot exceed 100 characters.';
        return undefined;

      case 'email':
        if (!value.trim()) return 'Corporate email is required.';
        if (!EMAIL_REGEX.test(value.trim())) return 'Please enter a valid email address (e.g. employee@gupio.corp).';
        return undefined;

      case 'department':
        if (!value.trim()) return 'Department selection is required.';
        return undefined;

      case 'designation':
        if (!value.trim()) return 'Designation / job title is required.';
        if (value.trim().length < 2) return 'Designation must be at least 2 characters.';
        return undefined;

      default:
        return undefined;
    }
  };

  const handleBlur = (field: keyof EmployeeFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const errorMsg = validateField(field, formData[field]);
    setErrors((prev) => ({ ...prev, [field]: errorMsg }));
  };

  const handleChange = (field: keyof EmployeeFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const errorMsg = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: errorMsg }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all as touched
    const newTouched = { name: true, email: true, department: true, designation: true };
    setTouched(newTouched);

    const newErrors: ValidationErrors = {
      name: validateField('name', formData.name),
      email: validateField('email', formData.email),
      department: validateField('department', formData.department),
      designation: validateField('designation', formData.designation),
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((err) => err !== undefined);
    if (hasErrors) {
      return;
    }

    await onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl bg-[#0e1017] rounded-2xl border border-white/[0.12] shadow-[0_24px_70px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.1)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#11141e]/50">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              {employeeToEdit ? 'Edit Employee Record' : 'Create New Personnel Record'}
            </h2>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">
              {employeeToEdit
                ? `ID: ${employeeToEdit.id || employeeToEdit._id}`
                : 'MongoDB Schema validation rules enforced'}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div className="mx-6 mt-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <div className="flex-1">
              <span className="font-semibold">Submission Error:</span> {serverError}
            </div>
          </div>
        )}

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Full Legal Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
              placeholder="e.g. Sarah Chen"
              className={`w-full px-3.5 py-2.5 text-sm bg-slate-900/80 border rounded-lg text-white placeholder-slate-500 focus:outline-none transition-all ${
                errors.name && touched.name
                  ? 'border-rose-500 focus:ring-1 focus:ring-rose-500'
                  : 'border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              }`}
            />
            {errors.name && touched.name && (
              <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.name}</span>
              </p>
            )}
          </div>

          {/* Corporate Email */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Corporate Email Address <span className="text-rose-400">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              placeholder="e.g. sarah.chen@gupio.corp"
              className={`w-full px-3.5 py-2.5 text-sm font-mono bg-slate-900/80 border rounded-lg text-white placeholder-slate-500 focus:outline-none transition-all ${
                errors.email && touched.email
                  ? 'border-rose-500 focus:ring-1 focus:ring-rose-500'
                  : 'border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              }`}
            />
            {errors.email && touched.email && (
              <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.email}</span>
              </p>
            )}
          </div>

          {/* Department & Designation in two columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Department */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Department <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <select
                  value={formData.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                  onBlur={() => handleBlur('department')}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-900/80 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                  ▼
                </div>
              </div>
            </div>

            {/* Designation */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Designation / Job Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={formData.designation}
                onChange={(e) => handleChange('designation', e.target.value)}
                onBlur={() => handleBlur('designation')}
                placeholder="e.g. Lead Cloud Architect"
                className={`w-full px-3.5 py-2.5 text-sm bg-slate-900/80 border rounded-lg text-white placeholder-slate-500 focus:outline-none transition-all ${
                  errors.designation && touched.designation
                    ? 'border-rose-500 focus:ring-1 focus:ring-rose-500'
                    : 'border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                }`}
              />
              {errors.designation && touched.designation && (
                <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.designation}</span>
                </p>
              )}
            </div>
          </div>

          {/* Operational Status */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Employment Status
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Active', 'On Leave', 'Terminated'] as const).map((statusVal) => (
                <button
                  type="button"
                  key={statusVal}
                  onClick={() => handleChange('status', statusVal)}
                  className={`py-2 px-3 text-xs font-medium rounded-lg border transition-all ${
                    formData.status === statusVal
                      ? statusVal === 'Active'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-sm'
                        : statusVal === 'On Leave'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-sm'
                        : 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-sm'
                      : 'bg-slate-900/40 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {statusVal}
                </button>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-white/[0.08]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-3.5 py-1.5 text-xs font-mono text-slate-300 hover:text-white rounded-lg raycast-button-secondary transition-all"
            >
              Cancel [ESC]
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-4 py-1.5 text-xs font-semibold text-white rounded-lg raycast-button-primary disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Writing to MongoDB...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{employeeToEdit ? 'Save Changes' : 'Commit Record'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

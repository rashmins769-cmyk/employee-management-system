import mongoose, { Document, Schema, Model } from 'mongoose';

/**
 * TypeScript interface representing an Employee document
 */
export interface IEmployee extends Document {
  name: string;
  email: string;
  department: string;
  designation: string;
  avatarUrl?: string;
  status?: 'Active' | 'On Leave' | 'Terminated';
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Standard RFC-compliant email regex validator
 */
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Mongoose Schema definition with strict built-in validation rules
 */
export const EmployeeSchema = new Schema<IEmployee>(
  {
    name: {
      type: String,
      required: [true, 'Employee name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Employee corporate email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [EMAIL_REGEX, 'Please enter a valid corporate email address (e.g. user@company.com)'],
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
      enum: {
        values: [
          'Engineering',
          'Product Management',
          'Design',
          'Human Resources',
          'Finance & Accounting',
          'Marketing',
          'Operations',
          'Sales & Accounts',
          'Legal & Compliance',
        ],
        message: '{VALUE} is not a valid department selection',
      },
    },
    designation: {
      type: String,
      required: [true, 'Job designation/title is required'],
      trim: true,
      minlength: [2, 'Designation must be at least 2 characters long'],
      maxlength: [100, 'Designation cannot exceed 100 characters'],
    },
    avatarUrl: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['Active', 'On Leave', 'Terminated'],
      default: 'Active',
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Record<string, unknown>) => {
        ret.id = (ret._id as unknown)?.toString();
        return ret;
      },
    },
    toObject: {
      virtuals: true,
    },
  }
);

// Index for high-performance search queries on name and email
EmployeeSchema.index({ name: 'text', email: 'text' });

/**
 * Export Mongoose Model
 */
export const Employee: Model<IEmployee> =
  mongoose.models.Employee || mongoose.model<IEmployee>('Employee', EmployeeSchema);

export default Employee;

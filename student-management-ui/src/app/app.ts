import {
  Component,
  Inject,
  PLATFORM_ID
} from '@angular/core';

import {
  CommonModule,
  isPlatformBrowser
} from '@angular/common';

import { FormsModule } from '@angular/forms';

import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http';

interface Student {
  id?: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phoneNumber: string;
  address: string;
  enrollmentDate: string;
  major: string;
}

interface StudentValidationErrors {
  [field: string]: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  private readonly apiUrl = '/api';
  private isBrowser: boolean;

  screen: 'login' | 'signup' | 'dashboard' = 'login';

  email = '';
  password = '';

  message = '';
  isError = false;

  students: Student[] = [];
  editingId: string | null = null;

  studentForm: Student = this.emptyStudent();

  backendErrors: StudentValidationErrors = {};

  studentErrorMessages: string[] = [];

  // Show field validation errors after the first submit.
  studentFormSubmitted = false;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  // Create an empty student object.
  private emptyStudent(): Student {
    return {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      email: '',
      phoneNumber: '',
      address: '',
      enrollmentDate: '',
      major: ''
    };
  }

  // Display success or error messages.
  private showMessage(
    text: string,
    error = false
  ): void {
    this.message = text;
    this.isError = error;
  }

  // Add JWT token to protected API requests.
  private authHeaders(): HttpHeaders {
    const token = this.isBrowser
      ? sessionStorage.getItem('token') || ''
      : '';

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  // Update validation summary from field errors.
  private updateStudentErrorMessages(): void {
    this.studentErrorMessages =
      Object.values(this.backendErrors);
  }

  // Clear a field error when the user edits that field.
  clearBackendError(field: string): void {
    if (this.backendErrors[field]) {
      const updatedErrors = { ...this.backendErrors };

      delete updatedErrors[field];

      this.backendErrors = updatedErrors;
      this.updateStudentErrorMessages();
    }

    if (
      this.studentErrorMessages.length === 0 &&
      this.isError
    ) {
      this.message = '';
      this.isError = false;
    }
  }

  // Handle validation errors returned by Spring Boot.
  private handleStudentError(
    err: HttpErrorResponse
  ): void {
    console.error('Student API error:', err);
    console.log('HTTP status:', err.status);
    console.log('Backend response:', err.error);

    this.backendErrors = {};
    this.studentErrorMessages = [];

    const body: any = err.error;

    if (
      err.status === 400 &&
      body &&
      typeof body === 'object'
    ) {
      const errorsObject =
        body.errors &&
        typeof body.errors === 'object'
          ? body.errors
          : body.error &&
            typeof body.error === 'object'
            ? body.error
            : body;

      const fields = [
        'firstName',
        'lastName',
        'dateOfBirth',
        'email',
        'phoneNumber',
        'address',
        'enrollmentDate',
        'major'
      ];

      for (const field of fields) {
        const value = errorsObject[field];

        if (
          typeof value === 'string' &&
          value.trim()
        ) {
          this.backendErrors[field] = value;
        }
      }

      this.updateStudentErrorMessages();

      if (this.studentErrorMessages.length > 0) {
        this.showMessage(
          'Please correct the student details highlighted below.',
          true
        );
        return;
      }
    }

    const serverMessage =
      typeof body === 'string'
        ? body
        : typeof body?.message === 'string'
          ? body.message
          : '';

    if (serverMessage) {
      this.showMessage(serverMessage, true);
    } else if (err.status === 0) {
      this.showMessage(
        'Cannot connect to the backend. Check whether Spring Boot is running.',
        true
      );
    } else if (
      err.status === 401 ||
      err.status === 403
    ) {
      this.showMessage(
        'Your session may have expired. Please log in again.',
        true
      );
    } else {
      this.showMessage(
        `Unable to save the student. HTTP status: ${err.status}`,
        true
      );
    }
  }

  // Navigate to Signup.
  openSignup(): void {
    this.email = '';
    this.password = '';
    this.message = '';
    this.isError = false;
    this.screen = 'signup';
  }

  // Navigate to Login.
  openLogin(): void {
    this.email = '';
    this.password = '';
    this.message = '';
    this.isError = false;
    this.screen = 'login';
  }

  // Signup with frontend validation.
  signup(): void {
    this.message = '';

    if (!this.email.trim() || !this.password) {
      this.showMessage(
        'Please enter email and password.',
        true
      );
      return;
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        this.email.trim()
      )
    ) {
      this.showMessage(
        'Please enter a valid email address.',
        true
      );
      return;
    }

    if (this.password.length < 8) {
      this.showMessage(
        'Password must be at least 8 characters.',
        true
      );
      return;
    }

    this.http.post<any>(
      `${this.apiUrl}/auth/signup`,
      {
        email: this.email.trim(),
        password: this.password
      }
    ).subscribe({
      next: (res) => {
        this.showMessage(
          res?.message || 'Account created successfully!'
        );

        this.password = '';
        this.screen = 'login';
      },

      error: (err: HttpErrorResponse) => {
        console.error('Signup error:', err);

        const errorMessage =
          err.error?.message ||
          (
            err.status === 0
              ? 'Cannot connect to backend. Check Spring Boot.'
              : err.status === 409
                ? 'This email is already registered. Please log in.'
                : err.status === 400
                  ? 'Invalid details. Check your email and password.'
                  : `Signup failed. HTTP status: ${err.status}`
          );

        this.showMessage(errorMessage, true);
      }
    });
  }

  // Login with frontend validation.
  login(): void {
    this.message = '';

    if (!this.email.trim() || !this.password) {
      this.showMessage(
        'Please enter email and password.',
        true
      );
      return;
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        this.email.trim()
      )
    ) {
      this.showMessage(
        'Please enter a valid email address.',
        true
      );
      return;
    }

    this.http.post<any>(
      `${this.apiUrl}/auth/login`,
      {
        email: this.email.trim(),
        password: this.password
      }
    ).subscribe({
      next: (res) => {
        if (!res?.token) {
          this.showMessage(
            'Login response did not contain a token.',
            true
          );
          return;
        }

        if (this.isBrowser) {
          sessionStorage.setItem('token', res.token);
        }

        this.email = res.email || this.email.trim();
        this.password = '';
        this.screen = 'dashboard';

        this.showMessage('Login successful!');

        this.loadStudents();
      },

      error: (err: HttpErrorResponse) => {
        console.error('Login error:', err);

        this.showMessage(
          err.status === 0
            ? 'Cannot connect to backend. Check Spring Boot.'
            : err.status === 401
              ? 'Invalid email or password.'
              : `Login failed. HTTP status: ${err.status}`,
          true
        );
      }
    });
  }

  // Load student records from Spring Boot.
  loadStudents(): void {
    if (!this.isBrowser) {
      return;
    }

    this.http.get<Student[]>(
      `${this.apiUrl}/students`,
      {
        headers: this.authHeaders()
      }
    ).subscribe({
      next: (data) => {
        this.students = Array.isArray(data)
          ? data
          : [];

        console.log('Students loaded:', this.students);
      },

      error: (err: HttpErrorResponse) => {
        console.error('Load students error:', err);

        if (
          err.status === 401 ||
          err.status === 403
        ) {
          this.logout();

          this.showMessage(
            'Session expired. Please log in again.',
            true
          );
        } else {
          this.showMessage(
            err.status === 0
              ? 'Cannot connect to backend.'
              : `Could not load students. HTTP status: ${err.status}`,
            true
          );
        }
      }
    });
  }

  // Save a new student or update an existing student.
  // Validate all fields before sending a request.
  saveStudent(): void {
    // Important: enable field errors on the first submit.
    this.studentFormSubmitted = true;

    this.message = '';
    this.isError = false;

    this.backendErrors = {};
    this.studentErrorMessages = [];

    const payload: Student = {
      firstName: this.studentForm.firstName?.trim() ?? '',
      lastName: this.studentForm.lastName?.trim() ?? '',
      dateOfBirth: this.studentForm.dateOfBirth ?? '',
      email: this.studentForm.email?.trim() ?? '',
      phoneNumber: this.studentForm.phoneNumber?.trim() ?? '',
      address: this.studentForm.address?.trim() ?? '',
      enrollmentDate: this.studentForm.enrollmentDate ?? '',
      major: this.studentForm.major?.trim() ?? ''
    };

    const errors: StudentValidationErrors = {};

    // First name validation.
    if (!payload.firstName) {
      errors['firstName'] = 'First name is required.';
    }

    // Last name validation.
    if (!payload.lastName) {
      errors['lastName'] = 'Last name is required.';
    }

    // Date of birth validation.
    if (!payload.dateOfBirth) {
      errors['dateOfBirth'] = 'Date of birth is required.';
    }

    // Email validation.
    if (!payload.email) {
      errors['email'] = 'Email is required.';
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)
    ) {
      errors['email'] = 'Please enter a valid email address.';
    }

    // Phone number validation.
    if (!payload.phoneNumber) {
      errors['phoneNumber'] = 'Phone number is required.';
    } else if (!/^[0-9]{10}$/.test(payload.phoneNumber)) {
      errors['phoneNumber'] =
        'Enter a valid 10-digit phone number.';
    }

    // Address validation.
    if (!payload.address) {
      errors['address'] = 'Address is required.';
    }

    // Enrollment date validation.
    if (!payload.enrollmentDate) {
      errors['enrollmentDate'] = 'Enrollment date is required.';
    }

    // Major validation.
    if (!payload.major) {
      errors['major'] = 'Major / Branch is required.';
    }

    // Show all errors immediately on the first submit.
    if (Object.keys(errors).length > 0) {
      this.backendErrors = errors;
      this.studentErrorMessages = Object.values(errors);

      this.showMessage(
        'Please correct the highlighted fields before saving.',
        true
      );

      return;
    }

    console.log('Student payload being sent:', payload);

    // Send request only after frontend validation succeeds.
    const request = this.editingId
      ? this.http.put(
          `${this.apiUrl}/students/${this.editingId}`,
          payload,
          {
            headers: this.authHeaders()
          }
        )
      : this.http.post(
          `${this.apiUrl}/students`,
          payload,
          {
            headers: this.authHeaders()
          }
        );

    request.subscribe({
      next: () => {
        const wasEditing = !!this.editingId;

        this.cancelEdit();

        this.showMessage(
          wasEditing
            ? 'Student updated successfully!'
            : 'Student added successfully!'
        );

        this.loadStudents();
      },

      error: (err: HttpErrorResponse) => {
        this.handleStudentError(err);
      }
    });
  }

  // Load a student into the form for editing.
  editStudent(student: Student): void {
    this.studentFormSubmitted = false;

    if (!student.id) {
      this.showMessage(
        'Student ID is missing.',
        true
      );
      return;
    }

    this.backendErrors = {};
    this.studentErrorMessages = [];

    this.editingId = student.id;
    this.studentForm = { ...student };

    this.showMessage(
      'Edit the details and click Update Student.'
    );
  }

  // Delete a student.
  deleteStudent(id?: string): void {
    if (!id || !this.isBrowser) {
      this.showMessage(
        'Student ID is missing.',
        true
      );
      return;
    }

    if (
      !window.confirm(
        'Are you sure you want to delete this student?'
      )
    ) {
      return;
    }

    this.http.delete(
      `${this.apiUrl}/students/${id}`,
      {
        headers: this.authHeaders()
      }
    ).subscribe({
      next: () => {
        this.students = this.students.filter(
          student => student.id !== id
        );

        this.showMessage(
          'Student deleted successfully!'
        );
      },

      error: (err: HttpErrorResponse) => {
        console.error('Delete student error:', err);

        this.showMessage(
          err.error?.message ||
          `Unable to delete student. HTTP status: ${err.status}`,
          true
        );
      }
    });
  }

  // Cancel editing and reset the form.
  cancelEdit(): void {
    this.studentFormSubmitted = false;

    this.editingId = null;
    this.studentForm = this.emptyStudent();

    this.backendErrors = {};
    this.studentErrorMessages = [];
  }

  // Logout and return to Login.
  logout(): void {
    if (this.isBrowser) {
      sessionStorage.removeItem('token');
    }

    this.screen = 'login';
    this.password = '';
    this.students = [];

    this.cancelEdit();

    this.showMessage('You have logged out.');
  }
}
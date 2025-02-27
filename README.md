# Navodhai E-commerce Platform

A modern e-commerce platform built with Next.js 14, TypeScript, Tailwind CSS, and Shadcn UI.

## Authentication System

The authentication system provides a secure, accessible, and user-friendly experience with the following features:

### Features

- **User Authentication**

  - Email/Password Sign In
  - User Registration
  - Password Reset Flow
  - Email Verification
  - Secure Password Handling

- **Security Features**

  - Password Strength Validation
  - Token-based Verification
  - Form Data Validation
  - Error Boundaries
  - CSRF Protection

- **Accessibility**

  - ARIA Labels
  - Keyboard Navigation
  - Focus Management
  - Skip Links
  - Screen Reader Support

- **UI/UX Features**
  - Responsive Design
  - Loading States
  - Error Feedback
  - Password Visibility Toggle
  - Password Strength Indicator

### Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Database**: Drizzle ORM with Neon DB
- **Form Handling**: React Hook Form + Zod
- **State Management**: React Server Components + Server Actions

### Directory Structure

```
app/
  auth/
    sign-in/
      page.tsx          # Sign in page
    sign-up/
      page.tsx          # Sign up page
    forgot-password/
      page.tsx          # Forgot password page
    reset-password/
      page.tsx          # Reset password page
    verify-email/
      page.tsx          # Email verification page

components/
  auth/
    auth components
```

### Authentication Flow

1. **Sign Up**

   - User enters name, email, and password
   - Password strength is validated in real-time
   - Email verification link is sent upon successful registration

2. **Email Verification**

   - User clicks verification link in email
   - Token is validated
   - Account is activated upon successful verification

3. **Sign In**

   - User enters email and password
   - Credentials are validated
   - Redirected to dashboard upon success

4. **Password Reset**
   - User requests password reset
   - Reset link is sent via email
   - User sets new password with strength validation

### Security Considerations

- Passwords are validated for strength and common patterns
- All form data is validated using Zod schemas
- Tokens are time-limited and single-use
- Error messages are user-friendly but not overly detailed
- CSRF protection is enabled for all forms

### Accessibility Features

- Skip links for keyboard navigation
- ARIA labels and roles
- Focus management
- Keyboard-accessible interactive elements
- Status messages for screen readers

### Error Handling

- Client-side form validation
- Server-side error handling
- User-friendly error messages
- Error boundaries for unexpected errors
- Consistent error UI across all pages

### Development

1. **Installation**

   ```bash
   bum install
   ```

2. **Environment Setup**

   ```env
   DATABASE_URL=your_database_url
   NEXTAUTH_SECRET=your_auth_secret
   ```

3. **Run Development Server**
   ```bash
   bum run dev
   ```

### Testing

The authentication system includes:

- Unit tests for components
- Integration tests for auth flows
- E2E tests for user journeys

Run tests with:

```bash
bum run test        # Unit and integration tests
bum run test:e2e    # E2E tests
```

### Contributing

1. Follow the established code style
2. Write meaningful commit messages
3. Add tests for new features
4. Update documentation as needed

### License

MIT License - See LICENSE file for details

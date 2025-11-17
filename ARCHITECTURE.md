# Architecture Documentation

## Overview

This document describes the software architecture and design patterns implemented in the Personal Manager Hektor (siportal) project.

## Architecture Layers

### 1. Presentation Layer (UI Components)

**Location:** `src/components/`, `src/pages/`

**Purpose:** User interface components and pages

**Key Components:**
- **Reusable Components:** LoadingSpinner, EmptyState, ConfirmDialog, PageHeader, Card, Button, Badge
- **Feature Components:** Navbar, ImageUpload, LoginModal, AdminPanel
- **Pages:** WorkerListingPage, JobsPage, ContractsPage, ProfilePage, etc.

**Patterns:**
- Component composition
- Presentational vs. Container components
- Lazy loading for route components

### 2. Business Logic Layer (Hooks & Services)

**Location:** `src/hooks/`, `src/services/`

**Purpose:** Business logic and data operations

**Custom Hooks:**
- **Data Fetching:** `useJobs`, `useWorkers`, `useContracts`, `useContactRequests`
- **Form Management:** `useForm` - Generic form state and validation
- **Authorization:** `usePermissions` - Permission checks and role management
- **Notifications:** `useToast` - Toast notification system

**Services:**
- **jobService** - Job CRUD operations
- **workerService** - Worker CRUD operations
- **contractService** - Contract CRUD operations
- **contactRequestService** - Contact request operations
- **authService** - Authentication and user management
- **adminService** - Admin operations
- **storageService** - File storage operations

**Benefits:**
- Separation of concerns
- Reusable business logic
- Easier testing
- Consistent data access patterns

### 3. Data Layer (Supabase Client)

**Location:** `src/lib/supabase.ts`

**Purpose:** Database and authentication backend

**Key Features:**
- PostgreSQL database with Row-Level Security (RLS)
- Real-time subscriptions
- File storage
- Authentication

### 4. Type System

**Location:** `src/types/`

**Purpose:** TypeScript type definitions

**Type Files:**
- `auth.types.ts` - Authentication and user types
- `worker.types.ts` - Worker-related types
- `job.types.ts` - Job-related types
- `contract.types.ts` - Contract types
- `contactRequest.types.ts` - Contact request types

**Benefits:**
- Type safety across the application
- Single source of truth for data structures
- Better IDE support and autocomplete

### 5. Constants

**Location:** `src/constants/`

**Purpose:** Application-wide constants

**Constant Files:**
- `roles.ts` - System roles (administrator, manager)
- `statuses.ts` - Status values for jobs, contracts, availability
- `employmentTypes.ts` - Employment type options
- `qualifications.ts` - Available qualifications
- `languages.ts` - Language options
- `workPreferences.ts` - Work days, shifts, smoking status

**Benefits:**
- No magic strings
- Easy to maintain and update
- Consistent values across the app

### 6. Utilities

**Location:** `src/utils/`

**Purpose:** Helper functions

**Utility Files:**
- `validators.ts` - Form validation functions
- `errorUtils.ts` - Error handling utilities
- `formatters.ts` - Data formatting functions
- `permissions.ts` - Permission checking utilities
- `dateUtils.ts` - Date manipulation functions
- `statusUtils.tsx` - Status display utilities

## Design Patterns

### 1. Repository Pattern (Services)

**Implementation:** Service layer abstracts data access

**Example:**
```typescript
// Service handles all data operations
const jobs = await jobService.getAll(filters);
const job = await jobService.getById(id);
await jobService.create(newJob);
await jobService.update(id, updates);
await jobService.delete(id);
```

**Benefits:**
- Centralized data access
- Easy to mock for testing
- Database schema changes isolated to service layer

### 2. Custom Hooks Pattern

**Implementation:** React hooks for reusable stateful logic

**Example:**
```typescript
const { jobs, loading, error, refetch } = useJobs(filters);
const { values, errors, handleChange, handleSubmit } = useForm({
  initialValues,
  validationSchema,
  onSubmit,
});
```

**Benefits:**
- Reusable logic across components
- Clean component code
- Consistent patterns

### 3. Provider Pattern (Context API)

**Implementation:** AuthContext provides global auth state

**Example:**
```typescript
const { user, userProfile, signOut } = useAuth();
```

**Benefits:**
- Avoid prop drilling
- Global state management
- Single source of truth for auth

### 4. Error Boundary Pattern

**Implementation:** ErrorBoundary component catches errors

**Benefits:**
- Graceful error handling
- Prevents app crashes
- Better user experience

### 5. Compound Component Pattern

**Implementation:** Reusable UI components (Card, Button, Badge)

**Benefits:**
- Flexible and composable
- Consistent styling
- DRY principle

### 6. Factory Pattern (Services)

**Implementation:** Service objects with multiple methods

**Benefits:**
- Organized related operations
- Easy to extend
- Consistent API

## Data Flow

### Read Operations

```
Component → Custom Hook → Service → Supabase → Database
                ↓
          State Update
                ↓
           Re-render
```

### Write Operations

```
Component → Form Submit → Service → Supabase → Database
              ↓                         ↓
         Validation              Success/Error
              ↓                         ↓
      Error Display              Toast Notification
                                        ↓
                                   Refetch Data
```

### Authentication Flow

```
Login Form → authService.signIn → Supabase Auth → Session Created
                                         ↓
                                  AuthContext Updates
                                         ↓
                                  App Re-renders
                                         ↓
                              Protected Routes Accessible
```

## Security Architecture

### Row-Level Security (RLS)

- **Primary Security:** All data access controlled by database policies
- **UI Checks:** Supplementary, not authoritative
- **Policy Examples:**
  - Users can read their own profile
  - Managers can edit workers they created
  - Admins have full access

### Authorization Layers

1. **Database Layer (RLS)** - Enforced by PostgreSQL
2. **Service Layer** - Business logic validation
3. **UI Layer** - Permission checks for display
4. **Custom Hooks** - `usePermissions` for role checks

## State Management

### Local State (useState)

- Component-specific state
- Form inputs
- UI toggles

### Global State (Context API)

- Authentication state (AuthContext)
- User profile
- System role

### Server State (Custom Hooks)

- Data from Supabase
- Cached in component state
- Refetch on demand

### URL State (React Router)

- Current route
- URL parameters
- Query strings

## Error Handling Strategy

### Layers

1. **Error Boundary** - Catches unhandled errors
2. **Service Layer** - Throws meaningful errors
3. **Custom Hooks** - Returns error state
4. **Components** - Displays errors to user

### Error Types

- **Network Errors** - Connection issues
- **Authentication Errors** - Login failures
- **Permission Errors** - Unauthorized access
- **Validation Errors** - Invalid input
- **Database Errors** - Supabase errors

### User Feedback

- **Toast Notifications** - Success/error messages
- **Inline Errors** - Form validation errors
- **Error Pages** - Error boundary fallback
- **Loading States** - Loading spinners

## Performance Optimizations

### Code Splitting

- Lazy loading for all route components
- Reduces initial bundle size
- Faster page loads

### Memoization

- `useCallback` for event handlers
- `useMemo` for expensive computations
- Prevents unnecessary re-renders

### Optimistic Updates

- Show success immediately
- Revert on error
- Better perceived performance

## Testing Strategy

### Unit Tests

- Service functions
- Utility functions
- Validators

### Integration Tests

- Custom hooks
- Components with data fetching
- Form submissions

### E2E Tests

- Critical user flows
- Authentication
- CRUD operations

## Future Improvements

### Recommended Enhancements

1. **State Management Library** - Consider Zustand or Jotai for complex state
2. **React Query** - Better server state management with caching
3. **Form Library** - Consider React Hook Form for complex forms
4. **Internationalization** - i18n for multi-language support
5. **Error Tracking** - Integrate Sentry or similar service
6. **Analytics** - User behavior tracking
7. **Performance Monitoring** - Real User Monitoring (RUM)
8. **Automated Testing** - Jest + React Testing Library
9. **Storybook** - Component documentation and testing
10. **API Documentation** - OpenAPI/Swagger for service layer

## Best Practices

### Code Organization

- One component per file
- Logical folder structure
- Index files for clean imports

### Naming Conventions

- PascalCase for components
- camelCase for functions/variables
- SCREAMING_SNAKE_CASE for constants
- Descriptive names

### TypeScript Usage

- Explicit type annotations
- Avoid `any` type
- Use interfaces for objects
- Export types separately

### Component Design

- Single Responsibility Principle
- Composition over inheritance
- Props interface for each component
- Default props where applicable

### State Management

- Keep state close to where it's used
- Lift state only when necessary
- Use Context sparingly
- Prefer props for component communication

### Error Handling

- Always handle errors
- Provide user-friendly messages
- Log errors for debugging
- Never expose sensitive information

### Performance

- Lazy load when possible
- Memoize expensive operations
- Optimize images
- Minimize bundle size

## Conclusion

This architecture provides a solid foundation for a scalable, maintainable React application. The separation of concerns, consistent patterns, and type safety make the codebase easy to understand and extend.

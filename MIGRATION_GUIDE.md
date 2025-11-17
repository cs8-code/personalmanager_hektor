# Migration Guide: Using New Architecture

This guide helps you migrate existing code to use the new architecture patterns, types, services, hooks, and components.

## Table of Contents

1. [Using Centralized Types](#1-using-centralized-types)
2. [Using Constants](#2-using-constants)
3. [Using Services](#3-using-services)
4. [Using Custom Hooks](#4-using-custom-hooks)
5. [Using the Toast System](#5-using-the-toast-system)
6. [Using Reusable Components](#6-using-reusable-components)
7. [Using Validation Utilities](#7-using-validation-utilities)
8. [Using Formatters](#8-using-formatters)
9. [Migration Examples](#9-migration-examples)

---

## 1. Using Centralized Types

### Before
```typescript
// Defined in each file
interface Worker {
  id: string;
  name: string;
  email: string;
  // ... more fields
}
```

### After
```typescript
// Import from centralized types
import { Worker, CreateWorkerDTO, UpdateWorkerDTO } from '../types';

// Use the types
const worker: Worker = { ... };
const newWorker: CreateWorkerDTO = { ... };
```

### Available Type Exports

```typescript
// All types
import {
  // Auth types
  UserProfile,
  SystemRole,
  UserRole,
  AuthContextType,
  LoginCredentials,
  RegistrationData,

  // Worker types
  Worker,
  CreateWorkerDTO,
  UpdateWorkerDTO,
  WorkerFilters,

  // Job types
  Job,
  CreateJobDTO,
  UpdateJobDTO,
  JobFilters,

  // Contract types
  Contract,
  CreateContractDTO,
  UpdateContractDTO,
  ContractFilters,

  // Contact Request types
  ContactRequest,
  CreateContactRequestDTO,
  UpdateContactRequestDTO,
  ContactRequestStatus,
} from '../types';
```

---

## 2. Using Constants

### Before
```typescript
// Magic strings scattered everywhere
if (status === 'active') { ... }
if (role === 'administrator') { ... }
```

### After
```typescript
import { JOB_STATUS, SYSTEM_ROLES } from '../constants';

if (status === JOB_STATUS.ACTIVE) { ... }
if (role === SYSTEM_ROLES.ADMINISTRATOR) { ... }
```

### Available Constants

```typescript
import {
  // Roles
  SYSTEM_ROLES,
  ROLE_LABELS,
  ROLE_DESCRIPTIONS,

  // Statuses
  AVAILABILITY_STATUS,
  JOB_STATUS,
  CONTRACT_STATUS,
  CONTACT_REQUEST_STATUS,

  // Employment
  EMPLOYMENT_TYPES,
  EMPLOYMENT_TYPE_VALUES,
  EMPLOYMENT_TYPE_OPTIONS,

  // Qualifications & Languages
  QUALIFICATIONS,
  LANGUAGES,

  // Work Preferences
  WORK_DAYS,
  SHIFTS,
  SMOKING_STATUS,
  GENDER_OPTIONS,
} from '../constants';
```

---

## 3. Using Services

### Before
```typescript
// Direct Supabase calls in components
const fetchJobs = async () => {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) throw error;
    setJobs(data);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### After
```typescript
import { jobService } from '../services';

const fetchJobs = async () => {
  try {
    const jobs = await jobService.getAll({ status: JOB_STATUS.ACTIVE });
    setJobs(jobs);
  } catch (error) {
    handleError(error, 'fetchJobs');
  }
};
```

### Available Services

```typescript
import {
  jobService,
  workerService,
  contractService,
  contactRequestService,
  authService,
  adminService,
  storageService,
} from '../services';

// Job Service
await jobService.getAll(filters);
await jobService.getById(id);
await jobService.getByUserId(userId);
await jobService.create(jobData);
await jobService.update(id, updates);
await jobService.delete(id);
await jobService.updateStatus(id, 'active');

// Worker Service
await workerService.getAll(filters);
await workerService.getById(id);
await workerService.getByCreatorId(creatorId);
await workerService.create(workerData);
await workerService.update(id, updates);
await workerService.delete(id);
await workerService.updateAvailabilityStatus(id, status);
await workerService.updateImage(id, imageUrl);
await workerService.search(searchTerm);

// Similar methods for other services...
```

---

## 4. Using Custom Hooks

### Before
```typescript
// Manual data fetching in every component
const [jobs, setJobs] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('jobs').select('*');
      if (error) throw error;
      setJobs(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };
  fetchJobs();
}, []);
```

### After
```typescript
import { useJobs } from '../hooks';

// One line!
const { jobs, loading, error, refetch } = useJobs({ status: JOB_STATUS.ACTIVE });

// Optionally refetch data
const handleRefresh = () => {
  refetch();
};
```

### Available Hooks

```typescript
import {
  // Job hooks
  useJobs,
  useJob,
  useJobsByUser,

  // Worker hooks
  useWorkers,
  useWorker,
  useWorkersByCreator,

  // Contract hooks
  useContracts,
  useContract,
  useContractsByUser,
  useActiveContracts,

  // Contact Request hooks
  useContactRequests,
  useContactRequest,
  useContactRequestsByWorker,
  usePendingRequestsCount,

  // Form hook
  useForm,

  // Permission hook
  usePermissions,

  // Toast hook
  useToast,
} from '../hooks';
```

### Form Hook Example

```typescript
const { values, errors, handleChange, handleSubmit, isSubmitting } = useForm({
  initialValues: {
    title: '',
    description: '',
  },
  validationSchema: {
    title: [
      { required: true, message: 'Titel ist erforderlich' },
      { minLength: 3, message: 'Titel muss mindestens 3 Zeichen lang sein' },
    ],
    description: [
      { required: true, message: 'Beschreibung ist erforderlich' },
    ],
  },
  onSubmit: async (values) => {
    await jobService.create({ ...values, created_by: user.id });
  },
});

return (
  <form onSubmit={handleSubmit}>
    <input
      name="title"
      value={values.title}
      onChange={handleChange}
    />
    {errors.title && <span>{errors.title}</span>}

    <button type="submit" disabled={isSubmitting}>
      {isSubmitting ? 'Wird gespeichert...' : 'Speichern'}
    </button>
  </form>
);
```

### Permission Hook Example

```typescript
const {
  isAuthenticated,
  isAdministrator,
  isManager,
  isManagerOrAdmin,
  canEditWorker,
  canManageJobs,
} = usePermissions();

// Use in components
{isManagerOrAdmin && (
  <button onClick={handleCreateJob}>Neuer Job</button>
)}

{canEditWorker(workerId, worker.created_by) && (
  <button onClick={handleEdit}>Bearbeiten</button>
)}
```

---

## 5. Using the Toast System

### Before
```typescript
// Old alert() calls
alert('Job erfolgreich erstellt!');
alert('Fehler beim Speichern');
```

### After
```typescript
import { useToast, TOAST_MESSAGES } from '../hooks';

const { showSuccess, showError, showWarning, showInfo } = useToast();

// Success message
showSuccess('Job erfolgreich erstellt!');
showSuccess(TOAST_MESSAGES.SUCCESS.CREATED);

// Error message
showError('Fehler beim Speichern');
showError(TOAST_MESSAGES.ERROR.SAVE);

// Warning message
showWarning('Sie haben ungespeicherte Änderungen');

// Info message
showInfo('Wird geladen...');

// Promise-based toast
const { promise } = useToast();
promise(
  jobService.create(jobData),
  {
    loading: 'Job wird erstellt...',
    success: 'Job erfolgreich erstellt!',
    error: 'Fehler beim Erstellen des Jobs',
  }
);
```

---

## 6. Using Reusable Components

### LoadingSpinner

```typescript
import { LoadingSpinner } from '../components/LoadingSpinner';

{loading && <LoadingSpinner message="Lädt Jobs..." size="lg" />}
```

### EmptyState

```typescript
import { EmptyState } from '../components/EmptyState';
import { Briefcase } from 'lucide-react';

{jobs.length === 0 && (
  <EmptyState
    icon={Briefcase}
    title="Keine Jobs gefunden"
    description="Versuchen Sie, Ihre Suchfilter anzupassen"
    action={
      <button onClick={handleReset}>Filter zurücksetzen</button>
    }
  />
)}
```

### ConfirmDialog

```typescript
import { ConfirmDialog } from '../components/ConfirmDialog';

const [showConfirm, setShowConfirm] = useState(false);

<ConfirmDialog
  isOpen={showConfirm}
  title="Job löschen?"
  message="Möchten Sie diesen Job wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden."
  confirmLabel="Löschen"
  cancelLabel="Abbrechen"
  variant="danger"
  onConfirm={handleDelete}
  onCancel={() => setShowConfirm(false)}
/>
```

### PageHeader

```typescript
import { PageHeader } from '../components/PageHeader';

<PageHeader
  title="Jobs verwalten"
  description="Erstellen und verwalten Sie Ihre Stellenangebote"
  action={
    <button onClick={handleCreate}>Neuer Job</button>
  }
/>
```

### Card

```typescript
import { Card } from '../components/Card';

<Card padding="lg" hover>
  <h3>Job Title</h3>
  <p>Description...</p>
</Card>
```

### Button

```typescript
import { Button } from '../components/Button';
import { Save } from 'lucide-react';

<Button
  variant="primary"
  size="md"
  icon={Save}
  loading={isSubmitting}
  onClick={handleSave}
>
  Speichern
</Button>
```

### Badge

```typescript
import { Badge } from '../components/Badge';

<Badge variant="success" size="md">
  Aktiv
</Badge>
```

---

## 7. Using Validation Utilities

### Before
```typescript
// Inline validation
const validateEmail = (email) => {
  return /\S+@\S+\.\S+/.test(email);
};
```

### After
```typescript
import { isValidEmail, isRequired, hasMinLength } from '../utils/validators';

// Use validators
if (!isRequired(email)) {
  setError('E-Mail ist erforderlich');
}

if (!isValidEmail(email)) {
  setError('Bitte geben Sie eine gültige E-Mail-Adresse ein');
}

if (!hasMinLength(password, 6)) {
  setError('Passwort muss mindestens 6 Zeichen lang sein');
}
```

### Available Validators

```typescript
import {
  isValidEmail,
  isValidPhone,
  isValidPassword,
  isRequired,
  hasMinLength,
  hasMaxLength,
  isDateInPast,
  isDateInFuture,
  isValidAge,
  isValidUrl,
  isInRange,
  isValidPostalCode,
} from '../utils/validators';
```

---

## 8. Using Formatters

### Before
```typescript
// Manual formatting
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('de-DE');
};
```

### After
```typescript
import { formatDate, formatDateTime, formatRelativeTime, formatCurrency } from '../utils/formatters';

// Format date
const formattedDate = formatDate(worker.created_at);
// "01.12.2023"

// Format date and time
const formattedDateTime = formatDateTime(job.created_at);
// "01.12.2023, 14:30"

// Relative time
const relativeTime = formatRelativeTime(request.created_at);
// "vor 2 Stunden"

// Currency
const formattedSalary = formatCurrency(50000);
// "50.000,00 €"
```

### Available Formatters

```typescript
import {
  formatDate,
  formatDateTime,
  formatRelativeTime,
  formatPhone,
  formatCurrency,
  formatNumber,
  truncate,
  formatList,
  formatFullName,
  formatFileSize,
  capitalize,
} from '../utils/formatters';
```

---

## 9. Migration Examples

### Example 1: Migrating a Job List Component

**Before:**
```typescript
const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('status', 'active');
        if (error) throw error;
        setJobs(data);
      } catch (error) {
        console.error('Error:', error);
        alert('Fehler beim Laden der Jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin..."></div>
        <p>Laden...</p>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <h3>Keine Jobs gefunden</h3>
      </div>
    );
  }

  return (
    <div>
      {jobs.map(job => (
        <div key={job.id}>
          <h3>{job.title}</h3>
          <p>{job.description}</p>
        </div>
      ))}
    </div>
  );
};
```

**After:**
```typescript
import { useJobs } from '../hooks';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { JOB_STATUS } from '../constants';
import { Briefcase } from 'lucide-react';

const JobsPage = () => {
  const { jobs, loading, error } = useJobs({ status: JOB_STATUS.ACTIVE });

  if (loading) return <LoadingSpinner message="Lädt Jobs..." />;

  if (error) return <div>Fehler: {error.message}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Stellenangebote"
        description="Finden Sie Ihre nächste Herausforderung"
      />

      {jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="Keine Jobs gefunden"
          description="Aktuell sind keine Stellenangebote verfügbar"
        />
      ) : (
        <div className="grid gap-4">
          {jobs.map(job => (
            <Card key={job.id} hover>
              <h3 className="text-xl font-bold">{job.title}</h3>
              <p className="text-gray-600">{job.description}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
```

### Example 2: Migrating a Form Component

**Before:**
```typescript
const CreateJobForm = () => {
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const newErrors = {};
    if (!formData.title) newErrors.title = 'Titel ist erforderlich';
    if (!formData.description) newErrors.description = 'Beschreibung ist erforderlich';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.from('jobs').insert([formData]);
      if (error) throw error;
      alert('Job erfolgreich erstellt!');
    } catch (error) {
      alert('Fehler beim Erstellen');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" value={formData.title} onChange={handleChange} />
      {errors.title && <span>{errors.title}</span>}

      <textarea name="description" value={formData.description} onChange={handleChange} />
      {errors.description && <span>{errors.description}</span>}

      <button type="submit" disabled={loading}>
        {loading ? 'Wird gespeichert...' : 'Speichern'}
      </button>
    </form>
  );
};
```

**After:**
```typescript
import { useForm, useToast } from '../hooks';
import { jobService } from '../services';
import { Button } from '../components/Button';
import { Save } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const CreateJobForm = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  const { values, errors, handleChange, handleSubmit, isSubmitting } = useForm({
    initialValues: {
      title: '',
      description: '',
    },
    validationSchema: {
      title: [
        { required: true, message: 'Titel ist erforderlich' },
        { minLength: 3, message: 'Titel muss mindestens 3 Zeichen lang sein' },
      ],
      description: [
        { required: true, message: 'Beschreibung ist erforderlich' },
      ],
    },
    onSubmit: async (values) => {
      try {
        await jobService.create({
          ...values,
          created_by: user!.id,
          status: 'active',
        });
        showSuccess('Job erfolgreich erstellt!');
      } catch (error) {
        showError('Fehler beim Erstellen des Jobs');
      }
    },
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title">Titel</label>
        <input
          id="title"
          name="title"
          value={values.title}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
        />
        {errors.title && (
          <span className="text-red-600 text-sm">{errors.title}</span>
        )}
      </div>

      <div>
        <label htmlFor="description">Beschreibung</label>
        <textarea
          id="description"
          name="description"
          value={values.description}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
        />
        {errors.description && (
          <span className="text-red-600 text-sm">{errors.description}</span>
        )}
      </div>

      <Button
        type="submit"
        variant="primary"
        icon={Save}
        loading={isSubmitting}
      >
        Speichern
      </Button>
    </form>
  );
};
```

---

## Quick Reference

### Import Paths

```typescript
// Types
import { Worker, Job, Contract } from '../types';

// Constants
import { SYSTEM_ROLES, JOB_STATUS } from '../constants';

// Services
import { jobService, workerService } from '../services';

// Hooks
import { useJobs, useForm, useToast, usePermissions } from '../hooks';

// Components
import { LoadingSpinner, EmptyState, Button, Card } from '../components/...';

// Utilities
import { formatDate, isValidEmail, handleError } from '../utils/...';
```

### Common Patterns

```typescript
// Data Fetching
const { data, loading, error, refetch } = useDataHook(filters);

// Form Handling
const { values, errors, handleChange, handleSubmit } = useForm({...});

// Toast Notifications
const { showSuccess, showError } = useToast();

// Permissions
const { isManagerOrAdmin, canEditWorker } = usePermissions();

// Error Handling
try {
  await service.method();
  showSuccess('Success message');
} catch (error) {
  const message = handleError(error, 'context');
  showError(message);
}
```

---

## Next Steps

1. Start with the most frequently used components
2. Migrate one page/component at a time
3. Test thoroughly after each migration
4. Remove old code once migrated
5. Update imports to use centralized types
6. Replace alert() calls with toast notifications
7. Use new reusable components for consistency

---

## Need Help?

- Check [ARCHITECTURE.md](./ARCHITECTURE.md) for architectural details
- Review the type definitions in `src/types/`
- Look at service implementations in `src/services/`
- Study hook usage examples in `src/hooks/`
- Examine component patterns in `src/components/`

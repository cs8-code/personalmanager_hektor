import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import ConditionalFooter from './components/ConditionalFooter';
import ScrollToTop from './components/ScrollToTop';

// Lazy load route components for code splitting
const PersonalmanagerHektorPage = lazy(() => import('./pages/PersonalmanagerHektorPage'));
const HomePage = lazy(() => import('./pages/HomePage/HomePage'));
const WorkerListingPage = lazy(() => import('./pages/WorkerListingPage'));
const WorkerDetailPage = lazy(() => import('./pages/WorkerDetailPage'));
const RegistrationPage = lazy(() => import('./pages/RegistrationPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const ServiceDetailPage = lazy(() => import('./pages/ServiceDetailPage'));
const AdminPanel = lazy(() => import('./components/AdminPanel'));
const ManagerPage = lazy(() => import('./pages/ManagerPage'));
const JobsPage = lazy(() => import('./pages/JobsPage'));
const JobDetailPage = lazy(() => import('./pages/JobDetailPage'));
const JobsManagementPage = lazy(() => import('./pages/JobsManagementPage'));
const SubcontractorGuidePage = lazy(() => import('./pages/SubcontractorGuidePage'));
const SipoNewsPage = lazy(() => import('./pages/SipoNewsPage'));
const BusinessRoomPage = lazy(() => import('./pages/BusinessRoomPage'));
const ContractsPage = lazy(() => import('./pages/ContractsPage'));
const ContractDetailPage = lazy(() => import('./pages/ContractDetailPage'));
const ContractManagementPage = lazy(() => import('./pages/ContractManagementPage'));
const KarrierePage = lazy(() => import('./pages/KarrierePage'));
const ATWSListingsPage = lazy(() => import('./pages/ATWSListingsPage'));
const ATWSListingDetailPage = lazy(() => import('./pages/ATWSListingDetailPage'));
const ATWSListingFormPage = lazy(() => import('./pages/ATWSListingFormPage'));
const UntersuchungenPage = lazy(() => import('./pages/UntersuchungenPage'));
const ImpressumPage = lazy(() => import('./pages/ImpressumPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsOfServicePage = lazy(() => import('./pages/TermsOfServicePage'));
const VerifyEmailPage = lazy(() => import('./pages/VerifyEmailPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <ScrollToTop />
        <AuthProvider>
          <Toaster />
          <div className="flex flex-col min-h-screen">
            <div className="flex-grow">
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<PersonalmanagerHektorPage />} />
                  <Route path="/siportal" element={<HomePage />} />
                  <Route path="/register" element={<RegistrationPage />} />
                  <Route path="/workers" element={<WorkerListingPage />} />
                  <Route path="/workers/:id" element={<WorkerDetailPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/service/:serviceId" element={<ServiceDetailPage />} />
                  <Route path="/admin" element={<AdminPanel />} />
                  <Route path="/manager" element={<ManagerPage />} />
                  <Route path="/jobs" element={<JobsPage />} />
                  <Route path="/jobs/:id" element={<JobDetailPage />} />
                  <Route path="/jobs-management" element={<JobsManagementPage />} />
                  <Route path="/subcontractor-guide" element={<SubcontractorGuidePage />} />
                  <Route path="/karriere" element={<KarrierePage />} />
                  <Route path="/sipo-news" element={<SipoNewsPage />} />
                  <Route path="/business-room" element={<BusinessRoomPage />} />
                  <Route path="/contracts" element={<ContractsPage />} />
                  <Route path="/contracts/:id" element={<ContractDetailPage />} />
                  <Route path="/contracts-management" element={<ContractManagementPage />} />
                  <Route path="/atws" element={<ATWSListingsPage />} />
                  <Route path="/atws/create" element={<ATWSListingFormPage />} />
                  <Route path="/atws/edit/:id" element={<ATWSListingFormPage />} />
                  <Route path="/atws/:id" element={<ATWSListingDetailPage />} />
                  <Route path="/untersuchungen" element={<UntersuchungenPage />} />
                  <Route path="/impressum" element={<ImpressumPage />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                  <Route path="/terms-of-service" element={<TermsOfServicePage />} />
                  <Route path="/verify-email" element={<VerifyEmailPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </div>
            <ConditionalFooter />
          </div>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;

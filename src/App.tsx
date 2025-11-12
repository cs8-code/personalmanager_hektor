import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import HomePage from './pages/HomePage/HomePage';
import WorkerListingPage from './pages/WorkerListingPage';
import WorkerDetailPage from './pages/WorkerDetailPage';
import RegistrationPage from './pages/RegistrationPage';
import ProfilePage from './pages/ProfilePage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import AdminPanel from './components/AdminPanel';
import ManagerPage from './pages/ManagerPage';
import JobsPage from './pages/JobsPage';
import JobDetailPage from './pages/JobDetailPage';
import JobsManagementPage from './pages/JobsManagementPage';
import SubcontractorGuidePage from './pages/SubcontractorGuidePage';
import SipoNewsPage from './pages/SipoNewsPage';
import PersonalmanagerHektorPage from './pages/PersonalmanagerHektorPage';
import ContractsPage from './pages/ContractsPage';
import ContractDetailPage from './pages/ContractDetailPage';
import ContractManagementPage from './pages/ContractManagementPage';

function App() {
  return (
    <AuthProvider>
      <Router>
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
          <Route path="/sipo-news" element={<SipoNewsPage />} />
          <Route path="/contracts" element={<ContractsPage />} />
          <Route path="/contracts/:id" element={<ContractDetailPage />} />
          <Route path="/contracts-management" element={<ContractManagementPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import HomePage from './pages/HomePage/HomePage';
import WorkerListingPage from './pages/WorkerListingPage/WorkerListingPage';
import WorkerDetailPage from './pages/WorkerDetailPage/WorkerDetailPage';
import RegistrationPage from './pages/RegistrationPage/RegistrationPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import ServiceDetailPage from './pages/ServiceDetailPage/ServiceDetailPage';
import AdminPanel from './components/AdminPanel';
import ManagerPage from './pages/ManagerPage/ManagerPage';
import JobsPage from './pages/JobsPage/JobsPage';
import JobDetailPage from './pages/JobDetailPage/JobDetailPage';
import JobsManagementPage from './pages/JobsManagementPage/JobsManagementPage';
import SubcontractorGuidePage from './pages/SubcontractorGuidePage/SubcontractorGuidePage';
import SipoNewsPage from './pages/SipoNewsPage/SipoNewsPage';
import PersonalmanagerHektorPage from './pages/PersonalmanagerHektorPage/PersonalmanagerHektorPage';
import ContractsPage from './pages/ContractsPage/ContractsPage';
import ContractDetailPage from './pages/ContractDetailPage/ContractDetailPage';
import ContractManagementPage from './pages/ContractManagementPage/ContractManagementPage';

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

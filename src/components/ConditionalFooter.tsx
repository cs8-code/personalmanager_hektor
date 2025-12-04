import { useLocation } from 'react-router-dom';
import HektorFooter from '../pages/HomePage/components/HektorFooter';
import SiportalFooter from '../pages/HomePage/components/SiportalFooter';

export default function ConditionalFooter() {
  const location = useLocation();

  // Use HektorFooter for the landing page
  if (location.pathname === '/') {
    return <HektorFooter />;
  }

  // Use SiportalFooter for all other pages
  return <SiportalFooter />;
}

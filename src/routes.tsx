import HomePage from './pages/HomePage';
import AssessmentPage from './pages/AssessmentPage';
import ResultsPage from './pages/ResultsPage';
import DiseaseDetailsPage from './pages/DiseaseDetailsPage';
import HospitalFinderPage from './pages/HospitalFinderPage';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Home',
    path: '/',
    element: <HomePage />,
    visible: true,
  },
  {
    name: 'Symptom Assessment',
    path: '/assessment',
    element: <AssessmentPage />,
    visible: true,
  },
  {
    name: 'Analysis Results',
    path: '/results',
    element: <ResultsPage />,
    visible: false,
  },
  {
    name: 'Disease Details',
    path: '/disease/:diseaseId',
    element: <DiseaseDetailsPage />,
    visible: false,
  },
  {
    name: 'Find Hospitals',
    path: '/hospitals',
    element: <HospitalFinderPage />,
    visible: true,
  },
];

export default routes;

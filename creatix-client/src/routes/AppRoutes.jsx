import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import { PrivateRoute, CreatorRoute, AdminRoute, PublicOnlyRoute, NonDemoRoute } from '../components/PrivateRoute';
import { HomeRoute } from '../components/HomeRoute';
import Loader from '../components/Loader';

// Eagerly loaded (critical path)
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';

// Lazy loaded (code splitting)
const AllContests = lazy(() => import('../pages/AllContests'));
const ContestDetails = lazy(() => import('../pages/ContestDetails'));
const Leaderboard = lazy(() => import('../pages/Leaderboard'));
const NotFound = lazy(() => import('../pages/NotFound'));
const About = lazy(() => import('../pages/About'));
const Contact = lazy(() => import('../pages/Contact'));
const Blog = lazy(() => import('../pages/Blog'));
const PrivacyPolicy = lazy(() => import('../pages/PrivacyPolicy'));
const Terms = lazy(() => import('../pages/Terms'));
const Pricing = lazy(() => import('../pages/Pricing'));
const Careers = lazy(() => import('../pages/Careers'));
const PressKit = lazy(() => import('../pages/PressKit'));
const HelpCenter = lazy(() => import('../pages/HelpCenter'));
const FaqsPage = lazy(() => import('../pages/FaqsPage'));
const Community = lazy(() => import('../pages/Community'));
const CookiePolicy = lazy(() => import('../pages/CookiePolicy'));
const ContestRules = lazy(() => import('../pages/ContestRules'));

// Dashboard Pages (lazy loaded)
const DashboardHome = lazy(() => import('../pages/dashboard/DashboardHome'));
const MyParticipatedContests = lazy(() => import('../pages/dashboard/MyParticipatedContests'));
const MyWinningContests = lazy(() => import('../pages/dashboard/MyWinningContests'));
const MyProfile = lazy(() => import('../pages/dashboard/MyProfile'));
const AddContest = lazy(() => import('../pages/dashboard/AddContest'));
const MyCreatedContests = lazy(() => import('../pages/dashboard/MyCreatedContests'));
const ContestSubmissions = lazy(() => import('../pages/dashboard/ContestSubmissions'));
const EditContest = lazy(() => import('../pages/dashboard/EditContest'));
const ManageUsers = lazy(() => import('../pages/dashboard/ManageUsers'));
const ManageContests = lazy(() => import('../pages/dashboard/ManageContests'));
const ApplyAsCreator = lazy(() => import('../pages/dashboard/ApplyAsCreator'));
const AdminReports = lazy(() => import('../pages/dashboard/AdminReports'));
const AdminCategories = lazy(() => import('../pages/dashboard/AdminCategories'));
const AdminSettings = lazy(() => import('../pages/dashboard/AdminSettings'));

// Suspense wrapper for lazy components
const LazyPage = ({ children }) => (
  <Suspense fallback={<Loader />}>
    {children}
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: (
          <HomeRoute>
            <Home />
          </HomeRoute>
        ),
      },
      {
        path: 'all-contests',
        element: <LazyPage><AllContests /></LazyPage>,
      },
      {
        path: 'contest/:id',
        element: <LazyPage><ContestDetails /></LazyPage>,
      },
      {
        path: 'leaderboard',
        element: <LazyPage><Leaderboard /></LazyPage>,
      },
      {
        path: 'login',
        element: (
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        ),
      },
      {
        path: 'register',
        element: (
          <PublicOnlyRoute>
            <Register />
          </PublicOnlyRoute>
        ),
      },
      {
        path: 'about',
        element: <LazyPage><About /></LazyPage>,
      },
      {
        path: 'contact',
        element: <LazyPage><Contact /></LazyPage>,
      },
      {
        path: 'blog',
        element: <LazyPage><Blog /></LazyPage>,
      },
      {
        path: 'privacy-policy',
        element: <LazyPage><PrivacyPolicy /></LazyPage>,
      },
      {
        path: 'terms',
        element: <LazyPage><Terms /></LazyPage>,
      },
      {
        path: 'pricing',
        element: <LazyPage><Pricing /></LazyPage>,
      },
      {
        path: 'careers',
        element: <LazyPage><Careers /></LazyPage>,
      },
      {
        path: 'press',
        element: <LazyPage><PressKit /></LazyPage>,
      },
      {
        path: 'help',
        element: <LazyPage><HelpCenter /></LazyPage>,
      },
      {
        path: 'faqs',
        element: <LazyPage><FaqsPage /></LazyPage>,
      },
      {
        path: 'community',
        element: <LazyPage><Community /></LazyPage>,
      },
      {
        path: 'cookies',
        element: <LazyPage><CookiePolicy /></LazyPage>,
      },
      {
        path: 'rules',
        element: <LazyPage><ContestRules /></LazyPage>,
      },
    ],
  },
  {
    path: '/dashboard',
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      // User Dashboard Routes
      {
        index: true,
        element: <LazyPage><DashboardHome /></LazyPage>,
      },
      {
        path: 'participated',
        element: <LazyPage><MyParticipatedContests /></LazyPage>,
      },
      {
        path: 'winning',
        element: <LazyPage><MyWinningContests /></LazyPage>,
      },
      {
        path: 'profile',
        element: (
          <NonDemoRoute>
            <LazyPage><MyProfile /></LazyPage>
          </NonDemoRoute>
        ),
      },
      {
        path: 'apply-creator',
        element: (
          <NonDemoRoute>
            <LazyPage><ApplyAsCreator /></LazyPage>
          </NonDemoRoute>
        ),
      },
      // Creator Dashboard Routes
      {
        path: 'add-contest',
        element: (
          <NonDemoRoute>
            <CreatorRoute>
              <LazyPage><AddContest /></LazyPage>
            </CreatorRoute>
          </NonDemoRoute>
        ),
      },
      {
        path: 'my-contests',
        element: (
          <NonDemoRoute>
            <CreatorRoute>
              <LazyPage><MyCreatedContests /></LazyPage>
            </CreatorRoute>
          </NonDemoRoute>
        ),
      },
      {
        path: 'submissions/:id',
        element: (
          <NonDemoRoute>
            <CreatorRoute>
              <LazyPage><ContestSubmissions /></LazyPage>
            </CreatorRoute>
          </NonDemoRoute>
        ),
      },
      {
        path: 'edit-contest/:id',
        element: (
          <NonDemoRoute>
            <CreatorRoute>
              <LazyPage><EditContest /></LazyPage>
            </CreatorRoute>
          </NonDemoRoute>
        ),
      },
      // Admin Dashboard Routes
      {
        path: 'manage-users',
        element: (
          <NonDemoRoute>
            <AdminRoute>
              <LazyPage><ManageUsers /></LazyPage>
            </AdminRoute>
          </NonDemoRoute>
        ),
      },
      {
        path: 'manage-contests',
        element: (
          <NonDemoRoute>
            <AdminRoute>
              <LazyPage><ManageContests /></LazyPage>
            </AdminRoute>
          </NonDemoRoute>
        ),
      },
      {
        path: 'reports',
        element: (
          <NonDemoRoute>
            <AdminRoute>
              <LazyPage><AdminReports /></LazyPage>
            </AdminRoute>
          </NonDemoRoute>
        ),
      },
      {
        path: 'categories',
        element: (
          <NonDemoRoute>
            <AdminRoute>
              <LazyPage><AdminCategories /></LazyPage>
            </AdminRoute>
          </NonDemoRoute>
        ),
      },
      {
        path: 'settings',
        element: (
          <NonDemoRoute>
            <AdminRoute>
              <LazyPage><AdminSettings /></LazyPage>
            </AdminRoute>
          </NonDemoRoute>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <LazyPage><NotFound /></LazyPage>,
  },
]);

const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;

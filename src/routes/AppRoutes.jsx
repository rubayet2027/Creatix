import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import { PrivateRoute, CreatorRoute, AdminRoute, PublicOnlyRoute } from '../components/PrivateRoute';

// Public Pages
import Home from '../pages/Home';
import AllContests from '../pages/AllContests';
import ContestDetails from '../pages/ContestDetails';
import Leaderboard from '../pages/Leaderboard';
import Login from '../pages/Login';
import Register from '../pages/Register';

// Dashboard Pages
import {
  DashboardHome,
  MyParticipatedContests,
  MyWinningContests,
  MyProfile,
  AddContest,
  MyCreatedContests,
  ContestSubmissions,
  EditContest,
  ManageUsers,
  ManageContests,
} from '../pages/dashboard';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'all-contests',
        element: <AllContests />,
      },
      {
        path: 'contest/:id',
        element: <ContestDetails />,
      },
      {
        path: 'leaderboard',
        element: <Leaderboard />,
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
        element: <DashboardHome />,
      },
      {
        path: 'participated',
        element: <MyParticipatedContests />,
      },
      {
        path: 'winning',
        element: <MyWinningContests />,
      },
      {
        path: 'profile',
        element: <MyProfile />,
      },
      // Creator Dashboard Routes
      {
        path: 'add-contest',
        element: (
          <CreatorRoute>
            <AddContest />
          </CreatorRoute>
        ),
      },
      {
        path: 'my-contests',
        element: (
          <CreatorRoute>
            <MyCreatedContests />
          </CreatorRoute>
        ),
      },
      {
        path: 'submissions/:id',
        element: (
          <CreatorRoute>
            <ContestSubmissions />
          </CreatorRoute>
        ),
      },
      {
        path: 'edit-contest/:id',
        element: (
          <CreatorRoute>
            <EditContest />
          </CreatorRoute>
        ),
      },
      // Admin Dashboard Routes
      {
        path: 'manage-users',
        element: (
          <AdminRoute>
            <ManageUsers />
          </AdminRoute>
        ),
      },
      {
        path: 'manage-contests',
        element: (
          <AdminRoute>
            <ManageContests />
          </AdminRoute>
        ),
      },
    ],
  },
]);

const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;

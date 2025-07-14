// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Common from './Common';
import Loginpage from './components/Loginpage';
import Register from './components/Register';
import Firstnextpage from './components/Firstnextpage';
import ProcessSteps from './components/ProcessSteps';
import EarningsPage from './components/EarningsPage';
import SkyFunded from './components/SkyFunded';
import ChallengePage from './components/ChallengePage';
import FeedbackSlider from './components/FeedbackSlider';
import TradersFeedback from './components/TradersFeedback';
import ContactUs from './components/ContactUs';
import SkyfundedChallenge from './components/SkyfundedChallenge';
import Express from './components/Express';
import Evaluation from './components/Evaluation';
import HowItWorks from './components/HowItWorks';
import Faq from './components/Faq';

import AdminPanel from './pages/AdminPanel';
import Homepage from './components/Homepage';
import Tablesteps from './components/Tablesteps';
import ProtectedRoute from './pages/ProtectedRoute';
import Profile from './pages/Profile';
import AdminChallengePage from './pages/AdminChallengePage';
import Transaction from './pages/Transactions';
import Settings from './pages/Settings';
import Deposit from './pages/Deposit'; // ✅ NEW Deposit Page import

import Layout from './components/Layout';  // **Import Layout component**

import HeadAdminpanel from './HeadAdminpanel/HeadAdminpanel';  // <-- NEW import
import Adminlogin from './HeadAdminpanel/Adminlogin';          // <-- Import AdminLogin
import UsersPage from './HeadAdminpanel/UsersPage';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Routes for non-admin pages */}
        <Route path="/" element={<Common />}>
          <Route index element={<Homepage />} />
          <Route path="/firstnextpage" element={<Firstnextpage />} />
          <Route path="/process-steps" element={<ProcessSteps />} />
          <Route path="/login" element={<Loginpage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/skyfunded-challenge" element={<SkyfundedChallenge />} />
          <Route path="/express" element={<Express />} />
          <Route path="/evaluation" element={<Evaluation />} />
          <Route path="/challenge-page" element={<ChallengePage />} />
          <Route path="/Tablesteps" element={<Tablesteps />} />
          <Route path="/sky-funded" element={<SkyFunded />} />
          <Route path="/earnings-page" element={<EarningsPage />} />
          <Route path="/feedback-slider" element={<FeedbackSlider />} />
          <Route path="/traders-feedback" element={<TradersFeedback />} />
        </Route>

        {/* Admin Login (unprotected) */}
        <Route path="/adminlogin" element={<Adminlogin />} />

        {/* Admin Panel Routes (Protected + Layout wrapper) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <AdminPanel />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/challenge-page"
          element={
            <ProtectedRoute>
              <Layout>
                <AdminChallengePage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/transaction"
          element={
            <ProtectedRoute>
              <Layout>
                <Transaction />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Layout>
                <Settings />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/deposit"
          element={
            <ProtectedRoute>
              <Layout>
                <Deposit />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* New route for HeadAdminpanel */}
        <Route
          path="/headadmin"
          element={
            <ProtectedRoute>
            
                <HeadAdminpanel />
           
            </ProtectedRoute>
          }
        />
        <Route
  path="/headadmin/users"
  element={
    <ProtectedRoute>
      <UsersPage />
    </ProtectedRoute>
  }
/>

        {/* Agar /admin/* se koi route aaye to AdminPanel hi render karna (optional) */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <Layout>
                <AdminPanel />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;



import React from 'react'
import { Routes } from 'react-router-dom'
import { Route } from 'react-router-dom';
import Navbar from './Components/Navbar'
import Home from './Components/Home'
import Createaccount from './Components/Createaccount';
import UserLogin from './Components/UserLogin'
import Forgotpassword from './Components/Forgotpassword'
import UserDashboard from './Components/UserDashboard';
import VoluteerDashboard from "./Components/VoluteerDashboard";
import AdminDasboard from "./Components/AdminDasboard";
import ProtectedRoute from "./Components/ProtectedRoute";
import Authsuccess from "./Components/Authsuccess";
import GuidenceDetail from "./Components/GuidenceDetail"
import Donation from "./Components/Donation"
import DonarRegistration from "./Components/DonarRegistration"
import BloodRequests from './Components/BloodRequests';
import ResetPassword from './Components/ResetPassword';
import EmergencyAlert from './Components/EmergencyAlert';
import DonorMatching from './Components/DonarMatching';
import EditProfile from './Components/EditProfile';
import Settings from './Components/Settings';
import Viewdonations from './Components/Viewdonations'

const App = () => {
  return (
    <div>

      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/createaccount" element={<Createaccount role="User" />} />
        <Route
          path="/createvolunteer"
          element={<Createaccount role="Responder" />}
        />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/forgotpassword" element={<Forgotpassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/emergency-Alert" element={<EmergencyAlert />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["User", "Admin"]}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/volunteer-dashboard"
          element={
            <ProtectedRoute allowedRoles={["Responder", "Admin"]}>
              <VoluteerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminDasboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/donor-registration"
          element={ <DonarRegistration /> }/>

        <Route
          path="/blood-requests"
          element={
            <ProtectedRoute allowedRoles={["User", "Responder", "Admin"]}>
              <BloodRequests />
            </ProtectedRoute>
          }
        />

        <Route
          path="/donor-matching"
          element={
            <ProtectedRoute allowedRoles={["Responder", "Admin"]}>
              <DonorMatching />
            </ProtectedRoute>
          }
        />

        <Route
          path="/view-donation"
          element={
            <ProtectedRoute allowedRoles={["User", "Admin"]}>
              <Viewdonations />
            </ProtectedRoute>
          }
        />


        <Route path="/auth-success" element={<Authsuccess />} />
        <Route path="/guidance/:id" element={<GuidenceDetail />} />
        <Route path="/fund-donation" element={<Donation />}></Route>
        <Route path="/edit-profile" element={<EditProfile />}></Route>
        <Route path="/settings" element={<Settings />}></Route>


      </Routes>



    </div>
  )
}

export default App

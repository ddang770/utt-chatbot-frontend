import {
  Routes,
  Route
} from "react-router-dom";
import HomeChat from '../components/HomeChat/HomeChat';
import AdminManager from '../components/AdminManager/AdminManager';
import AdminLogin from "../components/AdminLogin/AdminLogin";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

const AppRoutes = (props) => {
  return (
    <>
      <Routes>
        {/* <PrivateRoutes path="/users" component={Users} /> */}

        <Route path="/" element={<HomeChat />} />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute>
            <AdminManager />
          </ProtectedRoute>
        } />
        <Route path="/admin/login" element={
          <PublicRoute>
            <AdminLogin />
          </PublicRoute>} />
        <Route path="*" element={<div className="container">404 not found</div>} />
      </Routes >
    </>
  )
}

export default AppRoutes;
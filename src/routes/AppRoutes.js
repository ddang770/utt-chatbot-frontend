import {
  Routes,
  Route
} from "react-router-dom";
import HomeChat from '../components/HomeChat/HomeChat';
import AdminDashboard from '../components/AdminDashboard/AdminDashboard';
//import PrivateRoutes from "./PrivateRoutes";

const AppRoutes = (props) => {
  return (
    <>
      <Routes>
        {/* <PrivateRoutes path="/users" component={Users} /> */}

        <Route path="/" element={<HomeChat />} />
        <Route path="/admin" element={<AdminDashboard />} />
        {/* <Route path="/login" exact>
          <Login />
        </Route> */}
        <Route path="*" element={<div className="container">404 not found</div>} />
      </Routes >
    </>
  )
}

export default AppRoutes;
import { Outlet } from "react-router-dom";
import Navbar from "../shared/Navbar";
import Footer from "../shared/Footer";
import { ToastContainer } from "react-toastify";

const MainLayout = () => {
  return (
    <div>
      <Navbar />
      <div className="min-h-[82vh]">
        <Outlet />
      </div>
      <Footer />
      <ToastContainer autoClose={2000} />
    </div>
  );
};

export default MainLayout;

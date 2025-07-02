import { Outlet } from "react-router-dom";
import Navbar from "./Navbar1";

const RootLayout = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
};

export default RootLayout;

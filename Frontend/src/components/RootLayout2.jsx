import { Outlet } from "react-router-dom";
import Navbar2 from './Navbar2'

const RootLayout = () => {
  return (
    <div>
      <Navbar2/>
      <Outlet />
    </div>
  );
};

export default RootLayout;

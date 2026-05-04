import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <Navbar />
      <div className="layout">
        <main className="content">
          <div className="page">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
};

export default Layout;
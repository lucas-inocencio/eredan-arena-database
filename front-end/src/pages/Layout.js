import { Outlet, Link } from "react-router-dom";
import React from "react";

const Layout = () => {
  const [darkMode, setDarkMode] = React.useState(false);

  React.useEffect(() => {
    document.body.className = darkMode ? "dark-mode" : "";
  }, [darkMode]);

  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/cards">Cards</Link>
          </li>
          <li>
            <Link to="/equips">Equips</Link>
          </li>
          <li>
            <Link to="/skills">Skills</Link>
          </li>
        </ul>
        <button onClick={() => setDarkMode((prev) => !prev)}>
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </nav>

      <Outlet />
    </>
  )
};

export default Layout;
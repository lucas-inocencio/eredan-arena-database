import { Outlet, Link } from "react-router-dom";
import React from "react";

const Layout = () => {
  const [darkMode, setDarkMode] = React.useState(false);

  React.useEffect(() => {
    document.body.className = darkMode ? "dark-mode" : "";
  }, [darkMode]);

  // Automatically set dark mode based on user's system preference
  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setDarkMode(mediaQuery.matches);

    const handleChange = (e) => setDarkMode(e.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

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
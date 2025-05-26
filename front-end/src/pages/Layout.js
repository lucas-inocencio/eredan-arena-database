import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <nav>
        <ul className="Layout">
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
      </nav>

      <Outlet />
    </>
  )
};

export default Layout;
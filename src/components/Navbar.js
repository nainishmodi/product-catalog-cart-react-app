import { NavLink } from "react-router-dom"

const Navbar = () => {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <NavLink to="/" exact className="navbar-brand">
            Sample Product App
          </NavLink>
        </div>
      </nav>
    </>
  );
}

export default Navbar;

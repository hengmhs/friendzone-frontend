import { useNavigate } from "react-router-dom";
import "./NavBar.css";
import { useAuth0 } from "@auth0/auth0-react";

const NavBar = () => {
  const { isAuthenticated, logout } = useAuth0();
  const navigate = useNavigate();

  const handleNavigate = (e) => {
    navigate(`/${e.currentTarget.id}`);
  };

  const handleClick = () => {
    logout();
  };

  return (
    <div id="nav">
      <img src="../logos/fz_logo_full.svg" alt="logo" />
      <div id="nav-links">
        <button onClick={handleNavigate} id="events">
          <h5>Events</h5>
        </button>
        <button onClick={handleNavigate} id="participants">
          <h5>Participants</h5>
        </button>
        <button onClick={handleNavigate} id="facils">
          <h5>Facilitators</h5>
        </button>
        {!isAuthenticated && (
          <button onClick={handleClick} id="logout">
            <h5>Log Out</h5>
          </button>
        )}
      </div>
    </div>
  );
};

export default NavBar;

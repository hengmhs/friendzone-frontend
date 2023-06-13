import { useNavigate } from "react-router-dom";
import LogoutButton from "../../components/Buttons/LogoutButton";
import "./NavBar.css";
import { useAuth0 } from "@auth0/auth0-react";

const NavBar = () => {
  const navigate = useNavigate();
  const handleNavigate = (e) => {
    navigate(`/${e.currentTarget.id}`);
  };
  const { isAuthenticated } = useAuth0();

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
        {isAuthenticated && <LogoutButton />}
      </div>
    </div>
  );
};

export default NavBar;

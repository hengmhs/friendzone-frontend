import { useEffect } from "react";
import NavBar from "../../components/NavBar/NavBar";
import LoginButton from "../../components/Buttons/LoginButton";
import { useAuth0 } from "@auth0/auth0-react";
import "./Login.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/events");
    }
    // eslint-disable-next-line
  }, [isAuthenticated]);

  return (
    <div className="contents">
      <NavBar />
      <div id="login-module">
        <div className="login-header">
          <img src="../logos/pals_logo.svg" alt="logo" />
        </div>
        {!isAuthenticated && <LoginButton />}
      </div>
    </div>
  );
};

export default Login;

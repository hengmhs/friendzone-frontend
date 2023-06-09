import { useEffect } from "react";
import NavBar from "../../components/NavBar/NavBar";
import "./Login.css";
import { useAuth0 } from "@auth0/auth0-react";

const Login = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  const handleClick = () => {
    loginWithRedirect();
  };

  useEffect(() => {
    console.log(isAuthenticated);
  }, [isAuthenticated]);

  return (
    <div className="contents">
      <NavBar />
      <div id="login">
        <h1>Friendzone Event Management App</h1>
        <button onClick={handleClick}>
          <h2>Login</h2>
        </button>
      </div>
    </div>
  );
};

export default Login;

import NavBar from "../../components/NavBar/NavBar";
import LoginButton from "../../components/Buttons/LoginButton";
import LogoutButton from "../../components/Buttons/LogoutButton";
import { useAuth0 } from "@auth0/auth0-react";

const Login = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  return (
    <div className="contents">
      <NavBar />
      <h1>Login Page</h1>
      <div>isLoading: {isLoading.toString()}</div>
      <div>Authenticated Status: {isAuthenticated.toString()} </div>
      {isAuthenticated && <div>User: {user.email} </div>}

      <LoginButton />
      <LogoutButton />
    </div>
  );
};

export default Login;

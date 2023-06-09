import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";
import "./index.css";
import "./fonts/satoshi.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Auth0Provider
    domain="dev-uki2t68i2ph0pfv6.us.auth0.com"
    clientId="6yvACJbVtutMuMiP1Nt3qSW3FThr8ujo"
    authorizationParams={{ redirect_uri: window.location.origin }}
    audience="https://test/api"
  >
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Auth0Provider>
);

//----------- React -----------//

import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

//---------- Pages ----------//

import EventsHome from "./pages/Events/EventsHome/EventsHome";
import EventPage from "./pages/Events/EventPage/EventPage";
import Participants from "./pages/Participants/Participants";
import Facilitators from "./pages/Facilitators/Facilitators";
import Login from "./pages/Login/Login";

//---------- Others ----------//

import { useAuth0 } from "@auth0/auth0-react";
import "./App.css";

//------------------------------//

const App = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  useEffect(() => {
    console.log("App.js: ", isAuthenticated);
  }, [isAuthenticated]);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/events" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/events">
          <Route index element={<EventsHome />} />
          <Route path=":eventId" element={<EventPage />} />
        </Route>
        <Route path="/participants" element={<Participants />} />
        <Route path="/facils" element={<Facilitators />} />
      </Routes>
    </div>
  );
};

export default App;

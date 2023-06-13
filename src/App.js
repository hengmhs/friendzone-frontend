//----------- React -----------//

import React from "react";
import { Route, Routes } from "react-router-dom";

//---------- Pages ----------//

import EventsHome from "./pages/Events/EventsHome/EventsHome";
import EventPage from "./pages/Events/EventPage/EventPage";
import Participants from "./pages/Participants/Participants";
import Facilitators from "./pages/Facilitators/Facilitators";
import Login from "./pages/Login/Login";

//---------- Others ----------//

import "./App.css";

//------------------------------//

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
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

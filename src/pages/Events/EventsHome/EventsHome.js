//----------- React -----------//

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

//---------- Components ----------//

import NavBar from "../../../components/NavBar/NavBar";
import EventComposer from "../../../components/Forms/EventComposer";
import EventButton from "../../../components/Buttons/EventButton";

//---------- Others ----------//

import axios from "axios";
import "./EventsHome.css";

//---------- Auth ----------//
import { useAuth0 } from "@auth0/auth0-react";
import Loading from "../../Loading/Loading";

//------------------------------//

const EventsHome = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [toggleComposer, setToggleComposer] = useState(false);
  const [data, setData] = useState(null);

  //---------- Auth ----------//
  const {
    isAuthenticated,
    isLoading,
    getAccessTokenSilently,
    loginWithRedirect,
  } = useAuth0();
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        getAccessTokenSilently({
          audience: "https://friendzone",
        }).then((token) => {
          setAccessToken(token);
        });
      } else {
        loginWithRedirect();
      }
    }
    // eslint-disable-next-line
  }, [isLoading]);

  useEffect(() => {
    const getTableData = async () => {
      const eventList = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/events`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setData(eventList.data.data);
    };
    if (accessToken) {
      getTableData();
    }
  }, [accessToken]);

  const handleClick = (e) => {
    navigate(location.pathname + "/" + e.currentTarget.id);
  };

  const handleToggle = () => {
    setToggleComposer((prev) => !prev);
  };

  if (!data) {
    return <Loading />;
  } else {
    const buttons = data.map((event) => (
      <EventButton onClick={handleClick} id={event.id} key={event.id}>
        {event}
      </EventButton>
    ));

    return (
      <div className="contents">
        {toggleComposer && (
          <EventComposer
            handleToggle={handleToggle}
            accessToken={accessToken}
          />
        )}
        <NavBar />
        <div className="header">
          <h1>Events Home</h1>
          <button onClick={handleToggle}>
            <h5>Add Event</h5>
          </button>
        </div>
        <div className="events-home-buttons">{buttons}</div>
      </div>
    );
  }
};

export default EventsHome;

//----------- React -----------//

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

//---------- Components ----------//

import NavBar from "../../../components/NavBar/NavBar";
import ParticipantAdder from "../../../components/Forms/ParticipantAdder";
import ParticipantsAll from "../../../components/EventPage/ParticipantsAll";
import ParticipantsGroups from "../../../components/EventPage/ParticipantsGroups";

//---------- Others ----------//

import axios from "axios";
import "./EventPage.css";

//---------- Auth ----------//
import { useAuth0 } from "@auth0/auth0-react";

//------------------------------//

const EventPage = () => {
  const navigate = useNavigate();

  //---------- Auth ----------//
  const { isAuthenticated, getAccessTokenSilently, loginWithRedirect } =
    useAuth0;
  const [accessToken, setAccessToken] = useState("");

  //---------- Data ----------//

  const { eventId } = useParams();
  const [data, setData] = useState(null);
  const [eventData, setEventData] = useState(null);
  const [groupData, setGroupData] = useState(null);
  const [facilData, setFacilData] = useState(null);

  //---------- UI ----------//

  const [toggleComposer, setToggleComposer] = useState(false);
  const [tab, setTab] = useState("all");

  //------------------------------//

  /*
  useEffect(() => {
    if (isAuthenticated) {
      let token = getAccessTokenSilently({
        audience: "https://friendzone",
      });
      setAccessToken(token);
    } else {
      loginWithRedirect();
    }
  }, []);*/

  useEffect(() => {
    const getTableData = async () => {
      const rawData = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/events/${eventId}/participants`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const tableData = await rawData.data.data.map((raw) => ({
        ...raw.participant,
        egpId: raw.id,
        statusId: raw.statusId,
        isAttended: raw.isAttended,
        groupId: raw.groupId,
      }));
      setData(tableData);
    };
    const getEventData = async () => {
      const event = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/events/${eventId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setEventData(event.data.event);
    };
    const getGroupData = async () => {
      const groups = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/groups/${eventId}`
      );
      setGroupData(groups.data.data);
    };
    const getFacilData = async () => {
      const facilitators = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/facilitators`
      );
      setFacilData(facilitators.data.data);
    };

    getTableData();
    getEventData();
    getGroupData();
    getFacilData();
    // eslint-disable-next-line
  }, []);

  const handleClick = (e) => {
    if (e.currentTarget.id === "back") {
      navigate(-1);
    }
  };

  const handleToggle = (e) => {
    if (e.currentTarget.id === "participants") {
      setToggleComposer((prev) => !prev);
    }
  };

  const toggleTab = () => {
    if (tab === "all") {
      setTab("groupings");
    } else {
      setTab("all");
    }
  };

  return (
    <div className="contents" id="event-page">
      {toggleComposer && (
        <ParticipantAdder handleToggle={handleToggle} eventId={eventId} />
      )}
      <NavBar />
      <button onClick={handleClick} id="back">
        <h5>← Back</h5>
      </button>
      {tab === "all" ? (
        <ParticipantsAll
          data={data}
          setData={setData}
          eventData={eventData}
          handleToggle={handleToggle}
          toggleTab={toggleTab}
        />
      ) : (
        <ParticipantsGroups
          data={data}
          setData={setData}
          eventData={eventData}
          handleToggle={handleToggle}
          toggleTab={toggleTab}
          groupData={groupData}
          setGroupData={setGroupData}
          facilData={facilData}
        />
      )}
    </div>
  );
};

export default EventPage;

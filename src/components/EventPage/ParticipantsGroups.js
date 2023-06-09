//----------- React -----------//

import { useParams } from "react-router-dom";

//---------- Components ----------//

import Table from "../Table/Table";

//---------- Others ----------//

import { groupingColumns } from "../Table/columns";
import { useEffect, useState } from "react";
import axios from "axios";
import generateGroupings from "../../groupings/groupingFunction";

//------------------------------//

const ParticipantsGroups = ({
  data,
  setData,
  eventData,
  toggleTab,
  groupData,
  setGroupData,
  facilData,
}) => {
  const { eventId } = useParams();
  const [filteredData, setFilteredData] = useState([]);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const confirmedParticipants = data.filter(
      (participant) => Number(participant.statusId) === 5
    );
    setFilteredData(confirmedParticipants);
    //eslint-disable-next-line
  }, []);

  // To sort

  useEffect(() => {
    let facilGroups = groupData.map((group) => {
      const index = facilData.findIndex(
        (facil) => Number(facil.id) === Number(group.facilitatorId)
      );
      return {
        name: facilData[index].name,
        groupId: Number(group.name),
      };
    });

    setTableData(() => {
      const sortedData = [...filteredData, ...facilGroups];
      sortedData.sort((a, b) => {
        if (a.groupId === b.groupId) {
          if (a.mobile && b.mobile) {
            return a.groupId - b.groupId;
          } else {
            return !a.mobile ? -1 : 1;
          }
        } else {
          return a.groupId - b.groupId;
        }
      });
      return sortedData;
    });
    //eslint-disable-next-line
  }, [filteredData, data, groupData]);

  const addGroup = async () => {
    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/groups/${eventId}`,
      {
        groupArray: [
          {
            name: String(groupData.length + 1),
            facilitatorId: 1,
          },
        ],
      }
    );
    setGroupData((prevGroups) => [...prevGroups, ...response.data.data]);
  };

  const createGroupings = (filteredData, groupData) => {
    setFilteredData(generateGroupings(filteredData, groupData));
  };

  const saveGroupings = async (filteredData) => {
    const response = await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/events/${eventId}/bulk/participants`,
      {
        participantArray: filteredData,
      }
    );
    console.log("Posted: ", response);
  };

  return (
    <>
      <div className="header">
        {eventData && <h1>{eventData.name}</h1>}
        <div className="header-buttons">
          <button onClick={addGroup} id="groups">
            <h5>Add Group</h5>
          </button>
          <button
            onClick={() => createGroupings(filteredData, groupData.length)}
            id="participants"
          >
            <h5>Generate</h5>
          </button>
          <button onClick={() => saveGroupings(filteredData)} id="participants">
            <h5>Save Groupings</h5>
          </button>
        </div>
      </div>
      <div className="event-page-tabs">
        <button onClick={toggleTab} id="all" className="inactive">
          <h5>All Participants</h5>
        </button>
        <button id="groupings" className="active">
          <h5>Groupings</h5>
        </button>
      </div>
      {data && (
        <Table
          tableColumns={groupingColumns}
          tableData={tableData}
          setTableData={setData}
          options="attendance"
          eventId={eventId}
          groupData={groupData}
          setGroupData={setGroupData}
          facilData={facilData}
        />
      )}
    </>
  );
};

export default ParticipantsGroups;

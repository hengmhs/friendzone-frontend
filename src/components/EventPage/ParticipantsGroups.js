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
  eventData,
  toggleTab,
  groupData,
  setGroupData,
  facilData,
}) => {
  const { eventId } = useParams();
  const [filteredData, setFilteredData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [editsButton, setEditsButton] = useState(false);

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

  const deleteGroup = async () => {
    const allGroups = [...groupData];
    const deletedGroup = allGroups.pop();
    console.log(deletedGroup);
    setGroupData([...allGroups]);
    const response = await axios.delete(
      `${process.env.REACT_APP_BACKEND_URL}/groups/${eventId}/${deletedGroup.id}`
    );
    console.log(response);
  };

  const createGroupings = (filteredData, groupData) => {
    setFilteredData(generateGroupings(filteredData, groupData));
    setEditsButton(true);
  };

  const saveEdits = async (filteredData) => {
    const response = await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/events/${eventId}/bulk/participants`,
      {
        participantArray: filteredData,
      }
    );
    console.log("Posted: ", response);
    setEditsButton(false);
  };

  return (
    <>
      <div className="header">
        {eventData && <h1>{eventData.name}</h1>}
        <div className="header-buttons">
          <h5>
            Grouping
            <br />
            Actions:
          </h5>
          <button onClick={addGroup} id="groups">
            <h5>Add</h5>
          </button>
          <button onClick={deleteGroup} id="groups">
            <h5>Delete</h5>
          </button>
          <button
            onClick={() => createGroupings(filteredData, groupData.length)}
            id="participants"
          >
            <h5>Generate</h5>
          </button>
          {editsButton && (
            <button onClick={() => saveEdits(filteredData)} id="participants">
              <h5>Save Edits</h5>
            </button>
          )}
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
          setTableData={setFilteredData}
          options="attendance"
          eventId={eventId}
          groupData={groupData}
          setGroupData={setGroupData}
          facilData={facilData}
          setEditsButton={setEditsButton}
        />
      )}
    </>
  );
};

export default ParticipantsGroups;

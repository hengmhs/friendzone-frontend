//----------- React -----------//

import { useParams } from "react-router-dom";

//---------- Components ----------//

import Table from "../Table/Table";

//---------- Others ----------//

import { allColumns } from "../Table/columns";

//------------------------------//

const ParticipantsAll = ({
  data,
  setData,
  eventData,
  handleToggle,
  toggleTab,
  accessToken,
}) => {
  const { eventId } = useParams();

  return (
    <>
      <div className="header">
        {eventData && <h1>{eventData.name}</h1>}
        <div className="header-buttons">
          <button onClick={handleToggle} id="participants">
            <h5>Add Participants</h5>
          </button>
        </div>
      </div>
      <div className="event-page-tabs">
        <button id="all" className="active">
          <h5>All Participants</h5>
        </button>
        <button onClick={toggleTab} id="groupings" className="inactive">
          <h5>Groupings</h5>
        </button>
      </div>
      {data && (
        <Table
          tableColumns={allColumns}
          tableData={data}
          setTableData={setData}
          options="status"
          eventId={eventId}
          accessToken={accessToken}
        />
      )}
    </>
  );
};

export default ParticipantsAll;

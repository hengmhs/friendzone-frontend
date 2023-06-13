//----------- React -----------//

import { useParams } from "react-router-dom";

//---------- Components ----------//

import Table from "../Table/Table";

//---------- Others ----------//

import { allColumns } from "../Table/columns";
import Button from "../Buttons/Button";

//------------------------------//

const ParticipantsAll = ({
  data,
  setData,
  eventData,
  handleToggle,
  toggleTab,
}) => {
  const { eventId } = useParams();

  return (
    <>
      <div className="header">
        {eventData && <h1>{eventData.name}</h1>}
        <div className="header-buttons">
          <Button
            onClick={handleToggle}
            id="participants"
            label="Add Participants"
          />
        </div>
      </div>
      <div className="event-page-tabs">
        <Button id="all" className="active" label="All Participants" />
        <Button
          id="groupings"
          onClick={toggleTab}
          className="inactive"
          label="Groupings"
        />
      </div>
      {data && (
        <Table
          tableColumns={allColumns}
          tableData={data}
          setTableData={setData}
          options="status"
          eventId={eventId}
        />
      )}
    </>
  );
};

export default ParticipantsAll;

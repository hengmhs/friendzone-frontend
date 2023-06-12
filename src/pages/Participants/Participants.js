import { useEffect, useState } from "react";
import NavBar from "../../components/NavBar/NavBar";
import Table from "../../components/Table/Table";
import { allColumns } from "../../components/Table/columns";
import axios from "axios";

const Participants = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const getTableData = async () => {
      const tableData = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/participants`
      );
      const fullData = tableData.data.data.map((participant) => {
        const fullParticipant = {
          ...participant,
          neighbourhood: participant.neighbourhood
            ? participant.neighbourhood.location
            : "Not Found",
        };
        return fullParticipant;
      });
      setData(fullData);
    };
    getTableData();
  }, []);

  return (
    <div className="contents">
      <NavBar />
      <h1>Participants Page</h1>
      {data && <Table tableColumns={allColumns} tableData={data} />}
    </div>
  );
};

export default Participants;

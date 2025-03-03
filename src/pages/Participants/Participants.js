import { useEffect, useState } from "react";
import NavBar from "../../components/NavBar/NavBar";
import Table from "../../components/Table/Table";
import { allColumns } from "../../components/Table/columns";
import axios from "axios";

//---------- Auth ----------//
import { useAuth0 } from "@auth0/auth0-react";
import { bearerToken } from "../../utils";

const Participants = () => {
  const [data, setData] = useState(null);

  //---------- Auth ----------//
  const {
    isLoading,
    isAuthenticated,
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
      const tableData = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/participants`,
        bearerToken(accessToken)
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
    if (accessToken) {
      getTableData();
    }
  }, [accessToken]);

  return (
    <div className="contents">
      <NavBar />
      <h1>Participants Page</h1>
      {data && (
        <Table
          tableColumns={allColumns}
          tableData={data}
          accessToken={accessToken}
        />
      )}
    </div>
  );
};

export default Participants;

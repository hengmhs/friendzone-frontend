import { useEffect, useState } from "react";
import NavBar from "../../components/NavBar/NavBar";
import axios from "axios";
import Table from "../../components/Table/Table";
import { facilitatorColumns } from "../../components/Table/columns";
import FacilitatorAdder from "../../components/Forms/FacilitatorAdder";

//---------- Auth ----------//
import { useAuth0 } from "@auth0/auth0-react";

const Facilitators = () => {
  const [data, setData] = useState(null);
  const [toggleComposer, setToggleComposer] = useState(false);

  //---------- Auth ----------//
  const {
    isLoading,
    isAuthenticated,
    getAccessTokenSilently,
    loginWithRedirect,
  } = useAuth0();
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    console.log("isLoading: ", isLoading);
    if (!isLoading) {
      if (isAuthenticated) {
        getAccessTokenSilently({
          audience: "https://friendzone",
        }).then((token) => {
          console.log("Token: ", token);
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
        `${process.env.REACT_APP_BACKEND_URL}/facilitators`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setData(tableData.data.data);
    };
    if (accessToken) {
      getTableData();
    }

    // eslint-disable-next-line
  }, [accessToken]);

  const handleToggle = () => {
    setToggleComposer((prev) => !prev);
  };

  return (
    <div className="contents">
      {toggleComposer && (
        <FacilitatorAdder
          handleToggle={handleToggle}
          setData={setData}
          accessToken={accessToken}
        />
      )}
      <NavBar />
      <div className="header">
        <h1>Facilitators</h1>
        <div className="header-buttons">
          <button onClick={handleToggle} id="groupings">
            <h5>Add Facilitator</h5>
          </button>
        </div>
      </div>
      {data && <Table tableColumns={facilitatorColumns} tableData={data} />}
    </div>
  );
};

export default Facilitators;

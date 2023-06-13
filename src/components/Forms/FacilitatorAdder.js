import "./Forms.css";
import { useState } from "react";
import axios from "axios";
import Button from "../Buttons/Button";

const FacilitatorAdder = ({ handleToggle, setData, accessToken }) => {
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const facilitator = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/facilitators`,
        { name },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("Successfully added: ", facilitator);
    } catch (err) {
      console.log("Unable to add facilitator.");
    }
    setData((prevData) => [...prevData, { name }]);
    setName("");
    handleToggle();
  };

  const handleChange = (e) => {
    setName(e.currentTarget.value);
  };

  return (
    <div id="pop-up">
      <div className="forms">
        <div className="header">
          <h1>Add Facilitator</h1>
          <Button onClick={handleToggle} label="Close" />
        </div>

        <form>
          <input
            type="text"
            id="name"
            onChange={handleChange}
            placeholder="Input Facilitator's Name"
            value={name}
          />
          <Button onClick={handleSubmit} label="Add" />
        </form>
      </div>
    </div>
  );
};

export default FacilitatorAdder;

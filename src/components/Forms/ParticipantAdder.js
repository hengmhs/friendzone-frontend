import "./Forms.css";
import { useState } from "react";
import { parse } from "papaparse";
import axios from "axios";
import Button from "../Buttons/Button";
import { bearerToken } from "../../utils";

const ParticipantAdder = ({ handleToggle, eventId, accessToken }) => {
  const [csv, setCsv] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      parse(csv, {
        header: true,
        delimiter: ",",
        complete: async (results) => {
          // get an array of participant data in JSON format
          const participantJSON = results.data.map((participant) => {
            let {
              "Preferred Name": name,
              "Mobile Number (e.g. 91234567)": mobile,
              "Postal Code (e.g. 123456)": postalCode,
              "Year of Birth": year,
              "Marital Status": maritalStatus,
              Sex: isMale,
              Nationality: nationality,
              Race: race,
            } = participant;
            // convert 'Male' to true and 'Female' to false
            if (isMale === "Male") {
              isMale = true;
            } else if (isMale === "Female") {
              isMale = false;
            } else {
              console.log(
                "Error: Participant isMale variable is neither Male nor Female"
              );
            }
            // remove spaces betweeen numbers such as 8766 9043
            mobile = mobile.replaceAll(" ", "");
            // remove elements before mobile number
            if (mobile.length > 8) {
              // remove +65
              if (mobile[0] === "+") {
                mobile = mobile.slice(3);
              } else {
                // remove 65
                mobile = mobile.slice(2);
              }
            }
            const cleanedParticipant = {
              name,
              mobile,
              postalCode,
              year,
              maritalStatus,
              isMale,
              nationality,
              race,
            };
            return cleanedParticipant;
          });

          const response = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/participants`,
            { eventId, participantJSON },
            bearerToken(accessToken)
          );
          console.log(response);
          console.log("Posted to backend");
        },
      });
    } catch {
      console.log(
        "There is an error with parsing the CSV file. Check if the file type you have uploaded is a CSV."
      );
    }
    console.log(csv);
    setCsv(null);
  };

  const handleChange = (e) => {
    console.log(e.currentTarget.id);
    switch (e.currentTarget.id) {
      case "csv":
        setCsv(e.currentTarget.files[0]);
        break;
      default:
        return console.log(e.currentTarget.id);
    }
  };

  return (
    <div id="pop-up">
      <div className="forms">
        <div className="header">
          <h1>Add Participants</h1>
          <Button onClick={handleToggle} id="participants" label="Close" />
        </div>

        <div className="pop-up-note">
          <h5>Note</h5>
          <p>Remember to remove previously added participants! </p>
          <p>If not, they will be marked as repeat participants.</p>
        </div>

        <form>
          <div className="input-with-header">
            <h5>Upload Participant CSV File</h5>
            <input
              type="file"
              id="csv"
              placeholder="Upload Participant CSV File"
              accept=".csv"
              onChange={handleChange}
            />
          </div>
          <button onClick={handleSubmit}>Add</button>
        </form>
      </div>
    </div>
  );
};

export default ParticipantAdder;

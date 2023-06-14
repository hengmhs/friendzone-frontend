import "./Forms.css";
import { useState } from "react";
import { parse } from "papaparse";
import axios from "axios";
import { bearerToken } from "../../utils";

const EventComposer = ({ handleToggle, accessToken, setData }) => {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("Neighbourhood");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [venue, setVenue] = useState("");
  const [csv, setCsv] = useState(null);
  const [error, setError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !date || !type || !start || !end || !venue) {
      setError(true);
    } else {
      setError(false);
      try {
        const eventJSON = {
          name: name,
          startTime: start,
          endTime: end,
          date: date,
          venue: venue,
          eventType: type,
        };
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/events`,
          eventJSON,
          bearerToken(accessToken)
        );
        const event = response.data.content;
        console.log("posted event: ", event);
        console.log("eventJSON posted to backend");
        setData((prevData) => {
          const updatedEvents = [...prevData];
          updatedEvents.push(event);
          return updatedEvents;
        });
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
                { eventId: event.data.content.id, participantJSON },
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
      } catch {
        console.log("Error: Event JSON could not be posted to the backend");
      }
      // console.log(event);
      setName("");
      setDate("");
      setType("");
      setStart("");
      setEnd("");
      setVenue("");
      setCsv(null);
      handleToggle();
    }
  };

  const handleChange = (e) => {
    switch (e.currentTarget.id) {
      case "name":
        setName(e.currentTarget.value);
        break;
      case "date":
        setDate(e.currentTarget.value);
        break;
      case "type":
        setType(e.currentTarget.value);
        break;
      case "start":
        setStart(e.currentTarget.value);
        break;
      case "end":
        setEnd(e.currentTarget.value);
        break;
      case "venue":
        setVenue(e.currentTarget.value);
        break;
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
          <h1>Add Event</h1>
          <button onClick={handleToggle}>
            <h5>Close</h5>
          </button>
        </div>

        <form>
          <input
            type="text"
            id="name"
            onChange={handleChange}
            placeholder="Event Name"
            value={name}
          />

          <div className="form-2up">
            <div className="input-with-header">
              <h5>Date</h5>
              <input
                type="date"
                id="date"
                onChange={handleChange}
                placeholder="Event Date"
                value={date}
              />
            </div>

            <div className="input-with-header">
              <h5>Event type</h5>
              <select
                type="text"
                id="type"
                onChange={handleChange}
                value={type}
              >
                <option value="Neighbourhood">Neighbourhood</option>
                <option value="Open-To-All">Open-To-All</option>
                <option value="Sector-Based">Sector-Based</option>
                <option value="Others">Others</option>
              </select>
            </div>
          </div>

          <div className="form-2up">
            <div className="input-with-header">
              <h5>Start</h5>
              <input
                type="time"
                id="start"
                onChange={handleChange}
                value={start}
              />
            </div>

            <div className="input-with-header">
              <h5>End</h5>
              <input type="time" id="end" onChange={handleChange} value={end} />
            </div>
          </div>

          <input
            type="text"
            id="venue"
            onChange={handleChange}
            placeholder="Venue"
            value={venue}
          />
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
          {error && <p className="err-msg">Please fill in all fields!</p>}
          <button onClick={handleSubmit}>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default EventComposer;

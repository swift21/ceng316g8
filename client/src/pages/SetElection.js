import logo from "../img/iyte_logo-tur.png";
import { useState, useEffect, useRef } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import Button from "../components/Button";
import { auth } from "./LoginPage";
import { admin } from "./AdminLogin";
const addURL = "http://localhost:5000/api/setelectiondate/";
const dateGetURL = "http://localhost:5000/api/election/";

function SetElection() {
  const [auth, setAuth] = useState(localStorage.getItem("auth") || false);
  const [admin, setAdmin] = useState(
    localStorage.getItem("admin") === "true" || false
  );
  const logout = () => {
    localStorage.setItem("admin", false);
    setAdmin(false);
  };

  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const getCurrentDate = () => {
      const date = new Date();
      date.setUTCHours(date.getUTCHours());
      const options = {
        timeZone: "UTC",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        fractionalSecondDigits: 3,
      };
      const formattedDate = date.toISOString();
      setCurrentDate(formattedDate);
    };

    getCurrentDate();
  }, []);

  const [databaseElectionStart, setDatabaseElectionStart] = useState("");

  let navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(dateGetURL);
        const data = await response.json();
        const electionStartDate = data[0]?.electionStart || ""; // Access the electionStart value from the first item in the array
        setDatabaseElectionStart(electionStartDate);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  const [selectedDate, setSelectedDate] = useState(new Date());

  const [startingDate, setStartingDate] = useState(new Date());
  const [endingDate, setEndingDate] = useState(new Date());

  const [appStartingDate, setAppStartingDate] = useState(new Date());
  const [appEndingDate, setAppEndingDate] = useState(new Date());

  const handleStartingDateChange = (date) => {
    if (date <= appEndingDate) {
      setStartingDate(appEndingDate);
    } else if (date <= endingDate) {
      setStartingDate(date);
    } else {
      setStartingDate(endingDate);
    }
  };

  const handleEndingDateChange = (date) => {
    if (date >= startingDate) {
      setEndingDate(date);
    } else {
      setEndingDate(startingDate);
    }
  };

  const handleAppStartingDateChange = (date) => {
    if (date <= new Date(currentDate)) {
      alert("You are unable to set the date to a past time");
    } else if (date <= appEndingDate) {
      setAppStartingDate(date);
    } else {
      setAppStartingDate(appEndingDate);
    }
  };

  const handleAppEndingDateChange = (date) => {
    if (date >= startingDate) {
      setAppEndingDate(startingDate);
    } else if (date >= appStartingDate) {
      setAppEndingDate(date);
    } else {
      setAppEndingDate(appStartingDate);
    }
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const addElection = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    try {
      alert("Election Updated");
      navigate("/admin");
      const response = await fetch(addURL, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          electionStart: startingDate,
          electionEnd: endingDate,
          applicationStart: appStartingDate,
          applicationEnd: appEndingDate,
        }),
      });
      const data = await response.json();
    } catch (error) {
      console.error("Error adding application:", error);
    }
  };

  const [isCurrentlyElectionDate, setIsCurrentlyElectionDate] = useState(false);

  useEffect(() => {
    if (currentDate && databaseElectionStart) {
      const currentDateObj = new Date(currentDate);
      const electionStartDateObj = new Date(databaseElectionStart);
      const isElectionDate = currentDateObj >= electionStartDateObj;
      setIsCurrentlyElectionDate(isElectionDate);
    }
  }, [currentDate, databaseElectionStart]);
  if (localStorage.getItem("admin") === "false") {
    return <Navigate replace to="/adminlogin" />;
  } else {
    return (
      <div>
        <div className="flex space-x-5 h-15 bg-red-700 sticky top-0 z-50">
          <a href="/admin">
            <img src={logo} alt="logo" className="logo" />
          </a>

          <h1 className="text-4xl pt-3 w-2/4 text-white">
            IZTECH Student <br />
            Representative Election System
          </h1>
          <div className="navbox right-0 top-0 inset-y-0 pr-6 pt-8 absolute">
            <div className="">
              <Button fn={logout}>Log out</Button>
            </div>
            <div className=" pt-2">
              <a href="/admin">
                <Button>Back</Button>
              </a>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center">
          {/* Application Period Starting Date */}
          <div className="mb-4 items-center">
            <h2 style={{ width: "fit-content", margin: "auto" }}>
              <span style={{ fontWeight: "bold", color: "#9a0e20" }}>
                Application Period Starting Date
              </span>
            </h2>
            <Datetime
              onChange={handleAppStartingDateChange}
              value={appStartingDate}
              utcOffset={3}
              utc={false}
              inputProps={{ readOnly: true, className: "custom-input" }}
              renderInput={(props) => (
                <input
                  {...props}
                  placeholder="Select application starting date"
                  className="custom-input"
                />
              )}
              className="custom-datetime-picker"
            />
          </div>
          {/* Application Period Ending Date */}
          <div className="mb-4">
            <h2 style={{ width: "fit-content", margin: "auto" }}>
              <span style={{ fontWeight: "bold", color: "#9a0e20" }}>
                Application Period Ending Date
              </span>
            </h2>
            <Datetime
              onChange={handleAppEndingDateChange}
              value={appEndingDate}
              utcOffset={3}
              utc={false}
              inputProps={{ readOnly: true, className: "custom-input" }}
              renderInput={(props) => (
                <input
                  {...props}
                  placeholder="Select application ending date"
                  className="custom-input"
                />
              )}
              className="custom-datetime-picker"
            />
          </div>
          {/* Election Starting Date */}
          <div className="mb-4">
            <h2 style={{ width: "fit-content", margin: "auto" }}>
              <span
                style={{
                  fontWeight: "bold",
                  color: "#9a0e20",
                }}
              >
                Election Starting Date
              </span>
            </h2>
            <Datetime
              onChange={handleStartingDateChange}
              value={startingDate}
              utcOffset={3}
              utc={false}
              inputProps={{ readOnly: true, className: "custom-input" }}
              renderInput={(props) => (
                <input
                  {...props}
                  placeholder="Select election starting date"
                  className="custom-input"
                />
              )}
              className="custom-datetime-picker"
            />
          </div>
          {/* Election Ending Date */}
          <div className="mb-4">
            <h2 style={{ width: "fit-content", margin: "auto" }}>
              <span style={{ fontWeight: "bold", color: "#9a0e20" }}>
                Election Ending Date
              </span>
            </h2>
            <Datetime
              onChange={handleEndingDateChange}
              value={endingDate}
              utcOffset={3}
              utc={false}
              inputProps={{ readOnly: true, className: "custom-input" }}
              renderInput={(props) => (
                <input
                  {...props}
                  placeholder="Select election ending date"
                  className="custom-input"
                />
              )}
              className="custom-datetime-picker"
            />
          </div>
        </div>

        <div className="approve-reject-buttons">
          <button className="approve-reject-button" onClick={addElection}>
            Submit
          </button>
        </div>
      </div>
    );
  }
}

export default SetElection;

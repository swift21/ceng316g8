import logo from "../img/iyte_logo-tur.png";
import { useState, useEffect, useRef } from "react";
import { Navigate } from "react-router-dom";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import Button from "../components/Button";
import { auth } from "./LoginPage";
const getURL = "http://localhost:5000/api/allcandidates/";

function SetApplicationPeriod() {
  const [auth, setAuth] = useState(
    localStorage.getItem("auth") === "true" || false
  );
  const logout = () => {
    localStorage.setItem("auth", false);
    setAuth(false);
  };

  const [selectedDate, setSelectedDate] = useState(new Date());

  const [startingDate, setStartingDate] = useState(new Date());
  const [endingDate, setEndingDate] = useState(new Date());

  const [appStartingDate, setAppStartingDate] = useState(new Date());
  const [appEndingDate, setAppEndingDate] = useState(new Date());

  const handleStartingDateChange = (date) => {
    if (date <= endingDate) {
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

  if (!auth) {
    return <Navigate replace to="/" />;
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
        <div className="flex justify-center">
          <div className="flex items-center">
            <div className="mr-4">
              <h2>
                <span style={{ fontWeight: "bold", color: "#9a0e20" }}>
                  Application Starting Date
                </span>
              </h2>
              <Datetime
                onChange={handleStartingDateChange}
                value={startingDate}
              />
              <p>
                <span style={{ fontWeight: "bold", color: "#9a0e20" }}>
                  Selected Starting Date: {startingDate.toString()}
                </span>
              </p>
            </div>
            <div>
              <h2>
                <span style={{ fontWeight: "bold", color: "#9a0e20" }}>
                  Application Ending Date
                </span>
              </h2>
              <Datetime onChange={handleEndingDateChange} value={endingDate} />
              <p>
                <span style={{ fontWeight: "bold", color: "#9a0e20" }}>
                  Selected Ending Date: {endingDate.toString()}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SetApplicationPeriod;

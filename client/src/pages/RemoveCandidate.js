import logo from "../img/iyte_logo-tur.png";
import { useState, useEffect, useRef } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import Button from "../components/Button";
import { auth } from "./LoginPage";
import { admin } from "./AdminLogin";
const getURL = "http://localhost:5000/api/allcandidates/";
const removeURL = "http://localhost:5000/api/deletecandidate";
const dateGetURL = "http://localhost:5000/api/election/";

function RemoveCandidate() {
  const [admin, setAdmin] = useState(
    localStorage.getItem("admin") === "true" || false
  );
  const logout = () => {
    localStorage.setItem("admin", false);
    setAdmin(false);
  };

  const [candidateData, setCandidateData] = useState([]);
  const [currentCandidateIndex, setCurrentCandidateIndex] = useState(0);

  const [isLoading, setIsLoading] = useState(true);

  const fetchDataView = () => {
    fetch(getURL)
      .then((response) => response.json())
      .then((data) => {
        setCandidateData(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchDataView();
  }, []);

  const goToPreviousCandidate = () => {
    if (currentCandidateIndex === 0) {
      setCurrentCandidateIndex(candidateData.length - 1); // Wrap around to the last index
    } else {
      setCurrentCandidateIndex(currentCandidateIndex - 1);
    }
    window.scrollTo(0, 0);
  };

  const goToNextCandidate = () => {
    if (currentCandidateIndex === candidateData.length - 1) {
      setCurrentCandidateIndex(0); // Wrap around to the first index
    } else {
      setCurrentCandidateIndex(currentCandidateIndex + 1);
    }
    window.scrollTo(0, 0);
  };

  let navigate = useNavigate();

  const handleRemove = async () => {
    try {
      const deleteResponse = await fetch(
        `${removeURL}/${candidateData[currentCandidateIndex]._id}`,
        {
          method: "DELETE",
          mode: "cors",
        }
      );
      navigate("/admin");
    } catch (error) {
      console.error("Error rejecting application:", error);
    }
  };

  const toggleFullscreen = (element) => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      element.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    }
  };

  const transcriptRef = useRef(null);
  const criminalRecordsRef = useRef(null);

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

  const [isCurrentlyElectionDate, setIsCurrentlyElectionDate] = useState(false);

  useEffect(() => {
    if (currentDate && databaseElectionStart) {
      const currentDateObj = new Date(currentDate);
      const electionStartDateObj = new Date(databaseElectionStart);
      const isElectionDate = currentDateObj >= electionStartDateObj;
      setIsCurrentlyElectionDate(isElectionDate);
      console.log(isCurrentlyElectionDate);
    } else {
      setIsCurrentlyElectionDate(true);
    }
  }, [currentDate, databaseElectionStart]);

  if (localStorage.getItem("admin") === "false") {
    return <Navigate replace to="/adminlogin" />;
  } else if (isCurrentlyElectionDate) {
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
        <p
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          There is either an ongoing election or there is no election date set.
        </p>
      </div>
    );
  } else {
    if (isLoading) {
      return <p>Loading application data...</p>;
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
          <div className="candidate-container">
            {candidateData && candidateData.length > 0 ? (
              <div className="candidate-list">
                <div className="candidate-info">
                  <p>
                    <span style={{ fontWeight: "bold", color: "#9a0e20" }}>
                      Name:
                    </span>{" "}
                    {candidateData[currentCandidateIndex].name}
                  </p>
                  <p>
                    <span style={{ fontWeight: "bold", color: "#9a0e20" }}>
                      Surname:
                    </span>{" "}
                    {candidateData[currentCandidateIndex].surname}
                  </p>
                  <p>
                    <span style={{ fontWeight: "bold", color: "#9a0e20" }}>
                      Student Number:
                    </span>{" "}
                    {candidateData[currentCandidateIndex].studentnumber}
                  </p>
                  <p>
                    <span style={{ fontWeight: "bold", color: "#9a0e20" }}>
                      Program:
                    </span>{" "}
                    {candidateData[currentCandidateIndex].program}
                  </p>
                  <p>
                    <span style={{ fontWeight: "bold", color: "#9a0e20" }}>
                      Year:
                    </span>{" "}
                    {candidateData[currentCandidateIndex].year}
                  </p>
                  <p>
                    <span style={{ fontWeight: "bold", color: "#9a0e20" }}>
                      TC:
                    </span>{" "}
                    {candidateData[currentCandidateIndex].tc}
                  </p>
                  <p>
                    <span style={{ fontWeight: "bold", color: "#9a0e20" }}>
                      Description:
                    </span>{" "}
                    {candidateData[currentCandidateIndex].description}
                  </p>
                  <p>
                    <span style={{ fontWeight: "bold", color: "#9a0e20" }}>
                      Transcript:
                    </span>
                    <embed
                      ref={transcriptRef}
                      width="800"
                      height="800"
                      src={`${candidateData[currentCandidateIndex].transcript}`}
                    />
                    <button
                      className="fullscreen-button"
                      onClick={() => toggleFullscreen(transcriptRef)}
                    >
                      Fullscreen
                    </button>
                  </p>
                  <p>
                    <span style={{ fontWeight: "bold", color: "#9a0e20" }}>
                      Criminal Records:
                    </span>
                    <embed
                      ref={criminalRecordsRef}
                      width="800"
                      height="800"
                      src={`${candidateData[currentCandidateIndex].criminalrecords}`}
                    />
                    <button
                      className="fullscreen-button"
                      onClick={() => toggleFullscreen(criminalRecordsRef)}
                    >
                      Fullscreen
                    </button>
                  </p>
                  <p>
                    <span style={{ fontWeight: "bold", color: "#9a0e20" }}>
                      Image:
                    </span>
                    <img
                      src={`${candidateData[currentCandidateIndex].image}`}
                      alt="Base64 Image"
                      style={{ width: "auto" }}
                    />
                  </p>
                </div>
                <div className="approve-reject-buttons">
                  <button
                    className="approve-reject-button"
                    onClick={handleRemove}
                  >
                    Remove
                  </button>
                </div>
                <div className="navigation-buttons">
                  <button
                    className="switch-button"
                    onClick={goToPreviousCandidate}
                  >
                    Previous
                  </button>
                  <button className="switch-button" onClick={goToNextCandidate}>
                    Next
                  </button>
                </div>
              </div>
            ) : (
              <p>No candidate data available.</p>
            )}
          </div>
        </div>
      );
    }
  }
}

export default RemoveCandidate;

import logo from "../img/iyte_logo-tur.png";
import { useState, useEffect, useRef } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import Button from "../components/Button";
import { auth } from "./LoginPage";
const getURL = "http://localhost:5000/api/allapplications/";
const addURL = "http://localhost:5000/api/addcandidate/";
const removeURL = "http://localhost:5000/api/deleteapplication";
const dateGetURL = "http://localhost:5000/api/election/";

function AddCandidate() {
  const [admin, setAdmin] = useState(
    localStorage.getItem("admin") === "true" || false
  );
  const logout = () => {
    localStorage.setItem("admin", false);
    setAdmin(false);
  };

  const [currentCandidateIndex, setCurrentCandidateIndex] = useState(0);

  const goToNextCandidate = () => {
    setCurrentCandidateIndex((prevIndex) => {
      if (prevIndex === data.length - 1) {
        return 0; // Wrap around to the first index
      } else {
        return prevIndex + 1;
      }
    });
    window.scrollTo(0, 0);
  };

  const goToPreviousCandidate = () => {
    setCurrentCandidateIndex((prevIndex) => {
      if (prevIndex === 0) {
        return data.length - 1; // Wrap around to the last index
      } else {
        return prevIndex - 1;
      }
    });
    window.scrollTo(0, 0);
  };

  const [isLoading, setIsLoading] = useState(true);

  let navigate = useNavigate();

  const [data, setData] = useState(null);

  const fetchDataAddCandidate = () => {
    fetch(getURL)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setIsLoading(false); // Data fetching complete
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsLoading(false); // Data fetching failed
      });
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

  useEffect(() => {
    fetchDataAddCandidate();
  }, []);

  const transcriptRef = useRef(null);
  const criminalRecordsRef = useRef(null);

  const handleApprove = async () => {
    try {
      const response = await fetch(addURL, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data[currentCandidateIndex].name,
          surname: data[currentCandidateIndex].surname,
          studentnumber: data[currentCandidateIndex].studentnumber,
          program: data[currentCandidateIndex].program,
          year: data[currentCandidateIndex].year,
          tc: data[currentCandidateIndex].tc,
          description: data[currentCandidateIndex].description,
          image: data[currentCandidateIndex].image,
          transcript: data[currentCandidateIndex].transcript,
          criminalrecords: data[currentCandidateIndex].criminalrecords,
        }),
      });
      const responseData = await response.json();
      console.log("Application added successfully:", data);

      const deleteResponse = await fetch(
        `${removeURL}/${data[currentCandidateIndex]._id}`,
        {
          method: "DELETE",
          mode: "cors",
        }
      );

      navigate("/admin");
    } catch (error) {
      console.error("Error adding application:", error);

      navigate("/admin");
    }
  };

  const handleReject = async () => {
    try {
      const deleteResponse = await fetch(
        `${removeURL}/${data[currentCandidateIndex]._id}`,
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
            {data && data.length > 0 ? (
              <div className="candidate-list">
                <div className="candidate-info">
                  <p>
                    <span style={{ fontWeight: "bold", color: "#9a0e20" }}>
                      Name:
                    </span>{" "}
                    {data[currentCandidateIndex].name}
                  </p>
                  <p>
                    <span style={{ fontWeight: "bold", color: "#9a0e20" }}>
                      Surname:
                    </span>{" "}
                    {data[currentCandidateIndex].surname}
                  </p>
                  <p>
                    <span style={{ fontWeight: "bold", color: "#9a0e20" }}>
                      Student Number:
                    </span>{" "}
                    {data[currentCandidateIndex].studentnumber}
                  </p>
                  <p>
                    <span style={{ fontWeight: "bold", color: "#9a0e20" }}>
                      Program:
                    </span>{" "}
                    {data[currentCandidateIndex].program}
                  </p>
                  <p>
                    <span style={{ fontWeight: "bold", color: "#9a0e20" }}>
                      Year:
                    </span>{" "}
                    {data[currentCandidateIndex].year}
                  </p>
                  <p>
                    <span style={{ fontWeight: "bold", color: "#9a0e20" }}>
                      TC:
                    </span>{" "}
                    {data[currentCandidateIndex].tc}
                  </p>
                  <p>
                    <span style={{ fontWeight: "bold", color: "#9a0e20" }}>
                      Description:
                    </span>{" "}
                    {data[currentCandidateIndex].description}
                  </p>
                  <p>
                    <span style={{ fontWeight: "bold", color: "#9a0e20" }}>
                      Transcript:
                    </span>
                    <embed
                      ref={transcriptRef}
                      width="800"
                      height="800"
                      src={`${data[currentCandidateIndex].transcript}`}
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
                      src={`${data[currentCandidateIndex].criminalrecords}`}
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
                      src={`${data[currentCandidateIndex].image}`}
                      alt="Base64 Image"
                      style={{ width: "auto" }}
                    />
                  </p>
                </div>
                <div className="approve-reject-buttons">
                  <button
                    className="approve-reject-button"
                    onClick={handleApprove}
                  >
                    Approve
                  </button>
                  <button
                    className="approve-reject-button"
                    onClick={handleReject}
                  >
                    Reject
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
              <p>
                No application data available.
                <div></div>
              </p>
            )}
          </div>
        </div>
      );
    }
  }
}

export default AddCandidate;

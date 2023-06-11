import logo from "../img/iyte_logo-tur.png";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Button from "../components/Button";
import { auth } from "./LoginPage";
const getURL = "http://localhost:5000/api/allcandidates/";
const voterURL = "http://localhost:5000/api/results";
const dateGetURL = "http://localhost:5000/api/election/";

function ViewResults() {
  const [auth, setAuth] = useState(
    localStorage.getItem("auth") === "true" || false
  );
  const logout = () => {
    localStorage.setItem("auth", false);
    setAuth(false);
  };

  const [candidateIndex, setCandidateIndex] = useState(0);
  const [candidateIds, setCandidateIds] = useState([]);
  const [candidateVotes, setCandidateVotes] = useState([]);
  const [candidateData, setCandidateData] = useState([]);
  const [voteCounts, setVoteCounts] = useState({}); // Store voteCounts in state
  const [currentCandidateIndex, setCurrentCandidateIndex] = useState(0);

  const addItem = (candidateIdInfo) => {
    // Create a copy of the array and add a new item
    const updatedArray = [...candidateVotes, [candidateIdInfo, 0]];

    setCandidateVotes(updatedArray);
  };

  const fetchDataResult = () => {
    fetch(getURL)
      .then((response) => response.json())
      .then((data) => {
        setCandidateData(data);

        // Initialize voteCounts object
        const counts = {};
        data.forEach((candidate) => {
          counts[candidate.name] = 0;
        });

        setVoteCounts(counts); // Update voteCounts state
        setCandidateVotes(Object.entries(counts)); // Update candidateVotes state
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    fetchDataResult();
  }, []);

  const fetchData2 = async () => {
    try {
      const response = await fetch(voterURL);
      const data = await response.json();

      // Initialize voteCounts object
      const counts = {};
      candidateVotes.forEach(([candidateId]) => {
        counts[candidateId] = 0;
      });

      data.forEach((voter) => {
        const votedCandidate = voter.votedCandidate;

        if (votedCandidate in counts) {
          counts[votedCandidate] += 1;
        }
      });

      return counts;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  useEffect(() => {
    const updateVoteCounts = async () => {
      try {
        const updatedCounts = await fetchData2();
        setVoteCounts(updatedCounts); // Update voteCounts state
      } catch (error) {
        console.error("Error:", error);
      }
    };

    updateVoteCounts();
  }, [candidateVotes]);

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

  const [databaseElectionEnd, setDatabaseElectionEnd] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(dateGetURL);
        const data = await response.json();
        const electionEndDate = data[0]?.electionEnd || ""; // Access the electionStart value from the first item in the array
        setDatabaseElectionEnd(electionEndDate);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  const [isCurrentlyElectionDate, setIsCurrentlyElectionDate] = useState(false);

  useEffect(() => {
    if (currentDate && databaseElectionEnd) {
      const currentDateObj = new Date(currentDate);
      const electionEndDateObj = new Date(databaseElectionEnd);
      const isElectionDate = currentDateObj > electionEndDateObj;
      setIsCurrentlyElectionDate(isElectionDate);
      console.log(isCurrentlyElectionDate);
    } else {
      setIsCurrentlyElectionDate(false);
    }
  }, [currentDate, databaseElectionEnd]);

  if (!auth) {
    return <Navigate replace to="/" />;
  } else if (!isCurrentlyElectionDate) {
    return (
      <div>
        <div className="flex space-x-5 h-15 bg-red-700 sticky top-0 z-50">
          <a href="/dashboard">
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
              <a href="/dashboard">
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
            marginTop: "100px",
          }}
        >
          There is no finished election to display.
        </p>
      </div>
    );
  } else {
    const program = localStorage.getItem("program");
    const filteredCandidates = candidateData.filter(
      (candidate) => candidate.program === program
    );

    return (
      <div>
        <div className="flex space-x-5 h-15 bg-red-700 sticky top-0 z-50">
          <a href="/dashboard">
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
              <a href="/dashboard">
                <Button>Back</Button>
              </a>
            </div>
          </div>
        </div>
        <form>
          <div className="new-candidate-container">
            {filteredCandidates.length > 0 ? (
              <div className="new-candidate-list">
                {filteredCandidates.map((candidate) => (
                  <div className="new-test-container" key={candidate._id}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        position: "absolute",
                        width: "27.5%",
                        left: "0px",
                      }}
                    >
                      <img src={`${candidate.image}`} alt="Base64 Image" />
                    </div>
                    <div className="new-candidate-info2">
                      <p>
                        <span style={{ fontWeight: "bold", color: "#9a0e20" }}>
                          Name:
                        </span>{" "}
                        {candidate.name}
                      </p>

                      <p>
                        <span style={{ fontWeight: "bold", color: "#9a0e20" }}>
                          Surname:
                        </span>{" "}
                        {candidate.surname}
                      </p>

                      <p>
                        <span style={{ fontWeight: "bold", color: "#9a0e20" }}>
                          Student Number:
                        </span>{" "}
                        {candidate.studentnumber}
                      </p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        position: "absolute",
                        width: "27.5%",
                        right: "0px",
                      }}
                    >
                      <div>
                        {Object.keys(voteCounts).length > 0 && (
                          <div style={{ width: "fit-content", margin: "auto" }}>
                            <span
                              style={{
                                fontSize: "48px",
                                display: "flex",
                              }}
                            >
                              {voteCounts[candidate.name]}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No candidate data available.</p>
            )}
          </div>
        </form>
      </div>
    );
  }
}

export default ViewResults;

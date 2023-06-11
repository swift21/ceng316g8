import logo from "../img/iyte_logo-tur.png";
import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { useSelector } from "react-redux";

const getURL = "http://localhost:5000/api/allcandidates/";
const voteAddURL = "http://localhost:5000/api/addvoter";
const resultAddURL = "http://localhost:5000/api/addresult";
const voterURL = "http://localhost:5000/api/voters";
const dateGetURL = "http://localhost:5000/api/election/";

function VoteCandidate() {
  const [database, setDatabase] = useState([]);
  const [userVoted, setUserVoted] = useState(false);
  const currentUsername = localStorage.getItem("currentUsername");
  const navigate = useNavigate();

  const [auth, setAuth] = useState(
    localStorage.getItem("auth") === "true" || false
  );
  const logout = () => {
    localStorage.setItem("auth", false);
    setAuth(false);
  };

  const fetchDataVote = () => {
    fetch(getURL)
      .then((response) => response.json())
      .then((data) => {
        setDatabase(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("auth") === "true";
    setAuth(isAuthenticated);

    fetchDataVote();
  }, []);

  const fetchData2 = () => {
    fetch(voterURL)
      .then((response) => response.json())
      .then((data) => {
        const hasVoted = data.some((user) => user.username === currentUsername);
        setUserVoted(hasVoted);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    fetchData2();
  }, [currentUsername]);

  const [info, setInfo] = useState({
    username: currentUsername,
    votedCandidate: "",
  });

  const [selectedCandidate, setSelectedCandidate] = useState("");

  const handleChange = (event) => {
    setSelectedCandidate(event.target.value);

    setInfo((prevInfo) => ({
      ...prevInfo,
      votedCandidate: event.target.value,
    }));
  };

  const handleVote = async (event) => {
    event.preventDefault();

    try {
      console.log("Sending vote info:", info);

      if (userVoted) {
        console.log("you already voted");
        console.log(currentUsername);
      } else if (!userVoted && info.votedCandidate !== "") {
        console.log("currently voting");
        const response = await fetch(voteAddURL, {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: info.username,
          }),
        });
        const response2 = await fetch(resultAddURL, {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            votedCandidate: info.votedCandidate,
          }),
        });
      } else {
        console.log("kek");
      }

      navigate("/dashboard");
    } catch (error) {
      console.error("Error registering vote:", error);
      navigate("/dashboard");
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
  const [databaseElectionEnd, setDatabaseElectionEnd] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(dateGetURL);
        const data = await response.json();
        const electionStartDate = data[0]?.electionStart || "";
        const electionEndDate = data[0]?.electionEnd || "";
        setDatabaseElectionStart(electionStartDate);
        setDatabaseElectionEnd(electionEndDate);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  const [isCurrentlyElectionDate, setIsCurrentlyElectionDate] = useState(false);

  useEffect(() => {
    if (currentDate && databaseElectionStart && databaseElectionEnd) {
      const currentDateObj = new Date(currentDate);
      const electionStartDateObj = new Date(databaseElectionStart);
      const electionEndDateObj = new Date(databaseElectionEnd);
      const isElectionDate1 = electionEndDateObj >= currentDateObj;
      const isElectionDate2 = currentDateObj >= electionStartDateObj;
      setIsCurrentlyElectionDate(isElectionDate1 && isElectionDate2);
    }
  }, [currentDate, databaseElectionStart, databaseElectionEnd]);

  const program = localStorage.getItem("program");

  if (!auth || localStorage.getItem("admin") === "true") {
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
          }}
        >
          Either there is no ongoing election or there is no election date set.
        </p>
      </div>
    );
  } else {
    if (userVoted) {
      alert("You have already voted!");
      return <Navigate replace to="/dashboard" />;
    } else {
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
              {database && database.length > 0 ? (
                <div className="new-candidate-list">
                  {database
                    .filter((candidate) => candidate.program === program)
                    .map((candidate) => (
                      <div key={candidate.id} className="new-test-container">
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
                            <span
                              style={{ fontWeight: "bold", color: "#9a0e20" }}
                            >
                              Name:
                            </span>{" "}
                            {candidate.name}
                          </p>

                          <p>
                            <span
                              style={{ fontWeight: "bold", color: "#9a0e20" }}
                            >
                              Surname:
                            </span>{" "}
                            {candidate.surname}
                          </p>

                          <p>
                            <span
                              style={{ fontWeight: "bold", color: "#9a0e20" }}
                            >
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
                          <input
                            className="new-checkbox-vote"
                            type="radio"
                            name="candidate-selection"
                            value={candidate.name}
                            style={{ transform: "scale(1)" }}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p>No candidate data available.</p>
              )}
            </div>
            {
              <button
                type="submit"
                className={`submit-button${
                  !selectedCandidate ? " disabled" : ""
                }`}
                id="login-form-submit"
                onClick={handleVote}
                disabled={!selectedCandidate}
              >
                Submit
              </button>
            }
          </form>
        </div>
      );
    }
  }
}

export default VoteCandidate;

import logo from "../img/iyte_logo-tur.png";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Button from "../components/Button";
import { auth } from "./LoginPage";
const getURL = "http://localhost:5000/api/allcandidates/";

function ViewCandidates() {
  const [auth, setAuth] = useState(
    localStorage.getItem("auth") === "true" || false
  );
  const logout = () => {
    localStorage.setItem("auth", false);
    setAuth(false);
  };

  const [candidateData, setCandidateData] = useState([]);
  const [currentCandidateIndex, setCurrentCandidateIndex] = useState(0);

  const fetchDataView = () => {
    fetch(getURL)
      .then((response) => response.json())
      .then((data) => {
        setCandidateData(data);
      })
      .catch((error) => {
        console.error("Error:", error);
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

  const program = localStorage.getItem("program");

  if (!auth) {
    return <Navigate replace to="/" />;
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
        <div className="candidate-container">
          {candidateData && candidateData.length > 0 ? (
            <div className="candidate-list">
              {candidateData
                .filter((candidate) => candidate.program === program)
                .map((candidate, index) => (
                  <div key={index} className="candidate-info">
                    {/* Display candidate details */}
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
                    <p>
                      <span style={{ fontWeight: "bold", color: "#9a0e20" }}>
                        Program:
                      </span>{" "}
                      {candidate.program}
                    </p>
                    <p>
                      <span style={{ fontWeight: "bold", color: "#9a0e20" }}>
                        Year:
                      </span>{" "}
                      {candidate.year}
                    </p>
                    <p>
                      <span style={{ fontWeight: "bold", color: "#9a0e20" }}>
                        Description:
                      </span>{" "}
                      {candidate.description}
                    </p>
                    <p>
                      <img
                        src={`${candidate.image}`}
                        alt="Base64 Image"
                        style={{ width: "350px", height: "auto" }}
                      />
                    </p>
                  </div>
                ))}
            </div>
          ) : (
            <p>No candidate data available.</p>
          )}
        </div>
      </div>
    );
  }
}

export default ViewCandidates;

import { useEffect, useState } from "react";
import Button from "../components/Button";
import logo from "../img/iyte_logo-tur.png";
import { Navigate, useNavigate } from "react-router-dom";

function StudentMainPage() {
  const navigate = useNavigate();
  const [auth, setAuth] = useState(localStorage.getItem("auth") || false);
  const [admin, setAdmin] = useState(localStorage.getItem("admin") || false);

  const logout = () => {
    localStorage.setItem("auth", false);
    setAuth(false);
  };

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("auth") === "true";
    setAuth(isAuthenticated);
  }, []);

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

          <div className="right-0 top-0 inset-y-0 pr-6 pt-8 absolute">
            <Button fn={logout}>Log out</Button>
          </div>
        </div>

        <div className="button-container-top">
          <a href="/vote">
            <button className="navigation-button" id="set-election">
              Vote For A Candidate
            </button>
          </a>
          <a href="/results">
            <button className="navigation-button" id="add-candidate">
              View Election Results
            </button>
          </a>
        </div>
        <div className="button-container">
          <a href="/candidates">
            <button className="navigation-button" id="remove-candidate">
              View Candidates
            </button>
          </a>
          <a href="/application">
            <button className="navigation-button" id="application">
              Candidate Application
            </button>
          </a>
        </div>
      </div>
    );
  }
}

export default StudentMainPage;

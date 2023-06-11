import { useEffect, useState } from "react";
import Button from "../components/Button";
import logo from "../img/iyte_logo-tur.png";
import { Navigate, useNavigate } from "react-router-dom";

function AdminMainPage() {
  const [admin, setAdmin] = useState(
    localStorage.getItem("admin") === "true" || false
  );
  const logout = () => {
    localStorage.setItem("admin", false);
    setAdmin(false);
  };

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

          <div className="right-0 top-0 inset-y-0 pr-6 pt-8 absolute">
            <Button fn={logout}>Log out</Button>
          </div>
        </div>

        <div className="button-container-top">
          <a href="/setelection">
            <button className="navigation-button" id="set-election">
              Set Election
            </button>
          </a>
          <a href="/addcandidate">
            <button className="navigation-button" id="add-candidate">
              Add Candidate
            </button>
          </a>

          <a href="/removecandidate">
            <button className="navigation-button" id="remove-candidate">
              Remove Candidate
            </button>
          </a>
        </div>
      </div>
    );
  }
}

export default AdminMainPage;

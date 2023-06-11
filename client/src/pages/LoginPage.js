import logo from "../img/iyte_logo-tur.png";
import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";

function returnDepartment(studentNo) {
  const checkFaculty = studentNo.substring(2, 4).toString();
  const checkDep = studentNo.substring(4, 6).toString();
  let faculty = ""; // may be used later, first declaration
  switch (checkFaculty) {
    case "01":
      faculty = "Faculty of Science";
      switch (checkDep) {
        case "01":
          return "Physics";
        case "02":
          return "Chemistry";
        case "03":
          return "Mathematics";
        case "04":
          return "Molecular Biology and Genetics";
        default:
          return "Photonics";
      }
    case "02":
      faculty = "Faculty of Engineering";
      switch (checkDep) {
        case "01":
          return "Computer Engineering";
        case "02":
          return "Chemical Engineering";
        case "03":
          return "Mechanical Engineering";
        case "04":
          return "Civil Engineering";
        case "05":
          return "Food Engineering";
        case "06":
          return "Electrical-Electronics Engineering";
        case "08":
          return "Materials Science and Engineering";
        case "09":
          return "Energy Systems Engineering";
        case "10":
          return "Bioengineering";
        default:
          return "Environmental Engineering";
      }
    default:
      faculty = "Faculty of Architecture";
      switch (checkDep) {
        case "01":
          return "Architecture";
        case "02":
          return "City and Regional Planning";
        default:
          return "Industrial Design";
      }
  }
}

function LoginPage() {
  const navigate = useNavigate();
  const [auth, setAuth] = useState(
    localStorage.getItem(localStorage.getItem("auth") || false)
  );
  const [admin, setAdmin] = useState(localStorage.getItem("admin") || false);

  const [userId, setUserId] = useState("");
  const [userName, setUsername] = useState("");

  const [info, setInfo] = useState({
    username: "",
    password: "",
  });

  const handleNameChange = (e) => {
    setInfo({
      ...info,
      username: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setInfo({
      ...info,
      password: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:8000/api/login", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: info.username,
        password: info.password,
      }),
    });
    const returnID = await response.text();

    if (returnID > 0) {
      setAuth(true);
      setUserId(returnID);
      setUsername(info.username);
      localStorage.setItem("currentID", returnID);
      localStorage.setItem("currentUsername", info.username);
      localStorage.setItem("auth", true);
      localStorage.setItem("program", returnDepartment(info.username));
      console.log("currentID:", returnID);
      console.log("currentUsername:", info.username);
      navigate("/dashboard");
    } else {
      alert("Invalid username or password.");
    }
  };

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("auth") === "true";
    setAuth(isAuthenticated);
  }, []);

  if (auth) {
    return <Navigate replace to="/dashboard" />;
  } else if (localStorage.getItem("admin") === "true") {
    return <Navigate replace to="/admin" />;
  } else {
    return (
      <div className="grid h-screen place-items-center">
        <div className="flex flex-col items-center justify-center w-11/12 h-5/6 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold">
            IZTECH Student Representative Election System
          </h1>
          <img src={logo} alt="logo" className="w-1/5 h-1/2 " />
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center justify-center w-1/2 h-1/2"
          >
            <input
              value={info.username}
              onChange={handleNameChange}
              type="text"
              placeholder="Username"
              className="w-3/4 h-1/6 p-2 m-2 border-2 border-gray-300 rounded-lg"
            />
            <input
              value={info.password}
              onChange={handlePasswordChange}
              type="password"
              placeholder="Password"
              className="w-3/4 h-1/6 p-2 m-2 border-2 border-gray-300 rounded-lg"
            />
            <button className="w-3/4 h-1/6 p-2 m-2 text-white bg-blue-500 rounded-lg">
              Log in
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export let auth;
export let userId;
export let userName;

export default LoginPage;

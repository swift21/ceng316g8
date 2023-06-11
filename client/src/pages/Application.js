import logo from "../img/iyte_logo-tur.png";
import { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import Button from "../components/Button";
import { auth } from "./LoginPage";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const addURL = "http://localhost:5000/api/addapplication/";
const dateGetURL = "http://localhost:5000/api/election/";

function Application() {
  const [auth, setAuth] = useState(localStorage.getItem("auth") || false);
  const logout = () => {
    localStorage.setItem("auth", false);
    setAuth(false);
  };

  let navigate = useNavigate();

  const [candidateData, setCandidateData] = useState([]);

  const [info, setInfo] = useState({
    name: "",
    surname: "",
    studentnumber: "",
    program: "",
    year: "",
    tc: "",
    description: "",
    image: null,
    transcript: null,
    criminalrecords: null,
  });

  const handleNameChange = (e) => {
    setInfo({
      ...info,
      name: e.target.value,
    });
  };

  const handleSurnameChange = (e) => {
    setInfo({
      ...info,
      surname: e.target.value,
    });
  };

  const handleStudentNumberChange = (e) => {
    setInfo({
      ...info,
      studentnumber: e.target.value,
    });
  };

  const handleProgramChange = (e) => {
    setInfo({
      ...info,
      program: e.target.value,
    });
  };

  const handleYearChange = (e) => {
    setInfo({
      ...info,
      year: e.target.value,
    });
  };

  const handleTCChange = (e) => {
    setInfo({
      ...info,
      tc: e.target.value,
    });
  };

  const handleDescriptionChange = (e) => {
    setInfo({
      ...info,
      description: e.target.value,
    });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;

    if (!file || !allowedExtensions.exec(file.name)) {
      alert(
        "Invalid file type. Only JPEG, JPG, PNG, and GIF files are allowed."
      );
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setInfo((prevInfo) => ({
        ...prevInfo,
        image: {
          file,
          base64: reader.result,
        },
      }));
    };
  };

  const handleTranscriptChange = (event) => {
    const file = event.target.files[0];
    const allowedExtensions = /(\.pdf)$/i;

    if (!file || !allowedExtensions.exec(file.name)) {
      alert("Invalid file type. Only PDF files are allowed.");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setInfo((prevInfo) => ({
        ...prevInfo,
        transcript: {
          file,
          base64: reader.result,
        },
      }));
    };
  };

  const handleCriminalRecordsChange = (event) => {
    const file = event.target.files[0];
    const allowedExtensions = /(\.pdf)$/i;

    if (!file || !allowedExtensions.exec(file.name)) {
      alert("Invalid file type. Only PDF files are allowed.");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setInfo((prevInfo) => ({
        ...prevInfo,
        criminalrecords: {
          file,
          base64: reader.result,
        },
      }));
    };
  };

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("auth") === "true";
    setAuth(isAuthenticated);
  }, []);

  const [data, setData] = useState({ data: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState("");

  const addApplication = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    if (
      !info.name ||
      !info.surname ||
      !info.studentnumber ||
      !info.program ||
      !info.year ||
      !info.tc ||
      !info.description ||
      !info.image ||
      !info.transcript ||
      !info.criminalrecords
    ) {
      alert("Please fill in all the required fields.");
      return;
    }

    try {
      console.log("Sending application:", info);
      alert("Application added successfully.");
      navigate("/dashboard");
      const response = await fetch(addURL, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: info.name,
          surname: info.surname,
          studentnumber: info.studentnumber,
          program: info.program,
          year: info.year,
          tc: info.tc,
          description: info.description,
          image: info.image ? info.image.base64 : null,
          transcript: info.transcript ? info.transcript.base64 : null,
          criminalrecords: info.criminalrecords
            ? info.criminalrecords.base64
            : null,
        }),
      });
      const data = await response.json();
      console.log("Application added successfully:", data);
    } catch (error) {
      console.error("Error adding application:", error);

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

  const [databaseApplicationStart, setDatabaseApplicationStart] = useState("");
  const [databaseApplicationEnd, setDatabaseApplicationEnd] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(dateGetURL);
        const data = await response.json();
        const applicationStartDate = data[0]?.applicationStart || "";
        const applicationEndDate = data[0]?.applicationEnd || "";
        setDatabaseApplicationStart(applicationStartDate);
        setDatabaseApplicationEnd(applicationEndDate);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  const [isCurrentlyApplicationDate, setIsCurrentlyApplicationDate] =
    useState(false);

  useEffect(() => {
    if (currentDate && databaseApplicationStart && databaseApplicationEnd) {
      const currentDateObj = new Date(currentDate);
      const applicationStartDateObj = new Date(databaseApplicationStart);
      const applicationEndDateObj = new Date(databaseApplicationEnd);
      const isApplicationDate1 = applicationEndDateObj >= currentDateObj;
      const isApplicationDate2 = currentDateObj >= applicationStartDateObj;
      setIsCurrentlyApplicationDate(isApplicationDate1 && isApplicationDate2);
    } else {
      setIsCurrentlyApplicationDate(true);
    }
  }, [currentDate, databaseApplicationStart, databaseApplicationEnd]);

  if (!auth) {
    return <Navigate replace to="/" />;
  } else if (!isCurrentlyApplicationDate) {
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
          Either it is not application period or there is no election set.
        </p>
      </div>
    );
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
        <div className="grid h-screen place-items-center">
          <form className="flex flex-col items-center justify-start w-1/2 h-5/8">
            <input
              type="text"
              placeholder="Name"
              className="w-3/4 h-16 p-2 m-2 border-2 border-gray-300 rounded-lg"
              value={info.name}
              onChange={handleNameChange}
            />

            <input
              type="text"
              placeholder="Surname"
              className="w-3/4 h-16 p-2 m-2 border-2 border-gray-300 rounded-lg"
              value={info.surname}
              onChange={handleSurnameChange}
            />

            <input
              type="text"
              placeholder="Student number"
              className="w-3/4 h-16 p-2 m-2 border-2 border-gray-300 rounded-lg"
              value={info.studentnumber}
              onChange={handleStudentNumberChange}
            />

            <select
              name="program"
              value={info.program}
              onChange={handleProgramChange}
              className="w-3/4 h-16 p-2 m-2 border-2 border-gray-300 rounded-lg"
            >
              <option value="">Select Program</option>
              <option value="Computer Engineering">Computer Engineering</option>
              <option value="Bioengineering">Bioengineering</option>
              <option value="Environmental Engineering  ">
                Environmental Engineering
              </option>
              <option value="Energy Systems Engineering">
                Energy Systems Engineering
              </option>
              <option value="Electrical-Electronics Engineering">
                Electrical-Electronics Engineering
              </option>
              <option value="Food Engineering">Food Engineering</option>
              <option value="Civil Engineering">Civil Engineering</option>
              <option value="Chemical Engineering">Chemical Engineering</option>
              <option value="Mechanical Engineering">
                Mechanical Engineering
              </option>
              <option value="Materials Science and Engineering">
                Materials Science and Engineering
              </option>
              <option value="Physics">Physics</option>
              <option value="Photonics">Photonics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Molecular Biology and Genetics">
                Molecular Biology and Genetics
              </option>
              <option value="Industrial Design">Industrial Design</option>
              <option value="Architecture">Architecture</option>
              <option value="City and Regional Planning">
                City and Regional Planning
              </option>
            </select>
            <select
              name="year"
              value={info.year}
              onChange={handleYearChange}
              className="w-3/4 h-16 p-2 m-2 border-2 border-gray-300 rounded-lg"
            >
              <option value="">Select Year</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>

            <input
              type="text"
              placeholder="TC"
              className="w-3/4 h-16 p-2 m-2 border-2 border-gray-300 rounded-lg"
              value={info.tc}
              onChange={handleTCChange}
            />

            <textarea
              placeholder="Description"
              className="w-3/4 h-40 p-2 m-2 border-2 border-gray-300 rounded-lg"
              value={info.description}
              onChange={handleDescriptionChange}
            />

            <div className="w-3/4 h-16 p-2 m-2 border-2 border-gray-300 rounded-lg flex items-center justify-between">
              <span className="overflow-hidden truncate">
                {info.image ? (
                  <span>Image Uploaded: {info.image.file.name}</span>
                ) : (
                  <span>Upload an Image</span>
                )}
              </span>
              <label
                htmlFor="imageUpload"
                className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
              >
                Browse
              </label>
              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>

            <div className="w-3/4 h-16 p-2 m-2 border-2 border-gray-300 rounded-lg flex items-center justify-between">
              <span className="overflow-hidden truncate">
                {info.transcript ? (
                  <span>Transcript Uploaded: {info.transcript.file.name}</span>
                ) : (
                  <span>Upload Transcript</span>
                )}
              </span>
              <label
                htmlFor="transcriptUpload"
                className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
              >
                Browse
              </label>
              <input
                type="file"
                id="transcriptUpload"
                accept=".pdf"
                className="hidden"
                onChange={handleTranscriptChange}
              />
            </div>

            <div className="w-3/4 h-16 p-2 m-2 border-2 border-gray-300 rounded-lg flex items-center justify-between">
              <span className="overflow-hidden truncate">
                {info.criminalrecords ? (
                  <span>
                    Criminal Records Uploaded: {info.criminalrecords.file.name}
                  </span>
                ) : (
                  <span>Upload Criminal Records</span>
                )}
              </span>
              <label
                htmlFor="criminalRecordsUpload"
                className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
              >
                Browse
              </label>
              <input
                type="file"
                id="criminalRecordsUpload"
                accept=".pdf"
                className="hidden"
                onChange={handleCriminalRecordsChange}
              />
            </div>

            <button
              className="w-3/4 h-16 p-2 m-2 text-white bg-blue-500 rounded-lg"
              onClick={addApplication}
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default Application;

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import StudentMainPage from "./pages/StudentMainPage";
import LoginPage from "./pages/LoginPage";
import ViewCandidates from "./pages/ViewCandidates";
import VoteCandidate from "./pages/VoteCandidate";
import ViewResults from "./pages/ViewResults";
import Application from "./pages/Application";
import AdminMainPage from "./pages/AdminMainPage";
import AddCandidate from "./pages/AddCandidate";
import RemoveCandidate from "./pages/RemoveCandidate";
import SetElection from "./pages/SetElection";
import AdminLogin from "./pages/AdminLogin";
import SetApplicationPeriod from "./pages/SetApplicationPeriod";

const el = document.getElementById("root");
const root = ReactDOM.createRoot(el);

root.render(
  <Router>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard" element={<StudentMainPage />} />
      <Route path="/candidates" element={<ViewCandidates />} />
      <Route path="/vote" element={<VoteCandidate />} />
      <Route path="/results" element={<ViewResults />} />
      <Route path="/application" element={<Application />} />
      <Route path="/admin" element={<AdminMainPage />} />
      <Route path="/addcandidate" element={<AddCandidate />} />
      <Route path="/removecandidate" element={<RemoveCandidate />} />
      <Route path="/setelection" element={<SetElection />} />
      <Route path="/setapplication" element={<SetApplicationPeriod />} />
      <Route path="/adminlogin" element={<AdminLogin />} />
    </Routes>
  </Router>
);

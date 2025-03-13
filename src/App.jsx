import Login from "./pages/Login";
import Register from "./pages/Register";
import MainDashboard from "./components/MainDashboard"; // Make sure to import MainDashboard
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/MainDashboard" element={<MainDashboard />} />
    </Routes>
  );
}

export default App;

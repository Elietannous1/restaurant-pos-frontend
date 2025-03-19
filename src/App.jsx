import Login from "./pages/Login";
import Register from "./pages/Register";
import MainDashboard from "./pages/MainDashboard";
import CreateOrder from "./pages/CreateOrder";
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route } from "react-router-dom";
import { SidebarProvider } from "./context/SidebarContext";

function App() {
  return (
    <SidebarProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/MainDashboard" element={<MainDashboard />} />
        <Route path="/CreateOrder" element={<CreateOrder />} />
      </Routes>
    </SidebarProvider>
  );
}

export default App;

import Login from "./pages/Login";
import Register from "./pages/Register";
import MainDashboard from "./pages/MainDashboard";
import CreateOrder from "./pages/CreateOrder";
import ViewOrders from "./pages/ViewOrders";
import ProductManagement from "./pages/ProductManagement";
import CategoryManagement from "./pages/CategoryManagement";
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route } from "react-router-dom";
import { SidebarProvider } from "./context/SideBarContext";

function App() {
  return (
    <SidebarProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/MainDashboard" element={<MainDashboard />} />
        <Route path="/CreateOrder" element={<CreateOrder />} />
        <Route path="/ViewOrders" element={<ViewOrders />} />
        <Route path="/ProductManagement" element={<ProductManagement />} />
        <Route path="/CategoryManagement" element={<CategoryManagement />} />
      </Routes>
    </SidebarProvider>
  );
}

export default App;

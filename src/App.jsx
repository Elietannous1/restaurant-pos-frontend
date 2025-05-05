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
import AccountRecovery from "./pages/recovery/AccountRecovery";
import GlobalSpinner from "./components/GlobalSpinner";
import { Provider } from "react-redux";
import { store } from "../src/store/reduxStore";
function App() {
  return (
    <Provider store={store}>
      <GlobalSpinner />
      <SidebarProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/MainDashboard" element={<MainDashboard />} />
          <Route path="/CreateOrder" element={<CreateOrder />} />
          <Route path="/ViewOrders" element={<ViewOrders />} />
          <Route path="/ProductManagement" element={<ProductManagement />} />
          <Route path="/CategoryManagement" element={<CategoryManagement />} />
          <Route
            path="/recovery/AccountRecovery"
            element={<AccountRecovery />}
          />
        </Routes>
      </SidebarProvider>
    </Provider>
  );
}

export default App;

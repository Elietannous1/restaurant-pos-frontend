import Login from "./pages/Login"
import Register from "./pages/Register"
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes> {/* No need for <Router> here since it's in index.jsx */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  )
}

export default App

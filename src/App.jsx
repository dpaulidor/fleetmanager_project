import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Historiques from "./pages/Historiques";
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <div className="app-layout">
                  <Sidebar />
                  <div className="main-content">
                    <Navbar />
                    <div className="content">
                      <Routes>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/historiques" element={<Historiques />} />
                      </Routes>
                    </div>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

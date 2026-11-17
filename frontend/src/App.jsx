import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Login from './pages/Login';
import Register from './pages/Register';
import ManageRooms from './pages/ManageRooms';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-shell">
          <Navbar />
          <main className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/manage-rooms"
                element={
                  <ProtectedRoute>
                    <ManageRooms />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <footer className="footer">
            SmartStay &copy; 2026 — React Context + localStorage + ASP.NET Core + EF Core
          </footer>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

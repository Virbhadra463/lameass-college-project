import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import EventDetails from './pages/EventDetails';
import BookingForm from './pages/BookingForm';
import ManagerDetails from './pages/ManagerDetails';
import RequestForm from './pages/RequestForm';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#F8FAFC] relative overflow-hidden">
        {/* Subtle Background Glows */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-400/20 rounded-full blur-[120px] -z-10 animate-pulse"></div>
        <div className="absolute top-[40%] right-[-100px] w-[400px] h-[400px] bg-purple-400/20 rounded-full blur-[100px] -z-10 animate-pulse delay-1000"></div>

        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-10 z-10 animate-fade-in">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/event/:id" element={<EventDetails />} />
            <Route path="/book/:id" element={<BookingForm />} />
            <Route path="/manager/:id" element={<ManagerDetails />} />
            <Route path="/request/:id" element={<RequestForm />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

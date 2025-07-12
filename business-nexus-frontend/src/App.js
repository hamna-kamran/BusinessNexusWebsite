import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import InvestorDashboard from './pages/InvestorDashboard';
import EntrepreneurDashboard from './pages/EntrepreneurDashboard';
import EntrepreneurProfileForm from './pages/CreateEntrepreneurProfile';
import InvestorProfileForm from './pages/CreateInvestorProfile';
import InvestorProfileView from './pages/InvestorProfile';
import EntrepreneurProfileView from './pages/EntrepreneurProfile';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/Register" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard/investor" element={<InvestorDashboard />} />
        <Route path="/dashboard/entrepreneur" element={<EntrepreneurDashboard />} />
        <Route path="/entrepreneur/profile/create" element={<EntrepreneurProfileForm />} />
        <Route path="/investor/profile/create" element={<InvestorProfileForm />} />
        <Route path="/profile/investor/:id" element={<InvestorProfileView />} />
        <Route path="/investor/profile/edit" element={<InvestorProfileForm />} />
        <Route path="/profile/entrepreneur/:id" element={<EntrepreneurProfileView />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;

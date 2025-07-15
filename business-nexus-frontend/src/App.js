import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import InvestorDashboard from './pages/InvestorDashboard';
import EntrepreneurDashboard from './pages/EntrepreneurDashboard';
import EntrepreneurProfileForm from './pages/CreateEntrepreneurProfile';
import InvestorProfileForm from './pages/CreateInvestorProfile';
import InvestorProfileView from './pages/InvestorProfile';
import EntrepreneurProfileView from './pages/EntrepreneurProfile';
import AllEntrepreneurs from './pages/ViewAllEntrepreneurs';
import AllInvestors from './pages/ViewAllInvestors'; 
import CollaborationRequests from './pages/CollaborationRequests';
import Logout from './pages/Logout'; 


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
        <Route path="/entrepreneurs" element={<AllEntrepreneurs />} />
        <Route path="/profile/entrepreneur/:id" element={<EntrepreneurProfileView />} />
        <Route path="/investors" element={<AllInvestors />} />
        <Route path="/requests" element={<CollaborationRequests />} />
        <Route path="/logout" element={<Logout />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;

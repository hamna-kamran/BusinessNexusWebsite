import React from 'react';
import { useNavigate } from 'react-router-dom';

import DashboardLayout from '../layouts/DashboardLayout';
import TipsSection from '../components/TipSection';


export default function EntrepreneurDashboard() {
   const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const goToProfile = () => {
    navigate('/entrepreneur/profile/create');
  };

  return (
    <DashboardLayout>
      <div className="container">
        {/* Welcome Section */}
        <div className="bg-white shadow-sm rounded p-4 mb-4 text-center">
          <h3 className="fw-bold mb-2">Welcome back, {user?.name || 'Entrepreneur'}</h3>
           <h4>Let's Explore Business Nexus</h4>
          <p className="text-muted mb-3">
          </p>
          <p className="fs-5 text-dark mb-0">
            <em>🌟 Where startups and job seekers connect🌟</em>
          </p>
        </div>
      </div>
       {/* Profile Creation CTA Section */}
        <div className="bg-dark text-white rounded shadow-sm p-5 text-center">
          <h4 className="mb-3">Haven’t created your entrepreneur profile yet?</h4>
          <p className="mb-4 text-light">
            Showcase your startup idea, vision, and connect with potential investors. 
            A complete profile increases your chances of getting noticed!
          </p>
          <button
            onClick={goToProfile}
            className="btn btn-lg btn-outline-light px-5 py-3 fw-bold create-profile-btn"
          >
            + Create Your Profile
          </button>
        </div>

      {/* Custom Styling */}
      <style>{`
        .create-profile-btn {
          transition: all 0.3s ease-in-out;
        }
        .create-profile-btn:hover {
          background-color: white;
          color: #0d1b2a;
          border: 2px solid white;
          transform: scale(1.05);
        }
      `}</style>
      {/* Tips Section */}
<TipsSection />
    </DashboardLayout>
  );
}

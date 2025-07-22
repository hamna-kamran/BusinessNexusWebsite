import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DashboardLayout from '../layouts/DashboardLayout';

export default function AllInvestors() {
  const [investors, setInvestors] = useState([]);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvestors = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn("No token found in localStorage");
        return;
      }

      try {
        const res = await axios.get('https://businessnexuswebsite.onrender.com/api/investor/all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setInvestors(res.data);
      } catch (err) {
        console.error("Failed to fetch investors", err);
      }
    };

    fetchInvestors();
  }, []);

  const handleRequest = async (id) => {
  try {
    const token = localStorage.getItem('token');

    await axios.post(
      'https://businessnexuswebsite.onrender.com/api/request',
      { toUserId: id },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setMessage('✅ Request sent successfully!');
  } catch (err) {
    const backendMessage = err?.response?.data?.msg || err?.message || 'Something went wrong';
    console.error("Request Error:", backendMessage);
    setMessage(`❌ ${backendMessage}`);
  }
};


  // 🔍 Filter investors by investmentInterests
  const filtered = investors.filter(inv =>
    inv.investmentInterests?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="container py-5">
        <h2 className="text-center mb-4">📋 Explore Investors</h2>

        <input
          type="text"
          className="form-control mb-4"
          placeholder="Search by investment interests..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {message && <div className="alert alert-info text-center">{message}</div>}

        <div className="row">
          {filtered.length === 0 ? (
            <p className="text-muted text-center">No matching investor profiles found.</p>
          ) : (
            filtered.map((inv) => (
              <div className="col-md-6 col-lg-4 mb-4" key={inv._id}>
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title text-success">{inv.name}</h5>
                    <p className="text-muted mb-2">
                      <strong>Interests:</strong>{' '}
                      {inv.investmentInterests?.substring(0, 100) || 'N/A'}...
                    </p>
                    <p>
                      <strong>Portfolio:</strong>{' '}
                      {(inv.portfolioCompanies && inv.portfolioCompanies.length > 0)
                        ? inv.portfolioCompanies.slice(0, 2).join(', ') + '...'
                        : 'Not listed'}
                    </p>

                    <div className="mt-auto d-flex gap-2">
                      <button
                        className="btn btn-outline-success"
                        onClick={() => handleRequest(inv.user)}
                      >
                        🤝 Send Request
                      </button>

                      <button
                        className="btn btn-success"
                        onClick={() => navigate(`/profile/investor/${inv.user}`)}
                      >
                        🔍 View Full Profile
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

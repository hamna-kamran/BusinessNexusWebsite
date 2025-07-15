import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DashboardLayout from '../layouts/DashboardLayout';

export default function AllEntrepreneurs() {
  const [entrepreneurs, setEntrepreneurs] = useState([]);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEntrepreneurs = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await axios.get('http://localhost:5000/api/entrepreneur/all', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEntrepreneurs(res.data);
      } catch (err) {
        console.error("Failed to fetch entrepreneurs", err);
      }
    };

    fetchEntrepreneurs();
  }, []);

  const handleRequest = async (id) => {
  try {
    const token = localStorage.getItem('token');

    await axios.post(
      'http://localhost:5000/api/request',
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




  const filtered = entrepreneurs.filter(ent =>
    ent.startupDescription?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="container py-5">
        <h2 className="text-center mb-4">📋 Explore Entrepreneurs</h2>
        <input
          type="text"
          className="form-control mb-4"
          placeholder="Search by startup description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {message && <div className="alert alert-info text-center">{message}</div>}

        <div className="row">
          {filtered.length === 0 ? (
            <p className="text-muted text-center">No matching entrepreneur profiles found.</p>
          ) : (
            filtered.map((ent) => (
              <div className="col-md-6 col-lg-4 mb-4" key={ent._id}>
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title text-primary">{ent.name}</h5>
                    <p className="text-muted mb-2"><strong>Bio:</strong> {ent.bio?.substring(0, 100) || 'N/A'}...</p>
                    <p><strong>Startup:</strong> {ent.startupDescription?.substring(0, 80) || 'Not provided'}...</p>

                    <div className="mt-auto d-flex gap-2">
                      <button className="btn btn-outline-primary" onClick={() => handleRequest(ent.user)}>
                        🤝 Send Request
                      </button>
                      <button className="btn btn-primary" onClick={() => navigate(`/profile/entrepreneur/${ent.user}`)}>
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

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardLayout from '../layouts/DashboardLayout';

export default function CollaborationRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
const fetchRequests = async () => {
  try {
    const res = await axios.get('http://localhost:5000/api/requests', {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Decode user from token
    const decoded = JSON.parse(atob(token.split('.')[1])); // extract user info from JWT
    setCurrentUser(decoded); // decoded will have id and role

    setRequests(res.data || []);
  } catch (err) {
    console.error("Error fetching requests", err);
  } finally {
    setLoading(false);
  }
};

    fetchRequests();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`http://localhost:5000/api/request/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(prev =>
        prev.map(r => r._id === id ? { ...r, status } : r)
      );
    } catch (err) {
      console.error("Error updating request", err);
    }
  };

  return (
    <DashboardLayout>
      <div className="container py-5">
        <h3 className="text-center mb-4">📨 Collaboration Requests</h3>

        {loading ? (
          <p>Loading...</p>
        ) : requests.length === 0 ? (
          <p className="text-muted text-center">No requests found.</p>
        ) : (
          <ul className="list-group">
            {requests.map((r) => (
<li key={r._id} className="list-group-item d-flex justify-content-between align-items-center">
  {currentUser && (
    <p className="mb-1">
      From: <strong>
        {r.investorId?._id === currentUser.id
          ? r.entrepreneurId?.name
          : r.investorId?.name}
      </strong>
      <button
        className="btn btn-sm btn-outline-primary ms-3"
        onClick={() => {
          const senderId =
            r.investorId?._id === currentUser.id
              ? r.entrepreneurId?._id
              : r.investorId?._id;
          const role =
            r.investorId?._id === currentUser.id ? 'entrepreneur' : 'investor';

          window.location.href = `/profile/${role}/${senderId}`;
        }}
      >
        🔍 View Profile
      </button>
    </p>
  )}

  <div>
    {r.status === 'pending' ? (
      <>
        <button
          className="btn btn-success btn-sm me-2"
          onClick={() => updateStatus(r._id, 'accepted')}
        >
          Accept
        </button>
        <button
          className="btn btn-danger btn-sm"
          onClick={() => updateStatus(r._id, 'rejected')}
        >
          Reject
        </button>
      </>
    ) : (
      <span
        className={`badge ${
          r.status === 'accepted' ? 'bg-success' : 'bg-danger'
        }`}
      >
        {r.status}
      </span>
    )}
  </div>
</li>

            ))}
          </ul>
        )}
      </div>
    </DashboardLayout>
  );
}

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

        const decoded = JSON.parse(atob(token.split('.')[1]));
        setCurrentUser(decoded);

        const data = res.data;
        const formatted = Array.isArray(data) ? data : data.requests || [];
        setRequests(formatted);
      } catch (err) {
        console.error('Error fetching requests', err);
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchRequests();
  }, [token]);

  const handleAction = async (id, action) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/requests/${id}/status`,
        { action },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setRequests((prev) =>
        prev.map((r) =>
          r._id === id
            ? { ...r, status: action === 'accept' ? 'accepted' : 'rejected' }
            : r
        )
      );
    } catch (err) {
      console.error(`${action} error`, err.response?.data || err.message);
    }
  };

  return (
    <DashboardLayout>
      <div className="container py-5">
        <h3 className="text-center mb-4">
          📨 <span className="fw-bold">Collaboration Requests</span>
        </h3>

        {loading ? (
          <div className="text-center text-muted">
            <div className="spinner-border text-primary" role="status" />
            <p className="mt-2">Loading...</p>
          </div>
        ) : requests.length === 0 ? (
          <p className="text-muted text-center">No collaboration requests found.</p>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 g-4">
            {requests.map((r) => {
              const isSender = r.senderId?._id === currentUser?.id;
              const isReceiver = !isSender;
              const otherParty = isSender
                ? r.investorId._id === currentUser.id
                  ? r.entrepreneurId
                  : r.investorId
                : r.senderId;

              return (
                <div key={r._id} className="col">
                  <div className="card shadow-sm border-0 h-100">
                    <div className="card-body">
                      <h5 className="card-title mb-3">
                        {isSender ? `To: ${otherParty.name}` : `From: ${otherParty.name}`}
                      </h5>

                      <div className="d-flex flex-wrap gap-2 mb-3">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() =>
                            window.location.href = `/profile/${otherParty.role?.toLowerCase()}/${otherParty._id}`
                          }
                        >
                          🔍 View Profile
                        </button>

                        {r.status === 'accepted' && (
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() =>
                              (window.location.href = `/chat/${otherParty._id}`)
                            }
                          >
                            💬 Chat
                          </button>
                        )}

                        {r.status === 'pending' && isReceiver && (
                          <>
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => handleAction(r._id, 'accept')}
                            >
                              ✅ Accept
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleAction(r._id, 'reject')}
                            >
                              ❌ Reject
                            </button>
                          </>
                        )}
                      </div>

                      {r.status !== 'pending' && (
                        <span
                          className={`badge ${
                            r.status === 'accepted' ? 'bg-success' : 'bg-secondary'
                          }`}
                        >
                          {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

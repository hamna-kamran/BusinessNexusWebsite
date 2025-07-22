import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardLayout from '../layouts/DashboardLayout';

export default function CollaborationRequests() {
  const [sentRequests, setSentRequests] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        if (!token) return;

        const decoded = JSON.parse(atob(token.split('.')[1]));
        setCurrentUser(decoded);

        const res = await axios.get('https://businessnexuswebsite.onrender.com/api/requests', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const all = Array.isArray(res.data) ? res.data : res.data.requests || [];
        const sent = [];
        const incoming = [];

        for (let r of all) {
          const isSender = r.senderId?._id === decoded.id;
          if (isSender) sent.push(r);
          else incoming.push(r);
        }

        setSentRequests(sent);
        setIncomingRequests(incoming);
      } catch (err) {
        console.error('Error fetching requests', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [token]);

  const handleAction = async (id, action) => {
    try {
      const res = await axios.patch(
        `https://businessnexuswebsite.onrender.com/api/requests/${id}/status`,
        { action },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.request) {
        setIncomingRequests(prev =>
          prev.map(r => (r._id === id ? res.data.request : r))
        );
      }
    } catch (err) {
      console.error('❌ handleAction error:', err.response?.data || err.message);
      alert(err.response?.data?.message || err.message);
    }
  };

  const RequestCard = ({ r, isSender }) => {
    const other = isSender
      ? r.investorId?._id === currentUser?.id
        ? r.entrepreneurId
        : r.investorId
      : r.senderId;

    return (
      <div className="card shadow-sm border-0 h-100">
        <div className="card-body">
          <h5 className="card-title">
            {isSender ? `To: ${other?.name}` : `From: ${other?.name}`}
          </h5>
          <p className="card-text text-muted">{other?.email}</p>

          <div className="d-flex flex-wrap gap-2 mb-3">
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() =>
                (window.location.href = `/profile/${other?.role?.toLowerCase()}/${other?._id}`)
              }
            >
              🔍 View Profile
            </button>

            {r.status === 'accepted' && (
              <button
                className="btn btn-sm btn-success"
                onClick={() => (window.location.href = `/chat/${other?._id}`)}
              >
                💬 Chat
              </button>
            )}

            {r.status === 'pending' && !isSender && (
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

          <span
            className={`badge ${
              r.status === 'accepted'
                ? 'bg-success'
                : r.status === 'rejected'
                ? 'bg-danger'
                : 'bg-secondary'
            }`}
          >
            {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
          </span>
        </div>
      </div>
    );
  };

  return (
  <DashboardLayout>
    <div className="container py-5">
      <h2 className="text-center mb-5 fw-bold text-primary">
        🤝 Collaboration Requests
      </h2>

      {loading ? (
        <div className="text-center text-muted">
          <div className="spinner-border text-primary" role="status" />
          <p className="mt-2">Loading...</p>
        </div>
      ) : (
        <div className="row gy-5">
          {/* Incoming Requests */}
          <div className="col-lg-6">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="fw-semibold text-dark">📥 Incoming Requests</h4>
              <span className="badge bg-primary">
                {incomingRequests.length}
              </span>
            </div>
            {incomingRequests.length === 0 ? (
              <div className="alert alert-secondary">No incoming requests.</div>
            ) : (
              <div className="row row-cols-1 g-4">
                {incomingRequests.map(r => (
                  <div key={r._id} className="col">
                    <RequestCard r={r} isSender={false} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sent Requests */}
          <div className="col-lg-6">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="fw-semibold text-dark">📤 Sent Requests</h4>
              <span className="badge bg-success">
                {sentRequests.length}
              </span>
            </div>
            {sentRequests.length === 0 ? (
              <div className="alert alert-secondary">No sent requests.</div>
            ) : (
              <div className="row row-cols-1 g-4">
                {sentRequests.map(r => (
                  <div key={r._id} className="col">
                    <RequestCard r={r} isSender={true} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  </DashboardLayout>
);

}

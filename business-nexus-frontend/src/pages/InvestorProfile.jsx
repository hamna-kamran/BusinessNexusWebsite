import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DashboardLayout from '../layouts/DashboardLayout';
import ProfilePic from '../assets/Profilepic.jpg';

export default function InvestorProfileView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ bio: '', investmentInterests: '', portfolioCompanies: '' });
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');

  const loggedInUser = JSON.parse(localStorage.getItem('user'));
  const isOwner = loggedInUser?.id === id || loggedInUser?._id === id;

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) {
        setError('Invalid profile ID.');
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/investor/profile/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
        setForm({
          bio: res.data.bio || '',
          investmentInterests: res.data.investmentInterests || '',
          portfolioCompanies: (res.data.portfolioCompanies || []).join(', '),
        });
      } catch (err) {
        console.error(err);
        setError('Failed to load profile. Please try again.');
      }
    };

    fetchProfile();
  }, [id]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const payload = {
        ...form,
        portfolioCompanies: form.portfolioCompanies.split(',').map(c => c.trim()),
      };

      await axios.put(
        `http://localhost:5000/api/investor/profile/${id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage('Profile updated successfully!');
      setIsEditing(false);
      setProfile(payload);
    } catch (err) {
      console.error('Error updating profile:', err);
      setMessage(err.response?.data?.msg || 'Something went wrong.');
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm('Are you sure you want to delete your profile? This action cannot be undone.');
    if (!confirmed) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/investor/profile/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('Profile deleted successfully.');
      navigate('/dashboard/investor');
    } catch (err) {
      console.error('Error deleting profile:', err);
      alert('Failed to delete profile.');
    }
  };

  return (
    <DashboardLayout>
      <div className="container py-5" style={{ backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
        <div className="card shadow-lg border-0 mx-auto" style={{ maxWidth: '900px' }}>
          <div className="card-body d-flex flex-column flex-md-row align-items-start">
            {/* Profile Picture */}
            <div className="me-md-4 mb-3 mb-md-0">
              <img
                src={ProfilePic}
                alt="Profile"
                className="rounded-circle border border-3 shadow"
                style={{ width: '130px', height: '130px', objectFit: 'cover' }}
              />
            </div>

            <div className="flex-grow-1">
              <h3 className="mb-4 text-primary border-bottom pb-2">Investor Profile</h3>

              {error && <div className="alert alert-danger">{error}</div>}
              {message && <div className="alert alert-success">{message}</div>}

              {isEditing ? (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Bio</label>
                    <textarea
                      className="form-control"
                      name="bio"
                      rows="3"
                      value={form.bio}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Investment Interests</label>
                    <textarea
                      className="form-control"
                      name="investmentInterests"
                      rows="3"
                      value={form.investmentInterests}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Portfolio Companies (comma separated)</label>
                    <textarea
                      className="form-control"
                      name="portfolioCompanies"
                      rows="3"
                      value={form.portfolioCompanies}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary me-2">Update</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                </form>
              ) : profile ? (
                <>
                  <div className="mb-4 border-start ps-3 border-4 border-primary bg-light rounded py-2">
                    <h6 className="text-muted">Bio</h6>
                    <p className="fs-6">{profile.bio}</p>
                  </div>

                  <div className="mb-4 border-start ps-3 border-4 border-success bg-light rounded py-2">
                    <h6 className="text-muted">Investment Interests</h6>
                    <p className="fs-6">{profile.investmentInterests}</p>
                  </div>

                  <div className="border-start ps-3 border-4 border-info bg-light rounded py-2">
                    <h6 className="text-muted">Portfolio Companies</h6>
                    {profile.portfolioCompanies && profile.portfolioCompanies.length > 0 ? (
                      <div className="d-flex flex-wrap gap-2">
                        {profile.portfolioCompanies.map((company, index) => (
                          <span key={index} className="badge bg-info text-dark">
                            {company}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted">No companies listed.</p>
                    )}
                  </div>

                  {isOwner && (
                    <div className="mt-4 d-flex flex-column align-items-start gap-2">
                      <button
                        className="btn btn-outline-primary"
                        onClick={() => setIsEditing(true)}
                      >
                        Edit Profile
                      </button>
                      <button
                        className="btn btn-outline-danger"
                        onClick={handleDelete}
                      >
                        Delete Profile
                      </button>
                    </div>
                  )}
                </>
              ) : (
                !error && <p className="text-muted">Loading profile...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

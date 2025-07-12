import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DashboardLayout from '../layouts/DashboardLayout';
import ProfilePic from '../assets/Profilepic.jpg';

export default function EntrepreneurProfileView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    bio: '',
    startupDescription: '',
    fundingNeed: '',
    pitchDeck: '',
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const loggedInUser = JSON.parse(localStorage.getItem('user'));
  const isOwner = loggedInUser?.id === id || loggedInUser?._id === id;

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) return setError('Invalid profile ID.');
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/entrepreneur/profile/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
        setForm({
          bio: res.data.bio || '',
          startupDescription: res.data.startupDescription || '',
          fundingNeed: res.data.fundingNeed || '',
          pitchDeck: res.data.pitchDeck || '',
        });
      } catch (err) {
        console.error(err);
        setError('Failed to load profile');
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
      await axios.put(
        `http://localhost:5000/api/entrepreneur/profile/${id}`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Profile updated successfully!');
      setIsEditing(false);
      setProfile(form);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.msg || 'Error updating profile.');
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm('Are you sure you want to delete your profile? This action cannot be undone.');
    if (!confirmed) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/entrepreneur/profile/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Profile deleted');
      navigate('/dashboard/entrepreneur');
    } catch (err) {
      console.error(err);
      alert('Failed to delete profile.');
    }
  };

  return (
    <DashboardLayout>
      <div className="container py-5" style={{ backgroundColor: '#f9f9f9' }}>
        <div className="card shadow border-0 mx-auto" style={{ maxWidth: '900px' }}>
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

            {/* Content */}
            <div className="flex-grow-1">
              <h3 className="mb-4 text-primary border-bottom pb-2">Entrepreneur Profile</h3>

              {error && <div className="alert alert-danger">{error}</div>}
              {message && <div className="alert alert-success">{message}</div>}

              {isEditing ? (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Bio</label>
                    <textarea className="form-control" name="bio" rows="3" value={form.bio} onChange={handleChange} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Startup Description</label>
                    <textarea className="form-control" name="startupDescription" rows="3" value={form.startupDescription} onChange={handleChange} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Funding Need</label>
                    <input className="form-control" name="fundingNeed" value={form.fundingNeed} onChange={handleChange} />
                  </div>
                  <div className="mb-4">
                    <label className="form-label">Pitch Deck (link or text)</label>
                    <input className="form-control" name="pitchDeck" value={form.pitchDeck} onChange={handleChange} />
                  </div>
                  <button className="btn btn-primary me-2" type="submit">Update</button>
                  <button className="btn btn-secondary" type="button" onClick={() => setIsEditing(false)}>Cancel</button>
                </form>
              ) : profile ? (
                <>
                  <div className="mb-3">
                    <h6 className="text-muted">Bio</h6>
                    <p>{profile.bio}</p>
                  </div>
                  <div className="mb-3">
                    <h6 className="text-muted">Startup Description</h6>
                    <p>{profile.startupDescription}</p>
                  </div>
                  <div className="mb-3">
                    <h6 className="text-muted">Funding Need</h6>
                    <p>{profile.fundingNeed}</p>
                  </div>
                  <div className="mb-3">
                    <h6 className="text-muted">Pitch Deck</h6>
                    <p>{profile.pitchDeck}</p>
                  </div>
                  {isOwner && (
                    <div className="mt-3 d-flex flex-column gap-2 align-items-start">
                      <button className="btn btn-outline-primary" onClick={() => setIsEditing(true)}>Edit Profile</button>
                      <button className="btn btn-outline-danger" onClick={handleDelete}>Delete Profile</button>
                    </div>
                  )}
                </>
              ) : (
                <p>Loading profile...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

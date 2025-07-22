import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import axios from 'axios';

export default function InvestorProfileForm() {
  const user = JSON.parse(localStorage.getItem('user'));

  const [form, setForm] = useState({
    bio: '',
    investmentInterests: '',
    portfolioCompanies: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');

      await axios.post(
        'https://businessnexuswebsite.onrender.com/api/investor/profile',
        { ...form, userId: user._id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage('Investor profile created successfully!');
      setForm({ bio: '', investmentInterests: '', portfolioCompanies: '' });
    } catch (err) {
      console.error('Axios error:', err);

      const errorMsg =
        err.response?.data?.msg ||
        err.response?.data?.error ||
        err.message ||
        'Error submitting profile. Try again.';

      setMessage(errorMsg);
    }
  };

  return (
    <DashboardLayout>
      <div className="container bg-white shadow-sm p-5 rounded">
        <h3 className="mb-4">Create Your Investor Profile</h3>
        {message && <div className="alert alert-info">{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Bio</label>
            <textarea
              className="form-control"
              name="bio"
              rows="3"
              placeholder="Tell us about yourself"
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
              placeholder="E.g., Fintech, Healthtech, EdTech..."
              value={form.investmentInterests}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Portfolio Companies</label>
            <textarea
              className="form-control"
              name="portfolioCompanies"
              rows="3"
              placeholder="List your invested companies"
              value={form.portfolioCompanies}
              onChange={handleChange}
              required
            />
          </div>

          <button className="btn btn-primary px-4">Submit Profile</button>
        </form>
      </div>
    </DashboardLayout>
  );
}

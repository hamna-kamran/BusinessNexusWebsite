import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AccountSettings() {
  const [user, setUser] = useState({ name: '', email: '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get('https://businessnexuswebsite.onrender.com/api/auth/current', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setUser({ name: res.data.name, email: res.data.email }))
    .catch(err => console.error('Failed to fetch user:', err));
  }, [token]);

  const handleUserUpdate = async () => {
    setLoading(true);
    try {
     await axios.patch('https://businessnexuswebsite.onrender.com/api/auth/update-profile', user, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('User info updated successfully');
    } catch (error) {
      console.error(error);
      alert('Failed to update user info');
    }
    setLoading(false);
  };

  const handleChangePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      return alert('New passwords do not match');
    }

    setLoading(true);
    try {
     await axios.patch('https://businessnexuswebsite.onrender.com/api/auth/change-password', {
  currentPassword: passwords.currentPassword,
  newPassword: passwords.newPassword
}, {
  headers: { Authorization: `Bearer ${token}` }
});

      alert('Password changed successfully');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error(error);
      alert('Failed to change password');
    }
    setLoading(false);
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
    await axios.delete('https://businessnexuswebsite.onrender.com/api/auth/delete-account', {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Account deleted successfully');
      localStorage.removeItem('token');
      window.location.href = '/login';
    } catch (error) {
      console.error(error);
      alert('Failed to delete account');
    }
    setLoading(false);
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Account Settings</h2>

      {/* Update Info */}
      <div className="card shadow-sm p-4 mb-4">
        <h5 className="mb-3">Update Personal Info</h5>
        <input
          type="email"
          className="form-control mb-3"
          placeholder="Email"
          value={user.email}
          onChange={e => setUser({ ...user, email: e.target.value })}
        />
        <button
          className="btn btn-primary"
          onClick={handleUserUpdate}
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Info'}
        </button>
      </div>

      {/* Change Password */}
      <div className="card shadow-sm p-4 mb-4">
        <h5 className="mb-3">Change Password</h5>
        <input
          type="password"
          className="form-control mb-3"
          placeholder="Current Password"
          value={passwords.currentPassword}
          onChange={e => setPasswords({ ...passwords, currentPassword: e.target.value })}
        />
        <input
          type="password"
          className="form-control mb-3"
          placeholder="New Password"
          value={passwords.newPassword}
          onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })}
        />
        <input
          type="password"
          className="form-control mb-3"
          placeholder="Confirm New Password"
          value={passwords.confirmPassword}
          onChange={e => setPasswords({ ...passwords, confirmPassword: e.target.value })}
        />
        <button
          className="btn btn-warning"
          onClick={handleChangePassword}
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Change Password'}
        </button>
      </div>

      {/* Delete Account */}
      <div className="card shadow-sm p-4 mb-5">
        <h5 className="mb-3">Delete Account</h5>
        <p className="text-danger">Warning: This action is irreversible.</p>
        <button
          className="btn btn-danger"
          onClick={() => setShowDeleteConfirm(true)}
        >
          Delete My Account
        </button>
      </div>

      {/* Modal */}
      {showDeleteConfirm && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Account Deletion</h5>
              </div>
              <div className="modal-body">
                <p>Are you absolutely sure you want to permanently delete your account?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                <button className="btn btn-danger" onClick={handleDeleteAccount} disabled={loading}>
                  {loading ? 'Deleting...' : 'Yes, Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

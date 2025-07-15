// src/pages/Logout.jsx

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.removeItem('token');  // ✅ Clear the token
      navigate('/login');                // ✅ Redirect to login
    } else {
      navigate(-1); // Go back if user cancels
    }
  }, [navigate]);

  return null;
}

// src/pages/Logout.jsx
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
  const navigate = useNavigate();
  const hasPromptedRef = useRef(false);  // ✅ Track if prompt already shown

  useEffect(() => {
    if (!hasPromptedRef.current) {
      hasPromptedRef.current = true;

      const confirmLogout = window.confirm("Are you sure you want to log out?");
      if (confirmLogout) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        navigate(-1); // Go back
      }
    }
  }, [navigate]);

  return null;
}

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {FaUserCircle } from 'react-icons/fa';
import logo from '../assets/logo.png';

export default function Navbar({ setShowSidebar }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg shadow-sm px-4" style={{ backgroundColor: '#0d1b2a', color: 'white' }}>
      <button onClick={() => setShowSidebar(prev => !prev)} className="btn btn-outline-light me-2">
        ☰
      </button>

      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center" to={`/dashboard/${user?.role}`}>
          <img src={logo} alt="Business Nexus Logo" style={{ height: '50px', marginRight: '10px', width: '230px' }} />
        </Link>


          <div className="dropdown">
            <button className="btn dropdown-toggle d-flex align-items-center text-white" type="button" data-bs-toggle="dropdown">
              <FaUserCircle size={24} className="me-2 text-white" />
              {user?.name?.split(' ')[0] || 'User'}
            </button>
            <ul className="dropdown-menu dropdown-menu-end shadow-sm">
              <li><hr className="dropdown-divider" /></li>
              <li><button className="dropdown-item text-danger" onClick={handleLogout}>Logout</button></li>
            </ul>
          </div>
        </div>
     
    </nav>
  );
}

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBell, FaCommentDots, FaUserCircle } from 'react-icons/fa';
import logo from '../assets/logo.png'; // Make sure this exists

export default function Navbar({ setShowSidebar }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg shadow-sm px-4" style={{ backgroundColor: '#0d1b2a', color: 'white' }}>
      {/* Sidebar Toggle Button */}
      <button onClick={() => setShowSidebar(prev => !prev)} className="btn btn-outline-light me-2">
        ☰
      </button>

      <div className="container-fluid">
        {/* Logo / App Name */}
        <Link className="navbar-brand d-flex align-items-center" to={`/dashboard/${user?.role}`}>
          <img src={logo} alt="Business Nexus Logo" style={{ height: '50px', marginRight: '10px', width: '230px' }} />
        </Link>

        {/* Search Bar */}
        <form className="d-none d-md-flex mx-auto w-50">
          <input
            type="text"
            className="form-control rounded-pill px-4"
            placeholder="Search users, profiles or startups..."
          />
        </form>

        {/* Right Icons */}
        <div className="d-flex align-items-center gap-3">
          <div className="position-relative">
            <FaBell size={20} />
          </div>
          <div>
            <FaCommentDots size={20} />
          </div>

          {/* Dropdown */}
          <div className="dropdown">
            <button
              className="btn dropdown-toggle d-flex align-items-center text-white"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <FaUserCircle size={24} className="me-2 text-white" />
              {user?.name?.split(' ')[0] || 'User'}
            </button>
            <ul className="dropdown-menu dropdown-menu-end shadow-sm">
              <li>
                <Link className="dropdown-item" to={`/profile/${user?.role}/${user?._id}`}>
                  View Profile
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/settings">Settings</Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/messages">Messages</Link>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button className="dropdown-item text-danger" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

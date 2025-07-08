import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role;
  const userId = user?._id;
  const { pathname } = useLocation();

  const menu = {
    investor: [
      { label: 'Dashboard', path: `/dashboard/investor` },
      { label: 'Entrepreneurs', path: '/entrepreneurs' },
      { label: 'Collaboration Requests', path: '/requests' },
      { label: 'Chat', path: '/chat' },
      { label: 'My Profile', path: `/profile/investor/${userId}` },
      { label: 'Settings', path: '/settings' },
      { label: 'Logout', path: '/logout' },
    ],
    entrepreneur: [
      { label: 'Dashboard', path: `/dashboard/entrepreneur` },
      { label: 'Investors', path: '/investors' },
      { label: 'Collaboration Requests', path: '/requests' },
      { label: 'Chat', path: '/chat' },
      { label: 'My Profile', path: `/profile/entrepreneur/${userId}` },
      { label: 'Settings', path: '/settings' },
      { label: 'Logout', path: '/logout' },
    ]
  };

  const activeStyle = path => (
    pathname === path ? 'active text-white bg-primary' : 'text-light'
  );

  return (
    <div className="border-end min-vh-100 p-3" style={{ width: '250px',backgroundColor: '#0d1b2a', color: 'white' }}>
      <h4 className="mb-4 text-center">Menu</h4>
      <ul className="list-unstyled">
        {menu[role]?.map((item, index) => (
          <li key={index} className="mb-2">
            <Link to={item.path} className={`text-decoration-none d-block px-3 py-2 rounded ${activeStyle(item.path)}`}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

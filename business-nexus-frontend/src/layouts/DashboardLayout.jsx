import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

export default function DashboardLayout({ children }) {
  // ❌ was true → ✅ now false to hide sidebar initially
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <>
      <Navbar setShowSidebar={setShowSidebar} />

      <div className="d-flex">
        {showSidebar && (
          <div style={{ width: '250px', backgroundColor: '#0d1b2a' }}>
            <Sidebar />
          </div>
        )}

        <div className="flex-grow-1 p-4">{children}</div>
      </div>
    </>
  );
}

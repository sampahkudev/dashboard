import React from 'react';
import logo from '../assets/logo/logo-sampahku.png';
import Swal from 'sweetalert2';

const Sidebar = ({ onSelect, setIsSidebarOpen, selectedView }) => {
  const handleMenuClick = (view) => {
    onSelect(view);
    setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    Swal.fire({
      title: 'Keluar dari akun?',
      text: 'Apakah kamu yakin ingin logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Ya, Logout',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('iss_token');
        window.location.href = 'https://sampahkudev.github.io/landing-page/';
      }
    });
  };

  return (
    <div className="sidebar">
      <img
        className="w-14 h-auto mb-4 cursor-pointer"
        src={logo}
        alt="Logo"
        onClick={() => handleMenuClick('home')}
      />
      <button
        className={`py-4 px-4 rounded-full sidebar-menu ${
          selectedView === 'home' ? 'active' : ''
        }`}
        onClick={() => handleMenuClick('home')}
      >
        <span className="material-icons sidebar-icons text-base">home</span>Home
      </button>
      <button
        className={`py-4 px-4 rounded-full sidebar-menu ${
          selectedView === 'Profile' ? 'active' : ''
        }`}
        onClick={() => handleMenuClick('Profile')}
      >
        <span className="material-icons sidebar-icons text-base">person</span>Profile
      </button>
      <button
        className={`py-4 px-4 rounded-full sidebar-menu ${
          selectedView === 'FormSampah' ? 'active' : ''
        }`}
        onClick={() => handleMenuClick('FormSampah')}
      >
        <span className="material-icons sidebar-icons text-base">delete</span>Tambah Sampah
      </button>
      <button
        className={`py-4 px-4 rounded-full sidebar-menu ${
          selectedView === 'TukarPoint' ? 'active' : ''
        }`}
        onClick={() => handleMenuClick('TukarPoint')}
      >
        <span className="material-icons sidebar-icons text-base">redeem</span>Tukar Point
      </button>
      <button
        className={`py-4 px-4 rounded-full sidebar-menu ${
          selectedView === 'Donasi' ? 'active' : ''
        }`}
        onClick={() => handleMenuClick('Donasi')}
      >
        <span className="material-icons sidebar-icons text-base">volunteer_activism</span>Donasi
      </button>
      <button
        className={`py-4 px-4 rounded-full sidebar-menu ${
          selectedView === 'NotifSampah' ? 'active' : ''
        }`}
        onClick={() => handleMenuClick('NotifSampah')}
      >
        <span className="material-icons sidebar-icons text-base">notifications</span>Notifikasi
      </button>
      <button
        className="py-4 px-4 rounded-full sidebar-menu mt-auto bg-red-500 text-white"
        onClick={handleLogout}
      >
        <span className="material-icons sidebar-icons text-base">logout</span>Logout
      </button>
    </div>
  );
};

export default Sidebar;
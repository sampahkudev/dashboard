import React, { useEffect, useState } from 'react';
import { FaUser, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaEdit } from 'react-icons/fa';
import { fetchUserProfile } from '../utils/apiService';
import EditProfile from './EditProfile';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await fetchUserProfile();
      setUserData(data);
    } catch (err) {
      console.error('Gagal mengambil data profil:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-xl shadow-md border relative">
      <h1 className="text-2xl font-bold text-center mb-6">Profil Pengguna</h1>

      {loading ? (
        <p className="text-center">Memuat data...</p>
      ) : userData ? (
        <div className="space-y-4 text-gray-800">
          <div className="flex items-center space-x-3">
            <FaUser className="text-green-600" />
            <span className="font-semibold">Nama:</span>
            <span>{userData.nama}</span>
          </div>

          <div className="flex items-center space-x-3">
            <FaEnvelope className="text-blue-500" />
            <span className="font-semibold">Email:</span>
            <span>{userData.email}</span>
          </div>

          <div className="flex items-center space-x-3">
            <FaPhoneAlt className="text-yellow-500" />
            <span className="font-semibold">Telepon:</span>
            <span>{userData.telfon}</span>
          </div>

          <div className="flex items-start space-x-3">
            <FaMapMarkerAlt className="text-red-500 mt-1" />
            <div>
              <div className="font-semibold">Alamat:</div>
              <span>{userData.alamat}</span>
            </div>
          </div>

          <div className="text-center mt-6">
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition flex items-center gap-2 justify-center mx-auto"
            >
              <FaEdit />
              Edit Profil
            </button>
          </div>
        </div>
      ) : (
        <p className="text-center text-red-500">Gagal memuat data pengguna.</p>
      )}
      {showModal && (
        <EditProfile
          data={userData}
          onClose={() => setShowModal(false)}
          onSaved={() => {
            loadProfile();
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
};

export default Profile;
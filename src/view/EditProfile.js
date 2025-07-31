import React, { useState } from 'react';
import { updateUserProfile } from '../utils/apiService';
import Swal from 'sweetalert2';
import { FaSave, FaTimes } from 'react-icons/fa';

const EditProfile = ({ data, onClose, onSaved }) => {
  const [form, setForm] = useState({ ...data });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nama || !form.email || !form.telfon || !form.alamat) {
      return Swal.fire('Peringatan', 'Semua kolom harus diisi!', 'warning');
    }

    try {
      setLoading(true);
      await updateUserProfile(form);
      await Swal.fire({
        title: 'Berhasil!',
        text: 'Profil berhasil diperbarui.',
        icon: 'success',
        confirmButtonColor: '#16a34a',
      });
      onClose();
      onSaved();
    } catch (err) {
      Swal.fire('Gagal', 'Gagal memperbarui profil.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-all">
      <div className="bg-white rounded-xl w-full max-w-lg p-6 relative animate-fadeIn scale-95">

        <h2 className="text-2xl font-bold text-center mb-6 text-green-700">
          Edit Profil
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {['nama', 'email', 'telfon'].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 capitalize mb-1">
                {field}
              </label>
              <input
                type={field === 'email' ? 'email' : 'text'}
                name={field}
                value={form[field]}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none shadow-sm transition"
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alamat
            </label>
            <textarea
              name="alamat"
              value={form.alamat}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none shadow-sm transition"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-full hover:bg-gray-400 transition flex items-center justify-center gap-2"
            >
              <FaTimes /> Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-600 text-white py-2 rounded-full hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <FaSave /> {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;

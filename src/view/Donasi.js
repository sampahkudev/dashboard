import React, { useState } from 'react';
import { FaHeart, FaDonate } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { fetchDonasi } from '../utils/apiService';
import { PiSpinnerGapBold } from 'react-icons/pi';

const LEMBAGAS = [
  { id: 1, nama: 'Lembaga Hijau Bersih' },
  { id: 2, nama: 'Gerakan Peduli Lingkungan' },
  { id: 3, nama: 'Yayasan Alam Lestari' }
];

const NOMINALS = [5000, 10000, 20000, 50000, 100000];

function Donasi() {
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDonasi = async (nominal) => {
    if (!selected) {
      Swal.fire('Pilih Lembaga', 'Silakan pilih lembaga terlebih dahulu.', 'warning');
      return;
    }

    const confirm = await Swal.fire({
      title: 'Konfirmasi Donasi',
      html: `Anda akan mendonasikan <strong>Rp${nominal.toLocaleString()}</strong> ke <strong>${selected.nama}</strong>. Lanjutkan?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya, Donasi!',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#16a34a',
      cancelButtonColor: '#d1d5db'
    });

    if (!confirm.isConfirmed) return;

    try {
      setLoading(true);
      await fetchDonasi(nominal);
      Swal.fire({
        icon: 'success',
        title: 'Donasi Berhasil',
        text: `Donasi Rp${nominal.toLocaleString()} ke ${selected.nama} berhasil!`,
        confirmButtonColor: '#16a34a'
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal Donasi',
        text: err?.response?.data?.message || 'Terjadi kesalahan saat mengirim donasi.',
        confirmButtonColor: '#dc2626'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-6">💝 Donasi ke Lembaga</h1>

      <div className="grid gap-4 mb-8">
        {LEMBAGAS.map((lembaga) => (
          <div
            key={lembaga.id}
            onClick={() => setSelected(lembaga)}
            className={`cursor-pointer flex items-center gap-4 p-4 rounded-lg shadow transition-all duration-300 border-l-4 
              ${selected?.id === lembaga.id ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:bg-gray-50'}`}
          >
            <FaHeart className={`text-2xl transition-transform duration-200 ${selected?.id === lembaga.id ? 'text-red-500 scale-110' : 'text-gray-400'}`} />
            <div>
              <h3 className="text-lg font-semibold">{lembaga.nama}</h3>
              <p className="text-sm text-gray-500">Klik untuk memilih lembaga ini</p>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <FaDonate className="text-green-600 text-xl" />
            <h2 className="text-xl font-bold">Donasi ke: {selected.nama}</h2>
          </div>
          <p className="text-gray-700 mb-4">Pilih nominal donasi:</p>
          <div className="flex flex-wrap gap-3">
            {NOMINALS.map((nominal) => (
              <button
                key={nominal}
                disabled={loading}
                onClick={() => handleDonasi(nominal)}
                className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-5 rounded-full transition disabled:opacity-50"
              >
                {loading ? (
                  <PiSpinnerGapBold className="animate-spin mr-2 text-lg" />
                ) : null}
                Rp{nominal.toLocaleString()}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Donasi;

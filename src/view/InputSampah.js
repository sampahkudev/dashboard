import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { FaWeightHanging, FaRecycle, FaMoneyBillWave } from 'react-icons/fa';
import { postSampah } from '../utils/apiService';
import Token from '../config/Token';

const jenisOptions = {
  Plastik: 1000,
  Besi: 1500,
  'Pecah Belah': 3000,
};

const FormSampah = () => {
  const [formData, setFormData] = useState({
    berat: '',
    jenis_sampah: '',
    rate_berat: '',
    nominal: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (formData.jenis_sampah && formData.berat) {
      const rate = jenisOptions[formData.jenis_sampah] || 0;
      const total = rate * parseFloat(formData.berat || 0);
      setFormData((prev) => ({
        ...prev,
        rate_berat: rate,
        nominal: total,
      }));
    }
  }, [formData.jenis_sampah, formData.berat]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "berat" && parseFloat(value) < 0) return;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await postSampah(formData, Token);

      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        html: `Data berhasil disimpan!<br /><strong>Kode Transaksi:</strong> ${response.data?.dataid || 'N/A'}`,
      });

      setFormData({
        berat: '',
        jenis_sampah: '',
        rate_berat: '',
        nominal: '',
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: 'Gagal menyimpan data, coba lagi.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-green-700 text-center mb-6">🧾 Setor Sampah</h2>
        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700">Berat Sampah (kg)</label>
            <div className="flex items-center border rounded-md shadow-sm focus-within:ring-2 focus-within:ring-green-400">
              <span className="px-3 text-green-600">
                <FaWeightHanging />
              </span>
              <input
                type="number"
                name="berat"
                value={formData.berat}
                onChange={handleChange}
                required
                placeholder="Contoh: 2"
                className="w-full py-2 px-3 outline-none rounded-r-md"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700">Jenis Sampah</label>
            <div className="flex items-center border rounded-md shadow-sm focus-within:ring-2 focus-within:ring-green-400">
              <span className="px-3 text-green-600">
                <FaRecycle />
              </span>
              <select
                name="jenis_sampah"
                value={formData.jenis_sampah}
                onChange={handleChange}
                required
                className="w-full py-2 px-3 outline-none rounded-r-md bg-white"
              >
                <option value="">-- Pilih Jenis --</option>
                {Object.keys(jenisOptions).map((jenis) => (
                  <option key={jenis} value={jenis}>{jenis}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700">Rate per Kg (Rp)</label>
            <input
              type="number"
              name="rate_berat"
              value={formData.rate_berat}
              readOnly
              className="w-full py-2 px-3 border bg-gray-100 rounded-md"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700">Total (Rp)</label>
            <div className="flex items-center border rounded-md bg-gray-100">
              <span className="px-3 text-green-600">
                <FaMoneyBillWave />
              </span>
              <input
                type="number"
                name="nominal"
                value={formData.nominal}
                readOnly
                className="w-full py-2 px-3 outline-none bg-gray-100"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition"
          >
            {isSubmitting ? 'Menyimpan...' : 'Setor Sekarang'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormSampah;

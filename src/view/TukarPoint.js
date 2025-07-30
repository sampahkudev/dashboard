import React, { useState } from "react";
import Swal from "sweetalert2";
import { fetchTukarPoint } from "../utils/apiService";
import { Gift, ArrowRightLeft } from "lucide-react";

const OPTIONS = [
  { tipe: 2, label: "Pulsa", list: [100, 200, 300] },
  { tipe: 1, label: "Listrik", list: [100, 200, 300] },
  { tipe: 0, label: "Saldo", list: [100, 200, 300] },
];

const convertToValue = (poin) => {
  switch (poin) {
    case 100: return 5000;
    case 200: return 10000;
    case 300: return 20000;
    default: return 0;
  }
};

const TukarPoint = () => {
  const [selectedTipe, setSelectedTipe] = useState(2);
  const [selectedJumlah, setSelectedJumlah] = useState(100);

  const handleTukar = async () => {
    try {
      await fetchTukarPoint(selectedTipe, selectedJumlah);
      Swal.fire({
        icon: "success",
        title: "Penukaran Berhasil",
        html: `🎉 Kamu menukar <strong>${selectedJumlah} poin</strong> menjadi 
          <strong>Rp ${convertToValue(selectedJumlah).toLocaleString()}</strong> 
          untuk <strong>${OPTIONS.find(o => o.tipe === selectedTipe).label}</strong>.`,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Penukaran Gagal",
        text: err.response?.data?.message || "Terjadi kesalahan saat menukar poin.",
      });
    }
  };

  const currentOption = OPTIONS.find((opt) => opt.tipe === selectedTipe);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-xl border">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Gift className="w-6 h-6 text-green-600" />
        <h2 className="text-xl font-bold text-center text-gray-800">
          Penukaran Poin
        </h2>
      </div>

      <label className="block mb-2 text-gray-700 font-medium">Tipe Penukaran:</label>
      <select
        value={selectedTipe}
        onChange={(e) => setSelectedTipe(Number(e.target.value))}
        className="w-full mb-4 border px-4 py-2 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 transition"
      >
        {OPTIONS.map((opt) => (
          <option key={opt.tipe} value={opt.tipe}>{opt.label}</option>
        ))}
      </select>

      <label className="block mb-2 text-gray-700 font-medium">Jumlah Poin:</label>
      <div className="grid grid-cols-3 gap-3 mb-4">
        {currentOption?.list.map((poin) => (
          <button
            key={poin}
            type="button"
            onClick={() => setSelectedJumlah(poin)}
            className={`py-2 rounded-md border text-sm font-semibold transition 
              ${
                selectedJumlah === poin
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white text-gray-800 hover:bg-green-50"
              }`}
          >
            {poin} Poin
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between px-3 py-2 mb-4 bg-gray-100 rounded-md">
        <span className="font-medium text-gray-700">Dapat:</span>
        <span className="font-bold text-green-700">
          Rp {convertToValue(selectedJumlah).toLocaleString()}
        </span>
      </div>

      <button
        onClick={handleTukar}
        className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-green-700 transition"
      >
        <ArrowRightLeft className="w-5 h-5" />
        Tukar Sekarang
      </button>
    </div>
  );
};

export default TukarPoint;

import React, { useEffect, useState } from 'react';
import {
  FaCoins,
  FaLeaf,
  FaArrowDown,
  FaArrowUp,
  FaHandHoldingHeart,
  FaExchangeAlt,
} from 'react-icons/fa';
import { fetchSaldoHistory, fetchPointHistory } from '../utils/apiService';

function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function NotifSampah() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const [saldo, poin] = await Promise.all([
          fetchSaldoHistory(),
          fetchPointHistory(),
        ]);

        const merged = [
          ...saldo.map((item) => ({ ...item, source: 'saldo' })),
          ...poin.map((item) => ({ ...item, source: 'poin' })),
        ];

        const sorted = merged.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );

        setLogs(sorted);
      } catch (error) {
        console.error('Gagal mengambil data log:', error);
      }
      setLoading(false);
    };

    loadLogs();
  }, []);

const renderMessage = (log) => {
  if (log.source === 'saldo') {
    switch (log.tipe) {
      case 'setoran':
        return `Setoran saldo sebesar Rp${log.jumlah.toLocaleString()}`;
      case 'penarikan':
        return `Penarikan saldo sebesar Rp${log.jumlah.toLocaleString()}`;
      case 'donasi':
        return `Donasi sebesar Rp${log.jumlah.toLocaleString()} telah dikirim`;
      default:
        return `Saldo: Rp${log.jumlah.toLocaleString()}`;
    }
  } else if (log.source === 'poin') {
    if (log.tipe === 'exchange') {
      // Ambil informasi terakhir dari log.keterangan, misalnya "Penukaran poin menjadi pulsa"
      const tujuan = log.keterangan?.split('menjadi')[1]?.trim();
      return `Poin ${log.jumlah} telah ditukar menjadi ${tujuan}`;
    }
    return `Kamu mendapat ${log.jumlah} poin baru`;
  }
  return '';
};


  const renderIcon = (log) => {
    if (log.source === 'saldo') {
      switch (log.tipe) {
        case 'setoran':
          return <FaArrowDown className="text-green-600" />;
        case 'penarikan':
          return <FaArrowUp className="text-red-500" />;
        case 'donasi':
          return <FaHandHoldingHeart className="text-pink-600" />;
        default:
          return <FaCoins />;
      }
    } else if (log.source === 'poin') {
      return log.tipe === 'exchange' ? (
        <FaExchangeAlt className="text-yellow-600" />
      ) : (
        <FaLeaf className="text-green-500" />
      );
    }
    return <FaCoins />;
  };

  return (
    <div className="my-6">
      <h1 className="text-2xl font-bold mb-4">Riwayat Notifikasi</h1>
      <div className="max-h-[630px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
        {loading ? (
          <p>Memuat notifikasi...</p>
        ) : logs.length === 0 ? (
          <p className="text-gray-500">Belum ada log.</p>
        ) : (
          <ul className="space-y-3">
            {logs.map((log) => (
              <li
                key={log.log_id}
                className="p-4 bg-white shadow-md rounded-xl border-l-4 border-green-400 flex items-start space-x-3"
              >
                <div className="mt-1">{renderIcon(log)}</div>
                <div>
                  <p className="text-gray-800">{renderMessage(log)}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(log.timestamp)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default NotifSampah;

import axios from 'axios';
import getToken from '../config/Token'; // Pastikan ini adalah fungsi, bukan nilai

const baseAPIURL = 'https://api.sampahku.herobuxx.me';

const mySaldo = `${baseAPIURL}/api/protected/saldo`;
const myPoint = `${baseAPIURL}/api/protected/point`;
const mySampah = `${baseAPIURL}/api/protected/sampah`;
const myLogSaldo = `${baseAPIURL}/api/protected/history/saldo`;
const myLogPoint = `${baseAPIURL}/api/protected/history/point`;
const myExcPoint = `${myPoint}/tukar`;
const myDonasi = `${baseAPIURL}/api/protected/donasi`;
const myProfile = `${baseAPIURL}/api/protected/profile`;

export const fetchSaldo = async () => {
  try {
    const token = getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axios.get(mySaldo, { headers });
    
    // Langsung return nilai saldo saja
    return response.data.data.saldo;
  } catch (error) {
    console.error('Error fetching saldo:', error);
    throw error;
  }
};

export const fetchPoint = async () => {
  try {
    const token = getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axios.get(myPoint, { headers });

    return response.data.data.point; // ✅ sesuai JSON kamu
  } catch (error) {
    console.error('Error fetching point:', error);
    throw error;
  }
};

export const fetchLatestSampah = async () => {
  try {
    const token = getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await axios.get(mySampah, { headers });

    const data = response.data.data;

    // Urutkan berdasarkan tanggal_setor terbaru
    const sorted = data.sort((a, b) => new Date(b.tanggal_setor) - new Date(a.tanggal_setor));

    // Ambil data pertama (paling baru)
    return sorted[0];
  } catch (error) {
    console.error("Error fetching latest sampah:", error);
    throw error;
  }
};

export const requestCashout = async (jumlah) => {
  try {
    const token = getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await axios.post(
      `${mySaldo}/tarik`,
      { jumlah }, // ← kirim jumlah saldo yang ditarik
      { headers }
    );

    return response.data.data.kode; // Ambil kode dari respons
  } catch (error) {
    console.error('❌ Error during cashout:', error);
    throw error;
  }
};

export const postSampah = async ({ berat, nominal, rate_berat, jenis_sampah }) => {
  try {
    const token = getToken();
    const response = await axios.post(mySampah,
      {
        berat: parseFloat(berat),
        nominal: parseFloat(nominal),
        rate_berat: parseFloat(rate_berat),
        jenis_sampah,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('❌ Gagal mengirim data sampah:', error);
    throw error;
  }
};

export const fetchSaldoHistory = async () => {
  try {
    const token = getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await axios.get(myLogSaldo, { headers });
    const data = response.data.data;

    // Urutkan dari yang terbaru
    const sorted = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return sorted;
  } catch (error) {
    console.error("❌ Gagal mengambil histori saldo:", error);
    throw error;
  }
};

export const fetchPointHistory = async () => {
  try {
    const token = getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    
    const response = await axios.get(myLogPoint, { headers });
    const data = response.data.data;

    const sorted = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return sorted;
  } catch (error) {
    console.error("❌ Gagal mengambil histori poin:", error);
    throw error;
  }
};

export const fetchTukarPoint = async (tipe, jumlah) => {
  try {
    const token = getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await axios.post(
      myExcPoint,
      {
        tipe,   // 0 = Saldo, 1 = Listrik, 2 = Pulsa
        jumlah, // Jumlah poin yang ditukar
      },
      { headers }
    );

    return response.data; // bisa akses response.data.message atau lainnya
  } catch (error) {
    console.error('Error saat menukar poin:', error);
    throw error;
  }
};

export const fetchDonasi = async (jumlah) => {
  try {
    const token = getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    
    const response = await axios.post(myDonasi, { jumlah }, { headers });
    
    return response.data; // bisa sesuaikan sesuai respons backend
  } catch (error) {
    console.error('Error saat mengirim donasi:', error);
    throw error;
  }
};

export const fetchUserProfile = async () => {
  try {
    const token = getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await axios.get(myProfile, { headers });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching user info:', error);
    throw error;
  }
};
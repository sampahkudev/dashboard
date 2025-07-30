// App.js
import React, { useState, useEffect } from 'react';
import './style/App.css';
import Sidebar from './utils/Sidebar';
import FormSampah from './view/InputSampah';
import NotifSampah from './view/NotifSampah';
import TukarPoint from './view/TukarPoint';
import Donasi from './view/Donasi';
import Profile from './view/Profile';
import TarikSaldo from './view/TarikSaldo';
import { fetchSaldo, fetchUserProfile, fetchPoint, fetchLatestSampah } from './utils/apiService';

function App() {
  const [selectedView, setSelectedView] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saldo, setSaldo] = useState(0);
  const [nama, setNama] = useState('');
  const [point, setPoint] = useState(0);
  const [latestSampah, setLatestSampah] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        if (selectedView === 'home') {
          const saldoRes = await fetchSaldo();
          setSaldo(saldoRes);

          const profile = await fetchUserProfile();
          setNama(profile.nama);;
         
          const pointRes = await fetchPoint();
          setPoint(pointRes); // ✅ simpan point

          const sampahRes = await fetchLatestSampah();
          setLatestSampah(sampahRes);

        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
      setLoading(false);
    };

    loadData();
  }, [selectedView]);

  const handleReturnHome = () => {
    setSelectedView('home');
  };

  const handleViewChange = (view) => {
    setIsAnimating(true);
    setTimeout(() => {
      setSelectedView(view);
    }, 150);
  };

  return (
    <div className="app">
      <button
        className="toggle-sidebar-btn"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? (
          <span className="material-icons text-base">close</span>
        ) : (
          <span className="material-icons text-base">menu</span>
        )}
      </button>

      <div className={isSidebarOpen ? 'sidebar-container open' : 'sidebar-container'}>
        <Sidebar
          onSelect={handleViewChange}
          setIsSidebarOpen={setIsSidebarOpen}
          selectedView={selectedView}
        />
      </div>

      <div
        className={`main-content px-8 ${isAnimating ? 'fade-out' : 'fade-in'}`}
        onTransitionEnd={() => setIsAnimating(false)}
      >
        {loading ? (
          <div className="loading-spinner">
            <svg
              className="spinner-frame"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 100"
              preserveAspectRatio="xMidYMid"
              width="200"
              height="200"
              style={{
                shapeRendering: 'auto',
                display: 'block',
              }}
            >
              <g>
                <path
                  stroke="none"
                  fill="#003366"
                  d="M10 50A40 40 0 0 0 90 50A40 42 0 0 1 10 50"
                >
                  <animateTransform
                    values="0 50 51;360 50 51"
                    keyTimes="0;1"
                    repeatCount="indefinite"
                    dur="0.75s"
                    type="rotate"
                    attributeName="transform"
                  ></animateTransform>
                </path>
              </g>
            </svg>
          </div>
        ) : (
          <>
            {selectedView === 'home' && (
              <>
                {/* Header */}
                <div className="my-4 py-6 animate-fadeInUp">
                  <h1 className="text-3xl font-bold text-green-800 tracking-wide">🌿 DASHBOARD</h1>
                </div>

                {/* Welcome Card */}
                <div className="my-6 p-6 rounded-2xl shadow-xl bg-gradient-to-br from-green-100 to-white border border-green-200 transition hover:shadow-2xl">
                  <h1 className="text-2xl font-extrabold text-green-900 mb-2">Selamat datang, {nama} 👋</h1>
                  <p className="text-gray-700">Terima kasih telah berkontribusi menjaga lingkungan! 🌱💚</p>
                </div>

                {/* Informasi Utama */}
                <div className="my-6 grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">

                  {/* Saldo dan Poin */}
                  <div className="p-6 bg-white shadow-md rounded-xl border-l-4 border-green-500 relative overflow-hidden group transition hover:shadow-xl">
                    <div className="absolute right-3 top-3 text-green-200 text-4xl group-hover:text-green-300 transition">💰</div>
                    <p className="text-2xl font-semibold text-green-700">Saldo Anda</p>
                    <p className="text-3xl font-bold text-green-900 mb-1">Rp {saldo?.toLocaleString('id-ID')}</p>
                    <p className="text-sm text-gray-500">Poin Anda: <strong>{point}</strong></p>
                    <button
                      onClick={() => handleViewChange('TarikSaldo')}
                      className="mt-4 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-full transition duration-200"
                    >
                      Tarik Saldo
                    </button>
                  </div>

                  {/* Setoran Terakhir */}
                  <div className="p-6 bg-white shadow-md rounded-xl border-l-4 border-yellow-500 relative overflow-hidden group transition hover:shadow-xl">
                    <div className="absolute right-3 top-3 text-yellow-300 text-4xl group-hover:text-yellow-400 transition">♻️</div>
                    <h2 className="text-xl font-semibold text-yellow-700 mb-2">Setoran Terakhir</h2>
                    {latestSampah ? (
                      <>
                        <p className="text-md text-gray-800">
                          <strong>{latestSampah.jenis_sampah}</strong> - {latestSampah.berat} kg
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Tanggal: {new Date(latestSampah.tanggal_setor).toLocaleDateString('id-ID', {
                            day: 'numeric', month: 'long', year: 'numeric'
                          })}
                        </p>
                      </>
                    ) : (
                      <p className="text-gray-500 text-sm italic">Belum ada data setoran</p>
                    )}
                  </div>
                </div>

                {/* Call to Action */}
                <div className="my-8 p-6 bg-gradient-to-r from-green-200 via-green-100 to-white rounded-2xl text-center shadow-lg animate-fadeInUp">
                  <h2 className="text-2xl font-bold text-green-900 mb-2">Yuk, Setor Sampahmu Hari Ini!</h2>
                  <p className="text-gray-700 mb-4">
                    Kurangi limbah, bantu bumi, dan kumpulkan poin setiap kali kamu menyetor sampah ke bank sampah.
                  </p>
                  <button
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-full shadow-md transition duration-200"
                    onClick={() => handleViewChange('FormSampah')}
                  >
                    🚮 Setor Sekarang
                  </button>
                </div>
              </>

            )}
            {selectedView === 'FormSampah' && (
              <div className="my-4">
                <FormSampah onProjectCreated={handleReturnHome} />
              </div>
            )}
            {selectedView === 'Profile' && (
              <div className="my-4">
                <Profile />
              </div>
            )}
            {selectedView === 'TukarPoint' && (
              <div className="my-4">
                <TukarPoint />
              </div>
            )}
            {selectedView === 'Donasi' && (
              <div className="my-4">
                <Donasi />
              </div>
            )}
            {selectedView === 'TarikSaldo' && (
              <div className="my-4">
                <TarikSaldo />
              </div>
            )}
            {selectedView === 'NotifSampah' && (
              <div className="my-4">
                <NotifSampah />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;

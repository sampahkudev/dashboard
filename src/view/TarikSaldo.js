import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { PiSpinnerGapBold } from 'react-icons/pi';
import { FaMoneyBillWave } from 'react-icons/fa';
import { requestCashout, fetchSaldo } from '../utils/apiService';

const NOMINALS = [20000, 50000, 100000];

function TarikSaldo() {
    const [saldo, setSaldo] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        ambilSaldo();
    }, []);

    const ambilSaldo = async () => {
        try {
            const saldoBaru = await fetchSaldo(); // fetchSaldo return angka
            setSaldo(saldoBaru);
        } catch (err) {
            Swal.fire('Gagal', 'Tidak bisa mengambil saldo saat ini.', 'error');
        }
    };

    const handleTarik = async (jumlah) => {
        if (jumlah > saldo) {
            Swal.fire('Saldo Kurang', `Saldo Anda hanya Rp${saldo.toLocaleString()}`, 'warning');
            return;
        }

        const konfirmasi = await Swal.fire({
            title: 'Konfirmasi Penarikan',
            html: `Anda yakin ingin menarik <strong>Rp${jumlah.toLocaleString()}</strong>?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, Tarik!',
            cancelButtonText: 'Batal',
            confirmButtonColor: '#16a34a',
            cancelButtonColor: '#d1d5db'
        });

        if (!konfirmasi.isConfirmed) return;

        try {
            setLoading(true);
            const kodePenarikan = await requestCashout(jumlah); // langsung kirim jumlah
            Swal.fire(
                'Berhasil',
                `Rp${jumlah.toLocaleString()} telah ditarik.<br />Kode Penarikan: <strong>${kodePenarikan}</strong>`,
                'success'
            );
            ambilSaldo();
        } catch (err) {
            Swal.fire('Gagal', 'Terjadi kesalahan saat penarikan.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6">
            <h1 className="text-2xl font-bold text-center mb-4">Tarik Saldo</h1>

            <div className="bg-white p-5 rounded-xl shadow-md border mb-6">
                <div className="flex items-center gap-3 mb-2">
                    <FaMoneyBillWave className="text-green-600 text-2xl" />
                    <h2 className="text-xl font-semibold">Saldo Anda</h2>
                </div>
                <p className="text-3xl font-bold text-green-700">
                    Rp{typeof saldo === 'number' ? saldo.toLocaleString() : '0'}
                </p>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-md border">
                <h3 className="text-lg font-semibold mb-3 text-gray-700">Pilih Nominal Penarikan</h3>
                <div className="flex flex-wrap gap-4 mb-4">
                    {NOMINALS.map((nominal) => (
                        <button
                            key={nominal}
                            onClick={() => handleTarik(nominal)}
                            disabled={loading}
                            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-full transition disabled:opacity-50"
                        >
                            {loading ? <PiSpinnerGapBold className="animate-spin inline mr-2" /> : null}
                            Rp{nominal.toLocaleString()}
                        </button>
                    ))}
                </div>

                <hr className="my-4" />

                <button
                    onClick={() => handleTarik(saldo)}
                    disabled={loading || saldo === 0}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-5 py-3 rounded-full transition disabled:opacity-50"
                >
                    {loading ? <PiSpinnerGapBold className="animate-spin inline mr-2" /> : null}
                    Tarik Semua Saldo
                </button>
            </div>
        </div>
    );
}

export default TarikSaldo;

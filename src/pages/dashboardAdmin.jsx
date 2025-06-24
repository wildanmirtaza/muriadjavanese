import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import backgroundpc from "../assets/backgroundpc.png";
import backgroundhp from "../assets/backgroundhp.png";
import { message } from "antd";
import backgroundpc2 from "../assets/backgroundpc2.png";
import backgroundhp2 from "../assets/backgroundhp2.png";
import { MdQrCodeScanner } from 'react-icons/md';
import { TbChecklist } from 'react-icons/tb';
import { LuClipboardList } from 'react-icons/lu';
import { IoPeopleSharp } from 'react-icons/io5';
import { FiPlus } from 'react-icons/fi';
import { IoIosSend } from 'react-icons/io';
import { RxCross2 } from 'react-icons/rx';
import { v4 as uuidv4 } from 'uuid';

const AdminGuestList = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");

    const checkPassword = async () => {
        try {
            const response = await fetch('https://rakevserver.space/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
            });

            const data = await response.json();

            if (response.status === 200) {
                console.log("Login berhasil!");
                messageApi.success('Login berhasil!');
                localStorage.setItem('token', data.token);
                setIsAuthenticated(true);
            } else {
                messageApi.error('Login gagal!');
                console.error(data.message);
            }
        } catch (error) {
            console.error("Terjadi kesalahan:", error);
        }
    };



    const [messageApi, contextHolder] = message.useMessage();
    const [guests, setGuests] = useState([]);
    const [dataReservasi, setDataReservasi] = useState([]);
    const [dataKehadiran, setDataKehadiran] = useState([]);
    const [isEdited, setIsEdited] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState("Daftar Tamu");

    const fetchGuests = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token tidak ditemukan. Silakan login kembali.');
            return;
        }

        try {
            const response = await fetch('https://rakevserver.space/tamu', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 401) {
                console.error('Token tidak valid atau kedaluwarsa.');
            }

            const data = await response.json();
            setGuests(data);
        } catch (error) {
            console.error('Error fetching guests:', error);
        }
    };

    const fetchDataReservasi = async () => {

        try {
            const response = await fetch('https://rakevserver.space/reservasi', {
                method: 'GET',
            });

            if (response.status === 401) {
                console.error('Token tidak valid atau kedaluwarsa.');
            }

            const data = await response.json();
            setDataReservasi(data);
        } catch (error) {
            console.error('Error fetching guests:', error);
        }
    };


    useEffect(() => {
        fetchGuests();
        fetchDataReservasi();
    }, []);


    const addGuestRow = () => {
        setIsEdited(true);
        setGuests((prevGuests) => [
            ...prevGuests,
            { tempId: uuidv4(), name: '', table: '', link: '' }
        ]);
    };

    const updateGuestData = (id, field, value) => {
        setIsEdited(true);
        setGuests((prev) =>
            prev.map((guest) =>
                (guest._id === id || guest.tempId === id)
                    ? { ...guest, [field]: value }
                    : guest
            )
        );
    };



    const saveChanges = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            messageApi.error('Token tidak ditemukan. Silakan login kembali.');
            return;
        }

        try {
            const response = await fetch('https://rakevserver.space/tamu', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(guests),
            });

            if (!response.ok) {
                throw new Error('Failed to save changes');
            }

            const result = await response.json();
            console.log('Bulk update successful:', result);
            messageApi.success('Perubahan berhasil disimpan!');
            setIsEdited(false);
        } catch (error) {
            console.error('Error saving changes:', error);
            messageApi.error('Terjadi kesalahan saat menyimpan perubahan.');
        }
    };


    const cancelChanges = async () => {
        setIsEdited(false);
        fetchGuests();
    };


    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkScreenSize();
        window.addEventListener("resize", checkScreenSize);
        return () => window.removeEventListener("resize", checkScreenSize);
    }, []);

    const generateLink = (name) => {
        return name ? btoa(name.trim()) : '';
    };


    return !isAuthenticated ? (
        <div>
            {contextHolder}
            <div
                className="relative h-screen w-screen overflow-hidden text-white font-sriracha"
                style={{
                    backgroundImage: `url(${isMobile ? backgroundhp2 : backgroundpc2})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="flex items-center justify-center h-screen">
                    <div className="p-8 bg-yellow-800/20 border-1 border-yellow-400 text-white rounded-lg shadow-lg max-w-sm w-full">
                        <h2 className="mb-4 text-3xl font-bold text-center text-yellow-400">Login</h2>
                        <p className="mb-4 text-sm text-center text-gray-300">Silakan masukkan password untuk mengakses halaman ini.</p>
                        <input
                            type="password"
                            className="w-full p-3 mb-4 text-gray-200 rounded-lg border-1 border-yellow-500 focus:outline-none focus:ring focus:ring-yellow-500"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            onClick={checkPassword}
                            className="w-full px-4 py-3 font-bold text-white bg-yellow-500/70 border-2 border-yellow-500 cursor-pointer rounded-lg shadow hover:bg-yellow-600 focus:outline-none focus:ring focus:ring-yellow-500"
                        >
                            Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <>
            {contextHolder}

            <div
                className="relative h-screen w-screen overflow-hidden text-white font-sriracha"
                style={{
                    backgroundImage: `url(${isMobile ? backgroundhp2 : backgroundpc2})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <motion.img
                    src={isMobile ? backgroundhp : backgroundpc}
                    alt="Background"
                    className="absolute inset-0 w-full h-auto object-cover opacity-75 pointer-events-none"
                    initial={{ scale: 1.2 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                />
                <div className="p-6 bg-gradient-to-l from-yellow-900/20 to-yellow-800/20 text-white font-sriracha rounded-xl shadow-lg max-w-4xl mx-auto mt-10 z-20 border-1 border-yellow-400">
                    <h1 className="text-3xl font-bold text-yellow-400 text-center mb-6">{selectedMenu}</h1>
                    {selectedMenu === "Daftar Tamu" && (
                        guests.length > 0 ? (
                            <div className="overflow-x-hidden">
                                <div className="max-h-[70vh] overflow-y-auto">
                                    <table className="w-full text-left border-collapse table-fixed">
                                        <thead>
                                            <tr>
                                                <th className="px-4 py-2 border-b w-[10%]">No</th>
                                                <th className="px-4 py-2 border-b w-[40%]">Nama Tamu</th>
                                                <th className="px-4 py-2 border-b w-[20%]">Nomor Meja</th>
                                                <th className="px-4 py-2 border-b w-[30%]">Link Undangan</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {guests.map((guest, index) => (
                                                <tr key={guest._id || guest.tempId}>
                                                    <td className="px-4 py-2 border-b">{index + 1}</td>
                                                    <td className="px-4 py-2 border-b">
                                                        <input
                                                            type="text"
                                                            value={guest.name}
                                                            onChange={(e) =>
                                                                updateGuestData(guest._id || guest.tempId, 'name', e.target.value)
                                                            }
                                                            placeholder="Nama Tamu"
                                                            className="w-full px-2 bg-transparent focus:outline-none"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-2 border-b">
                                                        <input
                                                            type="text"
                                                            value={guest.table}
                                                            onChange={(e) =>
                                                                updateGuestData(guest._id || guest.tempId, 'table', e.target.value)
                                                            }
                                                            placeholder="Nomor"
                                                            className="w-full px-2 bg-transparent focus:outline-none"
                                                        />
                                                    </td>
                                                    <td
                                                        className="px-4 py-2 border-b cursor-copy overflow-hidden whitespace-nowrap text-ellipsis"
                                                        onClick={() => {
                                                            const link = `https://muria-d-javanese.vercel.app/${generateLink(guest.name)}`;
                                                            navigator.clipboard.writeText(link);
                                                            messageApi.success('Link berhasil disalin!');
                                                        }}
                                                    >
                                                        {generateLink(guest.name)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>

                                    </table>
                                </div>
                            </div>





                        ) : (
                            <p className="text-center text-gray-300 mt-4">Belum ada tamu yang ditambahkan.</p>
                        ))}

                    {selectedMenu === "Reservasi" && (
                        dataReservasi.length > 0 ? (
                            <div className="overflow-x-hidden">
                                <div className="max-h-[70vh] overflow-y-auto">
                                    <table className="w-full text-left border-collapse table-fixed">
                                        <thead>
                                            <tr>
                                                <th className="px-4 py-2 border-b w-[10%]">No</th>
                                                <th className="px-4 py-2 border-b w-[40%]">Nama Tamu</th>
                                                <th className="px-4 py-2 border-b w-[20%]">Jumlah Tamu</th>
                                                <th className="px-4 py-2 border-b w-[30%]">Kehadiran</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {dataReservasi.map((guest, index) => (
                                                <tr key={guest.id}>
                                                    <td className="px-4 py-2 border-b">{index + 1}</td>
                                                    <td className="px-4 py-2 border-b">
                                                        <input
                                                            type="text"
                                                            value={guest.name}
                                                            placeholder="Nama Tamu"
                                                            className="w-full px-2 bg-transparent focus:outline-none"
                                                            readOnly
                                                        />
                                                    </td>
                                                    <td className="px-4 py-2 border-b">
                                                        <input
                                                            type="text"
                                                            value={guest.guestCount}
                                                            placeholder="Nomor"
                                                            className="w-full px-2 bg-transparent focus:outline-none"
                                                            readOnly
                                                        />
                                                    </td>
                                                    <td
                                                        className="px-4 py-2 border-b cursor-copy overflow-hidden whitespace-nowrap text-ellipsis"
                                                    >
                                                        <input
                                                            type="text"
                                                            value={guest.attendance}
                                                            placeholder="Nomor"
                                                            className="w-full px-2 bg-transparent focus:outline-none"
                                                            readOnly
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>





                        ) : (
                            <p className="text-center text-gray-300 mt-4">Belum ada data reservasi.</p>
                        ))}

                    {selectedMenu === "Kehadiran" && (
                        dataKehadiran.length > 0 ? (
                            <div className="overflow-x-hidden">
                                <div className="max-h-[70vh] overflow-y-auto">
                                    <table className="w-full text-left border-collapse table-fixed">
                                        <thead>
                                            <tr>
                                                <th className="px-4 py-2 border-b w-[10%]">No</th>
                                                <th className="px-4 py-2 border-b w-[40%]">Nama Tamu</th>
                                                <th className="px-4 py-2 border-b w-[20%]">Jumlah Tamu</th>
                                                <th className="px-4 py-2 border-b w-[30%]">Waktu</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {dataKehadiran.map((guest, index) => (
                                                <tr key={guest.id}>
                                                    <td className="px-4 py-2 border-b">{index + 1}</td>
                                                    <td className="px-4 py-2 border-b">
                                                        <input
                                                            type="text"
                                                            value={guest.name}
                                                            onChange={(e) => updateGuestData(guest.id, 'name', e.target.value)}
                                                            placeholder="Nama Tamu"
                                                            className="w-full px-2 bg-transparent focus:outline-none"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-2 border-b">
                                                        <input
                                                            type="text"
                                                            value={guest.table}
                                                            onChange={(e) => updateGuestData(guest.id, 'table', e.target.value)}
                                                            placeholder="Nomor"
                                                            className="w-full px-2 bg-transparent focus:outline-none"
                                                        />
                                                    </td>
                                                    <td
                                                        className="px-4 py-2 border-b cursor-copy overflow-hidden whitespace-nowrap text-ellipsis"
                                                        onClick={() => {
                                                            const link = `https://muria-d-javanese.vercel.app/${generateLink(guest.name)}`;
                                                            navigator.clipboard.writeText(link);
                                                            messageApi.success("Link berhasil disalin!");
                                                        }}
                                                    >
                                                        {generateLink(guest.name)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>





                        ) : (
                            <p className="text-center text-gray-300 mt-4">Belum ada data kehadiran.</p>
                        ))}

                    <div className="fixed bottom-4 left-4">
                        <button
                            onClick={() => setSelectedMenu("Kehadiran")}
                            className={`flex items-center gap-2 w-48 px-6 py-2 font-bold text-white transition-all rounded-full shadow-lg border-1 cursor-pointer ${selectedMenu === "Kehadiran"
                                ? "bg-yellow-700/85 border-yellow-500"
                                : "bg-yellow-600/70 hover:bg-yellow-700/70 border-yellow-400"
                                }`}
                        >
                            <TbChecklist className="text-2xl" /> Kehadiran
                        </button>
                    </div>

                    {/* <div className="fixed bottom-16 left-4">
                        <button
                            onClick={() => { setSelectedMenu("Scanner") }}
                            className="flex items-center gap-2 w-48 bg-yellow-600/70 hover:bg-yellow-700/70 border-1 border-yellow-400 text-white font-bold py-2 px-6 rounded-full shadow-lg transition-all"
                        >
                            <MdQrCodeScanner className="text-2xl" /> Scanner
                        </button>
                    </div> */}
                    <div className="fixed bottom-16 left-4">
                        <button
                            onClick={() => { setSelectedMenu("Reservasi") }}
                            className={`flex items-center gap-2 w-48 px-6 py-2 font-bold text-white transition-all rounded-full shadow-lg border-1 cursor-pointer ${selectedMenu === "Reservasi"
                                ? "bg-yellow-700/85 border-yellow-500"
                                : "bg-yellow-600/70 hover:bg-yellow-700/70 border-yellow-400"
                                }`}
                        >
                            <IoPeopleSharp className="text-2xl" /> Reservasi
                        </button>
                    </div>
                    <div className="fixed bottom-28 left-4">
                        <button
                            onClick={() => { setSelectedMenu("Daftar Tamu") }}
                            className={`flex items-center gap-2 w-48 px-6 py-2 font-bold text-white transition-all rounded-full shadow-lg border-1 cursor-pointer ${selectedMenu === "Daftar Tamu"
                                ? "bg-yellow-700/85 border-yellow-500"
                                : "bg-yellow-600/70 hover:bg-yellow-700/70 border-yellow-400"
                                }`}
                        >
                            <LuClipboardList className="text-2xl" /> Daftar Tamu
                        </button>
                    </div>


                    {selectedMenu === "Daftar Tamu" && (
                        <>
                            <div className="fixed bottom-4 right-4">
                                <button
                                    onClick={addGuestRow}
                                    className="flex items-center gap-2 w-32 bg-blue-600/70 hover:bg-blue-700/70 border-1 border-blue-400 text-white font-bold py-2 px-6 rounded-full shadow-lg transition-all cursor-pointer"
                                >
                                    <FiPlus /> Add
                                </button>
                            </div>
                            {isEdited && (
                                <>
                                    <div className="fixed bottom-16 right-4">
                                        <button
                                            onClick={cancelChanges}
                                            className="flex items-center gap-2 w-32 bg-red-600/70 hover:bg-red-700/70 border-1 border-red-400 text-white font-bold py-2 px-6 rounded-full shadow-lg transition-all cursor-pointer"
                                        >
                                            <RxCross2 /> Cancel
                                        </button>
                                    </div>
                                    <div className="fixed bottom-28 right-4">
                                        <button
                                            onClick={saveChanges}
                                            className="flex items-center gap-2 w-32 bg-green-600/70 hover:bg-green-700/70 border-1 border-green-400 text-white font-bold py-2 px-6 rounded-full shadow-lg transition-all cursor-pointer"
                                        >
                                            <IoIosSend /> Save
                                        </button>
                                    </div>
                                </>
                            )}
                        </>
                    )}

                </div>
            </div>

        </>
    );
};

export default AdminGuestList;

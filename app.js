const express = require('express');
const cors = require('cors'); // Import CORS
const app = express();
require('dotenv').config();
const invoiceRoutes = require('./routes/invoiceRoutes');
const authRoutes = require('./routes/authRoutes');

// Gunakan CORS untuk mengizinkan permintaan dari frontend
app.use(cors({
  origin: 'http://localhost:3000',  // Izin hanya untuk domain ini
  methods: ['GET', 'POST'],  // Hanya izinkan metode GET dan POST
}));

// Middleware untuk parse body request JSON
app.use(express.json());

// Tambahkan route test (untuk cek server)
app.get('/ping', (req, res) => {
  res.send('Server aktif');
});

// Gunakan route untuk API invoice
app.use('/api', invoiceRoutes);

// Route untuk auth (login, register)
app.use('/api/auth', authRoutes);

// Jalankan server
app.listen(5000, () => {
  console.log('Server berjalan di port 5000');
});

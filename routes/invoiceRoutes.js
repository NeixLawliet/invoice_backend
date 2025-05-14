const express = require('express');
const router = express.Router();
const { createInvoice, getInvoices, getInvoiceById } = require('../controllers/InvoiceController');
const authenticateToken = require('../middlewares/authMiddleware');

// Buat invoice
router.post('/invoices', authenticateToken, createInvoice);

// Ambil semua invoice
router.get('/invoices', authenticateToken, getInvoices);

// Ambil detail invoice tertentu
router.get('/invoices/:id', authenticateToken, getInvoiceById);

module.exports = router;

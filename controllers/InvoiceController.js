const db = require('../db');

// Fungsi untuk membuat invoice
const createInvoice = async (req, res) => {
  try {
    console.log("Request diterima:", req.body);
    
    const {
      invoice_number,
      date,
      payment_terms,
      due_date,
      po_number,
      bill_to,
      ship_to,
      total_amount,
      items,
      logo
    } = req.body;

    if (!invoice_number || !date || !payment_terms || !due_date || !bill_to) {
      return res.status(400).json({ message: 'Data tidak lengkap' });
    }

    const invoiceSql = `
      INSERT INTO invoices 
      (invoice_number, date, payment_terms, due_date, po_number, bill_to, ship_to, total_amount, logo)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const [result] = await db.query(invoiceSql, [
      invoice_number,
      date,
      payment_terms,
      due_date,
      po_number,
      bill_to,
      ship_to,
      total_amount,
      logo
    ]);

    console.log("Invoice berhasil disimpan:", result);
    const invoiceId = result.insertId;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(201).json({
        message: 'Invoice berhasil disimpan tanpa item',
        invoiceId
      });
    }

    const itemValues = items.map(item => [
      invoiceId,
      item.description,
      item.quantity,
      item.rate,
      item.amount
    ]);

    const itemSql = `INSERT INTO invoice_items (invoice_id, description, quantity, rate, amount) VALUES ?`;
    const [itemResult] = await db.query(itemSql, [itemValues]);

    res.status(201).json({
      message: 'Invoice dan item berhasil disimpan',
      invoiceId,
      itemResult
    });

  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message });
  }
};

// Fungsi untuk mengambil semua invoice
const getInvoices = async (req, res) => {
  try {
    const sql = `SELECT * FROM invoices ORDER BY date DESC`;
    const [results] = await db.query(sql);
    res.status(200).json(results);
  } catch (err) {
    console.error('Gagal mengambil data invoice:', err);
    res.status(500).json({ message: 'Gagal mengambil invoice' });
  }
};

// Fungsi untuk mengambil 1 invoice + item-itemnya
const getInvoiceById = async (req, res) => {
  try {
    const invoiceId = req.params.id;
    const invoiceSql = `SELECT * FROM invoices WHERE id = ?`;
    const itemSql = `SELECT * FROM invoice_items WHERE invoice_id = ?`;

    const [invoiceResult] = await db.query(invoiceSql, [invoiceId]);

    if (!invoiceResult || invoiceResult.length === 0) {
      return res.status(404).json({ message: 'Invoice tidak ditemukan' });
    }

    const invoice = invoiceResult[0];
    const [itemResult] = await db.query(itemSql, [invoiceId]);

    res.status(200).json({
      invoice,
      items: itemResult
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'Gagal mengambil data invoice', error: err.message });
  }
};

module.exports = {
  createInvoice,
  getInvoices,
  getInvoiceById
};

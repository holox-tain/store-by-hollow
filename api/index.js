const express = require('express');
const app = express();

app.use(express.json());

let gamesConfig = {};
let sendToProvider = async () => ({ status: false, message: 'Provider adapter offline' });

try {
  gamesConfig = require('../config/games');
  const adapter = require('../services/providerAdapter');
  sendToProvider = adapter.sendToProvider;
} catch (e) {
  console.error('Error loading modules:', e);
}

app.post('/api/validation', async (req, res) => {
  try {
    const { game, userInputs, whatsapp, productCode, paymentMethod } = req.body || {};

    if (!game || !userInputs || !whatsapp || !productCode || !paymentMethod) {
      return res.status(400).json({ success: false, message: 'Data transaksi tidak lengkap.' });
    }

    const gameKey = game.toLowerCase();
    const gameSpec = gamesConfig[gameKey];

    if (!gameSpec) {
      return res.status(400).json({ success: false, message: `Game '${game}' tidak ditemukan di konfigurasi.` });
    }

    const targetAccount = typeof gameSpec.formatTarget === 'function' 
      ? gameSpec.formatTarget(userInputs) 
      : (userInputs.userId || '');

    const providerResult = await sendToProvider(gameSpec.provider, req.body, targetAccount);

    return res.status(200).json({
      success: true,
      message: providerResult.message || 'Pesanan berhasil diproses',
      result: providerResult
    });

  } catch (err) {
    console.error('Serverless API Error:', err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan internal server: ' + err.message });
  }
});

module.exports = app;

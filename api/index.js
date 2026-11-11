const express = require('express');
const gamesConfig = require('../config/games');
const { sendToProvider } = require('../services/providerAdapter');

const app = express();
app.use(express.json());

// 1. Endpoint Konfigurasi Game (Kirim Input, Server, & Produk ke Frontend)
app.get('/api/game-config/:gameId', (req, res) => {
  const gameId = req.params.gameId ? req.params.gameId.toLowerCase() : '';
  const game = gamesConfig[gameId];

  if (!game) {
    return res.status(404).json({ success: false, message: 'Game tidak ditemukan' });
  }

  return res.json({
    success: true,
    config: {
      name: game.name,
      inputs: game.inputs,
      servers: game.servers || [],
      products: game.products
    }
  });
});

// 2. Endpoint Transaksi & Validasi
app.post('/api/validation', async (req, res) => {
  try {
    const { game, userInputs, whatsapp, productCode, paymentMethod } = req.body;

    if (!game || !userInputs || !whatsapp || !productCode || !paymentMethod) {
      return res.status(400).json({ success: false, message: 'Data transaksi tidak lengkap.' });
    }

    const gameSpec = gamesConfig[game.toLowerCase()];
    if (!gameSpec) {
      return res.status(400).json({ success: false, message: 'Game tidak didukung.' });
    }

    const targetAccount = gameSpec.formatTarget(userInputs);
    const providerResult = await sendToProvider(gameSpec.provider, req.body, targetAccount);

    return res.status(200).json({
      success: true,
      message: providerResult.message || 'Pesanan berhasil diproses',
      result: providerResult
    });

  } catch (err) {
    console.error('Serverless API Error:', err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan pada sistem Vercel Function.' });
  }
});

module.exports = app;
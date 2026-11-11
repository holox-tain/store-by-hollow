const crypto = require('crypto');

// Format Payload Provider 1: Digiflazz
function buildDigiflazzPayload(orderData, targetAccount) {
  const username = process.env.DIGIFLAZZ_USERNAME || 'demo_user';
  const apiKey = process.env.DIGIFLAZZ_KEY || 'demo_key';
  const refId = `HLW-${Date.now()}`;
  const sign = crypto.createHash('md5').update(username + apiKey + refId).digest('hex');

  return {
    url: 'https://api.digiflazz.com/v1/transaction',
    payload: {
      username: username,
      buyer_sku_code: orderData.productCode,
      customer_no: targetAccount,
      ref_id: refId,
      sign: sign
    }
  };
}

// Format Payload Provider 2: VIP Reseller
function buildVipResellerPayload(orderData, targetAccount) {
  const apiKey = process.env.VIP_KEY || 'demo_key';
  const apiSign = crypto.createHash('md5').update(process.env.VIP_ID + apiKey).digest('hex');

  return {
    url: 'https://vip-reseller.com/api/game-feature',
    payload: {
      key: apiKey,
      sign: apiSign,
      type: 'order',
      service: orderData.productCode,
      data_no: targetAccount
    }
  };
}

// Adapter Dispatcher
async function sendToProvider(providerName, orderData, targetAccount) {
  let reqConfig;

  if (providerName === 'digiflazz') {
    reqConfig = buildDigiflazzPayload(orderData, targetAccount);
  } else if (providerName === 'vip_reseller') {
    reqConfig = buildVipResellerPayload(orderData, targetAccount);
  } else {
    throw new Error(`Provider ${providerName} belum dikonfigurasi`);
  }

  /* 
  // Eksekusi API nyata ke provider:
  const res = await fetch(reqConfig.url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reqConfig.payload)
  });
  return await res.json();
  */

  // Simulasi sukses untuk testing
  return {
    status: true,
    message: `[${providerName.toUpperCase()}] Transaksi ${orderData.productCode} ke ID ${targetAccount} sukses!`
  };
}

module.exports = { sendToProvider };
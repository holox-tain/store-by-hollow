module.exports = {
  'mlbb': {
    name: 'Mobile Legends',
    provider: 'digiflazz',
    inputs: [
      { key: 'userId', type: 'number', placeholder: 'Masukkan User ID' },
      { key: 'zoneId', type: 'number', placeholder: 'Masukkan Zone ID (4-5 digit)' }
    ],
    products: [
      { code: 'ML86', name: '86 Diamonds' },
      { code: 'ML172', name: '172 Diamonds' },
      { code: 'ML257', name: '257 Diamonds' },
      { code: 'MLWDP', name: 'Weekly Pass' }
    ],
    formatTarget: (inputs) => `${inputs.userId}${inputs.zoneId || ''}`
  },

  'ff': {
    name: 'Free Fire',
    provider: 'vip_reseller',
    inputs: [
      { key: 'userId', type: 'number', placeholder: 'Masukkan Player ID' }
    ],
    products: [
      { code: 'FF50', name: '50 Diamonds' },
      { code: 'FF140', name: '140 Diamonds' },
      { code: 'FF355', name: '355 Diamonds' }
    ],
    formatTarget: (inputs) => `${inputs.userId}`
  },

  'pubg': {
    name: 'PUBG Mobile',
    provider: 'digiflazz',
    inputs: [
      { key: 'userId', type: 'number', placeholder: 'Masukkan Player ID' }
    ],
    servers: [
      { name: 'Global', value: 'global' },
      { name: 'Indonesia', value: 'id' }
    ],
    products: [
      { code: 'PUBG60', name: '60 UC' },
      { code: 'PUBG325', name: '325 UC' },
      { code: 'PUBG660', name: '660 UC' }
    ],
    formatTarget: (inputs) => `${inputs.userId}${inputs.serverId ? '|' + inputs.serverId : ''}`
  },

  'cod': {
    name: 'Call of Duty Mobile',
    provider: 'vip_reseller',
    inputs: [
      { key: 'userId', type: 'number', placeholder: 'Masukkan OpenID / User ID' }
    ],
    products: [
      { code: 'COD31', name: '31 CP' },
      { code: 'COD63', name: '63 CP' },
      { code: 'COD128', name: '128 CP' }
    ],
    formatTarget: (inputs) => `${inputs.userId}`
  },

  'gi': {
    name: 'Genshin Impact',
    provider: 'digiflazz',
    inputs: [
      { key: 'userId', type: 'number', placeholder: 'Masukkan User ID (UID)' }
    ],
    servers: [
      { name: 'Asia (os_asia)', value: 'os_asia' },
      { name: 'America (os_usa)', value: 'os_usa' },
      { name: 'Europe (os_euro)', value: 'os_euro' },
      { name: 'TW/HK/MO (os_cht)', value: 'os_cht' }
    ],
    products: [
      { code: 'GI60', name: '60 Genesis Crystals' },
      { code: 'GI300', name: '300 Genesis Crystals' },
      { code: 'GIBLESSING', name: 'Blessing of the Welkin Moon' }
    ],
    formatTarget: (inputs) => `${inputs.userId}|${inputs.serverId || 'os_asia'}`
  },

  'hi': {
    name: 'Honkai Impact 3rd',
    provider: 'digiflazz',
    inputs: [
      { key: 'userId', type: 'number', placeholder: 'Masukkan User ID (UID)' }
    ],
    servers: [
      { name: 'Asia', value: 'asia' },
      { name: 'America', value: 'america' },
      { name: 'Europe', value: 'europe' }
    ],
    products: [
      { code: 'HI65', name: '65 Crystals' },
      { code: 'HI330', name: '330 Crystals' }
    ],
    formatTarget: (inputs) => `${inputs.userId}|${inputs.serverId || 'asia'}`
  },

  'rbx': {
    name: 'Roblox',
    provider: 'vip_reseller',
    inputs: [
      { key: 'userId', type: 'text', placeholder: 'Masukkan Username / User ID Roblox' }
    ],
    products: [
      { code: 'RBX80', name: '80 Robux' },
      { code: 'RBX400', name: '400 Robux' },
      { code: 'RBX800', name: '800 Robux' }
    ],
    formatTarget: (inputs) => `${inputs.userId}`
  }
};
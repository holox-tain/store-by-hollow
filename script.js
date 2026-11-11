// 1. Banner Promo
const disc = 20;
const code = 'HOLLOW20';
const info = document.querySelector('.banner');

if (info) {
    info.innerHTML = `Dapatkan diskon <span class="disc"> ${disc}%</span> dengan kode <span class="code"><strong><i>${code}</i></strong></span>, klaim sekarang juga!`;
}

// 2. Asset & Daftar Game Utama
const BASE_CDN = "https://cdn.jsdelivr.net/gh/saranaweb/gig/asset";

const list = [
    { id: "cod", name: "Call of Duty", icon: `${BASE_CDN}/cod.jpg` },
    { id: "ff", name: "Free Fire", icon: `${BASE_CDN}/ff.png` },
    { id: "gi", name: "Genshin Impact", icon: `${BASE_CDN}/gi.png` },
    { id: "hi", name: "Honkai Impact", icon: `${BASE_CDN}/hi.png` },
    { id: "mlbb", name: "Mobile Legends", icon: `${BASE_CDN}/mlbb.png` },
    { id: "pubg", name: "PUBG Mobile", icon: `${BASE_CDN}/pubg.png` },
    { id: "rbx", name: "Roblox", icon: `${BASE_CDN}/rbx.png` }
];

// 3. Database Local Config Form & Produk (Servis Sendiri di Frontend)
const GAME_CONFIGS = {
    'mlbb': {
        name: 'Mobile Legends',
        inputs: [
            { key: 'userId', type: 'number', placeholder: 'Masukkan User ID' },
            { key: 'zoneId', type: 'number', placeholder: 'Masukkan Zone ID (4-5 digit)' }
        ],
        products: [
            { code: 'ML86', name: '86 Diamonds' },
            { code: 'ML172', name: '172 Diamonds' },
            { code: 'ML257', name: '257 Diamonds' },
            { code: 'MLWDP', name: 'Weekly Pass' }
        ]
    },
    'ff': {
        name: 'Free Fire',
        inputs: [
            { key: 'userId', type: 'number', placeholder: 'Masukkan Player ID' }
        ],
        products: [
            { code: 'FF50', name: '50 Diamonds' },
            { code: 'FF140', name: '140 Diamonds' },
            { code: 'FF355', name: '355 Diamonds' }
        ]
    },
    'pubg': {
        name: 'PUBG Mobile',
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
        ]
    },
    'cod': {
        name: 'Call of Duty Mobile',
        inputs: [
            { key: 'userId', type: 'number', placeholder: 'Masukkan OpenID / User ID' }
        ],
        products: [
            { code: 'COD31', name: '31 CP' },
            { code: 'COD63', name: '63 CP' },
            { code: 'COD128', name: '128 CP' }
        ]
    },
    'gi': {
        name: 'Genshin Impact',
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
        ]
    },
    'hi': {
        name: 'Honkai Impact 3rd',
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
        ]
    },
    'rbx': {
        name: 'Roblox',
        inputs: [
            { key: 'userId', type: 'text', placeholder: 'Masukkan Username / User ID Roblox' }
        ],
        products: [
            { code: 'RBX80', name: '80 Robux' },
            { code: 'RBX400', name: '400 Robux' },
            { code: 'RBX800', name: '800 Robux' }
        ]
    }
};

// 4. Render Katalog di index.html
const gameList = document.querySelector('#gameList');
if (gameList) {
    gameList.innerHTML = list.map(game => `
        <a href="transaction.html?game=${game.id}" class="label">
            <img src="${game.icon}" alt="${game.name}" loading="lazy">
            <span>${game.name}</span>
        </a>
    `).join("");
}

// 5. Inisialisasi Halaman Transaksi (transaction.html)
const orderLabel = document.querySelector('.order-label');
const inputFill = document.querySelector('.input');

if (orderLabel && inputFill) {
    const url = new URLSearchParams(window.location.search);
    const pickGameId = url.get('game');

    if (!pickGameId) {
        orderLabel.innerHTML = `<h1>Pilih game terlebih dahulu</h1>`;
    } else {
        const gameKey = pickGameId.toLowerCase();
        const pick = list.find(item => item.id.toLowerCase() === gameKey);

        if (pick && GAME_CONFIGS[gameKey]) {
            orderLabel.innerHTML = `<span class="label-t">Transaksi ${pick.name}</span>`;
            loadDynamicForm(gameKey);
        } else {
            orderLabel.innerHTML = `<span class="label-t">Transaksi tidak valid</span>`;
        }
    }
}

// 6. Load Form Langsung dari Config Lokal
function loadDynamicForm(gameId) {
    const config = GAME_CONFIGS[gameId];
    if (!config) {
        inputFill.innerHTML = `<p style="color:red; text-align:center;">Konfigurasi game tidak ditemukan.</p>`;
        return;
    }

    renderFormHTML(config);
    attachActiveListeners();
}

// 7. Render HTML Dinamis
function renderFormHTML(config) {
    const inputsHTML = config.inputs.map(input => `
        <input type="${input.type}" data-key="${input.key}" placeholder="${input.placeholder}" class="input-box game-input" required>
    `).join('');

    let serverStepHTML = '';
    if (config.servers && config.servers.length > 0) {
        const serverPicks = config.servers.map(srv => `
            <div class="pick server-pick" data-server="${srv.value}">${srv.name}</div>
        `).join('');

        serverStepHTML = `
            <div class="card-step">
                <h3><span>1b.</span> Pilih Server</h3>
                <div class="grid-pick server-grid">
                    ${serverPicks}
                </div>
            </div>
        `;
    }

    const productsHTML = config.products.map(prod => `
        <div class="pick product-pick" data-kode="${prod.code}">${prod.name}</div>
    `).join('');

    inputFill.innerHTML = `
        <div class="card-step">
            <h3><span>1.</span> Data Akun</h3>
            <div class="grid-pick">
                ${inputsHTML}
            </div>
        </div>

        ${serverStepHTML}

        <div class="card-step">
            <h3><span>2.</span> Pilih Nominal</h3>
            <div class="grid-pick product-grid">
                ${productsHTML}
            </div>
        </div>

        <div class="card-step">
            <h3><span>3.</span> Metode Pembayaran</h3>
            <div class="grid-pick pay-grid">
                <div class="pay" data-pay="QRIS">QRIS</div>
                <div class="pay" data-pay="Gopay">Gopay</div>
                <div class="pay" data-pay="Dana">Dana</div>
                <div class="pay" data-pay="ShopeePay">ShopeePay</div>
            </div>
        </div>

        <div class="card-step">
            <h3><span>4.</span> Konfirmasi</h3>
            <div class="grid-pick">
                <p><i>Nomor WhatsApp digunakan untuk mengirim bukti pembayaran</i></p>
                <input type="number" id="telp-wa" placeholder="Nomor Whatsapp" class="input-box" required>
                <button class="buy-click">Beli Sekarang</button>
            </div>
        </div>
    `;
}

// 8. Event Listener Toggle Active Class
function attachActiveListeners() {
    document.querySelectorAll('.grid-pick').forEach(grid => {
        const items = grid.querySelectorAll('.pick, .pay');
        items.forEach(item => {
            item.addEventListener('click', function () {
                items.forEach(i => i.classList.remove('active'));
                this.classList.add('active');
            });
        });
    });
}

// 9. Dynamic Year Footer
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

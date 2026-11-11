const disc = 20;
const code = 'HOLLOW20';
const info = document.querySelector('.banner');

if (info) {
    info.innerHTML = `Dapatkan diskon <span class="disc"> ${disc}%</span> dengan kode <span class="code"><strong><i>${code}</i></strong></span>, klaim sekarang juga!`;
}

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

// Render Katalog di index.html
const gameList = document.querySelector('#gameList');
if (gameList) {
    gameList.innerHTML = list.map(game => `
        <a href="transaction.html?game=${game.id}" class="label">
            <img src="${game.icon}" alt="${game.name}" loading="lazy">
            <span>${game.name}</span>
        </a>
    `).join("");
}

// Handler Halaman Transaksi
const orderLabel = document.querySelector('.order-label');
const inputFill = document.querySelector('.input');

if (orderLabel && inputFill) {
    const url = new URLSearchParams(window.location.search);
    const pickGameId = url.get('game');

    if (!pickGameId) {
        orderLabel.innerHTML = `<h1>Pilih game terlebih dahulu</h1>`;
    } else {
        const pick = list.find(item => item.id.toLowerCase() === pickGameId.toLowerCase());
        if (pick) {
            orderLabel.innerHTML = `<span class="label-t">Transaksi ${pick.name}</span>`;
            loadDynamicForm(pickGameId);
        } else {
            orderLabel.innerHTML = `<span class="label-t">Transaksi tidak valid</span>`;
        }
    }
}

// Fetch Konfigurasi Form dari Endpoint Backend
async function loadDynamicForm(gameId) {
    try {
        const res = await fetch(`/api/game-config/${gameId}`);
        const data = await res.json();

        if (!data.success) {
            inputFill.innerHTML = `<p style="color:red; text-align:center;">${data.message}</p>`;
            return;
        }

        renderFormHTML(data.config);
        attachActiveListeners();
    } catch (err) {
        console.error('Error memuat form game:', err);
    }
}

// Render HTML Dinamis (Pilihan Input, Server, Produk, Pembayaran)
function renderFormHTML(config) {
    // 1. Render Input Akun Dinamis (hanya sesuai array inputs di config)
    const inputsHTML = config.inputs.map(input => `
        <input type="${input.type}" data-key="${input.key}" placeholder="${input.placeholder}" class="input-box game-input" required>
    `).join('');

    // 2. Render Pilihan Server jika ada (menggunakan class .pick)
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

    // 3. Render Pilihan Nominal Produk (menggunakan class .pick)
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

// Listerner Tombol Active (Per-Group Container agar tidak saling hapus kelas .active)
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

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();
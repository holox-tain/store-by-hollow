document.addEventListener('click', function (e) {
    if (!e.target || !e.target.classList.contains('buy-click')) return;

    const buying = e.target;
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('game');
    const waNum = document.getElementById('telp-wa')?.value?.trim();
    const selectPick = document.querySelector('.product-pick.active');
    const selectPay = document.querySelector('.pay.active');
    const selectServer = document.querySelector('.server-pick.active');
    const serverGrid = document.querySelector('.server-grid');
    const inpo = document.querySelector('.alert');

    // 1. Ambil input teks dari elemen bertanda .game-input
    const userInputs = {};
    let isInputsComplete = true;

    document.querySelectorAll('.game-input').forEach(input => {
        const key = input.getAttribute('data-key');
        const val = input.value.trim();
        if (!val) isInputsComplete = false;
        userInputs[key] = val;
    });

    // 2. Ambil Server ID jika game tersebut memiliki daftar server
    if (serverGrid) {
        if (!selectServer) {
            isInputsComplete = false;
        } else {
            userInputs['serverId'] = selectServer.getAttribute('data-server');
        }
    }

    // 3. Validasi Kelengkapan Data
    if (!gameId || !waNum || !selectPick || !selectPay || !isInputsComplete || Object.keys(userInputs).length === 0) {
        if (inpo) {
            inpo.textContent = "Data belum lengkap, isi semua kolom terlebih dahulu!";
            inpo.classList.add('show');
            setTimeout(() => inpo.classList.remove('show'), 2000);
        }
        return;
    }

    const productCode = selectPick.getAttribute('data-kode');
    const paymentMethod = selectPay.getAttribute('data-pay') || selectPay.textContent.trim();

    const originalText = buying.textContent;
    buying.textContent = "Memproses...";
    buying.disabled = true;

    const orderPayload = {
        game: gameId,
        userInputs: userInputs,
        whatsapp: waNum,
        productCode: productCode,
        paymentMethod: paymentMethod
    };

    fetch('/api/validation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
    })
        .then(response => response.json())
        .then(data => {
            if (data.result || data.success === true) {
                alert('Pesanan berhasil diproses!');
            } else {
                alert('Pesanan gagal: ' + (data.message || 'Cek kembali data Anda'));
            }
        })
        .catch(error => {
            console.error('Error memproses pesanan:', error);
            alert('Terjadi kesalahan jaringan/sistem');
        })
        .finally(() => {
            buying.textContent = originalText;
            buying.disabled = false;
        });
});
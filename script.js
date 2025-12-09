try {
  const socket = io('https://socketweb.haremaltin.com', {
    transports: ['websocket'],
    timeout: 5000
  });

  socket.on('connect', () => {
    console.log('Socket bağlantısı kuruldu.');
  });

  socket.on('connect_error', (err) => {
    console.warn('Socket bağlantı hatası:', err.message);
    // Ekranı boş bırakıyoruz, sabit değer asla yazılmayacak.
  });

  socket.on('price_changed', (msg) => {
    const data = msg.data;
    console.log('Gelen veri:', data);
    if (!data) return;

    function set(id, alisVal, satisVal) {
      const alisEl = document.getElementById(id + '_alis');
      const satisEl = document.getElementById(id + '_satis');
      if (!alisEl || !satisEl) return;
      alisEl.innerText = alisVal.toFixed(2);
      satisEl.innerText = satisVal.toFixed(2);
    }

    if (data.ALTIN) {
      const alis = parseFloat(data.ALTIN.alis);
      const satis = parseFloat(data.ALTIN.satis);
      set('ALTIN', alis - 3, satis + 3);
      set('BILEZIK_22', alis * 0.913, satis * 0.925);
      set('BILEZIK_CNC_22', alis * 0.913, satis * 0.932);
      set('HALEP_21', alis * 0.87, satis * 0.885);
      set('AYAR_14', alis * 0.575, satis * 0.715);
      set('DARP_CEYREK', alis * 1.64, satis * 1.65);
      set('ACIK_CEYREK', alis * 0.913 * 1.75, satis * 0.925 * 1.75);
      set('DARP_YARIM', alis * 3.28, satis * 3.3);
      set('ACIK_YARIM', alis * 0.913 * 3.5, satis * 0.925 * 3.5);
      set('DARP_TAM', alis * 6.52, satis * 6.55);
      set('ACIK_TAM', alis * 0.913 * 7, satis * 0.925 * 7);
      set('DARP_720', alis * 6.65, satis * 6.78);
      set('DARP_1750', alis * 16.2, satis * 16.3);
      set('GRAM_KUCUK', alis * 0.995, satis * 1.01);
      set('GRAM_BUYUK', alis * 0.995, satis * 1.005);
    }

    if (data.USDTRY) {
      set(
        'USDTRY',
        parseFloat(data.USDTRY.alis),
        parseFloat(data.USDTRY.satis)
      );
    }

    if (data.EURTRY) {
      set('EURO', parseFloat(data.EURTRY.alis), parseFloat(data.EURTRY.satis));
    }

    if (data.ONS) {
      set('ONS', parseFloat(data.ONS.alis), parseFloat(data.ONS.satis));
    }
  });
} catch (e) {
  console.error('Genel socket hatası:', e);
  // Yine hiçbir sabit veri yazmıyoruz
}

function updateTime() {
  const now = new Date();
  const date = now.toLocaleDateString('tr-TR');
  const time = now.toLocaleTimeString('tr-TR');
  const el = document.getElementById('datetime');
  if (el) el.innerText = `${date} - ${time}`;
}

setInterval(updateTime, 1000);
updateTime();

const vitrins = [
  'vitrin1.jpeg',
  'vitrin2.jpeg',
  'vitrin3.jpeg',
  'vitrin4.jpeg',
  'vitrin5.jpeg',
  'vitrin6.jpeg'
];

let currentIndex = 0;
const vitrinImg = document.getElementById('vitrinImage');

setInterval(() => {
  currentIndex = (currentIndex + 1) % vitrins.length;
  vitrinImg.style.opacity = 0;

  setTimeout(() => {
    vitrinImg.src = vitrins[currentIndex];
    vitrinImg.style.opacity = 1;
  }, 600);
}, 30000);

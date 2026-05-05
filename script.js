const TARGET_URL = 'https://diko.name.tr/service/api/v1/get_prices/1';
const API_URL =
  'https://api.codetabs.com/v1/proxy?quest=' + encodeURIComponent(TARGET_URL);

const NORMAL_SURE = 5000;
const HATA_SURESI = 20 * 60 * 1000; 

async function fetchDikoData() {
  let sonrakiCalismaSuresi = NORMAL_SURE;

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error('Sunucu yanıt vermedi');
    }

    const data = await response.json();

    let alis = 0;
    let satis = 0;

    if (data.originalprices && data.originalprices.ALTIN) {
      alis = parseFloat(data.originalprices.ALTIN.alis);
      satis = parseFloat(data.originalprices.ALTIN.satis);
    } else if (data.currencies && data.currencies.ALTIN) {
      alis = parseFloat(data.currencies.ALTIN.alis);
      satis = parseFloat(data.currencies.ALTIN.satis);
    }

    if (satis > 0) {
      updateGoldPrices(alis, satis);
      sonrakiCalismaSuresi = NORMAL_SURE;
    } else {
      throw new Error('Fiyat verisi 0 veya hatalı');
    }

    const dovizKaynagi = data.originalprices || data.currencies;
    if (dovizKaynagi) {
      if (dovizKaynagi.USDTRY)
        updateCurrency(
          'USDTRY',
          dovizKaynagi.USDTRY.alis,
          dovizKaynagi.USDTRY.satis
        );
      if (dovizKaynagi.EURTRY)
        updateCurrency(
          'EURO',
          dovizKaynagi.EURTRY.alis,
          dovizKaynagi.EURTRY.satis
        );
      if (dovizKaynagi.ONS)
        updateCurrency('ONS', dovizKaynagi.ONS.alis, dovizKaynagi.ONS.satis);
    }
  } catch (error) {
    console.error('Veri çekme hatası, 20 dakika beklenecek:', error);
    sonrakiCalismaSuresi = HATA_SURESI;
  } finally {
    setTimeout(fetchDikoData, sonrakiCalismaSuresi);
  }
}

function updateGoldPrices(alis, satis) {
  setPrice('ALTIN', alis, satis);
  setPrice('BILEZIK_22', alis * 0.913, satis * 0.925);
  setPrice('BILEZIK_CNC_22', alis * 0.913, satis * 0.932);
  setPrice('HALEP_21', alis * 0.87, satis * 0.885);
  setPrice('AYAR_14', alis * 0.575, satis * 0.715);
  setPrice('DARP_CEYREK', alis * 1.65, satis * 1.67);
  setPrice('ACIK_CEYREK', alis * 0.913 * 1.75, satis * 0.925 * 1.75);
  setPrice('DARP_YARIM', alis * 3.30, satis * 3.34);
  setPrice('ACIK_YARIM', alis * 0.913 * 3.5, satis * 0.925 * 3.5);
  setPrice('DARP_TAM', alis * 6.55, satis * 6.63);
  setPrice('ACIK_TAM', alis * 0.913 * 7, satis * 0.925 * 7);
  setPrice('DARP_720', alis * 6.65, satis * 6.78);
  setPrice('DARP_1750', alis * 16.2, satis * 16.3);
  setPrice('GRAM_KUCUK', alis * 0.995, satis * 1.01);
  setPrice('GRAM_BUYUK', alis * 0.995, satis * 1.005);
}

function updateCurrency(id, alis, satis) {
  setPrice(id, parseFloat(alis), parseFloat(satis));
}

function setPrice(id, alisVal, satisVal) {
  const alisEl = document.getElementById(id + '_alis');
  const satisEl = document.getElementById(id + '_satis');

  if (alisEl && !isNaN(alisVal)) alisEl.innerText = alisVal.toFixed(2);
  if (satisEl && !isNaN(satisVal)) satisEl.innerText = satisVal.toFixed(2);
}

function updateTime() {
  const now = new Date();
  const el = document.getElementById('datetime');
  if (el) {
    el.innerText = `${now.toLocaleDateString(
      'tr-TR'
    )} - ${now.toLocaleTimeString('tr-TR')}`;
  }
}

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

if (vitrinImg) {
  setInterval(() => {
    currentIndex = (currentIndex + 1) % vitrins.length;
    vitrinImg.style.opacity = 0;
    setTimeout(() => {
      vitrinImg.src = vitrins[currentIndex];
      vitrinImg.style.opacity = 1;
    }, 600);
  }, 30000);
}

document.addEventListener('click', () => {
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen();
  }
});

setInterval(updateTime, 1000);
updateTime();

fetchDikoData();

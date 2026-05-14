// --- Environment & API Base Configuration ---
const API_BASE_URL =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:5500"
    : "https://global-uncertainty-hedge-platform.onrender.com";

// 1. Elements
const commoditySelect = document.getElementById("commodity-select");
const currencySelect = document.getElementById("currency-select");
const priceDisplay = document.getElementById("price-display");
const unitLabel = document.getElementById("unit-label");
const footnoteDisplay = document.getElementById("footnote-display");
const currencySymbols = document.querySelectorAll(".currency");
const currencySymbolMain = document.getElementById("currency-symbol");
const amountInput = document.getElementById("investment-amount");
const tradeForm = document.getElementById("trade-form");
const investBtn = document.getElementById("invest-btn");
const dialog = document.getElementById("summary-dialog");
const summaryText = document.getElementById("investment-summary");
const priceChangeCont = document.getElementById("price-change");
const changeValue = priceChangeCont.querySelector(".change-value");
const changeIcon = priceChangeCont.querySelector(".change-icon");
const newsDisplay = document.getElementById("news-display");

// 2. State & Data
let lastPrice = 0;

const commodityInfo = {
  WTI: { unit: "/ bbl", desc: "* 1bbl = 1 barrel (42 US gallons) of Crude Oil" },
  NATURAL_GAS: { unit: "/ MMBtu", desc: "* 1 MMBtu = 1 million British Thermal Units" },
  GOLD: { unit: "/ ozt", desc: "* 1ozt = 1 troy ounce of 24 Carat Gold" },
  SILVER: { unit: "/ ozt", desc: "* 1ozt = 1 troy ounce of 99.9% Pure Silver" },
  COPPER: { unit: "/ lb", desc: "* 1lb = 1 pound of Grade A Copper" },
  WHEAT: { unit: "/ bu", desc: "* 1bu = 1 bushel of Hard Red Winter Wheat" },
  CORN: { unit: "/ bu", desc: "* 1bu = 1 bushel of Shelled Corn" },
};

// 3. Price & UI Functions
function updatePriceUI(newPrice) {
  const price = parseFloat(newPrice);
  if (isNaN(price)) return;

  if (lastPrice !== 0) {
    priceChangeCont.className = "price-change"; // Clean original layout positions
    const diff = ((price - lastPrice) / lastPrice) * 100;

    if (price > lastPrice) {
      priceChangeCont.classList.add("positive");
      changeValue.textContent = `+${diff.toFixed(2)}%`;
      changeIcon.textContent = "▲";
    } else if (price < lastPrice) {
      priceChangeCont.classList.add("negative");
      changeValue.textContent = `${diff.toFixed(2)}%`;
      changeIcon.textContent = "▼";
    } else {
      priceChangeCont.classList.add("neutral");
      changeValue.textContent = "0.00%";
      changeIcon.textContent = "●";
    }
  }
  priceDisplay.textContent = price.toFixed(2);
  lastPrice = price;
}

function updateStaticUI() {
  const info = commodityInfo[commoditySelect.value];
  const sign = currencySelect.value === "GBP" ? "£" : "$";

  unitLabel.textContent = info.unit;
  footnoteDisplay.textContent = info.desc;
  currencySymbolMain.textContent = sign;
  currencySymbols.forEach((el) => (el.textContent = sign));

  fetchLivePrice();
}

// 4. Live Data Logic (Ticker & News)
async function fetchLivePrice() {
  try {
    const symbol = commoditySelect.value;
    const response = await fetch(`${API_BASE_URL}/price/${symbol}`);
    const result = await response.json();
    if (result.price) updatePriceUI(result.price);
  } catch (err) {
    console.error("Ticker error:", err);
  }
}

function connectNewsFeed() {
  const eventSource = new EventSource(`${API_BASE_URL}/news`);

  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.event === "news-update") {
      newsDisplay.textContent = data.story;
    }
  };

  eventSource.onerror = () => {
    newsDisplay.textContent = "Reconnecting to market news...";
    eventSource.close();
    setTimeout(connectNewsFeed, 5000);
  };
}

// 5. Interaction Listeners
tradeForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const amount = amountInput.value;
  if (!amount || amount <= 0) return alert("Enter a valid amount");

  investBtn.textContent = "Processing...";
  investBtn.disabled = true;

  try {
    const response = await fetch(`${API_BASE_URL}/trade`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        commodity: commoditySelect.value,
        currency: currencySelect.value,
        amount: amount,
      }),
    });
    const result = await response.json();
    if (response.ok) {
      updatePriceUI(result.data.price);
      summaryText.textContent = `Success! You invested ${currencySelect.value} ${amount} in ${commoditySelect.value}.`;
      dialog.showModal();
    }
  } catch (err) {
    alert("Trade failed check console.");
  } finally {
    investBtn.textContent = "Execute Trade";
    investBtn.disabled = false;
  }
});

commoditySelect.addEventListener("change", updateStaticUI);
currencySelect.addEventListener("change", updateStaticUI);

// 6. Initialization
updateStaticUI();
connectNewsFeed();
setInterval(fetchLivePrice, 30000); // 30s Ticker Update
// index.js
// 1. Grab all the elements from the HTML
const commoditySelect = document.getElementById("commodity-select");
const currencySelect = document.getElementById("currency-select");
const priceDisplay = document.getElementById("price-display");
const unitLabel = document.getElementById("unit-label");
const footnoteDisplay = document.getElementById("footnote-display");
const currencySymbols = document.querySelectorAll(".currency"); // The £ signs
const investBtn = document.getElementById("invest-btn");
const amountInput = document.getElementById("investment-amount");
const dialog = document.getElementById("summary-dialog");
const summaryText = document.getElementById("investment-summary");

// 2. Our "Database" of info
const commodityData = {
  WTI: { unit: "bbl", price: 75.50, desc: "* 1bbl = 1 barrel of Crude Oil" },
  GOLD: { unit: "ozt", price: 1850.00, desc: "* 1ozt = 1 troy ounce of Gold" },
  WHEAT: { unit: "bu", price: 6.20, desc: "* 1bu = 1 bushel of Wheat" }
};

// 3. The Function that updates the screen
function updateUI() {
  const symbol = commoditySelect.value;
  const data = commodityData[symbol];
  const currency = currencySelect.value;
  
  // Update labels
  unitLabel.textContent = data.unit;
  footnoteDisplay.textContent = data.desc;
  
  // Update currency symbols (the £ or $)
  const sign = currency === "GBP" ? "£" : "$";
  currencySymbols.forEach(el => el.textContent = sign);
  
  // Update Price (In a real app, you'd multiply by an exchange rate here)
  priceDisplay.textContent = data.price.toLocaleString();
}

// 4. Listen for changes
commoditySelect.addEventListener("change", updateUI);
currencySelect.addEventListener("change", updateUI);

// 5. Make the Button work!
investBtn.addEventListener("click", (event) => {
  event.preventDefault(); // Stops the page from refreshing
  
  const amount = amountInput.value;
  const price = commodityData[commoditySelect.value].price;
  const unit = commodityData[commoditySelect.value].unit;
  
  if (amount > 0) {
    const totalBought = (amount / price).toFixed(2);
    summaryText.textContent = `You invested ${currencySelect.value} ${amount} and bought ${totalBought} ${unit} of ${commoditySelect.value}.`;
    dialog.showModal(); // Opens the popup
  } else {
    alert("Please enter an amount!");
  }
});

// 6. RUN ONCE AT START so the page isn't empty
updateUI();

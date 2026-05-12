// index.js
const commoditySelect = document.getElementById("commodity-select");
const footnoteDisplay = document.getElementById("footnote-display");
const unitLabel = document.getElementById("unit-label");

const commodityDetails = {
  WTI: {
    unit: "bbl",
    description:
      "* 1bbl = 1 barrel (42 US gallons) of West Texas Intermediate Crude Oil",
  },
  NATURAL_GAS: {
    unit: "MMBtu",
    description: "* 1 MMBtu = 1 million British Thermal Units",
  },
  GOLD: {
    unit: "ozt",
    description: "* 1ozt = 1 troy ounce of 24 Carat Gold",
  },
  SILVER: {
    unit: "ozt",
    description: "* 1ozt = 1 troy ounce of 99.9% Pure Silver",
  },
  COPPER: {
    unit: "lb",
    description: "* 1lb = 1 pound of Grade A Copper",
  },
  WHEAT: {
    unit: "bu",
    description: "* 1bu = 1 bushel (approx. 60 lbs) of Hard Red Winter Wheat",
  },
  CORN: {
    unit: "bu",
    description: "* 1bu = 1 bushel (approx. 56 lbs) of Shelled Corn",
  },
};

commoditySelect.addEventListener("change", (e) => {
  const selectedValue = e.target.value;
  const detail = commodityDetails[selectedValue];

  // Update the unit next to the price
  unitLabel.textContent = detail.unit;

  // Update the footnote to be inclusive of the specific asset
  footnoteDisplay.textContent = detail.description;
});

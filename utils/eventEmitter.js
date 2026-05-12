import EventEmitter from "node:events";

const customerDetails = {
  fullName: "Olly Olly",
  email: "nairobiolga@gmail.com",
};

const marketRequestEmitter = new EventEmitter();

// EMAIL FUNCTION
function generateEmail(data) {
  console.log(`Email generated for ${data.customer.email}`);
  console.log(`${data.commodity} rate is ${data.price}`);
}

// PDF FUNCTION
function generatePDF(data) {
  console.log(`PDF generated for ${data.customer.fullName}`);
}

// LOG FUNCTION
function logRequest() {
  console.log("Request logged in database");
}

// EVENT LISTENERS
marketRequestEmitter.on("goldRatesRequest", generateEmail);
marketRequestEmitter.on("goldRatesRequest", generatePDF);
marketRequestEmitter.on("goldRatesRequest", logRequest);

// TRIGGER EVENT AFTER 3 SECONDS
setTimeout(() => {
  marketRequestEmitter.emit("goldRatesRequest", {
    customer: customerDetails,
    commodity: "Gold",
    price: "$3,400",
  });
}, 3000);

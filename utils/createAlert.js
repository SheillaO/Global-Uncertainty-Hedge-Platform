export function createAlert(tradeData) {
  // Patched property pointers to match your live tradeData properties
  console.log(
    `🚨 TRANSACTION ALERT: Large Order Execution Processing in the ${tradeData.market || "Global Market"}`,
  );
  console.log(`📋 Commodity: ${tradeData.commodity}`);
  console.log(
    `💰 Capital Volume: ${tradeData.currency || "USD"} ${tradeData.amount}`,
  );
}

export function createAlert(tradeData) {
  
  console.log(
    `🚨 TRANSACTION ALERT: Large Order Execution Processing in the ${tradeData.market || "Global Market"}`,
  );
  console.log(`📋 Commodity: ${tradeData.commodity}`);
  console.log(
    `💰 Capital Volume: ${tradeData.currency || "USD"} ${tradeData.amount}`,
  );
}

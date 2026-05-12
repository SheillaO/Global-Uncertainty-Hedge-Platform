export function createAlert(commodity) {
  console.log(
    `🚨 ALERT: ${commodity.severity.toUpperCase()} bug reported in ${commodity.location}`,
  );
  console.log(`📋 Title: ${commodity.title}`);
  console.log(`👤 Assigned to: ${commodity.assignedTo || "Unassigned"}`);
}

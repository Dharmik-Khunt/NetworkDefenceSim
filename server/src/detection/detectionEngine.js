const {
  detectHighTraffic,
  detectSuspiciousPort,
  detectExternalAccess,
  detectPortScan,
  detectBruteForce
} = require("./rules");

const { calculateRisk } = require("./riskEngine");

const {
  enrichDetectionsWithMitre
} = require("./mitreMapping");

function analyzeEvent(recentEvents, currentEvent) {
  let detections = [];

  const highTraffic = detectHighTraffic(currentEvent);
  if (highTraffic) detections.push(highTraffic);

  const suspiciousPort = detectSuspiciousPort(currentEvent);
  if (suspiciousPort) detections.push(suspiciousPort);

  const externalAccess = detectExternalAccess(currentEvent);
  if (externalAccess) detections.push(externalAccess);

  const portScan = detectPortScan(recentEvents, currentEvent);
  if (portScan) detections.push(portScan);

  const bruteForce = detectBruteForce(recentEvents, currentEvent);
  if (bruteForce) detections.push(bruteForce);

  // Add MITRE ATT&CK mapping
  detections = enrichDetectionsWithMitre(detections);

  const risk = calculateRisk(detections);

  return {
    event: currentEvent,
    detections,
    risk
  };
}

module.exports = {
  analyzeEvent
};
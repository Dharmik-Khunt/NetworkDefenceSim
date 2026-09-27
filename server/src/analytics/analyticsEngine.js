function buildAnalytics({
  alerts = [],
  incidents = [],
  events = [],
  responseActions = []
}) {
  const severity = {
    CRITICAL: 0,
    HIGH: 0,
    MEDIUM: 0,
    LOW: 0
  };

  const detectionRules = {};
  const mitreTechniques = {};
  const sourceIPs = {};

  alerts.forEach(alert => {
    const level =
      String(
        alert.risk?.level ||
        alert.severity ||
        "LOW"
      ).toUpperCase();

    if (severity[level] !== undefined) {
      severity[level]++;
    }

    const sourceIP =
      alert.sourceIP ||
      alert.sourceIp ||
      "Unknown";

    sourceIPs[sourceIP] =
      (sourceIPs[sourceIP] || 0) + 1;

    (alert.detections || []).forEach(detection => {
      const rule = detection.rule || "UNKNOWN";

      detectionRules[rule] =
        (detectionRules[rule] || 0) + 1;

      if (detection.mitre) {
        const techniqueId =
          detection.mitre.techniqueId;

        const technique =
          detection.mitre.technique;

        const key =
          `${techniqueId} - ${technique}`;

        mitreTechniques[key] =
          (mitreTechniques[key] || 0) + 1;
      }
    });
  });

  const incidentStatus = {
    OPEN: 0,
    RESOLVED: 0
  };

  incidents.forEach(incident => {
    const status =
      String(incident.status || "OPEN")
        .toUpperCase();

    if (incidentStatus[status] !== undefined) {
      incidentStatus[status]++;
    }
  });

  const responseStatus = {};

  responseActions.forEach(action => {
    const status = action.status || "UNKNOWN";

    responseStatus[status] =
      (responseStatus[status] || 0) + 1;
  });

  const topSourceIPs = Object.entries(sourceIPs)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([ip, count]) => ({
      ip,
      count
    }));

  const topDetectionRules = Object.entries(
    detectionRules
  )
    .sort((a, b) => b[1] - a[1])
    .map(([rule, count]) => ({
      rule,
      count
    }));

  const topMitreTechniques = Object.entries(
    mitreTechniques
  )
    .sort((a, b) => b[1] - a[1])
    .map(([technique, count]) => ({
      technique,
      count
    }));

  return {
    summary: {
      totalAlerts: alerts.length,
      totalIncidents: incidents.length,
      totalEvents: events.length,
      totalResponses: responseActions.length
    },

    severity,

    incidentStatus,

    responseStatus,

    topSourceIPs,

    topDetectionRules,

    topMitreTechniques
  };
}

module.exports = {
  buildAnalytics
};
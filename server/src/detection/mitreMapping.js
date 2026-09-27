const MITRE_MAPPINGS = {
  HIGH_TRAFFIC_VOLUME: {
    techniqueId: "T1049",
    technique: "System Network Connections Discovery",
    tactic: "Discovery",
    description: "Adversaries may inspect network connections to understand active network communications."
  },

  SUSPICIOUS_PORT: {
    techniqueId: "T1046",
    technique: "Network Service Scanning",
    tactic: "Discovery",
    description: "Adversaries may scan network services to identify accessible systems and services."
  },

  EXTERNAL_TO_INTERNAL: {
    techniqueId: "T1190",
    technique: "Exploit Public-Facing Application",
    tactic: "Initial Access",
    description: "Adversaries may exploit vulnerabilities in internet-facing applications to gain access."
  },

  PORT_SCAN: {
    techniqueId: "T1046",
    technique: "Network Service Scanning",
    tactic: "Discovery",
    description: "Adversaries may scan ports and services to identify available network services."
  },

  BRUTE_FORCE: {
    techniqueId: "T1110",
    technique: "Brute Force",
    tactic: "Credential Access",
    description: "Adversaries may use repeated authentication attempts to obtain valid credentials."
  }
};

function getMitreMapping(rule) {
  if (!rule) {
    return null;
  }

  // Make sure different formats are handled
  const normalizedRule = String(rule)
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "_");

  return MITRE_MAPPINGS[normalizedRule] || null;
}

function enrichDetectionsWithMitre(detections) {
  return detections.map((detection) => {
    const mapping = getMitreMapping(detection.rule);

    return {
      ...detection,
      mitre: mapping
    };
  });
}

module.exports = {
  getMitreMapping,
  enrichDetectionsWithMitre
};
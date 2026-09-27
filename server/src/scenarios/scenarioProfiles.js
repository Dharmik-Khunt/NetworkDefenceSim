const scenarioProfiles = {

  normal: {
    name: "Normal Traffic",
    description:
      "Normal enterprise network activity"
  },

  portScan: {
    name: "Port Scan",
    description:
      "Simulated reconnaissance against an internal server"
  },

  bruteForce: {
    name: "Brute Force",
    description:
      "Simulated repeated SSH authentication attempts"
  },

  dataExfiltration: {
    name: "Data Exfiltration",
    description:
      "Simulated unusual outbound data transfer"
  },

  mixedAttack: {
    name: "Mixed Attack",
    description:
      "Combination of multiple suspicious behaviors"
  }

};

module.exports = scenarioProfiles;
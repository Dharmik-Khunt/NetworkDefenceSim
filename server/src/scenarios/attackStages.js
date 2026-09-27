const attackStages = {

  reconnaissance: {
    name: "Reconnaissance",
    description:
      "Attacker attempts to identify exposed services"
  },

  initialAccess: {
    name: "Initial Access",
    description:
      "Simulated attempt to gain access"
  },

  credentialAttack: {
    name: "Credential Attack",
    description:
      "Repeated authentication attempts"
  },

  lateralMovement: {
    name: "Lateral Movement",
    description:
      "Simulated movement between internal systems"
  },

  collection: {
    name: "Collection",
    description:
      "Simulated collection of sensitive information"
  },

  exfiltration: {
    name: "Exfiltration",
    description:
      "Simulated transfer of data outside the network"
  }

};

module.exports = attackStages;
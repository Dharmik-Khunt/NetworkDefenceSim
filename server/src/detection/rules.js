function detectHighTraffic(event) {

  if (event.bytes > 8000) {

    return {
      detected: true,
      rule: "HIGH_TRAFFIC_VOLUME",
      severity: "MEDIUM",
      score: 20,
      message: "Unusually high traffic volume detected"
    };

  }

  return {
    detected: false
  };
}


function detectSuspiciousPort(event) {

  const suspiciousPorts = [
    21,
    23,
    445,
    3389
  ];

  if (
    suspiciousPorts.includes(
      event.destinationPort
    )
  ) {

    return {
      detected: true,
      rule: "SUSPICIOUS_PORT",
      severity: "MEDIUM",
      score: 10,
      message:
        `Connection to sensitive port ${event.destinationPort}`
    };

  }

  return {
    detected: false
  };
}


function detectExternalAccess(event) {

  const sourceIsExternal =
    !event.sourceIP.startsWith("10.");

  const destinationIsInternal =
    event.destinationIP.startsWith("10.");

  if (
    sourceIsExternal &&
    destinationIsInternal
  ) {

    return {
      detected: true,
      rule: "EXTERNAL_TO_INTERNAL",
      severity: "HIGH",
      score: 15,
      message:
        "External source attempting to reach internal network"
    };

  }

  return {
    detected: false
  };
}

function detectPortScan(
  recentEvents,
  currentEvent
) {

  const sourceIP =
    currentEvent.sourceIP;

  const recentSourceEvents =
    recentEvents.filter(
      event =>
        event.sourceIP === sourceIP
    );

  const uniquePorts =
    new Set(
      recentSourceEvents.map(
        event => event.destinationPort
      )
    );

  if (uniquePorts.size >= 5) {

    return {
      detected: true,
      rule: "PORT_SCAN",
      severity: "HIGH",
      score: 30,
      message:
        `${sourceIP} contacted ${uniquePorts.size} different ports`
    };

  }

  return {
    detected: false
  };
}

function detectBruteForce(
  recentEvents,
  currentEvent
) {

  if (
    currentEvent.destinationPort !== 22
  ) {
    return {
      detected: false
    };
  }

  const sourceIP =
    currentEvent.sourceIP;

  const sshAttempts =
    recentEvents.filter(
      event =>
        event.sourceIP === sourceIP &&
        event.destinationPort === 22
    );

  if (sshAttempts.length >= 5) {

    return {
      detected: true,
      rule: "BRUTE_FORCE",
      severity: "HIGH",
      score: 25,
      message:
        `${sourceIP} generated ${sshAttempts.length} SSH connection attempts`
    };

  }

  return {
    detected: false
  };
}

module.exports = {
  detectHighTraffic,
  detectSuspiciousPort,
  detectExternalAccess,
  detectPortScan,
  detectBruteForce
};
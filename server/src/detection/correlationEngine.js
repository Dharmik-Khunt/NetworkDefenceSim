function correlateEvents(recentEvents, currentEvent) {
  const correlations = [];

  const sourceIP = currentEvent.sourceIP;

  // =========================================
  // 1. PORT SCAN CORRELATION
  // =========================================

  const sourceEvents = recentEvents.filter(
    (event) =>
      event.sourceIP === sourceIP &&
      event.destinationIP === currentEvent.destinationIP
  );

  const uniquePorts = new Set(
    sourceEvents.map(
      (event) => event.destinationPort
    )
  );

  uniquePorts.add(
    currentEvent.destinationPort
  );

  if (uniquePorts.size >= 5) {
    correlations.push({
      type: "RECONNAISSANCE",
      rule: "CORRELATED_PORT_SCAN",
      severity: "HIGH",
      score: 30,
      message:
        `${sourceIP} contacted ${uniquePorts.size} different ports`
    });
  }


  // =========================================
  // 2. SSH BRUTE FORCE CORRELATION
  // =========================================

  const sshEvents = recentEvents.filter(
    (event) =>
      event.sourceIP === sourceIP &&
      event.destinationPort === 22
  );

  const sshAttempts =
    sshEvents.length + 1;

  if (
    currentEvent.destinationPort === 22 &&
    sshAttempts >= 5
  ) {
    correlations.push({
      type: "CREDENTIAL_ATTACK",
      rule: "CORRELATED_SSH_BRUTE_FORCE",
      severity: "HIGH",
      score: 35,
      message:
        `${sourceIP} generated ${sshAttempts} SSH connection attempts`
    });
  }


  // =========================================
  // 3. EXTERNAL → INTERNAL CORRELATION
  // =========================================

  const sourceIsExternal =
    !sourceIP.startsWith("10.");

  const destinationIsInternal =
    currentEvent.destinationIP.startsWith("10.");

  if (
    sourceIsExternal &&
    destinationIsInternal
  ) {
    correlations.push({
      type: "INITIAL_ACCESS",
      rule: "CORRELATED_EXTERNAL_ACCESS",
      severity: "HIGH",
      score: 20,
      message:
        "External host is communicating with an internal system"
    });
  }


  // =========================================
  // 4. MULTI-STAGE ATTACK CORRELATION
  // =========================================

  const hasPortScan =
    correlations.some(
      (item) =>
        item.rule === "CORRELATED_PORT_SCAN"
    );

  const hasExternalAccess =
    correlations.some(
      (item) =>
        item.rule === "CORRELATED_EXTERNAL_ACCESS"
    );

  if (
    hasPortScan &&
    hasExternalAccess
  ) {
    correlations.push({
      type: "MULTI_STAGE_ATTACK",
      rule: "CORRELATED_RECON_AND_ACCESS",
      severity: "CRITICAL",
      score: 40,
      message:
        "Reconnaissance followed by external access attempt"
    });
  }


  return correlations;
}


module.exports = {
  correlateEvents
};